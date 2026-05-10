import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProposalRepository } from '../../domain/repositories/proposal.repository';
import { Proposal } from '../../domain/entities/proposal.entity';
import { ProposalSchema } from './proposal.schema';

@Injectable()
export class TypeOrmProposalRepository implements ProposalRepository {
  constructor(
    @InjectRepository(ProposalSchema)
    private readonly repository: Repository<ProposalSchema>,
  ) {}

  async findByProperty(propertyId: string): Promise<Proposal[]> {
    const proposals = await this.repository.find({ 
      where: { propertyId },
      relations: ['lead']
    });
    return proposals.map(p => new Proposal({ ...p, leadName: p.lead?.name } as any));
  }

  async findByLead(leadId: string): Promise<Proposal[]> {
    const proposals = await this.repository.find({ 
      where: { leadId },
      relations: ['lead']
    });
    return proposals.map(p => new Proposal({ ...p, leadName: p.lead?.name } as any));
  }

  async findByOrganization(orgId: string): Promise<Proposal[]> {
    const proposals = await this.repository.find({ 
      where: { organizationId: orgId },
      relations: ['lead']
    });
    return proposals.map(p => new Proposal({ ...p, leadName: p.lead?.name } as any));
  }

  async findById(id: string): Promise<Proposal | null> {
    const proposal = await this.repository.findOne({ where: { id } });
    return proposal ? new Proposal(proposal as any) : null;
  }

  async create(proposal: Partial<Proposal>): Promise<Proposal> {
    const newProposal = this.repository.create(proposal);
    await this.repository.save(newProposal);
    return new Proposal(newProposal as any);
  }

  async update(id: string, proposal: Partial<Proposal>): Promise<Proposal> {
    await this.repository.update(id, proposal);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
