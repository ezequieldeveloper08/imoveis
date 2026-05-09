import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyRepository } from '../../domain/repositories/property.repository';
import { Property } from '../../domain/entities/property.entity';
import { PropertySchema } from './property.schema';

@Injectable()
export class TypeOrmPropertyRepository implements PropertyRepository {
  constructor(
    @InjectRepository(PropertySchema)
    private readonly repository: Repository<PropertySchema>,
  ) {}

  async findByOrganization(orgId: string): Promise<Property[]> {
    const properties = await this.repository.find({ where: { organizationId: orgId } });
    return properties.map(property => new Property(property));
  }

  async findById(id: string): Promise<Property | null> {
    const property = await this.repository.findOne({ where: { id } });
    return property ? new Property(property) : null;
  }

  async create(property: Partial<Property>): Promise<Property> {
    const newProperty = this.repository.create(property);
    await this.repository.save(newProperty);
    return new Property(newProperty);
  }

  async update(id: string, property: Partial<Property>): Promise<Property> {
    await this.repository.update(id, property);
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
