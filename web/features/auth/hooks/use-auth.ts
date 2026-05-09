'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '../services/auth.service';
import type { LoginCredentials, AuthUser } from '../types/auth.types';

export interface RegisterWithOrganizationCredentials {
  organizationName: string;
  name: string;
  email: string;
  password: string;
}

const TOKEN_KEY = 'simovel_token';
const USER_KEY = 'simovel_user';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { access_token, user } = await authService.login(credentials);
      Cookies.set(TOKEN_KEY, access_token, { expires: 1 });
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterWithOrganizationCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { access_token, user } = await authService.register(data);
      Cookies.set(TOKEN_KEY, access_token, { expires: 1 });
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    router.push('/login');
  }, [router]);

  const getToken = useCallback(() => Cookies.get(TOKEN_KEY) || null, []);

  const getUser = useCallback((): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }, []);

  return { login, register, logout, getToken, getUser, isLoading, error };
}
