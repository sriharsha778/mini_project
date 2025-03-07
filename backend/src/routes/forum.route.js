import express from "express";
import ForumPost from "../models/ForumPost.js";

const router = express.Router();

// ✅ Fetch all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 }); // Get latest posts first
    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// ✅ Create a new post
router.post("/post", async (req, res) => {
  const { text, author } = req.body;
  if (!text) return res.status(400).json({ message: "Message cannot be empty" });

  try {
    console.log("🚀 Creating New Forum Post:", req.body);

    const newPost = new ForumPost({ text, author });
    await newPost.save();

    const io = req.app.get("io");
    if (io) {
      console.log("📢 Emitting newPost event:", newPost);
      io.emit("newPost", newPost);
    } else {
      console.error("❌ Socket.IO instance not found");
    }

    res.status(201).json(newPost);
  } catch (error) {
    console.error("❌ Error Saving Post:", error);
    res.status(500).json({ message: "Error saving post", error });
  }
});

export default router;
