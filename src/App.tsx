import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';

import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { LearningAdventurePage } from './pages/learn/LearningAdventurePage';
import { SubjectExplorerPage } from './pages/learn/SubjectExplorerPage';
import { LessonPage } from './pages/learn/LessonPage';
import { AdaptiveQuizPage } from './pages/quiz/AdaptiveQuizPage';
import { QuizResultPage } from './pages/quiz/QuizResultPage';
import { SkillTreePage } from './pages/skilltree/SkillTreePage';
import { AchievementsPage } from './pages/achievements/AchievementsPage';
import { LeaderboardPage } from './pages/leaderboard/LeaderboardPage';
import { RecommendationsPage } from './pages/recommendations/RecommendationsPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { DatabaseViewerPage } from './pages/database/DatabaseViewerPage';

// Interactive Games & 5-Minute Adventure
import { AdventureSessionRunner } from './games/AdventureSessionRunner';
import { GamePlayerPage } from './pages/games/GamePlayerPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GamificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes inside Main App Layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/learn" element={<LearningAdventurePage />} />
                <Route path="/learn/explore" element={<SubjectExplorerPage />} />
                <Route path="/lesson/:lessonId" element={<LessonPage />} />
                <Route path="/quiz/:quizId" element={<AdaptiveQuizPage />} />
                <Route path="/quiz/:quizId/result" element={<QuizResultPage />} />
                <Route path="/skill-tree" element={<SkillTreePage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/database" element={<DatabaseViewerPage />} />

                {/* Game Engine Routes */}
                <Route path="/adventure" element={<AdventureSessionRunner />} />
                <Route path="/play/:gameId" element={<GamePlayerPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </GamificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
