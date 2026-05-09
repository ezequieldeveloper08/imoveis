import type { Metadata } from 'next';
import { AuthLayoutShell } from '@/features/auth/components/auth-layout-shell';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = {
  title: 'Criar Conta — Estatein',
  description: 'Junte-se à Estatein e comece a gerenciar suas propriedades imobiliárias.',
};

export default function RegisterPage() {
  return (
    <AuthLayoutShell
      imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
      quote="Sua jornada imobiliária começa com um único passo. Vamos dar esse passo juntos."
    >
      <RegisterForm />
    </AuthLayoutShell>
  );
}
