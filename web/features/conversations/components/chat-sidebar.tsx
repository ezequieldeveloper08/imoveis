'use client';

import { MOCK_CHATS, Chat } from '../types/chat.types';
import { Search, Filter, MoreVertical, User, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}

export function ChatSidebar({ selectedChatId, onSelectChat }: ChatSidebarProps) {
  return (
    <div className="w-96 flex flex-col bg-grey-10 border-r border-grey-15 h-full overflow-hidden">
      {/* Search Header */}
      <div className="p-6 space-y-4 border-b border-grey-15">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">Conversas</h2>
          <button className="h-8 w-8 flex items-center justify-center text-grey-60 hover:text-white transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40" />
          <Input 
            placeholder="Pesquisar contatos..." 
            className="pl-10 bg-grey-08 border-grey-15 h-11 text-sm focus:ring-purple-60 transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {MOCK_CHATS.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "w-full p-4 flex gap-4 transition-all border-l-4",
              selectedChatId === chat.id 
                ? "bg-purple-60/5 border-purple-60" 
                : "border-transparent hover:bg-grey-15/50 hover:border-grey-30"
            )}
          >
            <div className="relative flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40">
                <User className="h-6 w-6" />
              </div>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-grey-10",
                chat.status === 'online' ? "bg-emerald-500" : "bg-grey-50"
              )} />
            </div>

            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white truncate">{chat.contactName}</span>
                <span className="text-[10px] text-grey-60">{chat.timestamp}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={cn(
                  "text-xs truncate",
                  chat.unreadCount > 0 ? "text-grey-30 font-semibold" : "text-grey-60"
                )}>
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="flex-shrink-0 bg-purple-60 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center ml-2 shadow-[0_0_8px_rgba(112,59,247,0.4)]">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
