export interface DashboardStats {
  totalRevenue: number;
  newLeadsCount: number;
  activeProperties: number;
  pipelineValue: number;
}

export interface ConversionData {
  leads: number;
  visits: number;
  proposals: number;
  contracts: number;
}

export interface RevenueMonth {
  month: string;
  value: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  conversion: ConversionData;
  revenueByMonth: RevenueMonth[];
  recentLeads: any[];
}
