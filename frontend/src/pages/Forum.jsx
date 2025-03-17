import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { io } from "socket.io-client";

// Dynamically determine API URL based on the hostname
const API_URL = `http://${window.location.hostname}:5000`;

const socket = io(API_URL, {
  query: { userId: "some-unique-id" },
});

function Forum() {
  const { authUser } = useAuthStore();
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/forum/posts`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();

    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    return () => {
      socket.off("newPost");
    };
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return alert("Please enter a message!");

    const newPost = {
      text: postContent,
      author: authUser?.fullName || "Anonymous",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/api/forum/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error("Failed to send post");

      const savedPost = await response.json();
      socket.emit("sendForumMessage", savedPost);
      setPosts((prev) => [savedPost, ...prev]);
      setPostContent("");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post!");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-base-200">
      <div className="bg-base-300 py-4 px-6 shadow-md">
        <h2 className="text-xl font-semibold text-white">Community Forum</h2>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 overflow-auto">
        <div className="w-full max-w-2xl bg-base-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary">Create a Post</h3>
          <form onSubmit={handlePostSubmit} className="mt-2">
            <textarea
              className="w-full p-2 border rounded-md bg-base-200 text-base-content"
              rows="3"
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg mt-2 hover:bg-primary-focus"
            >
              Post
            </button>
          </form>
        </div>

        <div className="w-full max-w-2xl mt-6 space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to share!</p>
          ) : (
            [...new Map(posts.map((post) => [post._id, post])).values()].map((post) => (
              <div key={post._id} className="bg-base-100 p-4 rounded-lg shadow-md">
                <h3 className="text-md font-semibold text-secondary">{post.author}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
                <p className="text-base-content mt-2">{post.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Forum;
