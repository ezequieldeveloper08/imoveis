'use client';

import { useState, useEffect } from 'react';
import { leadsService } from '../services/leads.service';
import { Lead } from '../types/lead.types';
import { 
  Mail, 
  Phone, 
  Search, 
  Plus, 
  Filter, 
  Download,
  Clock,
  ExternalLink,
  Trash2,
  Edit2,
  Eye,
  MessageSquare,
  Target,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LeadDetailsModal } from './lead-details-modal';
import { toast } from 'sonner';

export function LeadsListing() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadsService.getAll();
      setLeads(data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;
    
    try {
      await leadsService.delete(id);
      toast.success('Lead removido com sucesso');
      loadLeads();
    } catch (error) {
      toast.error('Erro ao remover lead');
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.interest?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Leads</h1>
          <p className="text-grey-60 mt-1">Gerencie seus contatos e oportunidades de negócio.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-grey-10 border-grey-15 h-11 px-4 text-white hover:bg-grey-15 hover:border-grey-30 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Link href="/admin/leads/new">
            <Button className="bg-purple-60 hover:bg-purple-65 h-11 px-6 text-white-pure font-semibold shadow-lg shadow-purple-60/20 active:scale-95 transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 py-4 border-y border-grey-15">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40" />
          <Input 
            placeholder="Pesquisar por nome, email ou interesse..." 
            className="pl-10 bg-grey-10 border-grey-15 h-12 text-sm focus:ring-purple-60/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button variant="outline" className="bg-grey-10 border-grey-15 h-12 px-5 text-white hover:bg-grey-15 hover:border-grey-30 transition-all">
          <Filter className="h-4 w-4 mr-2 text-purple-60" />
          Status do Lead
        </Button>
        
        <div className="md:ml-auto flex items-center gap-2">
          <span className="text-xs text-grey-60 font-medium text-nowrap">Origem:</span>
          <select className="bg-grey-10 border border-grey-15 text-white text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-purple-60">
            <option>Todos as origens</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Google</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-grey-10 border border-grey-15 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 border-4 border-purple-60 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-grey-40 text-sm animate-pulse">Carregando leads...</p>
            </div>
          ) : filteredLeads.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-grey-08 border-b border-grey-15">
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Lead</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Interesse</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest text-center">Origem</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Cadastrado em</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-15">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-grey-15/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-purple-60 font-bold text-xs">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-none mb-1">{lead.name}</p>
                          <p className="text-xs text-grey-60 leading-none">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <span className="text-xs text-white line-clamp-1 italic underline decoration-purple-60/30">
                          {lead.interest || 'Interesse Geral'}
                        </span>
                        <ExternalLink className="h-3 w-3 text-grey-40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        lead.status?.toLowerCase() === 'new' ? "bg-blue-500/10 text-blue-500" :
                        lead.status?.toLowerCase() === 'qualified' ? "bg-purple-60/10 text-purple-60" :
                        lead.status?.toLowerCase() === 'visit' ? "bg-amber-500/10 text-amber-500" :
                        lead.status?.toLowerCase() === 'proposal' ? "bg-indigo-500/10 text-indigo-500" :
                        lead.status?.toLowerCase() === 'closed' ? "bg-emerald-500/10 text-emerald-500" :
                        "bg-grey-40/10 text-grey-40"
                      )}>
                        {lead.status?.toLowerCase() === 'new' ? 'Novo' : 
                         lead.status?.toLowerCase() === 'qualified' ? 'Qualificado' : 
                         lead.status?.toLowerCase() === 'visit' ? 'Visita' :
                         lead.status?.toLowerCase() === 'proposal' ? 'Proposta' :
                         lead.status?.toLowerCase() === 'closed' ? 'Fechado' :
                         lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[10px] font-bold text-grey-40 bg-grey-08 px-2 py-1 rounded border border-grey-15">
                        {lead.source || 'Site'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs text-grey-60">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {lead.status?.toLowerCase() === 'new' && (
                          <button 
                            onClick={async () => {
                              await leadsService.update(lead.id, { status: 'qualified' });
                              loadLeads();
                              toast.success('Lead qualificado!');
                            }}
                            title="Qualificar Lead"
                            className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            const phone = lead.phone?.replace(/\D/g, '');
                            if (phone) {
                              window.open(`https://wa.me/55${phone}?text=Olá ${lead.name}, vi seu interesse no Simovel...`, '_blank');
                            } else {
                              toast.error('Telefone não cadastrado');
                            }
                          }}
                          title="Chamar no WhatsApp"
                          className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                        <Link href={`/admin/leads/${lead.id}`}>
                          <button 
                            title="Ver detalhes"
                            className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white hover:bg-purple-60/20 hover:border-purple-60/30 transition-all"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/leads/${lead.id}/edit`}>
                          <button 
                            title="Editar"
                            className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/30 transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          title="Remover"
                          className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-red-500 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center gap-6">
              <div className="h-20 w-20 rounded-3xl bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40">
                <Target className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Nenhum lead encontrado</h3>
                <p className="text-sm text-grey-60 max-w-xs mx-auto">
                  Você ainda não possui oportunidades de negócio registradas. Comece adicionando um novo lead.
                </p>
              </div>
              <Link href="/admin/leads/new">
                <Button className="bg-purple-60 hover:bg-purple-65 text-white h-12 px-8 font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Lead
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
