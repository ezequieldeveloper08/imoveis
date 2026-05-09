import { LeadStatus, Lead } from '../../leads/types/lead.types';

export type { LeadStatus, Lead } from '../../leads/types/lead.types';

export interface Column {
  id: LeadStatus;
  title: string;
  leads: Lead[];
}

export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', value: 450000, status: 'new', createdAt: new Date().toISOString() },
  { id: '2', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(11) 98888-8888', value: 890000, status: 'new', createdAt: new Date().toISOString() },
  { id: '3', name: 'Pedro Santos', email: 'pedro@email.com', phone: '(11) 97777-7777', value: 1200000, status: 'qualified', createdAt: new Date().toISOString() },
  { id: '4', name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 96666-6666', value: 320000, status: 'qualified', createdAt: new Date().toISOString() },
  { id: '5', name: 'Carlos Lima', email: 'carlos@email.com', phone: '(11) 95555-5555', value: 550000, status: 'visit', createdAt: new Date().toISOString() },
  { id: '6', name: 'Julia Paiva', email: 'julia@email.com', phone: '(11) 94444-4444', value: 1500000, status: 'proposal', createdAt: new Date().toISOString() },
  { id: '7', name: 'Roberto Junior', email: 'roberto@email.com', phone: '(11) 93333-3333', value: 750000, status: 'closed', createdAt: new Date().toISOString() },
];

export const PIPELINE_COLUMNS: { id: LeadStatus; title: string }[] = [
  { id: 'new', title: 'Novos Leads' },
  { id: 'qualified', title: 'Qualificados' },
  { id: 'visit', title: 'Visita Agendada' },
  { id: 'proposal', title: 'Proposta Enviada' },
  { id: 'closed', title: 'Fechamento' },
];
