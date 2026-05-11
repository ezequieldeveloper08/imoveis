import { Department } from '../entities/department.entity';

export abstract class DepartmentRepository {
  abstract findAll(orgId: string): Promise<Department[]>;
  abstract findById(id: string): Promise<Department | null>;
  abstract create(data: Partial<Department>): Promise<Department>;
  abstract update(id: string, data: Partial<Department>): Promise<Department>;
  abstract delete(id: string): Promise<void>;
}
