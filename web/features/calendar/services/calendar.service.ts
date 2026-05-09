import { apiClient } from '@/infrastructure/api/api-client';
import Cookies from 'js-cookie';
import { Appointment } from '../types/calendar.types';

const TOKEN_KEY = 'simovel_token';

export const calendarService = {
  async getAll() {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Appointment[]>('/appointments', { token });
  },

  async getByProperty(propertyId: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Appointment[]>(`/appointments?propertyId=${propertyId}`, { token });
  },

  async getByLead(leadId: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Appointment[]>(`/appointments?leadId=${leadId}`, { token });
  },

  async create(data: any) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Appointment>('/appointments', {
      method: 'POST',
      body: data,
      token,
    });
  }
};
