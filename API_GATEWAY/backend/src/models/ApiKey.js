import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    key: { type: String, required: true, unique: true },
    label: { type: String },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);
