import Cookies from 'js-cookie';
import { DashboardOverview } from '../types/dashboard.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const token = Cookies.get('simovel_token');
    
    const response = await fetch(`${API_URL}/dashboard/overview`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard overview');
    }

    return response.json();
  },
};
