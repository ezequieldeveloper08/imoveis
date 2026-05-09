'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Smartphone,
  Send,
  MoreVertical,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MOCK_TEMPLATES = [
  { id: '1', name: 'saudacao_inicial', category: 'UTILITY', status: 'APPROVED', lastUsed: '2h atrás' },
  { id: '2', name: 'confirmacao_visita', category: 'MARKETING', status: 'PENDING', lastUsed: '5h atrás' },
  { id: '3', name: 'follow_up_lead', category: 'MARKETING', status: 'REJECTED', lastUsed: '1d atrás' },
];

export default function WhatsappTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(MOCK_TEMPLATES[0]);

  return (
    <div className="min-h-screen bg-grey-08 p-8 pb-20 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Templates WhatsApp</h1>
          <p className="text-grey-60 text-[10px] font-black uppercase tracking-widest mt-1">Gestão de Mensagens Oficiais</p>
        </div>
        <Button className="bg-purple-60 hover:bg-purple-65 text-white font-bold h-12 px-8 rounded-xl shadow-xl shadow-purple-60/20 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Criar Novo Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Templates List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="relative w-full max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-60 group-focus-within:text-purple-60 transition-colors" />
                <input 
                  placeholder="Pesquisar templates..."
                  className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 pl-12 pr-4 text-sm text-white focus:border-purple-60 outline-none transition-all placeholder:text-grey-70"
                />
              </div>
              <Button variant="outline" className="bg-grey-08 border-grey-15 text-grey-40 hover:text-white h-12 px-6 rounded-2xl flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtros
              </Button>
            </div>

            <div className="space-y-3">
              {MOCK_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={cn(
                    "w-full p-6 rounded-2xl transition-all duration-300 flex items-center justify-between group border cursor-pointer",
                    selectedTemplate.id === tpl.id 
                      ? "bg-grey-15 border-purple-60/30 shadow-xl" 
                      : "bg-grey-08/50 border-grey-15 hover:border-grey-30"
                  )}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center border",
                      tpl.status === 'APPROVED' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      tpl.status === 'PENDING' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                      "bg-red-500/10 border-red-500/20 text-red-500"
                    )}>
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-purple-60 transition-colors">{tpl.name}</p>
                      <p className="text-[10px] text-grey-60 uppercase font-bold tracking-widest">{tpl.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-grey-50 uppercase font-black tracking-widest">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          tpl.status === 'APPROVED' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                          tpl.status === 'PENDING' ? "bg-amber-500" : "bg-red-500"
                        )} />
                        <span className="text-xs font-bold text-white">{tpl.status}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-grey-60 hover:text-white rounded-xl">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Previewer */}
        <div className="lg:col-span-1">
          <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 shadow-xl sticky top-8 flex flex-col items-center">
            <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest mb-8 self-start flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-60" /> Preview Real-time
            </h3>

            {/* Smartphone Frame */}
            <div className="w-full max-w-[280px] aspect-[9/18.5] bg-grey-900 rounded-[3rem] border-[8px] border-grey-15 relative shadow-2xl overflow-hidden ring-4 ring-grey-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-grey-15 rounded-b-2xl z-20" />
              
              {/* WhatsApp UI Mockup */}
              <div className="h-full flex flex-col bg-[#0b141a]">
                <div className="bg-[#1f2c34] p-4 pt-8 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-grey-30" />
                  <div className="h-3 w-20 bg-grey-40 rounded-full" />
                </div>
                
                <div className="flex-1 p-4 space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={selectedTemplate.id}
                    className="bg-[#202c33] rounded-2xl rounded-tl-none p-4 shadow-md max-w-[90%]"
                  >
                    <p className="text-[13px] text-white leading-relaxed mb-3">
                      Olá! 👋 Esta é uma mensagem de teste para o template <span className="text-blue-400 font-bold">{selectedTemplate.name}</span>. O conteúdo dinâmico aparecerá aqui.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-grey-50">12:00</span>
                    </div>
                  </motion.div>
                </div>

                <div className="bg-[#1f2c34] p-4 flex items-center gap-3">
                  <div className="flex-1 h-9 bg-[#2a3942] rounded-full" />
                  <div className="h-9 w-9 bg-[#00a884] rounded-full flex items-center justify-center text-white">
                    <Send className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full p-4 bg-grey-08 rounded-2xl border border-grey-15 space-y-3">
              <p className="text-[10px] font-black text-purple-60 uppercase tracking-widest">Dica de Aprovação</p>
              <p className="text-[11px] text-grey-50 leading-relaxed">
                Evite usar termos excessivamente comerciais. A Meta prefere mensagens que agreguem valor à jornada do lead.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
