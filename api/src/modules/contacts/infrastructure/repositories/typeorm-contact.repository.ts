import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRepository } from '../../domain/repositories/contact.repository';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactSchema } from './contact.schema';

@Injectable()
export class TypeOrmContactRepository implements ContactRepository {
  constructor(
    @InjectRepository(ContactSchema)
    private readonly repository: Repository<ContactSchema>,
  ) {}

  async findAll(orgId: string): Promise<Contact[]> {
    const contacts = await this.repository.find({ where: { organizationId: orgId } });
    return contacts.map(c => new Contact(c));
  }

  async findById(id: string): Promise<Contact | null> {
    const contact = await this.repository.findOne({ where: { id } });
    return contact ? new Contact(contact) : null;
  }

  async findByEmailOrPhone(email?: string, phone?: string): Promise<Contact | null> {
    if (!email && !phone) return null;
    
    const conditions: any[] = [];
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });

    const contact = await this.repository.findOne({ 
      where: conditions
    });
    return contact ? new Contact(contact) : null;
  }

  async create(contact: Partial<Contact>): Promise<Contact> {
    const newContact = this.repository.create(contact);
    await this.repository.save(newContact);
    return new Contact(newContact);
  }

  async update(id: string, contact: Partial<Contact>): Promise<Contact> {
    await this.repository.update(id, contact);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
