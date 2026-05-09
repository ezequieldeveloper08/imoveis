import { apiClient } from '@/infrastructure/api/api-client';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'simovel_token';

export const contactService = {
  async getAll() {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<any[]>('/contacts', { token });
  },

  async getById(id: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<any>(`/contacts/${id}`, { token });
  },

  async create(data: any) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<any>('/contacts', {
      method: 'POST',
      body: data,
      token,
    });
  },

  async update(id: string, data: any) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<any>(`/contacts/${id}`, {
      method: 'PATCH',
      body: data,
      token,
    });
  },

  async delete(id: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<void>(`/contacts/${id}`, {
      method: 'DELETE',
      token,
    });
  }
};
