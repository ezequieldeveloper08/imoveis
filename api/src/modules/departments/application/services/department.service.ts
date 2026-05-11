import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentRepository } from '../../domain/repositories/department.repository';
import { Department } from '../../domain/entities/department.entity';

@Injectable()
export class DepartmentService {
  constructor(private readonly repository: DepartmentRepository) {}

  async findAll(orgId: string): Promise<Department[]> {
    return this.repository.findAll(orgId);
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.repository.findById(id);
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async create(data: Partial<Department>): Promise<Department> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<Department>): Promise<Department> {
    await this.findOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
