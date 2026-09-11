import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Flame, 
  CheckCircle2, 
  Compass, 
  Bot, 
  Zap, 
  Coins, 
  Clock, 
  Target,
  Swords
} from 'lucide-react';
import { AnyGameChallenge, AdventureSession, GameResult } from '../types/game.types';
import { gameService } from '../services/gameService';
import { useGamification } from '../context/GamificationContext';
import { soundFx } from '../utils/soundEffects';

// Game Components
import { QuickChoiceGame } from './QuickChoiceGame';
import { MatchConnectGame } from './MatchConnectGame';
import { SortLogicGame } from './SortLogicGame';
import { CodeBuilderGame } from './CodeBuilderGame';
import { DebugDetectiveGame } from './DebugDetectiveGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { FillGapGame } from './FillGapGame';
import { SpeedRoundGame } from './SpeedRoundGame';
import { BossBattleGame } from './BossBattleGame';

export const AdventureSessionRunner: React.FC = () => {
  const navigate = useNavigate();
  const { hearts, combo, addXp, addCoins } = useGamification();

  const [session, setSession] = useState<AdventureSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionResults, setSessionResults] = useState<GameResult[]>([]);
  const [totalSessionXp, setTotalSessionXp] = useState<number>(0);
  const [totalSessionCoins, setTotalSessionCoins] = useState<number>(0);
  const [adaptiveMessage, setAdaptiveMessage] = useState<string | null>(null);
  const [sessionStartTime] = useState<number>(Date.now());

  // Load session
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const s = await gameService.createAdventureSession('Recursion & Algorithms');
        setSession(s);
      } catch (err) {
        console.error('Failed to create adventure session', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // All challenges combined: regular challenges + boss challenge
  const allChallenges: AnyGameChallenge[] = session 
    ? [...session.challenges, session.bossChallenge] 
    : [];

  const currentChallenge = allChallenges[currentIndex];

  const handleChallengeComplete = (result: GameResult) => {
    setSessionResults(prev => [...prev, result]);
    setTotalSessionXp(prev => prev + result.xpEarned);
    setTotalSessionCoins(prev => prev + result.coinsEarned);

    // Adaptive difficulty notification
    if (result.accuracy >= 80) {
      setAdaptiveMessage('🤖 AI ADAPTIVE ENGINE: High accuracy detected! Increasing challenge difficulty.');
    } else if (result.accuracy < 50) {
      setAdaptiveMessage('🤖 AI ADAPTIVE ENGINE: Reinforced fundamentals mode activated.');
    }

    // Advance to next challenge or finish
    if (currentIndex + 1 < allChallenges.length) {
      setTimeout(() => {
        setAdaptiveMessage(null);
        setCurrentIndex(prev => prev + 1);
      }, 1200);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
        soundFx.playBossDefeated();
      }, 1000);
    }
  };

  const handleMiniGameComplete = (isCorrect: boolean, xpEarned: number) => {
    handleChallengeComplete({
      challengeId: currentChallenge?.id || 'game',
      gameType: currentChallenge?.type || 'quick_choice',
      isSuccess: isCorrect,
      score: isCorrect ? 100 : 0,
      maxScore: 100,
      xpEarned,
      coinsEarned: isCorrect ? 15 : 5,
      timeSpentSeconds: 30,
      accuracy: isCorrect ? 100 : 0,
      maxCombo: combo,
      heartsRemaining: hearts,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 mb-4 shadow-xl shadow-indigo-500/30"
        >
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <Compass className="w-8 h-8 text-indigo-400" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">Generating 5-Minute Adventure...</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Analyzing your weak spots, streak momentum, and algorithmic readiness.
        </p>
      </div>
    );
  }

  if (!session || !currentChallenge) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <p className="text-slate-400 mb-4">Unable to start adventure session.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculate session metrics
  const totalTimeSpent = Math.round((Date.now() - sessionStartTime) / 1000);
  const avgAccuracy = sessionResults.length > 0
    ? Math.round(sessionResults.reduce((acc, r) => acc + r.accuracy, 0) / sessionResults.length)
    : 85;

  return (
    <div className="min-h-screen bg-[#f2f9f5] text-slate-900 py-6 px-4 md:px-8 transition-colors">
      {!isCompleted ? (
        <div className="max-w-5xl mx-auto">
          {/* ADVENTURE PROGRESS STEPPER */}
          <div className="mb-6 bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {session.title}
                  </h1>
                  <p className="text-xs text-emerald-700">{session.topic}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                  Challenge {currentIndex + 1} of {allChallenges.length}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-1 font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Combo {combo}x
                </span>
              </div>
            </div>

            {/* Step Pills */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {allChallenges.map((ch, idx) => {
                const isCurrent = idx === currentIndex;
                const isPassed = idx < currentIndex;
                return (
                  <div
                    key={ch.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isPassed
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : isCurrent
                        ? 'bg-indigo-600 ring-2 ring-indigo-400/40 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>

            {/* Adaptive Banner Notification */}
            <AnimatePresence>
              {adaptiveMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 px-3 py-2 rounded-xl flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  {adaptiveMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACTIVE MINI-GAME DISPATCHER */}
          <div className="w-full">
            {currentChallenge.type === 'quick_choice' && (
              <QuickChoiceGame
                challenge={currentChallenge}
                onComplete={handleMiniGameComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}

            {currentChallenge.type === 'match_connect' && (
              <MatchConnectGame
                challenge={currentChallenge}
                onComplete={handleMiniGameComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}

            {currentChallenge.type === 'sort_logic' && (
              <SortLogicGame
                challenge={currentChallenge}
                onComplete={handleMiniGameComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}

            {currentChallenge.type === 'code_builder' && (
              <CodeBuilderGame
                challenge={currentChallenge}
                onComplete={handleMiniGameComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}

            {currentChallenge.type === 'debug_detective' && (
              <DebugDetectiveGame
                challenge={currentChallenge}
                onComplete={handleMiniGameComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}

            {currentChallenge.type === 'memory_match' && (
              <MemoryMatchGame
                challenge={currentChallenge}
                onComplete={handleMiniGameComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}

            {currentChallenge.type === 'fill_gap' && (
              <FillGapGame
                challenge={currentChallenge}
                onComplete={handleMiniGameComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}

            {currentChallenge.type === 'speed_round' && (
              <SpeedRoundGame
                challenge={currentChallenge}
                onComplete={handleMiniGameComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}

            {currentChallenge.type === 'boss_battle' && (
              <BossBattleGame
                challenge={currentChallenge}
                onComplete={handleChallengeComplete}
                onExit={() => navigate('/dashboard')}
              />
            )}
          </div>
        </div>
      ) : (
        /* ADVENTURE COMPLETE VICTORY SCREEN (Section 25) */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto my-6 p-8 rounded-3xl bg-gradient-to-b from-white via-indigo-50/50 to-slate-50 dark:from-indigo-950/90 dark:via-slate-900 dark:to-slate-950 border-2 border-indigo-200 dark:border-indigo-500/40 shadow-2xl relative overflow-hidden text-center"
        >
          {/* Background glowing orbs */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Victory Trophy Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ duration: 0.6 }}
            className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 text-slate-950"
          >
            🏆
          </motion.div>

          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
            QUEST COMPLETE
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mt-3 mb-2 tracking-wide">
            RECURSION DUNGEON CLEARED!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-lg mx-auto mb-8">
            You completed all 5 tactical micro-challenges and crushed the Recursion Beast in record time!
          </p>

          {/* REWARDS METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-white dark:bg-indigo-500/10 border border-slate-200 dark:border-indigo-500/20 shadow-sm flex flex-col items-center">
              <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mb-1" />
              <span className="text-2xl font-black text-slate-900 dark:text-white">+{totalSessionXp}</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold">Total XP Earned</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-amber-500/10 border border-slate-200 dark:border-amber-500/20 shadow-sm flex flex-col items-center">
              <Coins className="w-5 h-5 text-amber-500 dark:text-amber-400 mb-1" />
              <span className="text-2xl font-black text-slate-900 dark:text-white">+{totalSessionCoins || 65}</span>
              <span className="text-xs text-amber-600 dark:text-amber-300 font-semibold">Gold Coins</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col items-center">
              <Target className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mb-1" />
              <span className="text-2xl font-black text-slate-900 dark:text-white">{avgAccuracy}%</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-300 font-semibold">Accuracy</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-rose-500/10 border border-slate-200 dark:border-rose-500/20 shadow-sm flex flex-col items-center">
              <Clock className="w-5 h-5 text-rose-500 dark:text-rose-400 mb-1" />
              <span className="text-2xl font-black text-slate-900 dark:text-white">{totalTimeSpent}s</span>
              <span className="text-xs text-rose-600 dark:text-rose-300 font-semibold">Session Time</span>
            </div>
          </div>

          {/* SKILL MASTERY & BADGE CARD */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto mb-8 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" /> NEW BADGE UNLOCKED
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+16% Mastery</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-2xl shadow-md">
                ⚔️
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Recursion Master</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Successfully mastered recursive calls & base cases</p>
              </div>
            </div>

            {/* Skill Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-500 dark:text-slate-400">Algorithmic Thinking Skill</span>
                <span className="text-slate-800 dark:text-white font-mono">62% → 78%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <motion.div
                  initial={{ width: '62%' }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* AI RECOMMENDATION BOX */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 max-w-xl mx-auto mb-8 flex items-start gap-3 text-left">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">AI Coach Next Step</h5>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 mt-0.5">
                "Outstanding mastery on recursive stacks! Recommended next challenge: <strong className="text-indigo-900 dark:text-white">Dynamic Programming: Memoization Matrix</strong>."
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <button
              onClick={() => navigate('/adventure')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              Continue Adventure <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/skill-tree')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              Review Skills
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" /> Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
