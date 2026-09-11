import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { mockUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBackendConnected: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  loginAsAdminDemo: () => Promise<void>;
  register: (data: RegisterData & { interests?: string[]; skillLevel?: string; learningGoal?: string; dailyGoalMinutes?: number }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionUser = await authService.getCurrentSession();
        setUser(sessionUser);
        setIsBackendConnected(true);
      } catch (err) {
        console.warn('Session init error, using offline cached user:', err);
        setIsBackendConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(credentials);
      setUser(loggedInUser);
      setIsBackendConnected(true);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setIsLoading(true);
    try {
      // Authenticate with seeded SQLite database demo account
      const { user: demoStudent } = await authService.login({
        email: 'alex@example.com',
        password: 'password123'
      });
      setUser(demoStudent);
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend demo login unreachable, falling back to local demo profile:', err);
      localStorage.setItem('gamelearn_user', JSON.stringify(mockUser));
      localStorage.setItem('gamelearn_token', 'demo_token_kishore');
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdminDemo = async () => {
    setIsLoading(true);
    try {
      // Authenticate with seeded SQLite database admin account
      const { user: demoAdmin } = await authService.login({
        email: 'admin@gamelearn.ai',
        password: 'admin123'
      });
      setUser(demoAdmin);
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend admin demo login unreachable, falling back to mock admin:', err);
      const adminFallback: User = {
        ...mockUser,
        id: 'demo-admin-sarah-001',
        name: 'Sarah Jenkins (Admin)',
        email: 'admin@gamelearn.ai',
        role: 'admin',
        title: 'System Administrator',
        level: 50,
        xp: 99999
      };
      localStorage.setItem('gamelearn_user', JSON.stringify(adminFallback));
      localStorage.setItem('gamelearn_token', 'demo_admin_token_2026');
      setUser(adminFallback);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData & { interests?: string[]; skillLevel?: string; learningGoal?: string; dailyGoalMinutes?: number }) => {
    setIsLoading(true);
    try {
      const { user: registeredUser } = await authService.register(data);
      setUser(registeredUser);
      setIsBackendConnected(true);
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('gamelearn_user', JSON.stringify(updated));

    // Asynchronously synchronize updates to the backend SQLite database
    userService.updateProfile(updates).catch((err) => {
      console.warn('Failed to persist profile update to database:', err);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isBackendConnected,
        login,
        loginAsDemo,
        loginAsAdminDemo,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
