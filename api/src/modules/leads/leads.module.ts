import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadService } from './application/services/lead.service';
import { LeadController } from './presentation/controllers/lead.controller';
import { LeadRepository } from './domain/repositories/lead.repository';
import { TypeOrmLeadRepository } from './infrastructure/repositories/typeorm-lead.repository';
import { LeadSchema } from './infrastructure/repositories/lead.schema';

import { ContactModule } from '../contacts/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeadSchema]),
    ContactModule,
  ],
  controllers: [LeadController],
  providers: [
    LeadService,
    {
      provide: LeadRepository,
      useClass: TypeOrmLeadRepository,
    },
  ],
  exports: [LeadService, LeadRepository],
})
export class LeadModule {}
