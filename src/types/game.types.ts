import { DifficultyLevel } from './index';

export type GameType =
  | 'quick_choice'
  | 'match_connect'
  | 'sort_logic'
  | 'code_builder'
  | 'debug_detective'
  | 'memory_match'
  | 'fill_gap'
  | 'speed_round'
  | 'boss_battle';

export interface BaseGameChallenge {
  id: string;
  type: GameType;
  title: string;
  topic: string;
  difficulty: DifficultyLevel;
  xpReward: number;
  timeLimitSeconds?: number;
  explanation: string;
  hint: string;
}

// 1. Quick Choice
export interface QuickChoiceChallenge extends BaseGameChallenge {
  type: 'quick_choice';
  question: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: string[];
  correctAnswerIndex: number;
}

// 2. Match & Connect
export interface MatchItem {
  id: string;
  left: string;
  right: string;
}

export interface MatchConnectChallenge extends BaseGameChallenge {
  type: 'match_connect';
  instruction: string;
  pairs: MatchItem[];
}

// 3. Sort the Logic
export interface SortLogicStep {
  id: string;
  label: string;
  order: number;
}

export interface SortLogicChallenge extends BaseGameChallenge {
  type: 'sort_logic';
  instruction: string;
  steps: SortLogicStep[];
}

// 4. Code Builder
export interface CodeBlockToken {
  id: string;
  code: string;
  correctSlot: number;
}

export interface CodeBuilderChallenge extends BaseGameChallenge {
  type: 'code_builder';
  instruction: string;
  expectedOutput: string;
  template: string; // code with blanks
  availableTokens: CodeBlockToken[];
}

// 5. Debug Detective
export interface DebugLine {
  lineNumber: number;
  code: string;
  isBug: boolean;
  bugExplanation?: string;
}

export interface DebugDetectiveChallenge extends BaseGameChallenge {
  type: 'debug_detective';
  instruction: string;
  codeLines: DebugLine[];
  bugDescription: string;
  fixOptions: string[];
  correctFixIndex: number;
}

// 6. Memory Match
export interface MemoryCard {
  id: string;
  matchId: string;
  content: string;
  type: 'concept' | 'definition';
}

export interface MemoryMatchChallenge extends BaseGameChallenge {
  type: 'memory_match';
  instruction: string;
  cards: MemoryCard[];
}

// 7. Fill the Gap
export interface GapItem {
  id: string;
  textBefore: string;
  correctAnswer: string;
  options: string[];
  textAfter: string;
}

export interface FillGapChallenge extends BaseGameChallenge {
  type: 'fill_gap';
  instruction: string;
  codeSnippet: string;
  gaps: GapItem[];
}

// 8. Speed Round
export interface SpeedRoundItem {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  xp: number;
}

export interface SpeedRoundChallenge extends BaseGameChallenge {
  type: 'speed_round';
  durationSeconds: number;
  items: SpeedRoundItem[];
}

// 9. Boss Battle
export interface BossBattleChallenge extends BaseGameChallenge {
  type: 'boss_battle';
  bossName: string;
  bossTitle: string;
  bossAvatar: string;
  bossMaxHp: number;
  phases: {
    question: string;
    codeSnippet?: string;
    options: string[];
    correctIndex: number;
    damage: number; // damage dealt to boss
    difficulty: DifficultyLevel;
    explanation: string;
  }[];
}

export type AnyGameChallenge =
  | QuickChoiceChallenge
  | MatchConnectChallenge
  | SortLogicChallenge
  | CodeBuilderChallenge
  | DebugDetectiveChallenge
  | MemoryMatchChallenge
  | FillGapChallenge
  | SpeedRoundChallenge
  | BossBattleChallenge;

// Game Session & Stats
export interface GameResult {
  challengeId: string;
  gameType: GameType;
  isSuccess: boolean;
  score: number;
  maxScore: number;
  xpEarned: number;
  coinsEarned: number;
  timeSpentSeconds: number;
  accuracy: number;
  maxCombo: number;
  heartsRemaining: number;
  mistakes?: {
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
}

// 5-Minute Adventure Session
export interface AdventureSession {
  sessionId: string;
  title: string;
  topic: string;
  totalChallenges: number;
  challenges: AnyGameChallenge[];
  totalExpectedXp: number;
  bossChallenge: BossBattleChallenge;
}

// Chat Interactive Action
export interface ChatInteractiveAction {
  type: 'launch_game' | 'quiz_question' | 'socratic_prompt';
  gameId?: string;
  gameType?: GameType;
  label?: string;
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    xp: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: ChatInteractiveAction;
  mode?: 'tutor' | 'hint' | 'practice' | 'quiz' | 'review' | 'motivation';
  isSocratic?: boolean;
}
