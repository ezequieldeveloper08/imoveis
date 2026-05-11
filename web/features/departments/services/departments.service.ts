import Cookies from 'js-cookie';
import { apiClient } from '../../../infrastructure/api/api-client';
import { Department } from '../types/department.types';

const TOKEN_KEY = 'simovel_token';

export const departmentsService = {
  async getAll(): Promise<Department[]> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Department[]>('/departments', { token });
  },

  async getById(id: string): Promise<Department> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Department>(`/departments/${id}`, { token });
  },

  async create(data: Partial<Department>): Promise<Department> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Department>('/departments', {
      method: 'POST',
      body: data,
      token,
    });
  },

  async update(id: string, data: Partial<Department>): Promise<Department> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Department>(`/departments/${id}`, {
      method: 'PATCH',
      body: data,
      token,
    });
  },

  async delete(id: string): Promise<void> {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<void>(`/departments/${id}`, {
      method: 'DELETE',
      token,
    });
  }
};
