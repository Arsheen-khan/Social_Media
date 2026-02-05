import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // backend port
  withCredentials: true,
});


// =======================
// AUTH
// =======================
export const authAPI = {
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),

  register: (username, email, password) =>
    apiClient.post("/auth/register", { username, email, password }),

  logout: () =>
    apiClient.post("/auth/logout"),
};


// =======================
// POSTS (MATCH YOUR BACKEND EXACTLY)
// =======================
export const postsAPI = {
  getPosts: (skip = 0, limit = 20) =>
    apiClient.get(`/posts?skip=${skip}&limit=${limit}`),

  createPost: (formData) =>
    apiClient.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // ⚠️ backend expects { post }
  likePost: (post) =>
    apiClient.post("/posts/like", { post }),

  // ⚠️ backend expects { post, text }
  commentPost: (post, text) =>
    apiClient.post("/posts/comment", { post, text }),
};


// =======================
// CHAT
// =======================
export const chatAPI = {
  getChatHistory: (user1, user2) =>
    apiClient.get(`/chat/chat-history/${user1}/${user2}`),
};


export default apiClient;

