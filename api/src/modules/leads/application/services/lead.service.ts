import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { Lead } from '../../domain/entities/lead.entity';
import { ContactService } from '../../../contacts/application/services/contact.service';

@Injectable()
export class LeadService {
  constructor(
    private readonly repository: LeadRepository,
    private readonly contactService: ContactService
  ) { }

  async findAll(orgId: string, propertyId?: string, email?: string, phone?: string, contactId?: string) {
    return this.repository.findByOrganization(orgId, propertyId, email, phone, contactId);
  }

  async findOne(id: string) {
    const lead = await this.repository.findById(id);
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async findByPhone(phone: string) {
    return this.repository.findByEmailOrPhone(undefined, phone);
  }

  async create(data: Partial<Lead>) {
    // 1. Find or Create Contact
    const contact = await this.contactService.findOrCreate({
      name: data.name!,
      email: data.email,
      phone: data.phone,
      organizationId: data.organizationId!
    });

    // 2. Check for existing lead by email or phone AND propertyId
    if (data.propertyId || data.interest) {
      const existingInSameProperty = await this.repository.findByEmailOrPhone(data.email, data.phone);
      
      if (existingInSameProperty && (existingInSameProperty.propertyId === data.propertyId || existingInSameProperty.interest === data.interest)) {
        return this.repository.update(existingInSameProperty.id, {
          ...data,
          contactId: contact.id,
          status: existingInSameProperty.status === 'closed' ? 'new' : existingInSameProperty.status
        });
      }
    }

    // 3. Create new Opportunity linked to Contact
    return this.repository.create({
      ...data,
      contactId: contact.id
    });
  }

  async update(id: string, data: Partial<Lead>) {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
