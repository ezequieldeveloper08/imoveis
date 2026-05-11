import Cookies from 'js-cookie';
import { apiClient } from '../../../infrastructure/api/api-client';
import { User } from '../types/user.types';

const TOKEN_KEY = 'simovel_token';

export const usersService = {
  async getAll(): Promise<User[]> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<User[]>('/users', { token });
  },

  async getById(id: string): Promise<User> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<User>(`/users/${id}`, { token });
  },

  async create(data: Partial<User>): Promise<User> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<User>('/users', {
      method: 'POST',
      body: data,
      token,
    });
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<User>(`/users/${id}`, {
      method: 'PATCH',
      body: data,
      token,
    });
  },

  async delete(id: string): Promise<void> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<void>(`/users/${id}`, {
      method: 'DELETE',
      token,
    });
  }
};
