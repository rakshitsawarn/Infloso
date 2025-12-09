// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// connect to DB (create ./config/db.js as shown in the README)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // parse JSON body

// Routes
app.use("/api/auth", authRoutes);

// Simple health check
app.get("/", (req, res) => {
  res.send("MelodyVerse Auth API — Backend is running ✅");
});

// Central error handler (keeps responses consistent)
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
