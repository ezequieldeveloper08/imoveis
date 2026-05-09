import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { Organization } from '../../domain/entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(private readonly repository: OrganizationRepository) { }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const org = await this.repository.findById(id);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async create(data: Partial<Organization>) {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Organization>) {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
