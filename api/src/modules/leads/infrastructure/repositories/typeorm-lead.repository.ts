import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadRepository } from '../../domain/repositories/lead.repository';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadSchema } from './lead.schema';

@Injectable()
export class TypeOrmLeadRepository implements LeadRepository {
  constructor(
    @InjectRepository(LeadSchema)
    private readonly repository: Repository<LeadSchema>,
  ) {}

  async findByOrganization(orgId: string, propertyId?: string, email?: string, phone?: string, contactId?: string): Promise<Lead[]> {
    const where: any = { organizationId: orgId };
    if (propertyId) where.propertyId = propertyId;
    if (email) where.email = email;
    if (phone) where.phone = phone;
    if (contactId) where.contactId = contactId;
    
    const leads = await this.repository.find({ where });
    return leads.map(lead => new Lead(lead));
  }

  async findById(id: string): Promise<Lead | null> {
    const lead = await this.repository.findOne({ where: { id } });
    return lead ? new Lead(lead) : null;
  }

  async findByEmailOrPhone(email?: string, phone?: string): Promise<Lead | null> {
    if (!email && !phone) return null;
    
    const conditions: any[] = [];
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });

    const lead = await this.repository.findOne({ 
      where: conditions
    });
    return lead ? new Lead(lead) : null;
  }

  async create(lead: Partial<Lead>): Promise<Lead> {
    const newLead = this.repository.create(lead);
    await this.repository.save(newLead);
    return new Lead(newLead);
  }

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    await this.repository.update(id, lead);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
