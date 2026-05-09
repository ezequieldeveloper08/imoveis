import { apiClient } from '@/infrastructure/api/api-client';
import { Chat, Message } from '../types/chat.types';

export const chatService = {
  getConversations: async (token?: string) => {
    const data = await apiClient<any[]>('/conversations', { token });
    return data.map(conv => {
      // Find lead info
      const leadName = conv.lead?.name || `Lead ${conv.leadId.substring(0, 5)}`;
      
      return {
        id: conv.id,
        leadId: conv.leadId,
        contactName: leadName,
        lastMessage: conv.messages?.[conv.messages.length - 1]?.content || 'Nenhuma mensagem',
        timestamp: conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unreadCount: conv.unreadCount || 0,
        status: 'online',
        messages: (conv.messages || [])
          .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.senderId === conv.leadId ? 'them' : 'me',
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }))
      } as Chat;
    });
  },

  getMessages: async (conversationId: string, token?: string) => {
    // We first get the conversation to know the leadId for proper sender identification
    const conv = await apiClient<any>(`/conversations/${conversationId}`, { token });
    const leadId = conv.leadId;
    
    const data = await apiClient<any[]>(`/conversations/${conversationId}/messages`, { token });
    
    // Sort messages by date to ensure order
    const sortedData = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    return sortedData.map(msg => ({
      id: msg.id,
      text: msg.content,
      sender: msg.senderId === leadId ? 'them' : 'me',
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: msg.isRead ? 'read' : 'delivered',
      mediaUrl: msg.mediaUrl,
      mediaType: msg.mediaType,
    } as Message));
  },

  sendMessage: (conversationId: string, text: string, token?: string, options?: { mediaUrl?: string, mediaType?: string }) => 
    apiClient(`/conversations/${conversationId}/messages`, { 
      method: 'POST', 
      body: { 
        content: text,
        mediaUrl: options?.mediaUrl,
        mediaType: options?.mediaType
      }, 
      token 
    }),

  markAsRead: (conversationId: string, token?: string) =>
    apiClient(`/conversations/${conversationId}/read`, {
      method: 'POST',
      token
    }),
};
