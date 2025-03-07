import mongoose from "mongoose";

const ForumPostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ForumPost = mongoose.model("ForumPost", ForumPostSchema);

export default ForumPost;
