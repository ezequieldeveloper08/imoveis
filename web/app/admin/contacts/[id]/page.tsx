'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Mail, Phone, Clock, MessageSquare,
  User, History, Edit2,
  ArrowLeft, Calendar, ExternalLink,
  ChevronRight, MapPin, Target,
  Briefcase, Activity,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactService } from '@/features/contacts/services/contact.service';
import { leadsService } from '@/features/leads/services/leads.service';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ContactDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [contact, setContact] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [contactData, leadsData] = await Promise.all([
          contactService.getById(id),
          leadsService.getAll({ contactId: id })
        ]);
        setContact(contactData);
        setLeads(leadsData);
        setEditedNotes(contactData.notes || '');
      } catch (error) {
        console.error('Failed to load contact data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey-08 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-purple-60 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-grey-08 flex flex-col items-center justify-center gap-4">
        <p className="text-white">Contato não encontrado.</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-08">
      <div className="container mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-grey-40 hover:text-white transition-colors group mb-8"
        >
          <div className="h-8 w-8 rounded-full bg-grey-10 border border-grey-15 flex items-center justify-center group-hover:bg-grey-15 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Voltar para Contatos</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div className="h-28 w-28 rounded-3xl bg-purple-60/10 border-4 border-grey-10 shadow-2xl flex items-center justify-center text-4xl font-black text-purple-60 mb-6">
                  {contact.name.charAt(0)}
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mb-2">{contact.name}</h1>
                <p className="text-xs text-grey-50 uppercase font-black tracking-widest mb-6">Ficha de Contato</p>

                <div className="w-full space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-grey-08 rounded-2xl border border-grey-15">
                    <Mail className="h-4 w-4 text-purple-60" />
                    <span className="text-sm text-grey-60 truncate">{contact.email || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-grey-08 rounded-2xl border border-grey-15">
                    <Phone className="h-4 w-4 text-purple-60" />
                    <span className="text-sm text-grey-60">{contact.phone || 'Não informado'}</span>
                  </div>
                </div>

                <div className="flex w-full gap-3">
                  <Button variant="outline" className="flex-1 h-12 bg-grey-08 border-grey-15 text-white hover:bg-grey-15">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button className="flex-1 h-12 bg-purple-60 hover:bg-purple-65 text-white font-bold shadow-lg shadow-purple-60/20">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-6">
              <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest">Resumo de Atividade</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-grey-08 rounded-2xl border border-grey-15 text-center">
                  <p className="text-2xl font-black text-white">{leads.length}</p>
                  <p className="text-[10px] text-grey-50 uppercase font-bold">Oportunidades</p>
                </div>
                <div className="p-4 bg-grey-08 rounded-2xl border border-grey-15 text-center">
                  <p className="text-2xl font-black text-emerald-500">
                    {leads.filter(l => l.status === 'closed').length}
                  </p>
                  <p className="text-[10px] text-grey-50 uppercase font-bold">Fechados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center/Right Column: Oportunidades */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <Target className="h-6 w-6 text-purple-60" />
                Histórico de Negócios
              </h2>
              <Link href={`/admin/leads/new?contactId=${contact.id}`}>
                <Button variant="outline" className="h-10 text-xs bg-grey-10 border-grey-15 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Oportunidade
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leads.length > 0 ? leads.map((lead, idx) => (
                <Link key={lead.id} href={`/admin/leads/${lead.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-grey-10 border border-grey-15 rounded-3xl p-6 hover:border-purple-60/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        lead.status === 'closed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          "bg-purple-60/10 text-purple-60 border-purple-60/20"
                      )}>
                        {lead.status}
                      </span>
                      <span className="text-[10px] text-grey-60 font-bold uppercase tracking-tighter">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 group-hover:text-purple-60 transition-colors">
                      {lead.interest || 'Interesse Geral'}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-grey-60 mb-4">
                      <MapPin className="h-3.5 w-3.5 text-purple-60" />
                      {lead.propertyId ? 'Imóvel Específico' : 'Busca Aberta'}
                    </div>

                    <div className="h-px bg-grey-15 mb-4" />

                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-grey-40 uppercase tracking-widest">Valor</span>
                      <span className="text-white">
                        {lead.value ? lead.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              )) : (
                <div className="col-span-2 py-20 bg-grey-10/50 border-2 border-dashed border-grey-15 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-grey-08 flex items-center justify-center text-grey-40">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Nenhum negócio ativo</p>
                    <p className="text-xs text-grey-60">Este contato ainda não possui leads registrados.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Internal Notes about the person */}
            <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-6">
              <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-60" />
                Notas de Perfil do Cliente
              </h3>
              <div className="p-8 bg-grey-08/50 rounded-2xl border border-grey-15 relative group">
                {isEditingNotes ? (
                  <div className="space-y-4">
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Ex: Perfil investidor, prefere contato via WhatsApp..."
                      className="w-full bg-grey-10 border border-grey-20 rounded-xl p-4 text-sm text-white outline-none focus:border-purple-60 transition-all min-h-[120px] resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingNotes(false);
                          setEditedNotes(contact.notes || '');
                        }}
                        className="text-xs text-grey-40 hover:text-white"
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={async () => {
                          await contactService.update(id, { notes: editedNotes });
                          setContact((prev: any) => ({ ...prev, notes: editedNotes }));
                          setIsEditingNotes(false);
                        }}
                        className="text-xs bg-purple-60 text-white font-bold h-8 px-4"
                      >
                        Salvar Perfil
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-grey-50 leading-relaxed italic whitespace-pre-wrap">
                      {contact.notes || 'Utilize este espaço para registrar características permanentes deste contato, como perfil de investidor, composição familiar ou preferências que valem para qualquer imóvel.'}
                    </p>
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-grey-10 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-purple-60 hover:border-purple-60 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
