import { Organization } from '../entities/organization.entity';

export abstract class OrganizationRepository {
  abstract findAll(): Promise<Organization[]>;
  abstract findById(id: string): Promise<Organization | null>;
  abstract create(organization: Partial<Organization>): Promise<Organization>;
  abstract update(id: string, organization: Partial<Organization>): Promise<Organization>;
  abstract delete(id: string): Promise<void>;
}
