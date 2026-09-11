import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockAchievements } from '../data/mockData';
import { Achievement } from '../types';

export const achievementService = {
  getAchievements: async (): Promise<Achievement[]> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get('/achievements');
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
      } catch (err) {
        console.warn('Backend /achievements error, using fallback:', err);
      }
    }
    return mockDelay([...mockAchievements], 250);
  },

  claimBadge: async (achievementId: string): Promise<{ success: boolean; xpAwarded: number }> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post(`/achievements/${achievementId}/claim`);
        if (response.data) return response.data;
      } catch (err) {
        console.warn(`Backend /achievements/${achievementId}/claim error, using fallback:`, err);
      }
    }
    const ach = mockAchievements.find((a) => a.id === achievementId);
    return mockDelay({
      success: true,
      xpAwarded: ach ? ach.xpReward : 100
    }, 300);
  }
};
