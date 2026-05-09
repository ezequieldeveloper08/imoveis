import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactRepository } from '../../domain/repositories/contact.repository';
import { Contact } from '../../domain/entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(private readonly repository: ContactRepository) { }

  async findAll(orgId: string) {
    return this.repository.findAll(orgId);
  }

  async findOne(id: string) {
    const contact = await this.repository.findById(id);
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async create(data: Partial<Contact>) {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Contact>) {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }

  async findOrCreate(data: { name: string, email?: string, phone?: string, organizationId: string }) {
    const existing = await this.repository.findByEmailOrPhone(data.email, data.phone);
    if (existing) {
      // Potentially update the name if it's better or missing
      if (!existing.name && data.name) {
        return this.repository.update(existing.id, { name: data.name });
      }
      return existing;
    }
    return this.repository.create(data);
  }
}
