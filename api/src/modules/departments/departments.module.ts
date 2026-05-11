import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentSchema } from './infrastructure/repositories/department.schema';
import { DepartmentService } from './application/services/department.service';
import { DepartmentController } from './presentation/controllers/department.controller';
import { DepartmentRepository } from './domain/repositories/department.repository';
import { TypeOrmDepartmentRepository } from './infrastructure/repositories/typeorm-department.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentSchema])],
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    {
      provide: DepartmentRepository,
      useClass: TypeOrmDepartmentRepository,
    },
  ],
  exports: [DepartmentService],
})
export class DepartmentsModule {}
