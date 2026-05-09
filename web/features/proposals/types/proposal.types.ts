export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFER';

export interface Proposal {
  id: string;
  value: number;
  date: string;
  status: ProposalStatus;
  notes?: string;
  leadId: string;
  leadName?: string;
  propertyId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProposalDto {
  value: number;
  date?: string;
  leadId: string;
  propertyId?: string;
  status?: string;
  notes?: string;
}
