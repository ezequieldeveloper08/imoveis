import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalSchema } from './infrastructure/repositories/proposal.schema';
import { ProposalRepository } from './domain/repositories/proposal.repository';
import { TypeOrmProposalRepository } from './infrastructure/repositories/typeorm-proposal.repository';

import { ProposalService } from './application/services/proposal.service';
import { ProposalController } from './presentation/controllers/proposal.controller';

import { LeadModule } from '../leads/leads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProposalSchema]),
    LeadModule
  ],
  controllers: [ProposalController],
  providers: [
    ProposalService,
    {
      provide: ProposalRepository,
      useClass: TypeOrmProposalRepository,
    },
  ],
  exports: [ProposalRepository, ProposalService],
})
export class ProposalsModule {}
