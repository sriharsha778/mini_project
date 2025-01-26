// Change from require to import
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import mongoose from 'mongoose';


// MongoDB Setup (replace with your MongoDB Atlas URI)
mongoose.connect('mongodb+srv://snehithkama:ahX4y2Ujr7DDFfyG@app123.urwno.mongodb.net/socialconnect?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Cloudinary Setup
cloudinary.config({
  cloud_name: 'dhxuqu43n',  // Replace with your Cloudinary Cloud Name
  api_key: '558854816252545',  // Replace with your Cloudinary API Key
  api_secret: '6ecJwXhnAnLzaERik_Yc3InddiY'  // Replace with your Cloudinary API Secret
});

// Define a schema and model for posts in MongoDB
const postSchema = new mongoose.Schema({
  text: String,
  file: String,
});
const Post = mongoose.model('Post', postSchema);

const app = express();
app.use(cors({ origin: true }));  // Allow frontend access

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage();  // Use memory storage to upload to Cloudinary
const upload = multer({ storage: storage });

// API to handle file and text upload
app.post('/upload', upload.single('file'), (req, res) => {
  const text = req.body.text;
  const file = req.file;

  if (!text && !file) {
    return res.status(400).json({ message: 'No text or file uploaded' });
  }

  // Upload file to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    { resource_type: 'auto' },  // Automatically detect file type (image, video, etc.)
    async (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Error uploading file to Cloudinary' });
      }

      const fileUrl = result.secure_url;

      // Save the post to MongoDB
      const newPost = new Post({
        text: text,
        file: fileUrl,
      });

      await newPost.save();  // Save the post to the database

      res.status(200).json({
        message: 'Post uploaded successfully',
        text,
        file: fileUrl,
      });
    }
  );

  // Stream the file from memory to Cloudinary
  streamifier.createReadStream(file.buffer).pipe(uploadStream);
});

// API to get all posts from MongoDB
app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);  // Return all posts
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
