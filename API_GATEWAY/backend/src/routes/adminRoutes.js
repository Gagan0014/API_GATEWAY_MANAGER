import express from "express";
import { UsageLog } from "../models/UsageLog.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Basic stats: total requests, top API keys, violations
router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalRequests = await UsageLog.countDocuments();

    const violations = await UsageLog.countDocuments({
      statusCode: 429
    });

    const topKeys = await UsageLog.aggregate([
      { $group: { _id: "$apiKey", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalRequests,
      rateLimitViolations: violations,
      topKeys
    });
  } catch (err) {
    console.error("Stats error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Recent logs
router.get("/logs", authMiddleware, adminOnly, async (req, res) => {
  try {
    const logs = await UsageLog.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    console.error("Logs error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
