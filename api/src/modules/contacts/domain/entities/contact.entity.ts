export class Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Contact>) {
    Object.assign(this, partial);
  }
}
