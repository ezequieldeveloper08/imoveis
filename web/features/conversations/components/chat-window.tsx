'use client';

import { Chat } from '../types/chat.types';
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
  Mic,
  Loader2,
  Search,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chat.service';
import { whatsappService } from '@/features/whatsapp/services/whatsapp.service';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useSocket } from '@/hooks/use-socket';
import { PropertySelectorModal } from './property-selector-modal';
import { Property } from '@/features/properties/types/property.types';
import Image from 'next/image';

interface ChatWindowProps {
  chat: Chat | null;
}

export function ChatWindow({ chat }: ChatWindowProps) {
  const { getToken } = useAuth();
  const socket = useSocket('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const getImageUrl = (url: string) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectProperties = async (selected: Property[]) => {
    if (!chat?.id) return;

    for (const property of selected) {
      const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price);
      const message = `🏠 *Imóvel Interessante*\n\n*${property.title}*\n💰 Valor: ${price}\n📍 Localização: ${property.neighborhood}, ${property.city}\n🛏️ ${property.bedrooms} Quartos | 🚿 ${property.bathrooms} Banheiros\n📏 Área: ${property.area}m²\n\n_Deseja agendar uma visita para conhecer este imóvel?_`;
      
      const token = getToken() || undefined;
      await chatService.sendMessage(chat.id, message, token, {
        mediaUrl: getImageUrl(property.images?.[0]),
        mediaType: 'image'
      });
    }
    
    // Refresh messages
    loadMessages();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !chat?.id) return;

    socket.on('new_message', (msg: any) => {
      if (msg.conversationId === chat.id) {
        setMessages(prev => {
           // Avoid duplicates from self-sending refresh
           if (prev.some(m => m.id === msg.id)) return prev;
           
           const newMsg = {
             id: msg.id,
             text: msg.content,
             sender: msg.senderId === chat.leadId ? 'them' : 'me',
             timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             status: 'read',
             mediaUrl: msg.mediaUrl,
             mediaType: msg.mediaType
           };
           return [...prev, newMsg];
        });
        
        // Mark as read since we are viewing it
        const token = getToken() || undefined;
        if (token) {
          chatService.markAsRead(chat.id, token);
        }
      }
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket, chat?.id, getToken]);

  useEffect(() => {
    if (chat?.id) {
      loadMessages();
      
      // Mark as read when opening
      const token = getToken() || undefined;
      if (token) {
        chatService.markAsRead(chat.id, token);
      }
    }
  }, [chat?.id, getToken]);

  const loadMessages = async () => {
    if (!chat?.id) return;
    setLoadingMessages(true);
    try {
      const token = getToken() || undefined;
      if (token) {
        const history = await chatService.getMessages(chat.id, token);
        setMessages(history);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !chat?.id || isSending) return;

    setIsSending(true);
    try {
      const token = getToken() || undefined;
      if (token) {
        await chatService.sendMessage(chat.id, messageText, token);
        setMessageText('');
        loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Connect to WhatsApp if needed (legacy or sync check)
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const token = getToken() || undefined;
        if (token) {
          const instances = await whatsappService.getInstances(token);
          const connected = instances.some((i: any) => i.status === 'CONNECTED');
          setIsConnected(connected);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };
    checkConnection();
  }, [getToken]);

  const formatWhatsAppText = (text: string) => {
    if (!text) return '';
    
    // Replace *text* with <strong>text</strong>
    let formatted = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    
    // Replace _text_ with <em>text</em>
    formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
    
    return formatted;
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-grey-08/30">
        <div className="w-24 h-24 rounded-full bg-grey-10 flex items-center justify-center mb-6 shadow-xl border border-grey-15">
          <Send className="h-10 w-10 text-grey-40 -rotate-12" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Selecione uma conversa</h2>
        <p className="text-grey-60 max-w-sm">
          Escolha um contato ao lado para iniciar ou continuar o atendimento via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col min-w-0 bg-grey-08/30">
        {/* Chat Header */}
        <div className="p-4 px-6 border-b border-grey-15 bg-grey-10/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-grey-15 flex items-center justify-center border border-grey-20 relative overflow-hidden group">
              {chat.contactAvatar ? (
                <img src={chat.contactAvatar} alt={chat.contactName} className="w-full h-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-grey-40 group-hover:text-purple-40 transition-colors" />
              )}
              {chat.status === 'online' && (
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-grey-10" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-white text-lg tracking-tight">{chat.contactName}</h2>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-grey-60 font-medium uppercase tracking-wider">WhatsApp Ativo</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15 rounded-xl">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15 rounded-xl">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15 rounded-xl">
              <Video className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-grey-20 mx-1" />
            <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15 rounded-xl">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
          {loadingMessages && messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-purple-60 animate-spin mb-4" />
              <p className="text-grey-60 text-sm">Carregando histórico...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-grey-60 text-sm italic">
              Nenhuma mensagem nesta conversa.
            </div>
          ) : (
            messages.map((msg) => (
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
                  {msg.mediaUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                      <Image 
                        src={getImageUrl(msg.mediaUrl) || ''} 
                        alt="Mídia" 
                        width={400} 
                        height={300}
                        unoptimized
                        className="w-full h-auto object-cover max-h-64"
                      />
                    </div>
                  )}
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatWhatsAppText(msg.text) }}
                  />
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
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-grey-10/50 backdrop-blur-md border-t border-grey-15">
          {!isConnected ? (
            <div className="flex items-center justify-center p-4 bg-grey-08 rounded-2xl border border-dashed border-grey-15">
              <p className="text-[10px] font-black uppercase tracking-widest text-grey-60">
                Conexão obrigatória para enviar mensagens
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-grey-08 border border-grey-15 rounded-2xl p-2 px-4 shadow-inner">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPropertyModalOpen(true)}
                className="h-10 w-10 text-purple-40 hover:text-purple-30 hover:bg-purple-60/10"
              >
                <Home className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15">
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-grey-60 py-3"
              />
              
              <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-grey-40 hover:text-white hover:bg-grey-15">
                <Mic className="h-5 w-5" />
              </Button>
              
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!messageText.trim() || isSending}
                className={cn(
                  "h-10 w-10 rounded-xl transition-all shadow-lg",
                  messageText.trim() 
                    ? "bg-purple-60 hover:bg-purple-70 text-white shadow-purple-60/40" 
                    : "bg-grey-20 text-grey-60 grayscale cursor-not-allowed"
                )}
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <PropertySelectorModal 
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        onSelect={handleSelectProperties}
      />
    </>
  );
}
