'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Network,
  User,
  AlignLeft,
  Palette,
  ArrowRight,
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
import { cn } from '@/lib/utils';

const departmentSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
  managerId: z.string().min(1, 'Selecione um gestor'),
});

const colorOptions = [
  { label: 'Roxo Estatein', value: '#703BF7' },
  { label: 'Azul Real', value: '#3B82F6' },
  { label: 'Verde Esmeralda', value: '#10B981' },
  { label: 'Laranja Vibrante', value: '#F59E0B' },
  { label: 'Vermelho Paixão', value: '#EF4444' },
  { label: 'Rosa Pink', value: '#EC4899' },
];

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { departmentsService } from '../services/departments.service';
import { usersService } from '../../users/services/users.service';
import { User as UserType } from '../../users/types/user.types';
import { toast } from 'sonner';

export function DepartmentForm() {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(departmentSchema),
  });

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await usersService.getAll();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    }
    loadUsers();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await departmentsService.create({
        ...data,
        color: selectedColor,
      });
      toast.success('Departamento criado com sucesso!');
      router.push('/admin/departments');
    } catch (error) {
      console.error('Failed to create department:', error);
      toast.error('Erro ao criar departamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-60/10 border border-purple-60/20 mb-6">
          <Network className="h-8 w-8 text-purple-60" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Novo Departamento</h2>
        <p className="text-grey-60 text-sm mt-2">Defina uma nova área para organizar sua operação e equipe.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-grey-10 border border-grey-15 rounded-3xl p-10 space-y-10 relative overflow-hidden">
          {/* Section: Basic Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Departamento</Label>
              <div className="relative">
                <Network className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 z-10" />
                <Input id="name" {...register('name')} placeholder="Ex: Vendas Novos Negócios" className="h-14 pl-12" />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição / Objetivo</Label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 h-4 w-4 text-grey-40 z-10" />
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder="Qual o foco desta divisão?"
                  className="w-full bg-grey-08 border border-grey-15 rounded-xl p-4 pl-12 text-white placeholder:text-grey-40 focus:ring-2 focus:ring-purple-60 outline-none h-32 transition-all"
                />
              </div>
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message as string}</p>}
            </div>
          </div>

          <div className="h-px bg-grey-15" />

          {/* Section: Management & Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="managerId">Gestor Responsável</Label>
              <Select onValueChange={(val) => setValue('managerId', val)}>
                <SelectTrigger className="h-14 bg-grey-08 border-grey-15 text-white">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-grey-40" />
                    <SelectValue placeholder="Selecione um gestor" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-grey-10 border-grey-15 text-white">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.managerId && <p className="text-red-400 text-xs mt-1">{errors.managerId.message as string}</p>}
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-grey-40" />
                Identidade Visual (Cor)
              </Label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedColor(option.value)}
                    className={cn(
                      "h-10 w-10 rounded-xl transition-all border-2",
                      selectedColor === option.value
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent opacity-50 hover:opacity-100"
                    )}
                    style={{ backgroundColor: option.value }}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-grey-60 hover:text-white"
          >
            Descartar Alterações
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-60 hover:bg-purple-65 h-14 px-12 text-white-pure font-bold rounded-xl shadow-xl shadow-purple-60/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Criando...' : 'Criar Departamento'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
