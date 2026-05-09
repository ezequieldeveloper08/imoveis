import { apiClient } from '@/infrastructure/api/api-client';
import Cookies from 'js-cookie';
import { Proposal, CreateProposalDto } from '../types/proposal.types';

const TOKEN_KEY = 'simovel_token';

export const proposalsService = {
  async getByProperty(propertyId: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Proposal[]>(`/proposals?propertyId=${propertyId}`, { token });
  },

  async getByLead(leadId: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Proposal[]>(`/proposals?leadId=${leadId}`, { token });
  },

  async create(data: CreateProposalDto) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Proposal>('/proposals', {
      method: 'POST',
      body: data,
      token,
    });
  },

  async updateStatus(id: string, status: string) {
    const token = Cookies.get(TOKEN_KEY);
    return apiClient<Proposal>(`/proposals/${id}`, {
      method: 'PATCH',
      body: { status },
      token,
    });
  }
};
