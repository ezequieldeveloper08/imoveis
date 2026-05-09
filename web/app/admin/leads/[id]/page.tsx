'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Mail, Phone, Clock, MessageSquare,
  User, DollarSign, History, Edit2,
  ArrowLeft, Calendar, ExternalLink,
  ChevronRight, MapPin, Briefcase,
  CheckCircle2, AlertCircle, LayoutGrid,
  Trash2, X, AlertTriangle, Bed, Bath, Maximize2,
  DollarSign as DollarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { leadsService } from '@/features/leads/services/leads.service';
import { proposalsService } from '@/features/proposals/services/proposals.service';
import { calendarService } from '@/features/calendar/services/calendar.service';
import { propertiesService } from '@/features/properties/services/properties.service';
import { Lead } from '@/features/leads/types/lead.types';
import { Property } from '@/features/properties/types/property.types';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Activity {
  id: string;
  type: 'creation' | 'proposal' | 'appointment';
  title: string;
  description: string;
  date: string;
  status?: string;
}

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [relatedLeads, setRelatedLeads] = useState<Lead[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [discardReason, setDiscardReason] = useState('');
  const [proposalValue, setProposalValue] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const leadData = await leadsService.getById(id);
        setLead(leadData);

        const [proposals, appointments, related, propertyData] = await Promise.all([
          proposalsService.getByLead(id),
          calendarService.getByLead(id),
          leadsService.getAll({ email: leadData.email }),
          leadData.propertyId ? propertiesService.getById(leadData.propertyId) : Promise.resolve(null)
        ]);

        setProperty(propertyData);
        setEditedNotes(leadData.notes || '');

        // Compile activities
        const allActivities: Activity[] = [
          {
            id: 'creation',
            type: 'creation',
            title: 'Lead Cadastrado',
            description: `O lead entrou no sistema via ${leadData.source || 'Direto'}.`,
            date: leadData.createdAt
          }
        ];

        proposals.forEach(p => {
          allActivities.push({
            id: p.id,
            type: 'proposal',
            title: 'Proposta Enviada',
            description: `Valor: ${p.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
            date: p.createdAt,
            status: p.status
          });
        });

        appointments.forEach(a => {
          allActivities.push({
            id: a.id,
            type: 'appointment',
            title: 'Visita Agendada',
            description: `Data: ${new Date(a.date).toLocaleDateString('pt-BR')} às ${a.time}`,
            date: a.createdAt,
            status: a.status
          });
        });

        // Sort by date descending
        allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setActivities(allActivities);
        setRelatedLeads(related.filter(r => r.id !== id));

      } catch (error) {
        console.error('Failed to load lead data:', error);
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-grey-08 flex flex-col items-center justify-center gap-4">
        <p className="text-white">Lead não encontrado.</p>
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
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Voltar para Leads</span>
        </button>

        {/* Sales Workflow Bar */}
        <div className="bg-grey-10 border border-grey-15 rounded-3xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl shadow-purple-60/5">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-black text-grey-40 uppercase tracking-widest mb-1">Próximo Passo</span>
              <p className="text-sm font-bold text-white">
                {lead.status?.toLowerCase() === 'new' ? 'Qualificação do Lead' :
                  lead.status?.toLowerCase() === 'qualified' ? 'Agendar Visita Técnica' :
                    lead.status?.toLowerCase() === 'visit' ? 'Apresentar Proposta' : 'Fechar Negócio'}
              </p>
            </div>
            <div className="h-8 w-px bg-grey-15 hidden md:block" />
            <div className="flex items-center gap-2">
              {['new', 'qualified', 'visit', 'proposal', 'closed'].map((step, idx) => {
                const isActive = lead.status?.toLowerCase() === step;
                const isPast = ['new', 'qualified', 'visit', 'proposal', 'closed'].indexOf(lead.status?.toLowerCase() || '') > idx;

                return (
                  <div key={step} className="flex items-center">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all",
                      isActive ? "bg-purple-60 border-purple-60 text-white shadow-lg shadow-purple-60/20 scale-110" :
                        isPast ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500" :
                          "bg-grey-08 border-grey-15 text-grey-50"
                    )}>
                      {isPast ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    {idx < 4 && <div className="w-4 h-px bg-grey-15 mx-1" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lead.status?.toLowerCase() === 'new' ? (
              <Button
                onClick={async () => {
                  await leadsService.update(id, { status: 'qualified' });
                  window.location.reload();
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 px-6 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" /> Qualificar Lead
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="bg-purple-60 hover:bg-purple-65 text-white font-bold h-11 px-6 shadow-lg shadow-purple-60/20"
                >
                  <Calendar className="h-4 w-4 mr-2" /> Agendar Visita
                </Button>
                <Button
                  onClick={() => setIsProposalModalOpen(true)}
                  variant="outline"
                  className="bg-grey-08 border-grey-15 text-white hover:bg-grey-15 h-11 px-6"
                >
                  <DollarSign className="h-4 w-4 mr-2 text-emerald-500" /> Fazer Proposta
                </Button>
              </>
            )}
            <div className="h-6 w-px bg-grey-15 mx-1" />
            <Button
              onClick={() => setIsDiscardModalOpen(true)}
              variant="ghost"
              className="text-red-500 hover:bg-red-500/10 h-11 px-4"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div className="h-28 w-28 rounded-3xl bg-purple-60/10 border-4 border-grey-10 shadow-2xl flex items-center justify-center text-4xl font-black text-purple-60 mb-6">
                  {lead.name.charAt(0)}
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight mb-2">{lead.name}</h1>
                <Link href={`/admin/contacts/${lead.contactId}`} className="text-[10px] text-purple-60 font-black uppercase tracking-widest hover:underline mb-6 flex items-center gap-1">
                  <User className="h-3 w-3" /> Ver Ficha do Contato
                </Link>
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-6",
                  lead.status === 'closed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    lead.status === 'proposal' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      "bg-purple-60/10 text-purple-60 border-purple-60/20"
                )}>
                  {lead.status}
                </span>

                <div className="w-full space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-grey-08 rounded-2xl border border-grey-15">
                    <Mail className="h-4 w-4 text-purple-60" />
                    <span className="text-sm text-grey-60 truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-grey-08 rounded-2xl border border-grey-15">
                    <Phone className="h-4 w-4 text-purple-60" />
                    <span className="text-sm text-grey-60">{lead.phone}</span>
                  </div>
                </div>

                <div className="w-full space-y-3 mb-6">
                  <div className="p-4 bg-purple-60/5 border border-purple-60/10 rounded-2xl">
                    <p className="text-[10px] font-black text-purple-60 uppercase tracking-widest mb-1">Status Atual</p>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-60 animate-pulse" />
                      {lead.status?.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Potential Score */}
            <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest">Potencial de Venda</h3>
                <DollarSign className="h-4 w-4 text-purple-60" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-grey-50 uppercase font-bold mb-1">Valor Estimado</span>
                  <span className="text-3xl font-black text-white">
                    {lead.value ? lead.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-grey-50">Score de Qualificação</span>
                    <span className="text-purple-60">
                      {lead.status === 'new' ? '20%' :
                        lead.status === 'qualified' ? '50%' :
                          lead.status === 'visit' ? '70%' :
                            lead.status === 'proposal' ? '90%' : '100%'}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-grey-08 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: lead.status === 'new' ? '20%' :
                          lead.status === 'qualified' ? '50%' :
                            lead.status === 'visit' ? '70%' :
                              lead.status === 'proposal' ? '90%' : '100%'
                      }}
                      className="h-full bg-purple-60 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Related Opportunities */}
            {relatedLeads.length > 0 && (
              <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-purple-60" />
                  Outras Oportunidades
                </h3>
                <div className="space-y-3">
                  {relatedLeads.map(related => (
                    <Link key={related.id} href={`/admin/leads/${related.id}`}>
                      <div className="p-4 bg-grey-08/50 rounded-2xl border border-grey-15 hover:border-purple-60/50 transition-all group">
                        <p className="text-xs font-bold text-white mb-1 group-hover:text-purple-60 transition-colors">
                          {related.interest || 'Interesse em Imóvel'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-grey-50 uppercase font-bold">{related.status}</span>
                          <ExternalLink className="h-3 w-3 text-grey-60" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center/Right Column: Detailed Info & Timeline */}
          <div className="lg:col-span-2 space-y-8">

            {/* Property Card: Full Width Side-by-Side */}
            <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-6 shadow-xl">
              <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-60" />
                Imóvel desta Oportunidade
              </h3>

              {property ? (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="relative h-64 md:h-auto md:w-[45%] min-h-[260px] rounded-2xl overflow-hidden border border-grey-15 group shadow-2xl">
                    <Image
                      src={property.images?.[0]?.startsWith('http')
                        ? property.images[0]
                        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${property.images?.[0] || ''}`
                      }
                      alt={property.title}
                      fill
                      unoptimized={property.images?.[0]?.startsWith('/')}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute top-6 left-6">
                      <p className="px-4 py-2 bg-purple-60 text-white text-lg font-black rounded-xl shadow-2xl border border-white/10">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-2xl font-black text-white mb-2 leading-tight line-clamp-2">{property.title}</h4>
                        <p className="text-sm text-grey-50 flex items-center gap-2 font-medium">
                          <MapPin className="h-4 w-4 text-purple-60" /> {property.address}, {property.city}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 py-6 border-y border-grey-15/50">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-grey-40 font-black uppercase tracking-widest">Quartos</span>
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4 text-purple-60" />
                            <span className="text-lg font-black text-white">{property.bedrooms}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 border-x border-grey-15/30 px-4 text-center">
                          <span className="text-[10px] text-grey-40 font-black uppercase tracking-widest text-center">Banhos</span>
                          <div className="flex items-center gap-2 justify-center">
                            <Bath className="h-4 w-4 text-purple-60" />
                            <span className="text-lg font-black text-white">{property.bathrooms}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                          <span className="text-[10px] text-grey-40 font-black uppercase tracking-widest text-right">Área</span>
                          <div className="flex items-center gap-2 justify-end">
                            <Maximize2 className="h-4 w-4 text-purple-60" />
                            <span className="text-lg font-black text-white">{property.area}m²</span>
                          </div>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-grey-08 rounded-xl border border-grey-15">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Disponível para {property.listingType === 'sale' ? 'Venda' : 'Locação'}</span>
                      </div>
                    </div>

                    <Link href={`/admin/properties/${property.id}`} className="mt-6">
                      <Button className="w-full h-11 bg-grey-08 border border-grey-15 text-white hover:bg-grey-15 font-bold transition-all text-xs">
                        Ver Ficha Completa do Imóvel <ChevronRight className="h-4 w-4 ml-1 text-purple-60" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-grey-08/50 rounded-2xl border border-grey-15 flex flex-col items-center text-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-purple-60/10 flex items-center justify-center text-purple-60">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white mb-1">Interesse Geral</p>
                    <p className="text-sm text-grey-60 italic max-w-md">"{lead.interest || 'Interesse registrado via site institucional.'}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Grid for Secondary Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origin Card */}
              <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                  <History className="h-4 w-4 text-purple-60" />
                  Dados de Origem
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-grey-08/50 rounded-2xl border border-grey-15">
                    <p className="text-[10px] text-grey-50 uppercase font-black tracking-wider mb-1">Canal</p>
                    <p className="text-sm font-bold text-white">{lead.source || 'Direto'}</p>
                  </div>
                  <div className="p-4 bg-grey-08/50 rounded-2xl border border-grey-15">
                    <p className="text-[10px] text-grey-50 uppercase font-black tracking-wider mb-1">Cadastro</p>
                    <p className="text-sm font-bold text-white">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-60" />
                  Notas Internas
                </h3>
                <div className="p-5 bg-grey-08/50 rounded-2xl border border-grey-15 relative group">
                  {isEditingNotes ? (
                    <div className="space-y-4">
                      <textarea
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        placeholder="Ex: Cliente busca permuta em imóvel menor..."
                        className="w-full bg-grey-10 border border-grey-20 rounded-xl p-4 text-sm text-white outline-none focus:border-purple-60 transition-all min-h-[120px] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditingNotes(false);
                            setEditedNotes(lead?.notes || '');
                          }}
                          className="text-xs text-grey-40 hover:text-white"
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            await leadsService.update(id, { notes: editedNotes });
                            setLead(prev => prev ? { ...prev, notes: editedNotes } : null);
                            setIsEditingNotes(false);
                          }}
                          className="text-xs bg-purple-60 text-white font-bold h-8 px-4"
                        >
                          Salvar Notas
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-grey-60 leading-relaxed italic line-clamp-4">
                        {lead.notes || 'Nenhuma observação técnica registrada.'}
                      </p>
                      <button
                        onClick={() => setIsEditingNotes(true)}
                        className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-grey-10 border border-grey-15 flex items-center justify-center text-grey-60 hover:text-purple-60 hover:border-purple-60 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Activities */}
            <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-60" />
                  Linha do Tempo de Atividades
                </h3>
                <span className="text-[10px] text-grey-60 font-bold uppercase">{activities.length} Atividades</span>
              </div>

              <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-grey-15">
                {activities.map((activity, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={activity.id}
                    className="relative pl-10"
                  >
                    <div className={cn(
                      "absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-grey-10 flex items-center justify-center",
                      activity.type === 'creation' ? "bg-blue-500" :
                        activity.type === 'proposal' ? "bg-emerald-500" :
                          "bg-amber-500"
                    )}>
                      {activity.type === 'creation' && <User className="h-2 w-2 text-white" />}
                      {activity.type === 'proposal' && <DollarSign className="h-2 w-2 text-white" />}
                      {activity.type === 'appointment' && <Calendar className="h-2 w-2 text-white" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">{activity.title}</p>
                        <p className="text-[10px] text-grey-60 font-bold uppercase">
                          {new Date(activity.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <p className="text-xs text-grey-60">{activity.description}</p>
                      {activity.status && (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-grey-08 border border-grey-15 text-[9px] font-bold text-grey-40 uppercase tracking-tighter">
                          Status: {activity.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}

                {activities.length === 1 && (
                  <div className="relative pl-10 opacity-30">
                    <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-grey-40 border-4 border-grey-10" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Aguardando Próximas Atividades</p>
                      <p className="text-xs text-grey-60">Nenhuma visita ou proposta registrada ainda.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Discard Modal */}
      <AnimatePresence>
        {isDiscardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDiscardModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-grey-10 border border-grey-15 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-red-500">
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">Descartar Lead</h3>
                </div>
                <button
                  onClick={() => setIsDiscardModalOpen(false)}
                  className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-grey-50">
                  Para melhorar nossa inteligência de vendas, selecione o motivo principal do descarte deste lead:
                </p>

                <div className="space-y-2">
                  {[
                    '💰 Preço fora do orçamento',
                    '📍 Localização não agradou',
                    '🤝 Já fechou com outra imobiliária',
                    '❌ Sem perfil / Apenas curioso',
                    '📝 Outro motivo...'
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setDiscardReason(reason)}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left text-sm font-bold transition-all",
                        discardReason === reason
                          ? "bg-purple-60/10 border-purple-60 text-purple-60"
                          : "bg-grey-08 border-grey-15 text-grey-40 hover:border-grey-30 hover:text-white"
                      )}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDiscardModalOpen(false)}
                    className="flex-1 h-12 bg-grey-08 border-grey-15 text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={!discardReason}
                    onClick={async () => {
                      await leadsService.update(id, {
                        status: 'lost',
                        lostReason: discardReason
                      });
                      window.location.reload();
                    }}
                    className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    Confirmar Descarte
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Visit Modal */}
      <AnimatePresence>
        {isVisitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsVisitModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-grey-10 border border-grey-15 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-white flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-purple-60" /> Agendar Visita
                </h3>
                <button onClick={() => setIsVisitModalOpen(false)} className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey-40 uppercase tracking-widest ml-1">Data da Visita</label>
                  <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 px-4 text-white outline-none focus:border-purple-60 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey-40 uppercase tracking-widest ml-1">Horário</label>
                  <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-12 px-4 text-white outline-none focus:border-purple-60 transition-all" />
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="outline" onClick={() => setIsVisitModalOpen(false)} className="flex-1 h-12 bg-grey-08 border-grey-15 text-white">Cancelar</Button>
                  <Button
                    disabled={!visitDate || !visitTime}
                    onClick={async () => {
                      // Merge date and time into ISO string
                      const isoDate = new Date(`${visitDate}T${visitTime}:00`).toISOString();

                      await calendarService.create({
                        description: `Visita: ${lead?.name}`,
                        date: isoDate,
                        leadId: id,
                        propertyId: lead?.propertyId || ''
                      });
                      await leadsService.update(id, { status: 'visit' });
                      window.location.reload();
                    }}
                    className="flex-1 h-12 bg-purple-60 text-white font-bold"
                  >Confirmar Agendamento</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Make Proposal Modal */}
      <AnimatePresence>
        {isProposalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProposalModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-grey-10 border border-grey-15 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-white flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-emerald-500" /> Fazer Proposta
                </h3>
                <button onClick={() => setIsProposalModalOpen(false)} className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-grey-40 uppercase tracking-widest ml-1">Valor da Proposta (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-40 font-bold">R$</span>
                    <input
                      type="text"
                      value={proposalValue ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(Number(proposalValue) / 100) : ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setProposalValue(val);
                      }}
                      placeholder="0,00"
                      className="w-full bg-grey-08 border border-grey-15 rounded-2xl h-14 pl-12 pr-4 text-white outline-none focus:border-emerald-500 transition-all font-black text-xl tracking-tight"
                    />
                  </div>
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Dica de Negociação</p>
                  <p className="text-xs text-grey-40 leading-relaxed">Ao registrar a proposta, o status do lead mudará automaticamente para "PROPOSTA" e o score de fechamento subirá para 90%.</p>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="outline" onClick={() => setIsProposalModalOpen(false)} className="flex-1 h-12 bg-grey-08 border-grey-15 text-white">Cancelar</Button>
                  <Button
                    disabled={!proposalValue}
                    onClick={async () => {
                      const numericValue = Number(proposalValue) / 100;
                      await proposalsService.create({
                        leadId: id,
                        value: numericValue,
                        status: 'PENDING',
                        propertyId: lead?.propertyId,
                        date: new Date().toISOString()
                      });
                      await leadsService.update(id, {
                        status: 'proposal',
                        value: numericValue
                      });
                      window.location.reload();
                    }}
                    className="flex-1 h-12 bg-emerald-500 text-white font-bold"
                  >Enviar Proposta</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
