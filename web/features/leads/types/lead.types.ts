export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'visit' | 'proposal' | 'closed' | 'lost' | 'converted';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status: LeadStatus;
  propertyId?: string;
  interest?: string;
  allInterests?: string[];
  contactId?: string;
  lostReason?: string;
  notes?: string;
  value?: number;
  createdAt: string;
  updatedAt?: string;
  lastContact?: string;
}

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Roberto Mendonça',
    email: 'roberto.m@gmail.com',
    phone: '(11) 98765-4321',
    source: 'Instagram',
    status: 'new',
    interest: 'Mansão Contemporânea no Alphaville',
    value: 4500000,
    createdAt: '2024-03-08T10:00:00Z',
    lastContact: '2024-03-08T10:00:00Z'
  },
  {
    id: '2',
    name: 'Juliana Paiva',
    email: 'ju.paiva@outlook.com',
    phone: '(21) 99888-7766',
    source: 'Facebook Ads',
    status: 'qualified',
    interest: 'Cobertura Duplex no Itaim Bibi',
    value: 8900000,
    createdAt: '2024-03-05T14:30:00Z',
    lastContact: '2024-03-07T11:20:00Z'
  },
  {
    id: '3',
    name: 'Carlos Alberto',
    email: 'carlos.alberto@uol.com.br',
    phone: '(31) 97766-5544',
    source: 'Google Search',
    status: 'contacted',
    interest: 'Apartamento Garden na Vila Nova',
    value: 15000,
    createdAt: '2024-03-07T09:15:00Z',
    lastContact: '2024-03-08T15:45:00Z'
  }
];
