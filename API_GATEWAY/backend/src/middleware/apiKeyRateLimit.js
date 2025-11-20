import { ApiKey } from "../models/ApiKey.js";
import { RateLimitCounter } from "../models/RateLimitCounter.js";
import { UsageLog } from "../models/UsageLog.js";

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "30", 10);

export const apiKeyRateLimit = async (req, res, next) => {
  const apiKeyHeader = req.headers["x-api-key"];

  if (!apiKeyHeader) {
    return res.status(401).json({ message: "x-api-key header required" });
  }

  try {
    const apiKeyDoc = await ApiKey.findOne({ key: apiKeyHeader, active: true });

    if (!apiKeyDoc) {
      return res.status(401).json({ message: "Invalid or inactive API key" });
    }

    // Attach apiKey + user to request
    req.apiKey = apiKeyDoc.key;
    req.apiUserId = apiKeyDoc.user.toString();

    const now = Date.now();
    const windowStart = new Date(now - windowMs);

    let counter = await RateLimitCounter.findOne({ apiKey: apiKeyDoc.key });

    if (!counter) {
      counter = await RateLimitCounter.create({
        apiKey: apiKeyDoc.key,
        windowStart: new Date(now),
        count: 1
      });
    } else {
      // if window expired → reset
      if (counter.windowStart < windowStart) {
        counter.windowStart = new Date(now);
        counter.count = 1;
      } else {
        counter.count += 1;
      }
      await counter.save();
    }

    if (counter.count > maxRequests) {
      // log violation
      await UsageLog.create({
        apiKey: apiKeyDoc.key,
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
        statusCode: 429,
        error: "Rate limit exceeded"
      });

      return res.status(429).json({
        message: "Rate limit exceeded",
        windowMs,
        maxRequests
      });
    }

    // when response finishes, log usage
    res.on("finish", async () => {
      try {
        await UsageLog.create({
          apiKey: apiKeyDoc.key,
          ip: req.ip,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode
        });
      } catch (e) {
        console.error("Error logging usage:", e.message);
      }
    });

    next();
  } catch (err) {
    console.error("Rate limit error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
