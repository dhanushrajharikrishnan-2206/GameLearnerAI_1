import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockUser } from '../data/mockData';
import { User, LoginCredentials, RegisterData } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        const { user, token } = response.data;
        if (token) localStorage.setItem('gamelearn_token', token);
        if (user) localStorage.setItem('gamelearn_user', JSON.stringify(user));
        return { user, token };
      } catch (err: any) {
        console.warn('Real backend login failed, trying fallback...', err);
        if (err.response?.data?.error) {
          throw new Error(err.response.data.error);
        }
        throw err;
      }
    }

    const user = { ...mockUser, email: credentials.email || mockUser.email };
    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('gamelearn_token', token);
    localStorage.setItem('gamelearn_user', JSON.stringify(user));
    return mockDelay({ user, token }, 300);
  },

  register: async (data: RegisterData & { interests?: string[]; skillLevel?: string; learningGoal?: string; dailyGoalMinutes?: number }): Promise<{ user: User; token: string }> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post('/auth/register', data);
        const { user, token } = response.data;
        if (token) localStorage.setItem('gamelearn_token', token);
        if (user) localStorage.setItem('gamelearn_user', JSON.stringify(user));
        return { user, token };
      } catch (err: any) {
        console.warn('Real backend register failed, checking response...', err);
        if (err.response?.data?.error) {
          throw new Error(err.response.data.error);
        }
        throw err;
      }
    }

    const newUser: User = {
      ...mockUser,
      name: data.name,
      email: data.email,
      level: 1,
      xp: 100,
      xpToNextLevel: 500,
      streak: 1,
      longestStreak: 1,
      overallMastery: 10,
      interests: data.interests || ['Programming', 'AI & Machine Learning'],
      skillLevel: (data.skillLevel as any) || 'Beginner'
    };
    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('gamelearn_token', token);
    localStorage.setItem('gamelearn_user', JSON.stringify(newUser));
    return mockDelay({ user: newUser, token }, 350);
  },

  logout: async (): Promise<void> => {
    try {
      if (!USE_MOCK_API) {
        await apiClient.post('/auth/logout');
      }
    } catch (e) {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem('gamelearn_token');
      localStorage.removeItem('gamelearn_user');
    }
  },

  getCurrentSession: async (): Promise<User | null> => {
    const token = localStorage.getItem('gamelearn_token');
    if (token && !USE_MOCK_API) {
      try {
        const response = await apiClient.get('/auth/me');
        if (response.data?.user) {
          localStorage.setItem('gamelearn_user', JSON.stringify(response.data.user));
          return response.data.user;
        }
      } catch (e) {
        console.warn('Could not verify token with backend server, using cached session:', e);
      }
    }

    const savedUser = localStorage.getItem('gamelearn_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return mockUser; // default demo user
  },

  requestPasswordReset: async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
      } catch (err: any) {
        console.warn('Backend forgot-password error', err);
      }
    }
    return mockDelay({
      success: true,
      message: `Password reset instructions sent to ${email}`
    }, 400);
  }
};
