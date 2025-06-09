
import { useState, useEffect } from 'react';
import { useAuth } from '@/context';
import { getRoomStatusSummary } from '@/context/rooms/roomStatusHandlers';
import { fetchRequests } from '@/context/requests/requestHandlers';
import type { Request } from '@/context/requests/requestHandlers';

export interface AnalyticsData {
  roomSummary: {
    total: number;
    vacant: number;
    occupied: number;
    maintenance: number;
    cleaning: number;
  };
  requests: Request[];
  isLoading: boolean;
  error: string | null;
}

export interface MetricsData {
  occupancyRate: number;
  totalRequests: number;
  resolvedRequests: number;
  pendingRequests: number;
  avgResponseTime: number;
  resolutionRate: number;
  revenueEstimate: number;
}

export const useAnalytics = (dateRange: string = '7d') => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    roomSummary: { total: 0, vacant: 0, occupied: 0, maintenance: 0, cleaning: 0 },
    requests: [],
    isLoading: true,
    error: null
  });

  const [metrics, setMetrics] = useState<MetricsData>({
    occupancyRate: 0,
    totalRequests: 0,
    resolvedRequests: 0,
    pendingRequests: 0,
    avgResponseTime: 0,
    resolutionRate: 0,
    revenueEstimate: 0
  });

  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!user?.hotelId) return;

      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        const [roomSummary, requests] = await Promise.all([
          getRoomStatusSummary(user.hotelId),
          fetchRequests(user.hotelId)
        ]);

        const newData = {
          roomSummary,
          requests,
          isLoading: false,
          error: null
        };

        setData(newData);

        // Calculate metrics
        const occupancyRate = roomSummary.total > 0 ? 
          Math.round((roomSummary.occupied / roomSummary.total) * 100) : 0;
        
        const resolvedRequests = requests.filter(r => r.status === 'resolved').length;
        const pendingRequests = requests.filter(r => r.status === 'pending').length;
        const resolutionRate = requests.length > 0 ? 
          Math.round((resolvedRequests / requests.length) * 100) : 0;

        setMetrics({
          occupancyRate,
          totalRequests: requests.length,
          resolvedRequests,
          pendingRequests,
          avgResponseTime: 14.5, // Mock data
          resolutionRate,
          revenueEstimate: roomSummary.occupied * 150 // $150 per occupied room
        });

      } catch (error) {
        console.error('Error loading analytics data:', error);
        setData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to load analytics data' 
        }));
      }
    };

    loadAnalyticsData();
  }, [user?.hotelId, dateRange]);

  const refetch = () => {
    if (user?.hotelId) {
      setData(prev => ({ ...prev, isLoading: true }));
      // Re-trigger the effect
      setData(prev => ({ ...prev }));
    }
  };

  return {
    data,
    metrics,
    refetch
  };
};
