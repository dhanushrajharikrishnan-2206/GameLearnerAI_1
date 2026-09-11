import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockUser } from '../data/mockData';
import { User } from '../types';

export const userService = {
  getUserProfile: async (): Promise<User> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get('/user/profile');
        if (response.data) {
          localStorage.setItem('gamelearn_user', JSON.stringify(response.data));
          return response.data;
        }
      } catch (err) {
        console.warn('Backend getUserProfile failed, falling back to cached user', err);
      }
    }

    const saved = localStorage.getItem('gamelearn_user');
    const user = saved ? JSON.parse(saved) : mockUser;
    return mockDelay(user, 200);
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.put('/user/profile', updates);
        if (response.data) {
          localStorage.setItem('gamelearn_user', JSON.stringify(response.data));
          return response.data;
        }
      } catch (err) {
        console.warn('Backend updateProfile failed, updating local copy', err);
      }
    }

    const saved = localStorage.getItem('gamelearn_user');
    const currentUser = saved ? JSON.parse(saved) : mockUser;
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('gamelearn_user', JSON.stringify(updatedUser));
    return mockDelay(updatedUser, 250);
  },

  addXp: async (amount: number): Promise<{ newXp: number; newLevel: number; leveledUp: boolean }> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post('/user/xp', { amount });
        if (response.data) {
          const saved = localStorage.getItem('gamelearn_user');
          if (saved) {
            const current: User = JSON.parse(saved);
            const updated = {
              ...current,
              xp: response.data.newXp,
              level: response.data.newLevel,
              xpToNextLevel: response.data.xpToNextLevel || current.xpToNextLevel
            };
            localStorage.setItem('gamelearn_user', JSON.stringify(updated));
          }
          return response.data;
        }
      } catch (err) {
        console.warn('Backend addXp failed, fallback to local calculation', err);
      }
    }

    const saved = localStorage.getItem('gamelearn_user');
    const currentUser: User = saved ? JSON.parse(saved) : mockUser;
    const newXp = currentUser.xp + amount;
    let newLevel = currentUser.level;
    let leveledUp = false;

    if (newXp >= currentUser.xpToNextLevel) {
      newLevel += 1;
      leveledUp = true;
    }

    const updatedUser = {
      ...currentUser,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: leveledUp ? currentUser.xpToNextLevel + 2500 : currentUser.xpToNextLevel
    };
    localStorage.setItem('gamelearn_user', JSON.stringify(updatedUser));
    return mockDelay({ newXp, newLevel, leveledUp }, 200);
  },

  saveTopic: async (topicData: {
    topicId: string;
    topicTitle: string;
    category?: string;
    status?: string;
    score?: number;
  }) => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post('/user/topics', topicData);
        return response.data;
      } catch (err) {
        console.warn('Failed to save topic in database', err);
      }
    }
    return { success: true };
  },

  getUserTopics: async () => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get('/user/topics');
        return response.data;
      } catch (err) {
        console.warn('Failed to fetch user topics from database', err);
      }
    }
    return { chosenInterests: [], completedTopics: [] };
  },

  recordGameSession: async (sessionData: {
    gameType: string;
    score: number;
    accuracy: number;
    xpEarned: number;
    coinsEarned: number;
  }) => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post('/user/games', sessionData);
        return response.data;
      } catch (err) {
        console.warn('Failed to record game session to database', err);
      }
    }
    return { success: true };
  }
};
