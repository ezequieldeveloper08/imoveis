'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building2, 
  AlignLeft, 
  Plus,
  ArrowRight,
  Info
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
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { leadsService } from '../../leads/services/leads.service';
import { propertiesService } from '../../properties/services/properties.service';
import { calendarService } from '../services/calendar.service';
import { Lead } from '../../leads/types/lead.types';
import { Property } from '../../properties/types/property.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const appointmentSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  date: z.string().min(1, 'Selecione uma data'),
  time: z.string().min(1, 'Selecione um horário'),
  type: z.string().min(1, 'Selecione o tipo'),
  leadId: z.string().optional(),
  propertyId: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export function AppointmentForm() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: 'visit',
      date: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [leadsData, propertiesData] = await Promise.all([
          leadsService.getAll(),
          propertiesService.getAll()
        ]);
        setLeads(leadsData);
        setProperties(propertiesData);
      } catch (error) {
        console.error('Failed to load data for form:', error);
      }
    }
    loadData();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await calendarService.create({
        ...data,
        status: 'scheduled'
      });
      toast.success('Agendamento realizado com sucesso!');
      router.push('/admin/calendar');
    } catch (error) {
      console.error('Failed to create appointment:', error);
      toast.error('Erro ao realizar agendamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-60/10 border border-purple-60/20 mb-6">
          <Calendar className="h-8 w-8 text-purple-60" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Novo Compromisso</h2>
        <p className="text-grey-60 text-sm mt-2">Agende uma visita, reunião ou call com seus clientes.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-grey-10 border border-grey-15 rounded-3xl p-10 space-y-10 relative overflow-hidden">
          {/* Section: Basic Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Compromisso</Label>
              <div className="relative">
                <Info className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input id="title" {...register('title')} placeholder="Ex: Visita: Mansão Alphaville" className="h-14 pl-12" />
              </div>
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                  <Input id="date" type="date" {...register('date')} className="h-14 pl-12 bg-grey-08" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                  <Input id="time" type="time" {...register('time')} className="h-14 pl-12 bg-grey-08" />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-grey-15" />

          {/* Section: Details & Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Compromisso</Label>
              <Select onValueChange={(val) => setValue('type', val)} defaultValue="visit">
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15">
                  <SelectItem value="visit">Visita ao Imóvel</SelectItem>
                  <SelectItem value="call">Call de Alinhamento</SelectItem>
                  <SelectItem value="meeting">Reunião Presencial</SelectItem>
                  <SelectItem value="inspection">Vistoria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input id="location" {...register('location')} placeholder="Endereço ou Link do Meet" className="h-14 pl-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead">Lead Associado</Label>
              <Select onValueChange={(val) => setValue('leadId', val)}>
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-grey-40" />
                    <SelectValue placeholder="Selecione o lead" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15">
                  {leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>{lead.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property">Imóvel Relacionado</Label>
              <Select onValueChange={(val) => setValue('propertyId', val)}>
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-grey-40" />
                    <SelectValue placeholder="Selecione o imóvel" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15">
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id}>{property.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notas Adicionais</Label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 h-4 w-4 text-grey-40 z-10" />
              <textarea 
                id="description" 
                {...register('description')}
                placeholder="Detalhes importantes para o compromisso..."
                className="w-full bg-grey-08 border border-grey-15 rounded-xl p-4 pl-12 text-white placeholder:text-grey-40 focus:ring-2 focus:ring-purple-60 outline-none h-32 transition-all"
              />
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
            {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
