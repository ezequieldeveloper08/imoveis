'use client';

import { Chat, Message } from '../types/chat.types';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video,
  User,
  Check,
  CheckCheck,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ChatWindowProps {
  chat: Chat | null;
}

export function ChatWindow({ chat }: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-grey-08 text-center p-8">
        <div className="h-24 w-24 rounded-3xl bg-grey-10 border border-grey-15 flex items-center justify-center mb-6 shadow-2xl">
          <Send className="h-10 w-10 text-grey-40 opacity-20" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Selecione uma conversa</h3>
        <p className="text-grey-60 max-w-xs mx-auto text-sm">
          Escolha um contato ao lado para iniciar ou continuar o atendimento via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-grey-08 h-full overflow-hidden">
      {/* Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-grey-15 bg-grey-10/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none mb-1">{chat.contactName}</h3>
            <div className="flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", chat.status === 'online' ? "bg-emerald-500" : "bg-grey-50")} />
              <span className="text-[10px] text-grey-60 font-medium">
                {chat.status === 'online' ? 'Online' : 'Visto por último recentemente'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-60 hover:text-white">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-60 hover:text-white">
            <Video className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-grey-15 mx-2" />
          <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-60 hover:text-white">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('/assets/chat-bg.png')] bg-repeat opacity-95">
        {chat.messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex flex-col max-w-[70%]",
              msg.sender === 'me' ? "ml-auto items-end" : "items-start"
            )}
          >
            <div className={cn(
              "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
              msg.sender === 'me' 
                ? "bg-purple-60 text-white rounded-tr-none shadow-purple-60/20" 
                : "bg-grey-10 border border-grey-15 text-white rounded-tl-none"
            )}>
              {msg.text}
              <div className={cn(
                "flex items-center justify-end gap-1 mt-1 text-[9px]",
                msg.sender === 'me' ? "text-purple-90" : "text-grey-60"
              )}>
                {msg.timestamp}
                {msg.sender === 'me' && (
                  msg.status === 'read' ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-grey-10/50 backdrop-blur-md border-t border-grey-15">
        <div className="flex items-center gap-4 bg-grey-08 border border-grey-15 rounded-2xl p-2 px-4 shadow-inner">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <input 
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2"
          />

          <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15">
            <Smile className="h-5 w-5" />
          </Button>

          {messageText.trim() ? (
            <button className="h-10 w-10 rounded-xl bg-purple-60 flex items-center justify-center text-white shadow-lg shadow-purple-60/30 transition-all scale-100 hover:scale-105 active:scale-95">
              <Send className="h-5 w-5" />
            </button>
          ) : (
            <button className="h-10 w-10 rounded-xl bg-grey-15 flex items-center justify-center text-grey-40 hover:text-white transition-all">
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
