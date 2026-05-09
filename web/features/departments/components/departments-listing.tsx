'use client';

import { MOCK_DEPARTMENTS, Department } from '../types/department.types';
import { 
  Network, 
  Plus, 
  Users, 
  User as UserIcon, 
  MoreVertical,
  ChevronRight,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function DepartmentsListing() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Departamentos</h1>
          <p className="text-grey-60 mt-1">Estrutura organizacional da sua imobiliária.</p>
        </div>
        
        <Link href="/admin/departments/new">
          <Button className="bg-purple-60 hover:bg-purple-65 h-11 px-6 text-white font-semibold shadow-lg shadow-purple-60/20">
            <Plus className="h-4 w-4 mr-2" />
            Novo Departamento
          </Button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DEPARTMENTS.map((dept) => (
          <div key={dept.id} className="bg-grey-10 border border-grey-15 rounded-2xl p-6 hover:border-grey-30 transition-all group relative overflow-hidden">
            {/* Color Accent */}
            <div 
              className="absolute top-0 left-0 w-full h-1" 
              style={{ backgroundColor: dept.color }} 
            />
            
            <div className="flex items-start justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Network className="h-6 w-6" style={{ color: dept.color }} />
              </div>
              <button className="h-8 w-8 flex items-center justify-center text-grey-60 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{dept.name}</h3>
            <p className="text-sm text-grey-60 line-clamp-2 mb-6 min-h-[40px]">
              {dept.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-grey-08 rounded-xl border border-grey-15">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-grey-40" />
                  <span className="text-xs text-grey-60 font-medium text-nowrap">Gestor:</span>
                </div>
                <span className="text-xs text-white font-bold">{dept.manager}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-grey-08 rounded-xl border border-grey-15">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-grey-40" />
                  <span className="text-xs text-grey-60 font-medium text-nowrap">Membros:</span>
                </div>
                <span className="text-xs text-white font-bold">{dept.memberCount} colaboradores</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full mt-6 bg-grey-15 hover:bg-grey-20 border border-grey-20 text-white h-11 rounded-xl group/btn">
              Ver Detalhes
              <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        ))}

        {/* Create Card Placeholder */}
        <Link href="/admin/departments/new" className="border-2 border-dashed border-grey-15 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-purple-60/50 hover:bg-purple-60/5 transition-all group">
          <div className="h-14 w-14 rounded-full bg-grey-10 flex items-center justify-center border border-grey-15 group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6 text-grey-40 group-hover:text-purple-60" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">Adicionar Departamento</p>
            <p className="text-xs text-grey-60 mt-1 text-balance max-w-[150px]">Crie uma nova divisão para organizar sua equipe.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
