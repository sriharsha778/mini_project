import { create } from "zustand";

export const useForumStore = create((set) => ({
  posts: [],
  isLoading: false,

  // Fetch posts from backend
  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://192.168.1.4:5000/api/forum/posts");
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
