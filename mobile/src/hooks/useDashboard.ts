import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardStats, RegionalData } from '../services/dashboard';

// Hook for dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
  });
};

// Hook for regional data
export const useRegionalData = () => {
  return useQuery({
    queryKey: ['dashboard', 'regional-data'],
    queryFn: () => dashboardService.getRegionalData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for response trends
export const useResponseTrends = (days: number = 30) => {
  return useQuery({
    queryKey: ['dashboard', 'response-trends', days],
    queryFn: () => dashboardService.getResponseTrends(days),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for category distribution
export const useCategoryDistribution = () => {
  return useQuery({
    queryKey: ['dashboard', 'category-distribution'],
    queryFn: () => dashboardService.getCategoryDistribution(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for recent activity
export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity', limit],
    queryFn: () => dashboardService.getRecentActivity(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};