import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { Mission, ChatInteractiveAction } from '../types';
import { mockMissions } from '../data/mockData';
import { soundFx } from '../utils/soundEffects';

interface RewardNotification {
  id: string;
  type: 'xp' | 'coins' | 'level' | 'streak' | 'badge';
  title: string;
  amount?: number;
  badgeName?: string;
}

export interface MistakeContextData {
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  topic?: string;
}

interface GamificationContextType {
  missions: Mission[];
  rewardNotifications: RewardNotification[];
  dismissReward: (id: string) => void;
  awardXp: (amount: number, reason?: string) => void;
  awardCoins: (amount: number) => void;
  claimMissionReward: (missionId: string) => void;
  triggerConfetti: () => void;
  isLevelUpModalOpen: boolean;
  closeLevelUpModal: () => void;
  newLevelInfo: { level: number; title: string } | null;

  // Hearts / Lives
  hearts: number;
  maxHearts: number;
  loseHeart: () => boolean; // returns true if learner still has hearts, false if hearts reached 0
  restoreHearts: (amount?: number) => void;
  isHeartsModalOpen: boolean;
  closeHeartsModal: () => void;

  // Combo system
  combo: number;
  maxCombo: number;
  incrementCombo: () => number;
  resetCombo: () => void;

  // Sound system
  isAudioEnabled: boolean;
  toggleAudio: () => boolean;

  // Global Chatbot & Mistake Analysis Bridge
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  activeMistake: MistakeContextData | null;
  askAiAboutMistake: (
    mistakeOrQuestion: MistakeContextData | string,
    userAnswer?: string,
    correctAnswer?: string,
    explanation?: string
  ) => void;
  openChatWithPrompt: (prompt: string, action?: ChatInteractiveAction) => void;
  activeChatAction: ChatInteractiveAction | null;
  clearChatAction: () => void;

  // Aliases for developer convenience
  addXp: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [rewardNotifications, setRewardNotifications] = useState<RewardNotification[]>([]);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [newLevelInfo, setNewLevelInfo] = useState<{ level: number; title: string } | null>(null);

  // Hearts state (default 5)
  const maxHearts = 5;
  const [hearts, setHearts] = useState<number>(() => {
    const saved = localStorage.getItem('gamelearn_hearts');
    return saved !== null ? Number(saved) : 5;
  });
  const [isHeartsModalOpen, setIsHeartsModalOpen] = useState(false);

  // Combo state
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);

  // Audio state
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(soundFx.getAudioEnabled());

  // Global Chat Companion State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeMistake, setActiveMistake] = useState<MistakeContextData | null>(null);
  const [activeChatAction, setActiveChatAction] = useState<ChatInteractiveAction | null>(null);

  useEffect(() => {
    localStorage.setItem('gamelearn_hearts', String(hearts));
  }, [hearts]);

  const toggleAudio = () => {
    const next = soundFx.toggleAudio();
    setIsAudioEnabled(next);
    return next;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti error', e);
    }
  };

  const dismissReward = (id: string) => {
    setRewardNotifications((prev) => prev.filter((r) => r.id !== id));
  };

  const awardXp = (amount: number, reason: string = 'Challenge Completed') => {
    if (!user) return;

    // Apply combo bonus multiplier
    const multiplier = combo >= 5 ? 2.0 : combo >= 3 ? 1.5 : combo >= 2 ? 1.2 : 1.0;
    const finalAmount = Math.round(amount * multiplier);

    soundFx.playXp();

    const newXp = user.xp + finalAmount;
    let newLevel = user.level;
    let leveledUp = false;
    let newXpToNextLevel = user.xpToNextLevel;

    if (newXp >= user.xpToNextLevel) {
      newLevel += 1;
      newXpToNextLevel += 2500;
      leveledUp = true;
      setNewLevelInfo({
        level: newLevel,
        title: newLevel >= 15 ? 'Grandmaster Architect' : newLevel >= 13 ? 'Neural Vanguard' : 'Algorithm Alchemist'
      });
      setIsLevelUpModalOpen(true);
      triggerConfetti();
      soundFx.playLevelUpSound();
    }

    updateUser({
      xp: newXp,
      level: newLevel,
      xpToNextLevel: newXpToNextLevel
    });

    const notifId = 'reward_' + Date.now();
    setRewardNotifications((prev) => [
      ...prev,
      {
        id: notifId,
        type: 'xp',
        title: combo >= 2 ? `${reason} (🔥 Combo ×${multiplier})` : reason,
        amount: finalAmount
      }
    ]);

    setTimeout(() => {
      dismissReward(notifId);
    }, 3500);
  };

  const awardCoins = (amount: number) => {
    if (!user) return;
    const newCoins = (user.coins || 0) + amount;
    updateUser({ coins: newCoins });
    const notifId = 'reward_coin_' + Date.now();
    setRewardNotifications((prev) => [
      ...prev,
      {
        id: notifId,
        type: 'coins',
        title: 'Coins Earned',
        amount
      }
    ]);
    setTimeout(() => {
      dismissReward(notifId);
    }, 3500);
  };

  const claimMissionReward = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || !mission.isCompleted) return;

    awardXp(mission.rewardXp, `Mission: ${mission.title}`);
    awardCoins(mission.rewardCoins);

    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? { ...m, currentProgress: m.maxProgress, isCompleted: true }
          : m
      )
    );
  };

  // Hearts handlers
  const loseHeart = (): boolean => {
    soundFx.playIncorrect();
    const next = Math.max(0, hearts - 1);
    setHearts(next);
    resetCombo();

    if (next === 0) {
      setIsHeartsModalOpen(true);
      return false;
    }
    return true;
  };

  const restoreHearts = (amount: number = 5) => {
    setHearts(Math.min(maxHearts, hearts + amount));
    setIsHeartsModalOpen(false);
  };

  const closeHeartsModal = () => {
    setIsHeartsModalOpen(false);
  };

  // Combo handlers
  const incrementCombo = (): number => {
    const next = combo + 1;
    setCombo(next);
    if (next > maxCombo) {
      setMaxCombo(next);
    }
    soundFx.playCorrect();
    if (next >= 2) {
      soundFx.playCombo(next);
    }
    return next;
  };

  const resetCombo = () => {
    setCombo(0);
  };

  // Chatbot & Mistake Bridge
  const askAiAboutMistake = (
    mistakeOrQuestion: MistakeContextData | string,
    userAnswer?: string,
    correctAnswer?: string,
    explanation?: string
  ) => {
    if (typeof mistakeOrQuestion === 'string') {
      setActiveMistake({
        questionText: mistakeOrQuestion,
        userAnswer: userAnswer || '',
        correctAnswer: correctAnswer || '',
        explanation: explanation || ''
      });
    } else {
      setActiveMistake(mistakeOrQuestion);
    }
    setIsChatOpen(true);
  };

  const openChatWithPrompt = (prompt: string, action?: ChatInteractiveAction) => {
    setIsChatOpen(true);
    if (action) {
      setActiveChatAction(action);
    }
  };

  const clearChatAction = () => {
    setActiveChatAction(null);
  };

  const closeLevelUpModal = () => {
    setIsLevelUpModalOpen(false);
  };

  return (
    <GamificationContext.Provider
      value={{
        missions,
        rewardNotifications,
        dismissReward,
        awardXp,
        awardCoins,
        claimMissionReward,
        triggerConfetti,
        isLevelUpModalOpen,
        closeLevelUpModal,
        newLevelInfo,

        // Hearts
        hearts,
        maxHearts,
        loseHeart,
        restoreHearts,
        isHeartsModalOpen,
        closeHeartsModal,

        // Combo
        combo,
        maxCombo,
        incrementCombo,
        resetCombo,

        // Audio
        isAudioEnabled,
        toggleAudio,

        // Chatbot & Mistakes
        isChatOpen,
        setIsChatOpen,
        activeMistake,
        askAiAboutMistake,
        openChatWithPrompt,
        activeChatAction,
        clearChatAction,

        // Aliases
        addXp: awardXp,
        addCoins: awardCoins
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
