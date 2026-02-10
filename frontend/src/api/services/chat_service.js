import apiClient from '../client';
import { API_CONFIG } from '../../config/api.config';

export const chatService = {
    sendMessage: async (message, conversationId) => {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHAT, {
            message,
            conversation_id: conversationId,
            timestamp: new Date().toISOString(),
        });
        return response.data;
    },

    getStatus: async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.STATUS);
        return response.data;
    },
};
