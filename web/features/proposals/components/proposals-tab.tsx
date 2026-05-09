'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, Check, X, Clock, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { proposalsService } from '../services/proposals.service';
import { Proposal } from '../types/proposal.types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ProposalModal } from './proposal-modal';

interface ProposalsTabProps {
  propertyId: string;
  leads: any[];
}

export function ProposalsTab({ propertyId, leads }: ProposalsTabProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProposals = async () => {
    setIsLoading(true);
    try {
      const data = await proposalsService.getByProperty(propertyId);
      setProposals(data);
    } catch (error) {
      console.error('Failed to load proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [propertyId]);

  const handleStatusUpdate = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await proposalsService.updateStatus(id, status);
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      toast.success(`Proposta ${status === 'ACCEPTED' ? 'aceita' : 'recusada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao atualizar status da proposta');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2].map(i => <div key={i} className="h-24 bg-grey-08 rounded-2xl border border-grey-15" />)}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Registro de Propostas</h3>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-60 hover:bg-purple-65 text-white h-10 px-4 text-xs"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      <ProposalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyId={propertyId}
        leads={leads}
        onSuccess={loadProposals}
      />

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-grey-08 rounded-3xl border border-dashed border-grey-15 text-center">
          <div className="h-16 w-16 rounded-full bg-grey-10 flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-grey-40" />
          </div>
          <p className="text-grey-40 font-medium">Nenhuma proposta recebida para este imóvel.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-grey-08 border border-grey-15 rounded-2xl p-6 hover:border-grey-20 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-grey-10 border border-grey-15 flex items-center justify-center text-purple-60 group-hover:scale-110 transition-transform">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-bold text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.value)}
                      </h4>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                        proposal.status === 'ACCEPTED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        proposal.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {proposal.status === 'ACCEPTED' ? 'Aceita' :
                         proposal.status === 'REJECTED' ? 'Recusada' : 'Pendente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-grey-40">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{proposal.leadName || 'Lead Interessado'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(proposal.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {proposal.status === 'PENDING' && (
                    <>
                      <Button 
                        onClick={() => handleStatusUpdate(proposal.id, 'REJECTED')}
                        variant="outline" 
                        className="h-10 px-4 border-grey-15 bg-transparent text-grey-40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Recusar
                      </Button>
                      <Button 
                        onClick={() => handleStatusUpdate(proposal.id, 'ACCEPTED')}
                        className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aceitar
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" className="h-10 w-10 p-0 text-grey-40 hover:text-white">
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {proposal.notes && (
                <div className="mt-4 pt-4 border-t border-grey-15">
                  <p className="text-xs text-grey-40 italic">"{proposal.notes}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
