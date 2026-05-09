'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  organizationName: z.string().min(2, 'O nome da imobiliária deve ter pelo menos 2 caracteres'),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const { register: registerUser, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => registerUser(data);

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Crie sua conta</h1>
        <p className="text-grey-60 text-sm">Junte-se à Estatein e gerencie seus imóveis</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Organization Name */}
        <div className="space-y-2">
          <Label htmlFor="organizationName">Nome da Imobiliária</Label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 pointer-events-none z-10" />
            <Input id="organizationName" {...register('organizationName')} type="text" placeholder="Minha Agência Imobiliária" className="pl-12" aria-invalid={!!errors.organizationName} />
          </div>
          {errors.organizationName && <p className="text-red-400 text-xs">{errors.organizationName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 pointer-events-none z-10" />
            <Input id="email" {...register('email')} type="email" placeholder="seu@email.com" className="pl-12" aria-invalid={!!errors.email} />
          </div>
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Seu Nome Completo</Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 pointer-events-none z-10" />
            <Input id="name" {...register('name')} type="text" placeholder="João da Silva" className="pl-12" aria-invalid={!!errors.name} />
          </div>
          {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 pointer-events-none z-10" />
            <Input
              id="password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-12 pr-12"
              aria-invalid={!!errors.password}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-40 hover:text-white transition-colors">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-60 hover:bg-purple-65 disabled:opacity-50 disabled:cursor-not-allowed text-white h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-all group"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Criar Conta
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <p className="text-center text-grey-60 text-sm">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-white hover:text-purple-60 transition-colors font-medium">
          Entrar agora
        </Link>
      </p>
    </motion.form>
  );
}
