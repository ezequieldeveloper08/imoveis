'use client';

import { MOCK_USERS, User } from '../types/user.types';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  User as UserIcon, 
  Mail,
  Shield,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function UsersListing() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Equipe</h1>
          <p className="text-grey-60 mt-1">Gerencie os usuários e permissões da sua organização.</p>
        </div>
        
        <Link href="/admin/users/new">
          <Button className="bg-purple-60 hover:bg-purple-65 h-11 px-6 text-white font-semibold shadow-lg shadow-purple-60/20">
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar Membro
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4 py-4 border-y border-grey-15">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40" />
          <Input 
            placeholder="Buscar por nome ou email..." 
            className="pl-10 bg-grey-10 border-grey-15 h-12 text-sm focus:ring-purple-60"
          />
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-grey-60 font-medium">Cargo:</span>
          <select className="bg-grey-10 border border-grey-15 text-white text-xs rounded-xl px-3 py-2 outline-none">
            <option>Todos</option>
            <option>Admin</option>
            <option>Gerente</option>
            <option>Agente</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-grey-10 border border-grey-15 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-grey-08 border-b border-grey-15">
                <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Membro</th>
                <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest text-center">Nível de Acesso</th>
                <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Departamento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest">Último Acesso</th>
                <th className="px-6 py-4 text-[10px] font-bold text-grey-60 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-15">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-grey-15/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center relative overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <UserIcon className="h-5 w-5 text-grey-40" />
                        )}
                        {user.status === 'active' && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-grey-10 rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-none mb-1">{user.name}</p>
                        <p className="text-xs text-grey-60 leading-none">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        user.role === 'ADMIN' ? "bg-purple-60/10 text-purple-60" :
                        user.role === 'MANAGER' ? "bg-blue-500/10 text-blue-500" :
                        "bg-grey-15 text-grey-40"
                      )}>
                        {user.role === 'ADMIN' ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        {user.role}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-grey-30 font-medium">
                      {user.department}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <div className={cn(
                        "flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                        user.status === 'active' ? "text-emerald-500" : "text-grey-50"
                      )}>
                        <Circle className={cn("h-2 w-2 fill-current", user.status === 'active' ? "animate-pulse" : "")} />
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-grey-60">
                      {new Date(user.lastLogin).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white transition-all">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="h-8 w-8 rounded-lg bg-grey-08 border border-grey-15 flex items-center justify-center text-grey-40 hover:text-white transition-all">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
