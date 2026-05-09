import { apiClient } from '@/infrastructure/api/api-client';
import { Property } from '../types/property.types';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'simovel_token';

export const propertiesService = {
  async getAll() {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Property[]>('/properties', { token });
  },

  async getById(id: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Property>(`/properties/${id}`, { token });
  },

  async create(data: Omit<Property, 'id' | 'createdAt' | 'status' | 'organizationId'>) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Property>('/properties', {
      method: 'POST',
      body: data,
      token,
    });
  },

  async update(id: string, data: Partial<Property>) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Property>(`/properties/${id}`, {
      method: 'PATCH',
      body: data,
      token,
    });
  },

  async delete(id: string) {
    const token = Cookies.get(TOKEN_KEY);
    await apiClient(`/properties/${id}`, {
      method: 'DELETE',
      token,
    });
  },

  async uploadImages(files: File[]) {
    const token = Cookies.get(TOKEN_KEY);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return apiClient<{ url: string; originalName: string; size: number }[]>('/properties/upload', {
      method: 'POST',
      body: formData,
      token,
    });
  },

  async getLeads(id: string) {
    const token = Cookies.get(TOKEN_KEY);
    // For now, filtering leads in frontend or calling a mock endpoint
    // In a real app, this would be /properties/:id/leads
    return apiClient<any[]>(`/leads?propertyId=${id}`, { token });
  }
};
