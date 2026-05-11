'use client';

import { useEffect, useState } from 'react';
import {
  StatsCards,
  RevenueChart,
  ConversionFunnel
} from '@/features/dashboard/components/dashboard-charts';
import { Button } from '@/components/ui/button';
import { Download, Plus, Filter } from 'lucide-react';
import { dashboardService } from '@/features/dashboard/services/dashboard.service';
import { DashboardOverview } from '@/features/dashboard/types/dashboard.types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const overview = await dashboardService.getOverview();
        setData(overview);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-60"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Executivo</h1>
          <p className="text-grey-60 mt-1">Bem-vindo de volta! Aqui está o resumo da sua operação hoje.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-grey-10 border-grey-15 h-11 px-4 text-white hover:bg-grey-15">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" className="bg-grey-10 border-grey-15 h-11 px-4 text-white hover:bg-grey-15">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-purple-60 hover:bg-purple-65 h-11 px-6 font-semibold shadow-lg shadow-purple-60/20">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsCards stats={data?.stats} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={data?.revenueByMonth} />
        </div>
        <div className="lg:col-span-1">
          <ConversionFunnel data={data?.conversion} />
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-grey-10 border border-grey-15 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Leads Recentes</h3>
            <Button variant="link" className="text-purple-60 hover:text-purple-65 p-0 h-auto">Ver todos</Button>
          </div>
          <div className="space-y-6">
            {data?.recentLeads.map((lead, i) => (
              <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-grey-08 border border-grey-15 hover:border-purple-60/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-grey-15 flex items-center justify-center text-sm font-bold text-white border border-grey-20 group-hover:bg-purple-60 transition-colors">
                    {lead.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{lead.name}</p>
                    <p className="text-xs text-grey-60">Interesse: {lead.interest || 'Não informado'}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-grey-10 border border-grey-15 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-60/5 blur-[80px] -mr-32 -mt-32 group-hover:bg-purple-60/10 transition-all" />
          <h3 className="text-lg font-bold text-white mb-6">Próximos Eventos</h3>
          <div className="space-y-4">
            {[
              { time: '09:00', event: 'Visita Técnica - Ed. Horizon', type: 'Visita' },
              { time: '14:30', event: 'Reunião de Fechamento', type: 'Reunião' },
              { time: '16:00', event: 'Call: João Silva', type: 'Call' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-grey-08 border border-grey-15">
                <div className="flex flex-col items-center justify-center px-3 border-r border-grey-15">
                  <span className="text-sm font-bold text-white">{item.time}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.event}</p>
                  <p className="text-xs text-grey-60 mt-0.5">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-8 bg-grey-15 hover:bg-grey-20 border border-grey-20 text-white h-12 rounded-xl">
            Acessar Agenda Completa
          </Button>
        </div>
      </div>
    </div>
  );
}
