import { apiClient } from '@/infrastructure/api/api-client';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'simovel_token';

export const leadsService = {
  async getAll(filters?: { propertyId?: string, email?: string, phone?: string, contactId?: string }) {
    const token = Cookies.get(TOKEN_KEY);
    let url = '/leads';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.propertyId) params.append('propertyId', filters.propertyId);
      if (filters.email) params.append('email', filters.email);
      if (filters.phone) params.append('phone', filters.phone);
      if (filters.contactId) params.append('contactId', filters.contactId);
      url += `?${params.toString()}`;
    }
    return apiClient<any[]>(url, { token });
  },

  async getById(id: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<any>(`/leads/${id}`, { token });
  },

  async create(data: any) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<any>('/leads', {
      method: 'POST',
      body: data,
      token,
    });
  },

  async update(id: string, data: any) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<any>(`/leads/${id}`, {
      method: 'PATCH',
      body: data,
      token,
    });
  },

  async delete(id: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<void>(`/leads/${id}`, {
      method: 'DELETE',
      token,
    });
  }
};
