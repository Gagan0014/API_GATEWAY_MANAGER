import express from "express";
import crypto from "crypto";
import { ApiKey } from "../models/ApiKey.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get all keys for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const keys = await ApiKey.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.json(keys);
  } catch (err) {
    console.error("Get keys error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new API key
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { label } = req.body;
    const rawKey = crypto.randomBytes(24).toString("hex");

    const keyDoc = await ApiKey.create({
      user: req.user._id,
      key: rawKey,
      label: label || "Default key"
    });

    res.status(201).json(keyDoc);
  } catch (err) {
    console.error("Create key error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Toggle active/inactive
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const key = await ApiKey.findOne({ _id: req.params.id, user: req.user._id });
    if (!key) return res.status(404).json({ message: "Key not found" });

    key.active = !key.active;
    await key.save();
    res.json(key);
  } catch (err) {
    console.error("Toggle key error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
