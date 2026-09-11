import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockAnalytics } from '../data/mockData';
import { AnalyticsSummary } from '../types';

export const analyticsService = {
  getAnalyticsSummary: async (_timeframe: '7d' | '30d' | '90d' = '7d'): Promise<AnalyticsSummary> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get('/analytics/summary', { params: { timeframe: _timeframe } });
        if (response.data) return response.data;
      } catch (err) {
        console.warn('Analytics API endpoint fallback to cached metrics:', err);
      }
    }
    return mockDelay({ ...mockAnalytics }, 250);
  },

  downloadReport: async (): Promise<{ downloadUrl: string; filename: string }> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get('/analytics/export');
        if (response.data) return response.data;
      } catch (err) {
        console.warn('Analytics export endpoint fallback:', err);
      }
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockAnalytics, null, 2));
    return mockDelay({
      downloadUrl: dataStr,
      filename: `GameLearnAI_Analytics_Report_${new Date().toISOString().slice(0, 10)}.json`
    }, 300);
  }
};
