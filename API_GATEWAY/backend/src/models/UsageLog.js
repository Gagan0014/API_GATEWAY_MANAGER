import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema(
  {
    apiKey: { type: String },
    ip: { type: String },
    method: { type: String },
    path: { type: String },
    statusCode: { type: Number },
    error: { type: String }
  },
  { timestamps: true }
);

export const UsageLog = mongoose.model("UsageLog", usageLogSchema);
