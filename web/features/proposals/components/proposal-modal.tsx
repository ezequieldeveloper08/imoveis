'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, DollarSign, Calendar, User, 
  MessageSquare, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { proposalsService } from '../services/proposals.service';
import { toast } from 'sonner';

const proposalSchema = z.object({
  value: z.string().min(1, 'Informe o valor'),
  date: z.string().min(1, 'Informe a data'),
  leadId: z.string().min(1, 'Selecione o interessado'),
  notes: z.string().optional(),
});

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  leads: any[];
  onSuccess: () => void;
}

export function ProposalModal({ isOpen, onClose, propertyId, leads, onSuccess }: ProposalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(proposalSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Clean numeric value
      const numericValue = parseFloat(data.value.replace(/[^\d]/g, '')) / 100;
      
      await proposalsService.create({
        propertyId,
        leadId: data.leadId,
        value: numericValue,
        date: data.date,
        notes: data.notes,
      });

      toast.success('Proposta registrada com sucesso!');
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao registrar proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-lg bg-grey-10 border border-grey-15 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-grey-15 flex items-center justify-between bg-grey-08/50">
            <div>
              <h2 className="text-xl font-bold text-white">Nova Proposta</h2>
              <p className="text-xs text-grey-40">Registre uma oferta oficial para este imóvel.</p>
            </div>
            <button onClick={onClose} className="h-10 w-10 rounded-xl hover:bg-grey-15 flex items-center justify-center text-grey-40 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Interested Lead */}
            <div className="space-y-2">
              <Label>Interessado</Label>
              <Select onValueChange={(val) => setValue('leadId', val)}>
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15 text-white">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-purple-60" />
                    <SelectValue placeholder="Selecione o lead" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15 text-white">
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id} className="hover:bg-grey-15">
                      {lead.name}
                    </SelectItem>
                  ))}
                  {leads.length === 0 && (
                    <div className="p-4 text-center text-xs text-grey-60">Nenhum lead interessado neste imóvel.</div>
                  )}
                </SelectContent>
              </Select>
              {errors.leadId && <p className="text-red-400 text-xs mt-1">{errors.leadId.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Value */}
              <div className="space-y-2">
                <Label htmlFor="value">Valor da Oferta</Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                  <Input 
                    id="value" 
                    {...register('value')}
                    placeholder="0,00" 
                    className="h-14 pl-12" 
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '');
                      v = (Number(v) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                      e.target.value = v;
                      setValue('value', v);
                    }}
                  />
                </div>
                {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value.message as string}</p>}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Data da Proposta</Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                  <Input 
                    id="date" 
                    type="date"
                    {...register('date')}
                    className="h-14 pl-12 [color-scheme:dark]" 
                  />
                </div>
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message as string}</p>}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações da Proposta</Label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-grey-40 z-10" />
                <textarea 
                  id="notes" 
                  {...register('notes')}
                  placeholder="Ex: Cliente solicita parcelamento da entrada..."
                  className="w-full bg-grey-08 border border-grey-15 rounded-xl p-4 pl-12 text-white placeholder:text-grey-40 focus:ring-2 focus:ring-purple-60 outline-none h-24 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1 h-12 border-grey-15 text-grey-60 hover:text-white"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 h-12 bg-purple-60 hover:bg-purple-65 text-white font-bold"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Registrar Proposta'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
