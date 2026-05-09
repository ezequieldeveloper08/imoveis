'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Network,
  ArrowRight,
  UserPlus
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

const userSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'Selecione o nível de acesso'),
  department: z.string().min(1, 'Selecione o departamento'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'AGENT',
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Call service here
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white tracking-tight">Novo Membro da Equipe</h2>
        <p className="text-grey-60 text-sm mt-1">Crie um acesso para um novo colaborador da sua organização.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-grey-10 border border-grey-15 rounded-2xl p-8 space-y-8 relative overflow-hidden">
          {/* Header Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-60/20 via-purple-60 to-purple-60/20" />

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input id="name" {...register('name')} placeholder="Ex: Rodrigo Lemos" className="h-14 pl-12" />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message as string}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input id="email" {...register('email')} placeholder="rodrigo@simovel.com" className="h-14 pl-12" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
            </div>
          </div>

          <div className="h-px bg-grey-15" />

          {/* Permissions & Dept */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="role">Nível de Acesso</Label>
              <Select defaultValue="AGENT">
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-grey-40" />
                    <SelectValue placeholder="Selecione o cargo" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15">
                  <SelectItem value="ADMIN">Administrador (Acesso Total)</SelectItem>
                  <SelectItem value="MANAGER">Gerente de Vendas</SelectItem>
                  <SelectItem value="AGENT">Agente Imobiliário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select defaultValue="vendas">
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-grey-40" />
                    <SelectValue placeholder="Selecione o depto" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15">
                  <SelectItem value="diretoria">Diretoria</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="password">Senha Inicial</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input 
                  id="password" 
                  type="password"
                  {...register('password')} 
                  placeholder="Defina uma senha temporária" 
                  className="h-14 pl-12" 
                />
              </div>
              <p className="text-[10px] text-grey-50 italic mt-1">O usuário será solicitado a alterar a senha no primeiro acesso.</p>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="ghost" className="text-grey-60 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" className="bg-purple-60 hover:bg-purple-65 h-14 px-12 text-white font-bold rounded-xl shadow-xl shadow-purple-60/20">
            Criar Usuário
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
