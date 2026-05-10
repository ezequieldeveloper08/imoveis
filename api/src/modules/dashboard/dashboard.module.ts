import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/controllers/dashboard.controller';
import { DashboardService } from './application/services/dashboard.service';
import { LeadModule } from '../leads/leads.module';
import { PropertyModule } from '../properties/properties.module';
import { ProposalsModule } from '../proposals/proposals.module';

@Module({
  imports: [
    LeadModule,
    PropertyModule,
    ProposalsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
