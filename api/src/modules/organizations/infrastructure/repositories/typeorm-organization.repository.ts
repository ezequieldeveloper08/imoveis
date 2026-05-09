import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { Organization } from '../../domain/entities/organization.entity';
import { OrganizationSchema } from './organization.schema';

@Injectable()
export class TypeOrmOrganizationRepository implements OrganizationRepository {
  constructor(
    @InjectRepository(OrganizationSchema)
    private readonly repository: Repository<OrganizationSchema>,
  ) {}

  async findAll(): Promise<Organization[]> {
    const orgs = await this.repository.find();
    return orgs.map(org => new Organization(org));
  }

  async findById(id: string): Promise<Organization | null> {
    const org = await this.repository.findOne({ where: { id } });
    return org ? new Organization(org) : null;
  }

  async create(organization: Partial<Organization>): Promise<Organization> {
    const newOrg = this.repository.create(organization);
    await this.repository.save(newOrg);
    return new Organization(newOrg);
  }

  async update(id: string, organization: Partial<Organization>): Promise<Organization> {
    await this.repository.update(id, organization);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
