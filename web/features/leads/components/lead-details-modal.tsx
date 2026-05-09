'use client';

import { 
  X, Mail, Phone, Calendar, 
  MapPin, Clock, MessageSquare, 
  User, DollarSign, History,
  Edit2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lead } from '../types/lead.types';
import Link from 'next/link';

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export function LeadDetailsModal({ isOpen, onClose, lead }: LeadDetailsModalProps) {
  if (!isOpen || !lead) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-grey-10 border border-grey-15 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-purple-60 to-indigo-60 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white backdrop-blur-md transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6">
              <div className="h-24 w-24 rounded-3xl bg-grey-10 border-4 border-grey-10 shadow-xl flex items-center justify-center text-3xl font-black text-purple-60 overflow-hidden">
                <div className="absolute inset-0 bg-purple-60/10" />
                {lead.name.charAt(0)}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">{lead.name}</h2>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-grey-40">
                  <span className="flex items-center gap-2 bg-grey-08 px-3 py-1.5 rounded-lg border border-grey-15">
                    <Mail className="h-3.5 w-3.5 text-purple-60" /> 
                    {lead.email}
                  </span>
                  <span className="flex items-center gap-2 bg-grey-08 px-3 py-1.5 rounded-lg border border-grey-15">
                    <Phone className="h-3.5 w-3.5 text-purple-60" /> 
                    {lead.phone}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/leads/${lead.id}/edit`}>
                  <Button variant="outline" className="bg-grey-08 border-grey-15 h-11 text-xs px-5 hover:bg-grey-15">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button className="bg-purple-60 hover:bg-purple-65 h-11 text-xs px-6 text-white font-bold shadow-lg shadow-purple-60/20">
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {/* Left Column: Details */}
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-grey-40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <History className="h-4 w-4 text-purple-60" />
                    Sobre o Lead
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-grey-08/50 rounded-2xl border border-grey-15 space-y-2">
                      <p className="text-[10px] text-grey-50 uppercase font-black tracking-wider">Status Atual</p>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-60 animate-pulse" />
                        <p className="text-sm font-bold text-white capitalize">{lead.status}</p>
                      </div>
                    </div>
                    <div className="p-5 bg-grey-08/50 rounded-2xl border border-grey-15 space-y-2">
                      <p className="text-[10px] text-grey-50 uppercase font-black tracking-wider">Interesse</p>
                      <p className="text-sm font-bold text-white truncate">{lead.interest || 'Geral'}</p>
                    </div>
                    <div className="p-5 bg-grey-08/50 rounded-2xl border border-grey-15 space-y-2">
                      <p className="text-[10px] text-grey-50 uppercase font-black tracking-wider">Origem</p>
                      <p className="text-sm font-bold text-white">{lead.source || 'Direto'}</p>
                    </div>
                    <div className="p-5 bg-grey-08/50 rounded-2xl border border-grey-15 space-y-2">
                      <p className="text-[10px] text-grey-50 uppercase font-black tracking-wider">Membro desde</p>
                      <p className="text-sm font-bold text-white">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-grey-40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-60" />
                    Notas e Observações
                  </h3>
                  <div className="p-6 bg-grey-08/50 rounded-2xl border border-grey-15 min-h-[120px]">
                    <p className="text-sm text-grey-40 leading-relaxed italic">
                      {lead.notes || 'Nenhuma observação registrada para este lead.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Stats */}
              <div className="space-y-6">
                <div className="p-6 bg-purple-60/5 border border-purple-60/20 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-purple-60 uppercase tracking-widest">Potencial</h4>
                    <DollarSign className="h-4 w-4 text-purple-60" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-grey-50 uppercase font-bold">Valor Estimado</span>
                      <span className="text-2xl font-black text-white">
                        {lead.value ? lead.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-grey-50">Score</span>
                        <span className="text-purple-60">70%</span>
                      </div>
                      <div className="h-2 w-full bg-grey-15 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '70%' }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-purple-60 rounded-full" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-grey-50 uppercase tracking-widest">Ações Rápidas</h4>
                  <div className="space-y-3">
                    <button className="w-full p-4 text-left text-xs font-bold text-grey-40 hover:text-white hover:bg-grey-08 rounded-xl border border-grey-15/50 hover:border-purple-60/30 transition-all flex items-center justify-between group">
                      <span className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-purple-60" />
                        Ver Imóvel
                      </span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                    <button className="w-full p-4 text-left text-xs font-bold text-grey-40 hover:text-white hover:bg-grey-08 rounded-xl border border-grey-15/50 hover:border-purple-60/30 transition-all flex items-center justify-between group">
                      <span className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-purple-60" />
                        Histórico
                      </span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
