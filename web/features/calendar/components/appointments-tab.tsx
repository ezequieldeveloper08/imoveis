'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calendarService } from '../services/calendar.service';
import { Appointment } from '../types/calendar.types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { AppointmentModal } from './appointment-modal';

interface AppointmentsTabProps {
  propertyId: string;
  leads: any[];
}

export function AppointmentsTab({ propertyId, leads }: AppointmentsTabProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await calendarService.getByProperty(propertyId);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [propertyId]);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2].map(i => <div key={i} className="h-20 bg-grey-08 rounded-2xl border border-grey-15" />)}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Agenda de Visitas</h3>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-60 hover:bg-purple-65 text-white h-10 px-4 text-xs"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agendar Visita
        </Button>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyId={propertyId}
        leads={leads}
        onSuccess={loadAppointments}
      />

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-grey-08 rounded-3xl border border-dashed border-grey-15 text-center">
          <div className="h-16 w-16 rounded-full bg-grey-10 flex items-center justify-center mb-4">
            <CalendarIcon className="h-8 w-8 text-grey-40" />
          </div>
          <p className="text-grey-40 font-medium">Nenhuma visita agendada para este imóvel.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-grey-08 border border-grey-15 rounded-2xl p-5 hover:border-grey-20 transition-all group">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-grey-10 border border-grey-15 shrink-0 group-hover:bg-purple-60/10 group-hover:border-purple-60/20 transition-all">
                  <span className="text-[10px] font-bold text-grey-40 group-hover:text-purple-60 uppercase tracking-tighter">
                    {format(new Date(appointment.date), 'MMM', { locale: ptBR })}
                  </span>
                  <span className="text-xl font-black text-white group-hover:text-purple-60">
                    {format(new Date(appointment.date), 'dd')}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-bold text-white truncate">{appointment.title || 'Visita Técnica'}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-grey-40">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{appointment.time || format(new Date(appointment.date), 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{appointment.leadName || 'Lead Interessado'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                    appointment.id.includes('past') ? "bg-grey-15 text-grey-40" : "bg-purple-60/10 text-purple-60"
                  )}>
                    {appointment.id.includes('past') ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {appointment.id.includes('past') ? 'Finalizado' : 'Confirmado'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
