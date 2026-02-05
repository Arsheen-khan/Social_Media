// API endpoints for posts
import { api } from './api.js';

async function getPosts(skip = 0, limit = 20) {
    try {
        const response = await api.get('/posts', {
            params: { skip, limit },
        });
        return response.data.data || [];
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch posts';
    }
}

async function createPost(imageFile, caption, mentions) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('mentions', mentions || '');

        // Note: Backend might expect caption in different field, adjust if needed
        if (caption) {
            formData.append('caption', caption);
        }

        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create post';
    }
}

async function likePost(postId) {
    try {
        const response = await api.post('/posts/like', { postId });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to like post';
    }
}

async function commentOnPost(postId, comment) {
    try {
        const response = await api.post('/posts/comment', { postId, comment });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to add comment';
    }
}

export { getPosts, createPost, likePost, commentOnPost };
