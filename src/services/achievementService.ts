import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockAchievements } from '../data/mockData';
import { Achievement } from '../types';

export const achievementService = {
  getAchievements: async (): Promise<Achievement[]> => {
    if (USE_MOCK_API) {
      return mockDelay([...mockAchievements], 250);
    }
    const response = await apiClient.get('/achievements');
    return response.data;
  },

  claimBadge: async (achievementId: string): Promise<{ success: boolean; xpAwarded: number }> => {
    if (USE_MOCK_API) {
      const ach = mockAchievements.find((a) => a.id === achievementId);
      return mockDelay({
        success: true,
        xpAwarded: ach ? ach.xpReward : 100
      }, 300);
    }
    const response = await apiClient.post(`/achievements/${achievementId}/claim`);
    return response.data;
  }
};
