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
  eachDayOfInterval,
  isToday as isTodayFn
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Clock,
  User,
  Check,
  MoreVertical,
  Filter,
  Calendar as CalendarIcon,
  Search,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowUpRight,
  Target
} from 'lucide-react';
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
    <div className="flex gap-8 h-[calc(100vh-160px)] min-h-0">

      {/* 1. LEFT SIDEBAR: Command Center */}
      <aside className="w-80 flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pr-2">

        {/* Mini Calendar Navigation */}
        <div className="bg-grey-10 border border-grey-15 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon className="h-3 w-3 text-purple-60" /> Navegação
            </h4>
            <div className="flex gap-1">
              <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} variant="ghost" size="icon" className="h-6 w-6 text-grey-60 hover:text-white"><ChevronLeft className="h-3 w-3" /></Button>
              <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} variant="ghost" size="icon" className="h-6 w-6 text-grey-60 hover:text-white"><ChevronRight className="h-3 w-3" /></Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-white capitalize mb-4 px-1">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <span key={i} className="text-[8px] font-black text-grey-60 uppercase">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isTodayFn(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const hasApps = appointments.some(app => isSameDay(new Date(app.date), day));

                if (!isCurrentMonth) return <div key={i} className="h-7" />;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "h-7 w-full rounded-lg text-[10px] font-bold flex items-center justify-center transition-all relative group",
                      isSelected ? "bg-purple-60 text-white shadow-lg shadow-purple-60/30" :
                        isToday ? "text-purple-60 border border-purple-60/30" :
                          "text-grey-40 hover:bg-grey-15 hover:text-white"
                    )}
                  >
                    {format(day, 'd')}
                    {hasApps && !isSelected && (
                      <div className="absolute bottom-1 h-0.5 w-0.5 rounded-full bg-purple-60/60" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters / Categories */}
        <div className="bg-grey-10 border border-grey-15 rounded-3xl p-6 shadow-2xl">
          <h4 className="text-[10px] font-black text-grey-60 uppercase tracking-widest mb-6">Agendas</h4>
          <div className="space-y-4">
            {[
              { label: 'Visitas', color: 'bg-emerald-500', count: 12 },
              { label: 'Reuniões', color: 'bg-blue-500', count: 5 },
              { label: 'Follow-ups', color: 'bg-purple-60', count: 18 },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn("h-2 w-2 rounded-full", f.color)} />
                  <span className="text-[11px] font-bold text-grey-30 group-hover:text-white transition-colors">{f.label}</span>
                </div>
                <span className="text-[10px] font-black text-grey-70">{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT: Daily Roadmap */}
      <main className="flex-1 flex flex-col gap-8 min-w-0 h-full">

        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white capitalize tracking-tighter">
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-black text-purple-60 uppercase tracking-[0.2em] bg-purple-60/10 px-3 py-1 rounded-lg">
                Agenda de Hoje
              </p>
              <div className="h-1 w-1 rounded-full bg-grey-50" />
              <p className="text-[10px] font-black text-grey-50 uppercase tracking-widest">
                {appointmentsForSelectedDay.length} compromissos no radar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-60 group-focus-within:text-purple-60 transition-colors" />
              <input
                placeholder="Pesquisar..."
                className="bg-grey-10 border border-grey-15 rounded-2xl h-12 pl-12 pr-4 text-sm text-white focus:border-purple-60 outline-none transition-all w-48 focus:w-64 shadow-xl"
              />
            </div>
            <Link href="/admin/calendar/new">
              <Button className="bg-purple-60 hover:bg-purple-65 text-white font-black h-12 px-8 rounded-2xl shadow-xl shadow-purple-60/20 flex items-center gap-3 uppercase text-[10px] tracking-widest">
                <Plus className="h-4 w-4" /> Novo
              </Button>
            </Link>
          </div>
        </header>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-20 min-h-0">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="h-10 w-10 border-2 border-purple-60 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : appointmentsForSelectedDay.length > 0 ? (
            <div className="relative pl-12 space-y-8">
              {/* Timeline Line */}
              <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-purple-60/40 via-grey-15 to-transparent" />

              {appointmentsForSelectedDay.map((app, idx) => (
                <div key={app.id} className="relative group animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>

                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-8 h-3 w-3 rounded-full bg-grey-08 border-2 border-purple-60 shadow-[0_0_10px_rgba(112,59,247,0.5)] z-10 transition-transform group-hover:scale-150" />

                  {/* Appointment Card */}
                  <div className="bg-grey-10 border border-grey-15 rounded-3xl p-8 flex flex-col xl:flex-row xl:items-center gap-8 shadow-xl hover:border-purple-60/30 transition-all hover:shadow-2xl hover:shadow-purple-60/5 group/card">

                    {/* Time & Badge */}
                    <div className="flex xl:flex-col items-center xl:items-start justify-between gap-4 xl:min-w-[140px]">
                      <div className="flex flex-col">
                        <span className="text-3xl font-black text-white tracking-tighter">{app.time}</span>
                        <span className="text-[10px] font-black text-grey-60 uppercase tracking-widest">Início</span>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        app.type === 'visit' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          app.type === 'call' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            "bg-purple-60/10 text-purple-60 border-purple-60/20"
                      )}>
                        {app.type === 'visit' ? 'Visita' : app.type === 'call' ? 'Call' : 'Reunião'}
                      </span>
                    </div>

                    {/* Core Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-grey-50 uppercase tracking-[0.2em]">
                        <MapPin className="h-3 w-3 text-purple-60" /> {app.location || 'Escritório Central'}
                      </div>
                      <h3 className="text-2xl font-black text-white group-hover/card:text-purple-60 transition-colors">
                        {app.title || 'Alinhamento Estratégico'}
                      </h3>
                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-3 bg-grey-08 px-4 py-2 rounded-2xl border border-grey-15 transition-all hover:border-grey-30">
                          <div className="h-8 w-8 rounded-xl bg-purple-60/10 flex items-center justify-center text-purple-60 font-black text-xs shadow-inner">
                            {app.leadName?.charAt(0) || 'L'}
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-grey-60 uppercase tracking-widest leading-none mb-1">Lead</p>
                            <p className="text-xs font-bold text-white">{app.leadName || 'Não informado'}</p>
                          </div>
                        </div>
                        {app.propertyName && (
                          <div className="flex items-center gap-3 bg-grey-08 px-4 py-2 rounded-2xl border border-grey-15 transition-all hover:border-grey-30">
                            <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-inner">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-grey-60 uppercase tracking-widest leading-none mb-1">Imóvel</p>
                              <p className="text-xs font-bold text-white max-w-[120px] truncate">{app.propertyName}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="flex items-center gap-3 xl:ml-auto">
                      <Button variant="outline" className="h-14 w-14 rounded-2xl bg-grey-08 border-grey-15 text-grey-50 hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
                        <CheckCircle2 className="h-6 w-6" />
                      </Button>
                      <Link href={`/admin/leads/${app.leadId}`}>
                        <Button variant="outline" className="h-14 w-14 rounded-2xl bg-grey-08 border-grey-15 text-grey-50 hover:text-purple-60 hover:border-purple-60/30 hover:bg-purple-60/5 transition-all">
                          <ArrowUpRight className="h-6 w-6" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-14 w-10 text-grey-70 hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-grey-10/50 border-2 border-dashed border-grey-15 rounded-[40px] opacity-40">
              <div className="h-24 w-24 rounded-full bg-grey-15 flex items-center justify-center mb-8 relative">
                <CalendarIcon className="h-10 w-10 text-grey-40" />
                <div className="absolute inset-0 bg-purple-60/10 blur-2xl rounded-full" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Horizonte Limpo</h3>
              <p className="text-grey-60 max-w-sm mx-auto leading-relaxed font-bold uppercase text-[10px] tracking-widest">
                Você não tem compromissos agendados para este dia.
              </p>
              <Button
                onClick={() => setSelectedDate(new Date())}
                variant="ghost"
                className="mt-8 text-purple-60 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-purple-60/10 px-8 h-12 rounded-2xl"
              >
                Retornar para o Agora
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
