import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockRecommendations, mockStrengthsWeaknesses } from '../data/mockData';
import { AIRecommendation, StrengthsWeaknesses } from '../types';

export const recommendationService = {
  getRecommendations: async (): Promise<AIRecommendation[]> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get('/recommendations');
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
      } catch (err) {
        console.warn('Backend /recommendations error, using fallback:', err);
      }
    }
    return mockDelay([...mockRecommendations], 250);
  },

  getStrengthsAndWeaknesses: async (): Promise<StrengthsWeaknesses> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get('/recommendations/diagnostics');
        if (response.data && response.data.strengths) {
          return response.data;
        }
      } catch (err) {
        console.warn('Backend /recommendations/diagnostics error, using fallback:', err);
      }
    }
    return mockDelay({ ...mockStrengthsWeaknesses }, 250);
  },

  generateCustomPath: async (goal: string): Promise<{ pathId: string; topics: string[] }> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post('/recommendations/generate-path', { goal });
        if (response.data && response.data.topics) {
          return response.data;
        }
      } catch (err) {
        console.warn('Backend /recommendations/generate-path error, using fallback:', err);
      }
    }
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
};
