import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockLeaderboard } from '../data/mockData';
import { LeaderboardEntry } from '../types';

export const leaderboardService = {
  getLeaderboard: async (timeframe: 'weekly' | 'monthly' | 'allTime' = 'weekly', scope: 'global' | 'friends' = 'global'): Promise<LeaderboardEntry[]> => {
    if (USE_MOCK_API) {
      let entries = [...mockLeaderboard];
      if (timeframe === 'monthly') {
        entries = entries.map((e) => ({ ...e, xp: Math.round(e.xp * 3.2) }));
      } else if (timeframe === 'allTime') {
        entries = entries.map((e) => ({ ...e, xp: Math.round(e.xp * 7.5) }));
      }
      if (scope === 'friends') {
        entries = entries.filter((_, idx) => idx % 2 === 0 || idx === 3);
      }
      return mockDelay(entries, 250);
    }
    const response = await apiClient.get('/leaderboard', { params: { timeframe, scope } });
    return response.data;
  }
};
