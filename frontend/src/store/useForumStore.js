import { create } from "zustand";

// Dynamically determine API URL based on hostname
const API_URL = `http://${window.location.hostname}:5000`;

export const useForumStore = create((set) => ({
  posts: [],
  isLoading: false,

  // Fetch posts from backend
  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/forum/posts`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      set({ posts: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ isLoading: false });
    }
  },

  // Add new post to store
  addPost: (newPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
}));
