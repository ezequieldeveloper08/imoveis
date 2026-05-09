'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  ArrowRight,
  Info,
  Briefcase,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { leadsService } from '../services/leads.service';
import { PropertySelectModal } from '../../properties/components/property-select-modal';
import { Property } from '../../properties/types/property.types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const leadSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  source: z.string().min(1, 'Selecione a origem'),
  propertyId: z.string().optional(),
  interest: z.string().optional(),
  notes: z.string().optional(),
});

interface LeadFormProps {
  leadId?: string;
}

export function LeadForm({ leadId }: LeadFormProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!leadId);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      source: 'Direct',
    }
  });

  useState(() => {
    if (leadId) {
      async function loadLead() {
        try {
          const data = await leadsService.getById(leadId as string);
          reset({
            name: data.name,
            email: data.email || '',
            phone: data.phone || '',
            source: data.source || 'Direct',
            notes: data.notes || '',
            interest: data.interest || '',
          });
          // If lead has a propertyId, we'd need to fetch it or just keep it
          if (data.propertyId) {
            setValue('propertyId', data.propertyId as string);
          }
        } catch (error) {
          toast.error('Erro ao carregar dados do lead');
        } finally {
          setIsLoading(false);
        }
      }
      loadLead();
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (leadId) {
        await leadsService.update(leadId, {
          ...data,
          interest: selectedProperty?.title || data.interest,
          propertyId: selectedProperty?.id || data.propertyId
        });
        toast.success('Lead atualizado com sucesso!');
      } else {
        await leadsService.create({
          ...data,
          interest: selectedProperty?.title || data.interest || 'Interesse Geral',
          propertyId: selectedProperty?.id
        });
        toast.success('Lead cadastrado com sucesso!');
      }
      router.push('/admin/leads');
    } catch (error) {
      console.error('Failed to process lead:', error);
      toast.error('Erro ao processar lead. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setValue('propertyId', property.id);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-purple-60 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {leadId ? 'Editar Lead' : 'Novo Lead'}
        </h2>
        <p className="text-grey-60 text-sm mt-1">
          {leadId ? 'Atualize as informações do contato no sistema.' : 'Cadastre um novo contato manualmente no sistema.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-grey-10 border border-grey-15 rounded-2xl p-8 space-y-8">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input id="name" {...register('name')} placeholder="Ex: Maria dos Santos" className="h-14 pl-12" />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input id="email" {...register('email')} placeholder="maria@email.com" className="h-14 pl-12" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input
                  id="phone"
                  {...register('phone')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const formatted = value
                      .replace(/^(\d{2})(\d)/g, "($1) $2")
                      .replace(/(\d{5})(\d)/, "$1-$2")
                      .substring(0, 15);
                    e.target.value = formatted;
                    register('phone').onChange(e);
                  }}
                  placeholder="(11) 90000-0000"
                  className="h-14 pl-12"
                />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message as string}</p>}
            </div>
          </div>

          <div className="h-px bg-grey-15" />

          {/* Source & Interest */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="source">Origem do Contato</Label>
              <Select onValueChange={(val) => setValue('source', val)} defaultValue="Direct">
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15">
                  <SelectItem value="Direct">Indicação / Direto</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook Ads</SelectItem>
                  <SelectItem value="Google">Google Search</SelectItem>
                  <SelectItem value="Portal">Portal Imobiliário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Imóvel de Interesse</Label>
              <div
                onClick={() => setIsModalOpen(true)}
                className={cn(
                  "flex items-center gap-3 h-14 w-full px-4 rounded-xl border cursor-pointer transition-all",
                  selectedProperty
                    ? "bg-purple-60/5 border-purple-60/30"
                    : "bg-grey-08 border-grey-15 hover:border-grey-20"
                )}
              >
                <Briefcase className={cn("h-4 w-4", selectedProperty ? "text-purple-60" : "text-grey-40")} />
                <div className="flex-1 truncate">
                  {selectedProperty ? (
                    <span className="text-sm font-bold text-white">{selectedProperty.title}</span>
                  ) : (
                    <span className="text-sm text-grey-40">Clique para selecionar um imóvel</span>
                  )}
                </div>
                <div className="h-8 w-8 rounded-lg bg-grey-15 flex items-center justify-center text-white">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-grey-40 z-10" />
                <textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Informações adicionais sobre o perfil do cliente..."
                  className="w-full bg-grey-08 border border-grey-15 rounded-xl p-4 pl-12 text-white placeholder:text-grey-40 focus:ring-2 focus:ring-purple-60 outline-none h-32 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-grey-60 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-60 hover:bg-purple-65 h-14 px-12 text-white font-bold rounded-xl shadow-xl shadow-purple-60/20 disabled:opacity-50"
          >
            {isSubmitting ? (leadId ? 'Salvando...' : 'Cadastrando...') : (leadId ? 'Salvar Alterações' : 'Cadastrar Lead')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>

      <PropertySelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handlePropertySelect}
        selectedId={selectedProperty?.id}
      />
    </div>
  );
}
