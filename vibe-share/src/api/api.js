import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// Posts API
export const postsAPI = {
  getPosts: (skip = 0, limit = 20) => api.get(`/posts?skip=${skip}&limit=${limit}`),
  createPost: (formData) => api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  likePost: (postId) => api.post('/posts/like', { post: postId }),
  commentOnPost: (postId, text) => api.post('/posts/comment', { post: postId, text }),
};

// Chat API
export const chatAPI = {
  getChatHistory: (user1, user2) => api.get(`/chat/chat-history/${user1}/${user2}`),
};

export default api;
