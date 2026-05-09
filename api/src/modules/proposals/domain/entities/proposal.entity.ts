export class Proposal {
  id: string;
  propertyId: string;
  leadId: string;
  value: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFER';
  paymentMethod: string;
  description?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Proposal>) {
    Object.assign(this, partial);
  }
}
