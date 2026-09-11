import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockSkillNodes } from '../data/mockData';
import { SkillNode } from '../types';

export const assessmentService = {
  getSkillTree: async (category?: string): Promise<SkillNode[]> => {
    if (USE_MOCK_API) {
      if (category && category !== 'All') {
        return mockDelay(mockSkillNodes.filter((s) => s.category.toLowerCase().includes(category.toLowerCase())), 200);
      }
      return mockDelay([...mockSkillNodes], 250);
    }
    const response = await apiClient.get('/assessments/skills', { params: { category } });
    return response.data;
  },

  unlockSkill: async (skillId: string): Promise<SkillNode> => {
    if (USE_MOCK_API) {
      const target = mockSkillNodes.find((s) => s.id === skillId) || mockSkillNodes[0];
      const updated = { ...target, isUnlocked: true, masteryPercentage: 20 };
      return mockDelay(updated, 250);
    }
    const response = await apiClient.post(`/assessments/skills/${skillId}/unlock`);
    return response.data;
  }
};
