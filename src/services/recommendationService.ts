import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockRecommendations, mockStrengthsWeaknesses } from '../data/mockData';
import { AIRecommendation, StrengthsWeaknesses } from '../types';

export const recommendationService = {
  getRecommendations: async (): Promise<AIRecommendation[]> => {
    if (USE_MOCK_API) {
      return mockDelay([...mockRecommendations], 250);
    }
    const response = await apiClient.get('/recommendations');
    return response.data;
  },

  getStrengthsAndWeaknesses: async (): Promise<StrengthsWeaknesses> => {
    if (USE_MOCK_API) {
      return mockDelay({ ...mockStrengthsWeaknesses }, 250);
    }
    const response = await apiClient.get('/recommendations/diagnostics');
    return response.data;
  },

  generateCustomPath: async (goal: string): Promise<{ pathId: string; topics: string[] }> => {
    if (USE_MOCK_API) {
      return mockDelay({
        pathId: 'path_ai_adaptive_' + Date.now(),
        topics: [
          'Python Functions & Closures',
          'Call Stack & Recursive Patterns',
          'Divide & Conquer Paradigms',
          'Dynamic Programming & Memoization',
          'Algorithmic Complexity & Profiling'
        ]
      }, 700);
    }
    const response = await apiClient.post('/recommendations/generate-path', { goal });
    return response.data;
  }
};
