import { Proposal } from '../entities/proposal.entity';

export abstract class ProposalRepository {
  abstract findByProperty(propertyId: string): Promise<Proposal[]>;
  abstract findByLead(leadId: string): Promise<Proposal[]>;
  abstract findByOrganization(orgId: string): Promise<Proposal[]>;
  abstract findById(id: string): Promise<Proposal | null>;
  abstract create(proposal: Partial<Proposal>): Promise<Proposal>;
  abstract update(id: string, proposal: Partial<Proposal>): Promise<Proposal>;
  abstract delete(id: string): Promise<void>;
}
