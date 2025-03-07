import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import forumRoutes from "./routes/forum.route.js";
import { app, server, io } from "./lib/socket.js"; // Import io

dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/forum", forumRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
