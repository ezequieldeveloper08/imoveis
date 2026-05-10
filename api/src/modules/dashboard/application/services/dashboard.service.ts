import { Injectable } from '@nestjs/common';
import { LeadRepository } from '../../../leads/domain/repositories/lead.repository';
import { PropertyRepository } from '../../../properties/domain/repositories/property.repository';
import { ProposalRepository } from '../../../proposals/domain/repositories/proposal.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly propertyRepository: PropertyRepository,
    private readonly proposalRepository: ProposalRepository,
  ) {}

  async getOverview(orgId: string) {
    const [leads, properties, proposals] = await Promise.all([
      this.leadRepository.findByOrganization(orgId),
      this.propertyRepository.findByOrganization(orgId),
      this.proposalRepository.findByOrganization(orgId),
    ]);

    // 1. Stats Cards
    const activeProperties = properties.filter(p => p.status === 'AVAILABLE').length;
    const newLeadsCount = leads.filter(l => l.status === 'new').length;
    
    const totalRevenue = proposals
      .filter(p => p.status === 'ACCEPTED')
      .reduce((acc, p) => acc + Number(p.value), 0);
    
    const pipelineValue = proposals
      .filter(p => p.status === 'PENDING')
      .reduce((acc, p) => acc + Number(p.value), 0);

    // 2. Conversion Data
    const conversion = {
      leads: leads.length,
      visits: leads.filter(l => l.status === 'visited').length,
      proposals: proposals.length,
      contracts: proposals.filter(p => p.status === 'ACCEPTED').length,
    };

    // 3. Revenue Chart (simplified for now, grouped by month)
    const revenueByMonth = this.groupByMonth(
      proposals.filter(p => p.status === 'ACCEPTED')
    );

    // 4. Recent Leads
    const recentLeads = leads
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      stats: {
        totalRevenue,
        newLeadsCount,
        activeProperties,
        pipelineValue,
      },
      conversion,
      revenueByMonth,
      recentLeads,
    };
  }

  private groupByMonth(proposals: any[]) {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const last6Months: { month: string; value: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      last6Months.push({
        month: months[monthIdx],
        value: 0,
      });
    }

    proposals.forEach(p => {
      const pMonth = new Date(p.createdAt).getMonth();
      const pMonthName = months[pMonth];
      const monthData = last6Months.find(m => m.month === pMonthName);
      if (monthData) {
        monthData.value += Number(p.value);
      }
    });

    return last6Months;
  }
}
