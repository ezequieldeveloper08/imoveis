import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from '../../domain/repositories/property.repository';
import { Property } from '../../domain/entities/property.entity';

@Injectable()
export class PropertyService {
  constructor(private readonly repository: PropertyRepository) { }

  async findByOrganization(orgId: string) {
    return this.repository.findByOrganization(orgId);
  }

  async findOne(id: string) {
    const property = await this.repository.findById(id);
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async create(data: Partial<Property>) {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Property>) {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
