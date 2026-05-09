export class Appointment {
  id: string;
  propertyId: string;
  leadId: string;
  date: Date;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  description?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Appointment>) {
    Object.assign(this, partial);
  }
}
