import { apiService } from './api';

// Types
export interface DashboardStats {
  activeQuestionnaires: number;
  totalResponses: number;
  completedResponses: number;
  pendingInvitations: number;
  totalUsers: number;
  completionRate: number;
}

export interface RegionalData {
  region: string;
  totalResponses: number;
  completedResponses: number;
  completionRate: number;
}

export interface ResponseTrend {
  date: string;
  responseCount: number;
  completedCount: number;
}

export interface CategoryDistribution {
  category: string;
  questionnaireCount: number;
  responseCount: number;
  completedResponseCount: number;
}

export interface RecentActivity {
  type: 'response' | 'questionnaire';
  id: string;
  title: string;
  userName: string;
  status: string;
  timestamp: string;
  region?: string;
}

// Dashboard Service
class DashboardService {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    return apiService.get<DashboardStats>('/dashboard/stats');
  }

  // Get regional data breakdown
  async getRegionalData(): Promise<RegionalData[]> {
    return apiService.get<RegionalData[]>('/dashboard/regional-data');
  }

  // Get response trends over time
  async getResponseTrends(days: number = 30): Promise<ResponseTrend[]> {
    return apiService.get<ResponseTrend[]>(`/dashboard/response-trends?days=${days}`);
  }

  // Get category distribution
  async getCategoryDistribution(): Promise<CategoryDistribution[]> {
    return apiService.get<CategoryDistribution[]>('/dashboard/category-distribution');
  }

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    return apiService.get<RecentActivity[]>(`/dashboard/recent-activity?limit=${limit}`);
  }
}

export const dashboardService = new DashboardService();