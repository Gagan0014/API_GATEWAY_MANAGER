import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import keyRoutes from "./routes/keyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import testRoutes from "./routes/testRoutes.js";

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API Rate Limiting & API Key Management System Backend");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/keys", keyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/protected", testRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
