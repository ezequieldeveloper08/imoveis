'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Building2, Wallet, GitMerge } from 'lucide-react';
import { DashboardStats, RevenueMonth, ConversionData } from '../types/dashboard.types';

const COLORS = ['#703BF7', '#8254F8', '#936DF9', '#A486F9'];

// Components
export function StatsCards({ stats }: { stats?: DashboardStats }) {
  const items = [
    { 
      label: 'Receita Total', 
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats?.totalRevenue || 0), 
      trend: '+0%', 
      icon: Wallet, 
      color: 'text-purple-60' 
    },
    { 
      label: 'Novos Leads', 
      value: (stats?.newLeadsCount || 0).toLocaleString('pt-BR'), 
      trend: '+0%', 
      icon: Users, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Imóveis Ativos', 
      value: (stats?.activeProperties || 0).toLocaleString('pt-BR'), 
      trend: '+0%', 
      icon: Building2, 
      color: 'text-emerald-400' 
    },
    { 
      label: 'Valor em Pipeline', 
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats?.pipelineValue || 0), 
      trend: '+0%', 
      icon: GitMerge, 
      color: 'text-orange-400' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((stat, i) => (
        <div key={i} className="p-6 bg-grey-10 border border-grey-15 rounded-2xl hover:border-grey-30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-grey-08 border border-grey-15 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {stat.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {stat.trend}
            </div>
          </div>
          <p className="text-grey-60 text-sm font-medium mb-1">{stat.label}</p>
          <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart({ data = [] }: { data?: RevenueMonth[] }) {
  return (
    <div className="p-6 bg-grey-10 border border-grey-15 rounded-2xl h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white">Performance Financeira</h3>
          <p className="text-grey-60 text-sm">Receita mensal vs Projeção</p>
        </div>
        <select className="bg-grey-08 border border-grey-15 text-white text-xs rounded-lg px-3 py-2 outline-none">
          <option>Últimos 6 meses</option>
          <option>Último ano</option>
        </select>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#703BF7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#703BF7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#666666" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#666666" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `R$${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: '#703BF7', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#703BF7" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ConversionFunnel({ data }: { data?: ConversionData }) {
  const chartData = [
    { name: 'Leads', value: data?.leads || 0 },
    { name: 'Visitas', value: data?.visits || 0 },
    { name: 'Propostas', value: data?.proposals || 0 },
    { name: 'Contratos', value: data?.contracts || 0 },
  ];

  return (
    <div className="p-6 bg-grey-10 border border-grey-15 rounded-2xl h-[400px] flex flex-col">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white">Funil de Vendas</h3>
        <p className="text-grey-60 text-sm">Distribuição de conversão</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#ffffff" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              width={100}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: '12px' }}
              cursor={{ fill: '#ffffff05' }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
