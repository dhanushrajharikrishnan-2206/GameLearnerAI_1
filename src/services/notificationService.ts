import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockNotifications } from '../data/mockData';
import { AppNotification } from '../types';

export const notificationService = {
  getNotifications: async (): Promise<AppNotification[]> => {
    if (USE_MOCK_API) {
      return mockDelay([...mockNotifications], 200);
    }
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    if (USE_MOCK_API) {
      const target = mockNotifications.find((n) => n.id === notificationId);
      if (target) target.isRead = true;
      return mockDelay(undefined, 100);
    }
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    if (USE_MOCK_API) {
      mockNotifications.forEach((n) => (n.isRead = true));
      return mockDelay(undefined, 150);
    }
    await apiClient.post('/notifications/read-all');
  }
};
