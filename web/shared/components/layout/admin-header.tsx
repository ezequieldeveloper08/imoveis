'use client';

import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useEffect, useState } from 'react';
import { AuthUser } from '@/features/auth/types/auth.types';
import { useTheme } from 'next-themes';

export function AdminHeader() {
  const { getUser } = useAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setUser(getUser());
  }, [getUser]);

  return (
    <header className="h-20 border-b border-grey-15 bg-grey-08/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-40 transition-colors group-focus-within:text-purple-60" />
        <Input 
          placeholder="Pesquisar leads, imóveis..." 
          className="pl-12 bg-grey-10 border-grey-15 h-11 text-sm transition-all focus:ring-1 focus:ring-purple-60"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-11 w-11 flex items-center justify-center rounded-xl bg-grey-10 border border-grey-15 text-grey-40 hover:text-white hover:border-grey-30 transition-all"
        >
          <Sun className="h-5 w-5 hidden dark:block" />
          <Moon className="h-5 w-5 dark:hidden" />
        </button>

        <button className="h-11 w-11 flex items-center justify-center rounded-xl bg-grey-10 border border-grey-15 text-grey-40 hover:text-white hover:border-grey-30 transition-all relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-purple-60 rounded-full border-2 border-grey-10" />
        </button>
        
        <div className="h-11 px-3 flex items-center gap-3 rounded-xl bg-grey-10 border border-grey-15 hover:border-grey-30 transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-purple-60/20 flex items-center justify-center">
            {user?.name ? (
              <span className="text-purple-60 font-bold text-xs">{user.name.charAt(0)}</span>
            ) : (
              <User className="h-4 w-4 text-purple-60" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-white leading-none">
              {user?.name || 'Carregando...'}
            </p>
            <p className="text-[10px] text-grey-60 uppercase tracking-wider mt-1">
              {user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'MANAGER' ? 'Gerente' : user?.role === 'AGENT' ? 'Corretor' : 'Acesso Restrito'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
