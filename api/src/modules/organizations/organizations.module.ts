import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from './application/services/organization.service';
import { OrganizationController } from './presentation/controllers/organization.controller';
import { OrganizationRepository } from './domain/repositories/organization.repository';
import { TypeOrmOrganizationRepository } from './infrastructure/repositories/typeorm-organization.repository';
import { OrganizationSchema } from './infrastructure/repositories/organization.schema';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationSchema])],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    {
      provide: OrganizationRepository,
      useClass: TypeOrmOrganizationRepository,
    },
  ],
  exports: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
