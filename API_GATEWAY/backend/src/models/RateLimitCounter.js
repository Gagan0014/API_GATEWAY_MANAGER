import mongoose from "mongoose";

const rateLimitCounterSchema = new mongoose.Schema(
  {
    apiKey: { type: String, required: true, unique: true },
    windowStart: { type: Date, required: true },
    count: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const RateLimitCounter = mongoose.model(
  "RateLimitCounter",
  rateLimitCounterSchema
);
