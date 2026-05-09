'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Bot, 
  User, 
  Phone, 
  Video, 
  MoreHorizontal,
  Plus,
  Zap,
  Target,
  History,
  MapPin,
  ExternalLink,
  Briefcase,
  Clock,
  Sparkles,
  Settings2,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const MOCK_CONVERSATIONS = [
  { id: '1', name: 'João Silva', lastMsg: 'Olá, gostaria de saber mais sobre o imóvel em Alphaville...', time: '14:20', status: 'online', unread: 2, type: 'ia' },
  { id: '2', name: 'Maria Oliveira', lastMsg: 'A visita está confirmada para amanhã?', time: 'Ontem', status: 'away', unread: 0, type: 'human' },
  { id: '3', name: 'Carlos Alberto', lastMsg: 'Obrigado pelas informações.', time: '10:05', status: 'online', unread: 0, type: 'human' },
];

export default function ConversationsPage() {
  const [selectedId, setSelectedId] = useState('1');
  const [showIntelligence, setShowIntelligence] = useState(false);
  const [mode, setMode] = useState<'ai' | 'human'>('ai');

  const selectedChat = MOCK_CONVERSATIONS.find(c => c.id === selectedId) || MOCK_CONVERSATIONS[0];

  return (
    <div className="fixed inset-0 top-20 left-72 flex overflow-hidden bg-grey-08 border-t border-grey-15">
      
      {/* Sidebar: Conversations List */}
      <div className="w-[400px] border-r border-grey-15 flex flex-col bg-grey-08 shrink-0">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Conversas</h2>
              <p className="text-grey-60 text-[10px] font-black uppercase tracking-widest mt-1">Central de Atendimento</p>
            </div>
            <Button variant="ghost" size="icon" className="text-grey-60 hover:text-white rounded-xl">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-grey-60 group-focus-within:text-purple-60 transition-colors" />
            </div>
            <input 
              placeholder="Pesquisar contatos..."
              className="w-full bg-grey-10 border border-grey-15 rounded-2xl h-12 pl-12 pr-4 text-sm text-white focus:border-purple-60 outline-none transition-all placeholder:text-grey-60"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 custom-scrollbar">
          {MOCK_CONVERSATIONS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedId(chat.id)}
              className={cn(
                "w-full p-4 rounded-3xl transition-all duration-300 flex items-center gap-4 text-left group border",
                selectedId === chat.id 
                  ? "bg-grey-10 border-grey-15 shadow-xl shadow-purple-60/5" 
                  : "bg-transparent border-transparent hover:bg-grey-15/30"
              )}
            >
              <div className="relative shrink-0">
                <div className="h-14 w-14 rounded-2xl bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-lg font-black text-purple-60 overflow-hidden">
                   {chat.name.charAt(0)}
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-4 border-grey-08",
                  chat.status === 'online' ? "bg-emerald-500" : "bg-grey-40"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white truncate">{chat.name}</h4>
                  <span className="text-[9px] font-bold text-grey-60 uppercase tracking-widest">{chat.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-grey-50 truncate flex-1 leading-relaxed">{chat.lastMsg}</p>
                  {chat.unread > 0 && (
                    <div className="h-5 w-5 rounded-full bg-purple-60 text-[10px] font-black text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-60/20">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-grey-08 relative">
        
        {/* Chat Header */}
        <div className="h-24 px-10 border-b border-grey-15 flex items-center justify-between shrink-0 bg-grey-08/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-purple-60 font-black text-lg">
                {selectedChat.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-grey-08 bg-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">{selectedChat.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hybrid Intelligence Toggle */}
            <div className="flex items-center bg-grey-10 p-1 rounded-2xl border border-grey-15 mr-2">
              <button 
                onClick={() => setMode('ai')}
                className={cn(
                  "px-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                  mode === 'ai' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-grey-60 hover:text-white"
                )}
              >
                <Bot className="h-4 w-4" /> IA Ativa
              </button>
              <button 
                onClick={() => setMode('human')}
                className={cn(
                  "px-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                  mode === 'human' ? "bg-purple-60 text-white shadow-lg shadow-purple-60/20" : "text-grey-60 hover:text-white"
                )}
              >
                <User className="h-4 w-4" /> Humano
              </button>
            </div>

            <Button variant="outline" size="icon" className="bg-grey-10 border-grey-15 text-grey-40 hover:text-white h-11 w-11 rounded-xl"><Phone className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="bg-grey-10 border-grey-15 text-grey-40 hover:text-white h-11 w-11 rounded-xl"><Video className="h-4 w-4" /></Button>
            
            <div className="h-8 w-px bg-grey-15 mx-1" />
            
            {/* Settings Quick Access */}
            <div className="relative group">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-grey-10 border-grey-15 text-grey-40 hover:text-white h-11 w-11 rounded-xl"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-grey-10 border border-grey-15 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                <Link href="/admin/whatsapp/onboarding" className="flex items-center gap-3 p-3 hover:bg-grey-15 rounded-xl transition-colors group/item">
                  <div className="h-8 w-8 rounded-lg bg-purple-60/10 flex items-center justify-center text-purple-60 group-hover/item:bg-purple-60 group-hover/item:text-white transition-all">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Conectar Meta</p>
                    <p className="text-[9px] text-grey-50">Configuração API</p>
                  </div>
                </Link>
                <Link href="/admin/whatsapp/templates" className="flex items-center gap-3 p-3 hover:bg-grey-15 rounded-xl transition-colors group/item">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Templates</p>
                    <p className="text-[9px] text-grey-50">Mensagens oficiais</p>
                  </div>
                </Link>
              </div>
            </div>

            <Button 
              onClick={() => setShowIntelligence(!showIntelligence)}
              variant="outline" 
              size="icon" 
              className={cn(
                "h-11 w-11 rounded-xl transition-all",
                showIntelligence ? "bg-purple-60 border-purple-60 text-white shadow-xl shadow-purple-60/20" : "bg-grey-10 border-grey-15 text-grey-40 hover:text-white"
              )}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Content */}
        <div className="flex-1 overflow-y-auto p-10 pb-32 space-y-8 custom-scrollbar">
          <div className="flex flex-col gap-6">
            
            <div className="flex flex-col items-center py-4">
               <span className="px-4 py-1 bg-grey-10 border border-grey-15 rounded-full text-[9px] font-bold text-grey-50 uppercase tracking-widest">Hoje</span>
            </div>

            {/* Inbound Message */}
            <div className="flex items-start gap-4 max-w-[80%]">
              <div className="h-10 w-10 rounded-xl bg-grey-15 border border-grey-15 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {selectedChat.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <div className="bg-grey-10 border border-grey-15 p-5 rounded-2xl rounded-tl-sm text-sm text-white leading-relaxed shadow-sm">
                  Bom dia! Tudo bem?
                </div>
                <span className="text-[9px] font-bold text-grey-60 px-1">14:15</span>
              </div>
            </div>

            <div className="flex items-start gap-4 max-w-[80%]">
              <div className="h-10 w-10 rounded-xl bg-grey-15 border border-grey-15 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {selectedChat.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <div className="bg-grey-10 border border-grey-15 p-5 rounded-2xl rounded-tl-sm text-sm text-white leading-relaxed shadow-sm">
                  Olá, gostaria de saber mais sobre o imóvel em Alphaville.
                </div>
                <span className="text-[9px] font-bold text-grey-60 px-1">14:20</span>
              </div>
            </div>

            {/* AI Suggestion (Draft Mode) */}
            {mode === 'ai' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 max-w-[80%] self-end flex-row-reverse"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="space-y-3 flex flex-col items-end">
                  <div className="bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 p-5 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed italic relative">
                    <div className="absolute -top-3 right-6 px-2 py-1 bg-emerald-500 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">Sugestão IA</div>
                    "Com certeza, João! O imóvel em Alphaville possui 4 suítes e área gourmet privativa. Gostaria que eu te enviasse a ficha técnica completa ou prefere agendar uma visita?"
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" className="h-8 px-4 text-[9px] font-black text-grey-50 uppercase tracking-widest hover:text-white">Gerar Outra</Button>
                    <Button className="h-8 px-6 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20">Aprovar e Enviar</Button>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-8 shrink-0 bg-grey-08 border-t border-grey-15">
          <div className="bg-grey-10 border border-grey-15 rounded-2xl p-2 flex items-center gap-3 shadow-xl focus-within:border-purple-60/50 transition-all">
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-grey-50 hover:text-white hover:bg-grey-15 shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <input 
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2 placeholder:text-grey-60"
            />
            <div className="flex items-center gap-2 shrink-0">
               <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-grey-50 hover:text-white hover:bg-grey-15">
                <Smile className="h-5 w-5" />
              </Button>
              <Button className="h-11 w-11 rounded-xl bg-purple-60 hover:bg-purple-65 text-white shadow-lg shadow-purple-60/20 transition-all">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Lead Intelligence (Toggleable) */}
      <AnimatePresence>
        {showIntelligence && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-grey-15 bg-grey-10 flex flex-col shrink-0 overflow-hidden shadow-2xl"
          >
            <div className="w-[400px] p-8 space-y-8 overflow-y-auto custom-scrollbar h-full">
               <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="h-28 w-28 rounded-3xl bg-purple-60/10 border-4 border-grey-10 shadow-xl flex items-center justify-center text-4xl font-black text-purple-60 mx-auto">
                      {selectedChat.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2.5 rounded-xl border-4 border-grey-10 text-white shadow-xl">
                      <Zap className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">{selectedChat.name}</h3>
                    <p className="text-[10px] text-purple-60 uppercase font-black tracking-widest mt-2 flex items-center justify-center gap-2">
                       <Sparkles className="h-3 w-3" /> Lead Qualificado via IA
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-1.5 bg-grey-08 rounded-full border border-grey-15 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Score 94/100</span>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="p-6 bg-grey-08 rounded-3xl border border-grey-15 space-y-4 group hover:border-purple-60/30 transition-all">
                    <h4 className="text-[10px] font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-60" /> Imóvel de Interesse
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-grey-15 flex items-center justify-center shrink-0 border border-grey-15 relative">
                        <MapPin className="h-6 w-6 text-grey-60" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">Garden Ville Residence</p>
                        <p className="text-[10px] text-grey-50 font-medium">4 Suítes • R$ 1.250.000</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-grey-60 hover:text-white shrink-0 ml-auto h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 bg-grey-08 rounded-3xl border border-grey-15 space-y-6">
                    <h4 className="text-[10px] font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                      <History className="h-4 w-4 text-purple-60" /> Jornada do Lead
                    </h4>
                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-grey-15">
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-xs font-bold text-white mb-1">Qualificação de Perfil</p>
                        <p className="text-[10px] text-grey-50 leading-relaxed">IA identificou interesse em permuta e financiamento bancário.</p>
                        <span className="text-[9px] text-grey-60 font-medium mt-1.5 block uppercase tracking-tighter">Há 15 min</span>
                      </div>
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-0 h-6 w-6 rounded-lg bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-purple-60">
                          <MapPin className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-xs font-bold text-white mb-1">Visita Virtual</p>
                        <p className="text-[10px] text-grey-50 leading-relaxed">Navegou por 4m32s nas fotos 360º do Garden Ville.</p>
                        <span className="text-[9px] text-grey-60 font-medium mt-1.5 block uppercase tracking-tighter">Hoje, 11:30</span>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="pt-4 space-y-3">
                  <Button className="w-full h-12 bg-purple-60 hover:bg-purple-65 text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-purple-60/10 flex items-center justify-center gap-3">
                    <Briefcase className="h-4 w-4" /> Abrir Oportunidade
                  </Button>
                  <Button className="w-full h-12 bg-grey-15 hover:bg-grey-20 text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl border border-grey-20 flex items-center justify-center gap-3">
                    <Clock className="h-4 w-4 text-purple-60" /> Agendar Visita
                  </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
