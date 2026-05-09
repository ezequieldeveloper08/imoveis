import { Lead } from '../entities/lead.entity';

export abstract class LeadRepository {
  abstract findByOrganization(orgId: string, propertyId?: string, email?: string, phone?: string, contactId?: string): Promise<Lead[]>;
  abstract findById(id: string): Promise<Lead | null>;
  abstract findByEmailOrPhone(email?: string, phone?: string): Promise<Lead | null>;
  abstract create(lead: Partial<Lead>): Promise<Lead>;
  abstract update(id: string, lead: Partial<Lead>): Promise<Lead>;
  abstract delete(id: string): Promise<void>;
}
