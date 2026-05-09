'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Bot, 
  User, 
  MapPin, 
  Target, 
  History,
  Phone,
  Video,
  ChevronRight,
  Sparkles,
  Zap,
  Clock,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock Data for UX demo
const CONVERSATIONS = [
  { id: 1, name: 'Marcos Oliveira', lastMsg: 'Gostaria de ver o Garden Ville...', time: '14:20', status: 'ai', unread: 0 },
  { id: 2, name: 'Ana Beatriz', lastMsg: 'Qual o valor do condomínio?', time: '14:15', status: 'human', unread: 2 },
  { id: 3, name: 'Roberto Silva', lastMsg: 'Agendado para amanhã às 10h', time: '13:45', status: 'ai', unread: 0 },
  { id: 4, name: 'Juliana Costa', lastMsg: 'A IA respondeu seu interesse...', time: 'Ontem', status: 'pending', unread: 5 },
];

export default function WhatsappChatPage() {
  const [selectedChat, setSelectedChat] = useState(CONVERSATIONS[0]);
  const [mode, setMode] = useState<'ai' | 'human'>('ai');

  return (
    <div className="h-[calc(100vh-64px)] bg-grey-08 flex overflow-hidden">
      
      {/* Column 1: Conversations List */}
      <div className="w-[380px] bg-grey-10 border-r border-grey-15 flex flex-col shrink-0">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight">Conversas</h2>
            <Button variant="ghost" size="icon" className="text-grey-50 hover:text-white">
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-grey-50 group-focus-within:text-purple-60 transition-colors" />
            </div>
            <input 
              placeholder="Pesquisar leads..."
              className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 pl-12 pr-4 text-sm text-white focus:border-purple-60 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest bg-purple-60/10 text-purple-60 border border-purple-60/20 rounded-xl">Todas</Button>
            <Button variant="ghost" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest text-grey-50 hover:text-white transition-colors">Não Lidas</Button>
            <Button variant="ghost" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest text-grey-50 hover:text-white transition-colors">IA Ativa</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 custom-scrollbar">
          {CONVERSATIONS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                "w-full p-4 rounded-[2rem] border transition-all duration-300 flex items-start gap-4 text-left group",
                selectedChat.id === chat.id 
                  ? "bg-purple-60/10 border-purple-60/30 shadow-lg shadow-purple-60/5" 
                  : "bg-transparent border-transparent hover:bg-grey-15/50 hover:border-grey-15"
              )}
            >
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-grey-15 border border-grey-20 flex items-center justify-center text-lg font-black text-white overflow-hidden">
                   {chat.name.charAt(0)}
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-5 w-5 rounded-lg border-2 border-grey-10 flex items-center justify-center",
                  chat.status === 'ai' ? "bg-emerald-500" : "bg-purple-60"
                )}>
                   {chat.status === 'ai' ? <Bot className="h-3 w-3 text-white" /> : <User className="h-3 w-3 text-white" />}
                </div>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-black text-white truncate">{chat.name}</h4>
                  <span className="text-[10px] font-bold text-grey-50">{chat.time}</span>
                </div>
                <p className="text-xs text-grey-50 truncate leading-relaxed">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="mt-4 h-5 w-5 rounded-full bg-purple-60 text-[10px] font-black text-white flex items-center justify-center shadow-lg shadow-purple-60/20">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: Chat Area */}
      <div className="flex-1 flex flex-col bg-grey-08 relative">
        
        {/* Chat Header */}
        <div className="h-24 px-8 border-b border-grey-15 flex items-center justify-between shrink-0 bg-grey-08/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-grey-15 border border-grey-15 flex items-center justify-center text-white font-black">
              {selectedChat.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">{selectedChat.name}</h3>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-grey-50 uppercase tracking-widest">Online via WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-grey-10 p-1.5 rounded-2xl border border-grey-15">
              <button 
                onClick={() => setMode('ai')}
                className={cn(
                  "px-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                  mode === 'ai' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-grey-50 hover:text-white"
                )}
              >
                <Bot className="h-3.5 w-3.5" /> IA Ativa
              </button>
              <button 
                onClick={() => setMode('human')}
                className={cn(
                  "px-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                  mode === 'human' ? "bg-purple-60 text-white shadow-lg shadow-purple-60/20" : "text-grey-50 hover:text-white"
                )}
              >
                <User className="h-3.5 w-3.5" /> Assumir
              </button>
            </div>
            <div className="h-8 w-px bg-grey-15 mx-2" />
            <Button variant="outline" size="icon" className="bg-grey-10 border-grey-15 text-grey-50 hover:text-white h-11 w-11 rounded-2xl"><Phone className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="bg-grey-10 border-grey-15 text-grey-50 hover:text-white h-11 w-11 rounded-2xl"><MoreVertical className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Messages Flow */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="flex flex-col gap-6">
            
            {/* AI Message */}
            <div className="flex items-start gap-4 max-w-[80%]">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <div className="bg-grey-10 border border-grey-15 p-5 rounded-[2rem] rounded-tl-lg text-sm text-white leading-relaxed shadow-sm">
                  Olá Marcos! Sou a Bia, assistente virtual da imobiliária. O Garden Ville é uma excelente escolha. Gostaria de saber mais sobre a planta de 3 quartos ou sobre a área de lazer?
                </div>
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[10px] font-bold text-grey-60">14:10</span>
                  <div className="h-1 w-1 rounded-full bg-grey-60" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">IA Respondeu</span>
                </div>
              </div>
            </div>

            {/* Lead Message */}
            <div className="flex items-start gap-4 max-w-[80%] self-end flex-row-reverse">
              <div className="h-8 w-8 rounded-lg bg-grey-15 border border-grey-20 flex items-center justify-center text-grey-50 shrink-0">
                {selectedChat.name.charAt(0)}
              </div>
              <div className="space-y-2 flex flex-col items-end">
                <div className="bg-purple-60 text-white p-5 rounded-[2rem] rounded-tr-lg text-sm leading-relaxed shadow-xl shadow-purple-60/10">
                  Gostaria de ver a área de lazer. Tem piscina aquecida?
                </div>
                <span className="text-[10px] font-bold text-grey-60 px-2">14:12</span>
              </div>
            </div>

            {/* AI Typing Indicator */}
            <div className="flex items-center gap-4 text-grey-60">
               <div className="h-8 w-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500/40">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest ml-2">Bia está pensando...</span>
            </div>

          </div>
        </div>

        {/* Chat Input */}
        <div className="p-8 shrink-0">
          <div className="bg-grey-10 border border-grey-15 rounded-[2.5rem] p-2 flex items-center gap-2 shadow-2xl">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-grey-50 hover:text-white hover:bg-grey-15">
              <Paperclip className="h-5 w-5" />
            </Button>
            <input 
              placeholder={mode === 'ai' ? "Aguardando IA ou assuma para digitar..." : "Digite sua mensagem..."}
              disabled={mode === 'ai'}
              className="flex-1 bg-transparent border-none outline-none text-white text-sm px-4 placeholder:text-grey-60"
            />
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-grey-50 hover:text-white hover:bg-grey-15">
              <Smile className="h-5 w-5" />
            </Button>
            <Button className="h-12 w-12 rounded-full bg-purple-60 hover:bg-purple-65 text-white shadow-lg shadow-purple-60/20">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Column 3: Lead Intelligence Sidebar */}
      <div className="w-[380px] bg-grey-10 border-l border-grey-15 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="p-8 space-y-8">
          
          {/* Lead Profile */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="h-24 w-24 rounded-[2rem] bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-4xl font-black text-purple-60 mx-auto shadow-2xl">
                {selectedChat.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-grey-10 text-white shadow-xl">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">{selectedChat.name}</h3>
              <p className="text-xs text-grey-50 uppercase font-black tracking-widest mt-1">Lead Qualificado</p>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <div className="px-3 py-1 bg-grey-08 rounded-full border border-grey-15 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Score 94/100</span>
              </div>
            </div>
          </div>

          {/* Core Info */}
          <div className="space-y-4">
             <div className="p-5 bg-grey-08 rounded-3xl border border-grey-15 space-y-4">
               <h4 className="text-[10px] font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                 <Target className="h-4 w-4 text-purple-60" /> Imóvel de Interesse
               </h4>
               <div className="flex items-center gap-4">
                 <div className="h-16 w-16 rounded-2xl bg-grey-15 flex items-center justify-center shrink-0 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                   <MapPin className="h-6 w-6 text-white relative z-10" />
                 </div>
                 <div className="min-w-0">
                   <p className="text-sm font-bold text-white truncate">Garden Ville Residence</p>
                   <p className="text-[10px] text-grey-50 font-medium">3 Quartos • R$ 850.000</p>
                 </div>
                 <Button variant="ghost" size="icon" className="text-grey-60 hover:text-white shrink-0 ml-auto">
                    <ExternalLink className="h-4 w-4" />
                 </Button>
               </div>
             </div>

             <div className="p-5 bg-grey-08 rounded-3xl border border-grey-15 space-y-6">
               <h4 className="text-[10px] font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                 <History className="h-4 w-4 text-purple-60" /> Timeline do Lead
               </h4>
               <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-grey-15">
                 <div className="relative pl-8">
                   <div className="absolute left-0 top-0 h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                     <Bot className="h-3.5 w-3.5" />
                   </div>
                   <p className="text-xs font-bold text-white mb-1">Qualificação IA</p>
                   <p className="text-[10px] text-grey-50">Lead confirmou interesse em piscina aquecida.</p>
                   <span className="text-[9px] text-grey-60 font-medium mt-2 block italic">Há 10 minutos</span>
                 </div>
                 <div className="relative pl-8">
                   <div className="absolute left-0 top-0 h-6 w-6 rounded-lg bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-purple-60">
                     <MapPin className="h-3.5 w-3.5" />
                   </div>
                   <p className="text-xs font-bold text-white mb-1">Busca de Imóvel</p>
                   <p className="text-[10px] text-grey-50">Visualizou 4 fotos do Garden Ville.</p>
                   <span className="text-[9px] text-grey-60 font-medium mt-2 block italic">Hoje, 11:30</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
             <Button className="w-full h-14 bg-grey-15 hover:bg-grey-20 text-white font-black uppercase tracking-widest rounded-2xl border border-grey-20 flex items-center justify-center gap-3">
               <Briefcase className="h-4 w-4 text-purple-60" /> Abrir Oportunidade
             </Button>
             <Button className="w-full h-14 bg-grey-15 hover:bg-grey-20 text-white font-black uppercase tracking-widest rounded-2xl border border-grey-20 flex items-center justify-center gap-3">
               <Clock className="h-4 w-4 text-purple-60" /> Agendar Visita
             </Button>
          </div>

        </div>
      </div>

    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
