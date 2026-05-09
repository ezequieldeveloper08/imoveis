import type { Metadata } from 'next';
import { AuthLayoutShell } from '@/features/auth/components/auth-layout-shell';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Entrar — Estatein',
  description: 'Entre na sua conta Estatein para gerenciar seus imóveis e leads.',
};

export default function LoginPage() {
  return (
    <AuthLayoutShell
      imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
      quote="Todo grande negócio imobiliário começa com o parceiro certo. Bem-vindo de volta."
    >
      <LoginForm />
    </AuthLayoutShell>
  );
}
