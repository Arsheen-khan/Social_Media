// API endpoints for chat
import { api } from './api.js';

async function getChatHistory(user1, user2) {
    try {
        const response = await api.get(`/chat/chat-history/${user1}/${user2}`);
        return response.data.data || [];
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch chat history';
    }
}

export { getChatHistory };
