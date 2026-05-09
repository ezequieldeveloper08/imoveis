import { Contact } from '../entities/contact.entity';

export abstract class ContactRepository {
  abstract findAll(orgId: string): Promise<Contact[]>;
  abstract findById(id: string): Promise<Contact | null>;
  abstract findByEmailOrPhone(email?: string, phone?: string): Promise<Contact | null>;
  abstract create(contact: Partial<Contact>): Promise<Contact>;
  abstract update(id: string, contact: Partial<Contact>): Promise<Contact>;
  abstract delete(id: string): Promise<void>;
}
