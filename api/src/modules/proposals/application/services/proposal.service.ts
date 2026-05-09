import { Injectable, NotFoundException } from '@nestjs/common';
import { ProposalRepository } from '../../domain/repositories/proposal.repository';
import { Proposal } from '../../domain/entities/proposal.entity';

import { LeadRepository } from '../../../leads/domain/repositories/lead.repository';

@Injectable()
export class ProposalService {
  constructor(
    private readonly repository: ProposalRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  async findAll(orgId: string, propertyId?: string, leadId?: string) {
    if (propertyId) {
      return this.repository.findByProperty(propertyId);
    }
    if (leadId) {
      return this.repository.findByLead(leadId);
    }
    return this.repository.findByOrganization(orgId);
  }

  async findOne(id: string) {
    const proposal = await this.repository.findById(id);
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  async create(data: Partial<Proposal>) {
    const proposal = await this.repository.create(data as Proposal);
    
    // Auto-update lead status to 'proposal'
    if (proposal.leadId) {
      await this.leadRepository.update(proposal.leadId, { status: 'proposal' } as any);
    }

    return proposal;
  }

  async update(id: string, data: Partial<Proposal>) {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
