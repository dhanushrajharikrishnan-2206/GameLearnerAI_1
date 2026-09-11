import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockSubjects, mockAdventureWorlds } from '../data/mockData';
import { Subject, AdventureWorld } from '../types';

export const courseService = {
  getSubjects: async (): Promise<Subject[]> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get('/courses/subjects');
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
      } catch (err) {
        console.warn('Backend /courses/subjects error, falling back to curriculum:', err);
      }
    }
    return mockDelay([...mockSubjects], 250);
  },

  getSubjectBySlug: async (slug: string): Promise<Subject | null> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get(`/courses/subjects/${slug}`);
        if (response.data) return response.data;
      } catch (err) {
        console.warn(`Backend /courses/subjects/${slug} error, falling back:`, err);
      }
    }
    const found = mockSubjects.find((s) => s.slug === slug);
    return mockDelay(found || mockSubjects[0], 200);
  },

  getAdventureWorlds: async (_subjectSlug: string = 'python'): Promise<AdventureWorld[]> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get(`/courses/${_subjectSlug}/worlds`);
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
      } catch (err) {
        console.warn(`Backend /courses/${_subjectSlug}/worlds error, falling back:`, err);
      }
    }
    return mockDelay([...mockAdventureWorlds], 300);
  }
};
