import { apiClient } from '@/infrastructure/api/api-client';
import type { AuthTokens, LoginCredentials } from '../types/auth.types';
import type { RegisterWithOrganizationCredentials } from '../hooks/use-auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    return apiClient<AuthTokens>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  async register(data: RegisterWithOrganizationCredentials): Promise<AuthTokens> {
    return apiClient<AuthTokens>('/auth/register', {
      method: 'POST',
      body: data,
    });
  },
};
