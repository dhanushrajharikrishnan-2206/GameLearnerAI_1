import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockSubjects, mockAdventureWorlds } from '../data/mockData';
import { Subject, AdventureWorld } from '../types';

export const courseService = {
  getSubjects: async (): Promise<Subject[]> => {
    if (USE_MOCK_API) {
      return mockDelay([...mockSubjects], 250);
    }
    const response = await apiClient.get('/courses/subjects');
    return response.data;
  },

  getSubjectBySlug: async (slug: string): Promise<Subject | null> => {
    if (USE_MOCK_API) {
      const found = mockSubjects.find((s) => s.slug === slug);
      return mockDelay(found || mockSubjects[0], 200);
    }
    const response = await apiClient.get(`/courses/subjects/${slug}`);
    return response.data;
  },

  getAdventureWorlds: async (_subjectSlug: string = 'python'): Promise<AdventureWorld[]> => {
    if (USE_MOCK_API) {
      return mockDelay([...mockAdventureWorlds], 300);
    }
    const response = await apiClient.get(`/courses/${_subjectSlug}/worlds`);
    return response.data;
  }
};
