export class Lead {
  id: string;
  contactId?: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  source?: string;
  organizationId: string;
  propertyId?: string;
  interest?: string;
  allInterests?: string[];
  lostReason?: string;
  notes?: string;
  value?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Lead>) {
    Object.assign(this, partial);
  }
}
