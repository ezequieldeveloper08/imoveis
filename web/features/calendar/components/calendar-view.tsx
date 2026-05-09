'use client';

import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, User, Check, MoreVertical, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Appointment } from '../types/calendar.types';
import { calendarService } from '../services/calendar.service';
import Link from 'next/link';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await calendarService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const appointmentsForSelectedDay = appointments.filter(app =>
    isSameDay(new Date(app.date), selectedDate)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)] overflow-hidden">
      {/* Calendar Grid - Main Content */}
      <div className="lg:col-span-8 bg-grey-10 border border-grey-15 rounded-3xl p-8 shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white capitalize tracking-tight">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <p className="text-grey-60 text-xs font-bold uppercase tracking-widest mt-1">Gestão de Agenda</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-grey-08 border-grey-15 hover:bg-grey-15 text-white rounded-xl"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="bg-grey-08 border-grey-15 hover:bg-grey-15 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl"
              onClick={() => {
                setCurrentMonth(new Date());
                setSelectedDate(new Date());
              }}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-grey-08 border-grey-15 hover:bg-grey-15 text-white rounded-xl"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-purple-60 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-7 gap-px bg-grey-15 border border-grey-15 rounded-2xl overflow-hidden shadow-inner">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
              <div key={day} className="bg-grey-08 py-4 text-center text-[10px] font-black text-grey-50 uppercase tracking-widest border-b border-grey-15">
                {day}
              </div>
            ))}
            {days.map((day, i) => {
              const dayAppointments = appointments.filter(app => isSameDay(new Date(app.date), day));
              const hasAppointments = dayAppointments.length > 0;
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "min-h-[110px] bg-grey-10 p-4 transition-all relative flex flex-col items-start hover:bg-grey-15/30 group text-left",
                    !isCurrentMonth && "opacity-20",
                    isSelected && "bg-purple-60/5 z-10 before:absolute before:inset-0 before:ring-2 before:ring-inset before:ring-purple-60/50"
                  )}
                >
                  <span className={cn(
                    "text-xs font-black h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-300",
                    isToday ? "bg-purple-60 text-white shadow-xl shadow-purple-60/40 scale-110" :
                      isSelected ? "bg-white text-grey-10" : "text-grey-40 group-hover:text-white"
                  )}>
                    {format(day, 'd')}
                  </span>

                  {hasAppointments && isCurrentMonth && (
                    <div className="mt-auto space-y-1 w-full pt-3">
                      {dayAppointments.slice(0, 2).map(app => (
                        <div
                          key={app.id}
                          className={cn(
                            "text-[9px] px-2.5 py-1.5 rounded-lg border truncate font-black leading-tight uppercase tracking-tighter flex items-center gap-1.5",
                            app.type === 'visit' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                              app.type === 'call' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                "bg-purple-60/10 border-purple-60/20 text-purple-400"
                          )}
                        >
                          <div className={cn(
                            "h-1 w-1 rounded-full",
                            app.type === 'visit' ? "bg-emerald-500" :
                              app.type === 'call' ? "bg-blue-500" : "bg-purple-60"
                          )} />
                          {app.title || (app.type === 'visit' ? 'Visita' : app.type === 'call' ? 'Call' : 'Reunião')}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-[9px] text-grey-50 font-black pl-1 uppercase tracking-widest opacity-60">
                          + {dayAppointments.length - 2} itens
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Sidebar - Navigation & Quick Access */}
      <div className="lg:col-span-4 h-full flex flex-col gap-6 overflow-hidden">

        {/* Section 1: Mini Calendar & User Header */}
        <div className="bg-grey-10 border border-grey-15 rounded-3xl p-6 shadow-2xl flex flex-col shrink-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-purple-60/10 border border-purple-60/20 flex items-center justify-center text-purple-60 font-black text-lg">
              EP
            </div>
            <div>
              <p className="text-sm font-bold text-white">Ezequiel Pires</p>
              <p className="text-[10px] text-grey-50 font-bold uppercase tracking-widest">Admin / Broker</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-grey-60 hover:text-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-grey-08 border border-grey-15 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </h4>
              <div className="flex gap-1">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 text-grey-60 hover:text-white transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 text-grey-60 hover:text-white transition-colors"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px mb-2 text-center">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                <span key={d} className="text-[8px] font-black text-grey-60">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);

                if (!isCurrentMonth) return <div key={i} className="h-6" />;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(day);
                      setCurrentMonth(startOfMonth(day));
                    }}
                    className={cn(
                      "h-7 w-full rounded-lg text-[10px] font-bold flex items-center justify-center transition-all",
                      isSelected ? "bg-purple-60 text-white shadow-lg shadow-purple-60/20" :
                        isToday ? "text-purple-60 border border-purple-60/30" :
                          "text-grey-40 hover:bg-grey-15 hover:text-white"
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Selected Day Agenda */}
        <div className="bg-grey-10 border border-grey-15 rounded-3xl p-6 shadow-2xl flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-60" />
              Agenda: {format(selectedDate, "dd 'de' MMM", { locale: ptBR })}
            </h3>
            <Link href="/admin/calendar/new">
              <Button className="h-8 px-4 bg-purple-60 hover:bg-purple-65 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-60/20">
                <Plus className="h-3.5 w-3.5 mr-1" /> Novo
              </Button>
            </Link>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {appointmentsForSelectedDay.length > 0 ? (
              appointmentsForSelectedDay.map((app) => (
                <div key={app.id} className="bg-grey-08 border border-grey-15 p-4 rounded-2xl hover:border-purple-60/30 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        app.type === 'visit' ? "bg-emerald-500" :
                          app.type === 'call' ? "bg-blue-500" : "bg-purple-60"
                      )} />
                      <span className="text-[10px] font-black text-white uppercase tracking-tighter">{app.time}</span>
                    </div>
                    <span className={cn(
                      "text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border",
                      app.type === 'visit' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        app.type === 'call' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                          "bg-purple-60/10 text-purple-60 border-purple-60/20"
                    )}>
                      {app.type}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-3 line-clamp-1 group-hover:text-purple-60 transition-colors">
                    {app.title || 'Compromisso'}
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] text-grey-50 font-bold uppercase">
                      <User className="h-3 w-3 text-purple-60" /> {app.leadName || 'S/ Lead'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-grey-50 font-bold uppercase truncate">
                      <MapPin className="h-3 w-3 text-purple-60" /> {app.location || 'Escritório'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-8">
                <div className="h-12 w-12 rounded-2xl border-2 border-dashed border-grey-15 flex items-center justify-center mb-4 text-grey-40">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="text-[10px] font-black text-grey-60 uppercase tracking-widest">Nada agendado</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Calendars & Filters */}
        <div className="bg-grey-10 border border-grey-15 rounded-3xl p-6 shadow-2xl shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-grey-40 uppercase tracking-widest flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-60" /> Minhas Agendas
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-emerald-500" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-emerald-500 transition-colors cursor-pointer">Visitas Técnicas</span>
              </div>
              <span className="text-[10px] font-black text-grey-60">12</span>
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-blue-500" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-blue-500 transition-colors cursor-pointer">Apresentações</span>
              </div>
              <span className="text-[10px] font-black text-grey-60">08</span>
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-md bg-purple-60/20 border border-purple-60/30 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-purple-60" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-purple-60 transition-colors cursor-pointer">Reuniões</span>
              </div>
              <span className="text-[10px] font-black text-grey-60">04</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
