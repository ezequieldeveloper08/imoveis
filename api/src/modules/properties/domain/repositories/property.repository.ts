import { Property } from '../entities/property.entity';

export abstract class PropertyRepository {
  abstract findByOrganization(orgId: string): Promise<Property[]>;
  abstract findById(id: string): Promise<Property | null>;
  abstract create(property: Partial<Property>): Promise<Property>;
  abstract update(id: string, property: Partial<Property>): Promise<Property>;
  abstract delete(id: string): Promise<void>;
}
