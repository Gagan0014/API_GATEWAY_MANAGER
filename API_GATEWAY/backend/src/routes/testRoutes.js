import express from "express";
import { apiKeyRateLimit } from "../middleware/apiKeyRateLimit.js";

const router = express.Router();

// Example API endpoint protected by API key + rate limiting
router.get("/data", apiKeyRateLimit, async (req, res) => {
  res.json({
    message: "This is protected data",
    apiKey: req.apiKey,
    userId: req.apiUserId,
    timestamp: new Date()
  });
});

export default router;
