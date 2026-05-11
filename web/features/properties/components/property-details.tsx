'use client';

import { useState, useEffect } from 'react';
import { 
  Bed, Bath, Car, Maximize, MapPin, 
  ChevronLeft, ChevronRight, Edit, 
  Users, TrendingUp, History, Clock,
  User, CheckCircle2, MessageSquare,
  DollarSign, ArrowUpRight, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Property } from '../types/property.types';
import { propertiesService } from '../services/properties.service';
import { proposalsService } from '../../proposals/services/proposals.service';
import { calendarService } from '../../calendar/services/calendar.service';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { ProposalsTab } from '../../proposals/components/proposals-tab';
import { AppointmentsTab } from '../../calendar/components/appointments-tab';

interface PropertyDetailsProps {
  id: string;
}

const mockChartData = [
  { name: 'Jan', views: 400, leads: 24 },
  { name: 'Fev', views: 300, leads: 18 },
  { name: 'Mar', views: 600, leads: 32 },
  { name: 'Abr', views: 800, leads: 45 },
  { name: 'Mai', views: 700, leads: 38 },
];

export function PropertyDetails({ id }: PropertyDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'proposals' | 'agenda'>('overview');
  const [property, setProperty] = useState<Property | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [propData, leadsData, proposalsData, appointmentsData] = await Promise.all([
          propertiesService.getById(id),
          propertiesService.getLeads(id),
          proposalsService.getByProperty(id),
          calendarService.getByProperty(id)
        ]);
        setProperty(propData);
        setLeads(leadsData);
        setProposals(proposalsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Failed to load property details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-60"></div>
      </div>
    );
  }

  if (!property) return <div>Imóvel não encontrado.</div>;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const images = property.images.length > 0 
    ? property.images.map(img => img.startsWith('/') ? `${API_URL}${img}` : img)
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'];

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(property.price);

  return (
    <div className="space-y-8 pb-20">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-grey-60 text-sm">
            <Link href="/admin/properties" className="hover:text-white transition-colors">Imóveis</Link>
            <span>/</span>
            <span className="text-white">Detalhes</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{property.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-grey-15 bg-grey-10 text-white" asChild>
            <Link href={`/admin/properties/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Imóvel
            </Link>
          </Button>
          <Button className="bg-purple-60 hover:bg-purple-65 text-white">
            Impulsionar Anúncio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visuals & Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-grey-15 bg-grey-10 group">
            <Image
              src={images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
              unoptimized={images[currentImageIndex].includes('localhost')}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      currentImageIndex === i ? "w-8 bg-purple-60" : "w-2 bg-white/40"
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="h-10 w-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="h-10 w-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Visitas', value: appointments.length || '0', icon: TrendingUp, color: 'text-blue-400' },
              { label: 'Leads', value: leads.length || '0', icon: Users, color: 'text-purple-400' },
              { label: 'Propostas', value: proposals.length || '0', icon: DollarSign, color: 'text-green-400' },
              { label: 'Conversão', value: leads.length > 0 ? `${((proposals.length / leads.length) * 100).toFixed(1)}%` : '0%', icon: ArrowUpRight, color: 'text-orange-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-grey-10 border border-grey-15 p-6 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                  <span className="text-[10px] font-bold text-grey-40 uppercase tracking-widest">30 dias</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-grey-60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Details Tabs/Sections */}
          <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-8 border-b border-grey-15 overflow-x-auto custom-scrollbar">
              {[
                { id: 'overview', label: 'Visão Geral' },
                { id: 'leads', label: 'Interessados' },
                { id: 'proposals', label: 'Propostas' },
                { id: 'agenda', label: 'Agenda' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "pb-4 text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === tab.id 
                      ? "border-b-2 border-purple-60 text-white font-bold" 
                      : "text-grey-60 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-12"
                >
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Sobre o Imóvel</h3>
                    <p className="text-grey-60 leading-relaxed text-sm">
                      {property.description}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center">
                          <Bed className="h-5 w-5 text-purple-60" />
                        </div>
                        <div>
                          <div className="text-white font-bold">{property.bedrooms}</div>
                          <div className="text-[10px] text-grey-60 uppercase">Dormitórios</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center">
                          <Bath className="h-5 w-5 text-purple-60" />
                        </div>
                        <div>
                          <div className="text-white font-bold">{property.bathrooms}</div>
                          <div className="text-[10px] text-grey-60 uppercase">Banheiros</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center">
                          <Car className="h-5 w-5 text-purple-60" />
                        </div>
                        <div>
                          <div className="text-white font-bold">{property.garages}</div>
                          <div className="text-[10px] text-grey-60 uppercase">Vagas</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center">
                          <Maximize className="h-5 w-5 text-purple-60" />
                        </div>
                        <div>
                          <div className="text-white font-bold">{property.area}m²</div>
                          <div className="text-[10px] text-grey-60 uppercase">Área Útil</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Valor e Condições</h3>
                    <div className="bg-grey-08 rounded-2xl p-6 border border-grey-15 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-grey-60 uppercase font-bold tracking-widest">Valor de {property.listingType === 'sale' ? 'Venda' : 'Locação'}</span>
                          <span className="text-[10px] text-green-40 font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Preço de Mercado</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{formattedPrice}</div>
                      </div>
                      <div className="pt-4 border-t border-grey-15 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-grey-60">Condomínio</span>
                          <span className="text-white font-medium">R$ 850,00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-grey-60">IPTU (Anual)</span>
                          <span className="text-white font-medium">R$ 2.400,00</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white">Amenidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map(item => (
                          <span key={item} className="px-3 py-1.5 bg-grey-08 border border-grey-15 rounded-lg text-xs text-grey-40">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'leads' && (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Leads Interessados</h3>
                    <Button className="bg-purple-60 hover:bg-purple-65 text-white h-10 px-4 text-xs" asChild>
                      <Link href="/admin/leads/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Lead
                      </Link>
                    </Button>
                  </div>
                  
                  {leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-grey-08 rounded-3xl border border-dashed border-grey-15 text-center">
                      <div className="h-16 w-16 rounded-full bg-grey-10 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-grey-40" />
                      </div>
                      <p className="text-grey-40 font-medium">Nenhum lead vinculado a este imóvel.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {leads.map(lead => (
                        <div key={lead.id} className="p-4 bg-grey-08 border border-grey-15 rounded-2xl flex items-center gap-4 hover:border-grey-20 transition-all group">
                          <div className="h-10 w-10 rounded-full bg-purple-60/20 flex items-center justify-center text-purple-60 font-bold group-hover:scale-110 transition-transform">
                            {lead.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{lead.name}</p>
                            <p className="text-xs text-grey-40 truncate">{lead.email}</p>
                          </div>
                          <span className="text-[10px] font-bold bg-grey-15 px-2 py-1 rounded text-grey-40">
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'proposals' && (
                <motion.div
                  key="proposals"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ProposalsTab propertyId={id} leads={leads} />
                </motion.div>
              )}

              {activeTab === 'agenda' && (
                <motion.div
                  key="agenda"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AppointmentsTab propertyId={id} leads={leads} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Performance Chart */}
          <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Performance do Anúncio</h3>
              <select className="bg-grey-08 border border-grey-15 text-white text-xs rounded-lg px-3 py-1.5 outline-none">
                <option>Últimos 6 meses</option>
                <option>Último ano</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#703BF7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#703BF7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                  <XAxis dataKey="name" stroke="#4D4D4D" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4D4D4D" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: '12px' }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#703BF7" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Activity, Leads & History */}
        <div className="space-y-8">
          {/* Leads Section */}
          <div className="bg-grey-10 border border-grey-15 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Interessados</h3>
              <span className="bg-purple-60/10 text-purple-60 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-60/20">
                {leads.length} Novos
              </span>
            </div>

            <div className="space-y-4">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-grey-08 transition-all group cursor-pointer border border-transparent hover:border-grey-15">
                  <div className="h-10 w-10 rounded-full bg-grey-15 flex items-center justify-center text-grey-40 group-hover:bg-purple-60 group-hover:text-white transition-all">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{lead.name}</p>
                    <p className="text-xs text-grey-60 truncate">Via {lead.source || 'Site'}</p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-grey-08 flex items-center justify-center text-grey-40 hover:text-purple-60 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-grey-15 bg-grey-08 text-white h-11 text-xs" asChild>
                <Link href="/admin/leads">Ver todos os Leads</Link>
              </Button>
            </div>
          </div>

          {/* History / Timeline */}
          <div className="bg-grey-10 border border-grey-15 rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-purple-60" />
              <h3 className="text-lg font-bold text-white">Histórico</h3>
            </div>

            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-grey-15">
              {[
                { type: 'update', title: 'Preço alterado', user: 'Ricardo Santos', time: 'Há 2 dias', icon: DollarSign },
                { type: 'status', title: 'Imóvel Publicado', user: 'Ricardo Santos', time: 'Há 5 dias', icon: CheckCircle2 },
                { type: 'create', title: 'Anúncio Criado', user: 'Ricardo Santos', time: 'Há 5 dias', icon: Clock },
              ].map((item, i) => (
                <div key={i} className="relative pl-8 space-y-1">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-grey-08 border border-grey-15 flex items-center justify-center z-10">
                    <item.icon className="h-3 w-3 text-grey-40" />
                  </div>
                  <p className="text-xs font-bold text-white leading-none">{item.title}</p>
                  <p className="text-[10px] text-grey-60">Por <span className="text-white font-medium">{item.user}</span> • {item.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Info */}
          <div className="p-6 bg-grey-08/50 border border-grey-15 rounded-2xl space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-grey-60">Criado em:</span>
              <span className="text-white font-medium">{new Date(property.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-grey-60">Última atualização:</span>
              <span className="text-white font-medium">{new Date(property.updatedAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-grey-60">Responsável:</span>
              <span className="text-white font-medium">Ricardo Santos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
