export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  mediaType?: string;
}

export interface Chat {
  id: string;
  leadId: string;
  contactName: string;
  contactAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'online' | 'offline';
  messages: Message[];
}

export const MOCK_CHATS: Chat[] = [];
