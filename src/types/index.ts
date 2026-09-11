// ==========================================
// USER & AUTH TYPES
// ==========================================
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string; // e.g. "Algorithm Alchemist"
  role?: 'admin' | 'student' | 'user';
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  longestStreak: number;
  coins: number;
  overallMastery: number; // percentage
  learningTimeMinutes: number;
  joinedDate: string;
  learningGoal?: string;
  dailyGoalMinutes?: number;
  interests?: string[];
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

// ==========================================
// GAMIFICATION TYPES
// ==========================================
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  currentProgress: number;
  maxProgress: number;
  rewardXp: number;
  rewardCoins: number;
  isCompleted: boolean;
  actionUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'learning' | 'accuracy' | 'mastery' | 'social';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  title: string;
  level: number;
  xp: number;
  streak: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

// ==========================================
// COURSES & LEARNING ADVENTURE TYPES
// ==========================================
export interface Subject {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  masteryPercentage: number;
  completedLessons: number;
  totalLessons: number;
  isAiRecommended?: boolean;
  difficulty: DifficultyLevel;
  tags: string[];
}

export type AdventureNodeStatus = 'locked' | 'available' | 'current' | 'completed' | 'mastered';

export interface AdventureNode {
  id: string;
  title: string;
  subjectSlug: string;
  worldId: string;
  order: number;
  status: AdventureNodeStatus;
  estimatedTime: string;
  xpReward: number;
  difficulty: DifficultyLevel;
  description: string;
  lessonId?: string;
  quizId?: string;
}

export interface AdventureWorld {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  levelRange: string;
  order: number;
  isUnlocked: boolean;
  nodes: AdventureNode[];
}

export interface LessonContentBlock {
  id: string;
  type: 'text' | 'code' | 'callout' | 'checkpoint';
  title?: string;
  content: string;
  codeLanguage?: string;
  codeSnippet?: string;
  calloutType?: 'tip' | 'info' | 'warning';
  checkpointQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  subjectSlug: string;
  worldTitle: string;
  estimatedMinutes: number;
  xpReward: number;
  difficulty: DifficultyLevel;
  overview: string;
  blocks: LessonContentBlock[];
  associatedQuizId: string;
  nextLessonId?: string;
  prevLessonId?: string;
}

// ==========================================
// ADAPTIVE QUIZ & ASSESSMENT TYPES
// ==========================================
export type QuestionType = 'multiple_choice' | 'true_false' | 'code_analysis';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  topic: string;
  question: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: string[];
  correctAnswer: number; // index of option
  explanation: string;
  hint: string;
  xpValue: number;
}

export interface AdaptiveEngineState {
  currentDifficulty: DifficultyLevel;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  recentAccuracy: number;
  adaptationNotice: string | null;
  difficultyHistory: { questionIndex: number; difficulty: DifficultyLevel }[];
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  subjectSlug: string;
  estimatedMinutes: number;
  baseXp: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSeconds: number;
  xpEarned: number;
  coinsEarned: number;
  difficultyProgression: { questionIndex: number; difficulty: DifficultyLevel }[];
  answersBreakdown: {
    questionId: string;
    questionText: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    difficulty: DifficultyLevel;
    timeTakenSeconds: number;
  }[];
  aiAnalysis: {
    overallSummary: string;
    strengths: string[];
    growthAreas: string[];
    accuracyTrendNote: string;
    responseTimeNote: string;
    recommendedNextStep: {
      title: string;
      reason: string;
      difficulty: DifficultyLevel;
      actionUrl: string;
    };
  };
}

// ==========================================
// SKILL TREE TYPES
// ==========================================
export interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number;
  masteryPercentage: number;
  xp: number;
  prerequisites: string[]; // IDs of required skills
  isUnlocked: boolean;
  isMastered: boolean;
  totalChallenges: number;
  completedChallenges: number;
  icon: string;
}

// ==========================================
// AI RECOMMENDATION TYPES
// ==========================================
export interface AIRecommendation {
  id: string;
  topic: string;
  subject: string;
  priority: 'High Priority' | 'Recommended' | 'Optional';
  difficulty: DifficultyLevel;
  expectedTime: string;
  rewardXp: number;
  reason: string;
  actionUrl: string;
  icon: string;
}

export interface StrengthsWeaknesses {
  strengths: { topic: string; score: number; trend: string }[];
  weaknesses: { topic: string; score: number; trend: string; recommendation: string }[];
}

// ==========================================
// ANALYTICS TYPES
// ==========================================
export interface ActivityDataPoint {
  day: string;
  date: string;
  minutes: number;
  xp: number;
  quizzes: number;
  accuracy: number;
}

export interface TopicMasteryMetric {
  topic: string;
  mastery: number;
  benchmark: number;
}

export interface AnalyticsSummary {
  totalXp: number;
  learningHours: number;
  averageAccuracy: number;
  questionsSolved: number;
  currentStreak: number;
  skillsMastered: number;
  weeklyActivity: ActivityDataPoint[];
  monthlyActivity: ActivityDataPoint[];
  topicMastery: TopicMasteryMetric[];
  difficultyDistribution: { name: string; value: number; color: string }[];
}

// ==========================================
// NOTIFICATIONS
// ==========================================
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'challenge' | 'achievement' | 'level' | 'streak' | 'quiz' | 'leaderboard';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

// ==========================================
// GAME ENGINE TYPES
// ==========================================
export * from './game.types';
