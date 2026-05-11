import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentRepository } from '../../domain/repositories/department.repository';
import { Department } from '../../domain/entities/department.entity';
import { DepartmentSchema } from './department.schema';

@Injectable()
export class TypeOrmDepartmentRepository implements DepartmentRepository {
  constructor(
    @InjectRepository(DepartmentSchema)
    private readonly repository: Repository<DepartmentSchema>,
  ) {}

  async findAll(orgId: string): Promise<Department[]> {
    const departments = await this.repository.find({ 
      where: { organizationId: orgId },
      relations: ['manager']
    });
    return departments.map(d => new Department({
      ...d,
      manager: d.manager?.name // Map manager object to manager name for frontend compatibility
    }));
  }

  async findById(id: string): Promise<Department | null> {
    const department = await this.repository.findOne({ 
      where: { id },
      relations: ['manager']
    });
    return department ? new Department({
      ...department,
      manager: department.manager?.name
    }) : null;
  }

  async create(data: Partial<Department>): Promise<Department> {
    const { manager, memberCount, ...dbData } = data as any;
    const department = this.repository.create(dbData);
    const saved = await this.repository.save(department) as any;
    return this.findById(saved.id) as Promise<Department>;
  }

  async update(id: string, data: Partial<Department>): Promise<Department> {
    const { manager, memberCount, ...dbData } = data as any;
    await this.repository.update(id, dbData);
    return this.findById(id) as Promise<Department>;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
