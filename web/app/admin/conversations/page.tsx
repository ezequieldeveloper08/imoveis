'use client';

import { useState } from 'react';
import { ChatSidebar } from '@/features/conversations/components/chat-sidebar';
import { ChatWindow } from '@/features/conversations/components/chat-window';
import { Chat } from '@/features/conversations/types/chat.types';

export default function ConversationsPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="fixed inset-0 top-20 left-72 flex overflow-hidden bg-grey-08 border-t border-grey-15">
      <ChatSidebar 
        selectedChatId={selectedChat?.id || null} 
        onSelectChat={handleSelectChat} 
      />
      <ChatWindow chat={selectedChat} />
    </div>
  );
}
