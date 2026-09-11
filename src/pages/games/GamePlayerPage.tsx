import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, RotateCcw, Home, Sparkles, ArrowRight, Trophy, Flame } from 'lucide-react';
import { AnyGameChallenge, GameResult } from '../../types/game.types';
import { gameService, MOCK_CHALLENGES } from '../../services/gameService';
import { useGamification } from '../../context/GamificationContext';

// Mini games
import { QuickChoiceGame } from '../../games/QuickChoiceGame';
import { MatchConnectGame } from '../../games/MatchConnectGame';
import { SortLogicGame } from '../../games/SortLogicGame';
import { CodeBuilderGame } from '../../games/CodeBuilderGame';
import { DebugDetectiveGame } from '../../games/DebugDetectiveGame';
import { MemoryMatchGame } from '../../games/MemoryMatchGame';
import { FillGapGame } from '../../games/FillGapGame';
import { SpeedRoundGame } from '../../games/SpeedRoundGame';
import { BossBattleGame } from '../../games/BossBattleGame';

export const GamePlayerPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { awardXp, awardCoins, combo } = useGamification();

  const [challenge, setChallenge] = useState<AnyGameChallenge | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      const ch = await gameService.getChallengeById(gameId || 'qc-recursion-base');
      setChallenge(ch || MOCK_CHALLENGES['qc-recursion-base']);
      setLoading(false);
      setGameResult(null);
    };
    fetchGame();
  }, [gameId]);

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
    awardXp(result.xpEarned, `${challenge?.title || 'Interactive Game'} Cleared`);
    awardCoins(result.coinsEarned);
  };

  const handleMiniGameComplete = (isCorrect: boolean, xpEarned: number) => {
    handleGameComplete({
      challengeId: challenge?.id || 'game',
      gameType: challenge?.type || 'quick_choice',
      isSuccess: isCorrect,
      score: isCorrect ? 100 : 0,
      maxScore: 100,
      xpEarned,
      coinsEarned: isCorrect ? 15 : 5,
      timeSpentSeconds: 25,
      accuracy: isCorrect ? 100 : 0,
      maxCombo: combo,
      heartsRemaining: 5,
    });
  };

  const handleReplay = () => {
    setGameResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading challenge arena...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <p className="text-slate-400 mb-4">Challenge not found.</p>
        <button
          onClick={() => navigate('/adventure')}
          className="px-5 py-2.5 bg-indigo-600 rounded-xl text-white font-bold"
        >
          Return to Learning Adventure
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          ← Exit Challenge
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-2.5 py-1 rounded-full font-bold uppercase">
            {challenge.topic}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            +{challenge.xpReward} XP
          </span>
        </div>
      </div>

      {/* GAME RUNNER */}
      {!gameResult ? (
        <div>
          {challenge.type === 'quick_choice' && (
            <QuickChoiceGame
              challenge={challenge}
              onComplete={handleMiniGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}

          {challenge.type === 'match_connect' && (
            <MatchConnectGame
              challenge={challenge}
              onComplete={handleMiniGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}

          {challenge.type === 'sort_logic' && (
            <SortLogicGame
              challenge={challenge}
              onComplete={handleMiniGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}

          {challenge.type === 'code_builder' && (
            <CodeBuilderGame
              challenge={challenge}
              onComplete={handleMiniGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}

          {challenge.type === 'debug_detective' && (
            <DebugDetectiveGame
              challenge={challenge}
              onComplete={handleMiniGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}

          {challenge.type === 'memory_match' && (
            <MemoryMatchGame
              challenge={challenge}
              onComplete={handleMiniGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}

          {challenge.type === 'fill_gap' && (
            <FillGapGame
              challenge={challenge}
              onComplete={handleMiniGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}

          {challenge.type === 'speed_round' && (
            <SpeedRoundGame
              challenge={challenge}
              onComplete={handleMiniGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}

          {challenge.type === 'boss_battle' && (
            <BossBattleGame
              challenge={challenge}
              onComplete={handleGameComplete}
              onExit={() => navigate('/adventure')}
            />
          )}
        </div>
      ) : (
        /* CHALLENGE CLEAR SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/80 text-center max-w-xl mx-auto"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30">
            ✨
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            CHALLENGE COMPLETE!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            You conquered <strong className="text-slate-900 dark:text-slate-200">{challenge.title}</strong>!
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xl font-bold text-slate-900 dark:text-white block">+{gameResult.xpEarned}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">XP Earned</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xl font-bold text-slate-900 dark:text-white block">{gameResult.accuracy}%</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Accuracy</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xl font-bold text-slate-900 dark:text-white block">{gameResult.timeSpentSeconds}s</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Time</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/adventure')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Back to Adventure <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleReplay}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Replay
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
