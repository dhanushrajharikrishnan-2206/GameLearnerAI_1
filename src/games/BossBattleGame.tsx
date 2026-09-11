import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Swords, 
  Sparkles, 
  Flame, 
  Trophy, 
  AlertCircle, 
  ArrowRight, 
  Bot, 
  RotateCcw,
  Skull,
  Coins,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { BossBattleChallenge, GameResult } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';
import { soundFx } from '../utils/soundEffects';

interface BossBattleGameProps {
  challenge: BossBattleChallenge;
  onComplete: (result: GameResult) => void;
  onExit?: () => void;
}

export const BossBattleGame: React.FC<BossBattleGameProps> = ({
  challenge,
  onComplete,
  onExit,
}) => {
  const { 
    hearts, 
    loseHeart, 
    combo, 
    incrementCombo, 
    resetCombo, 
    addXp, 
    addCoins,
    askAiAboutMistake 
  } = useGamification();

  const [bossHp, setBossHp] = useState<number>(challenge.bossMaxHp || 100);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isBossDamaged, setIsBossDamaged] = useState<boolean>(false);
  const [isBossAttacking, setIsBossAttacking] = useState<boolean>(false);
  const [damageDealt, setDamageDealt] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [totalXpEarned, setTotalXpEarned] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  const currentPhase = challenge.phases[currentPhaseIndex] || challenge.phases[0];
  const hpPercentage = Math.max(0, Math.round((bossHp / challenge.bossMaxHp) * 100));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswerSubmitted || isVictory) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= currentPhase.options.length) {
        handleOptionSelect(num - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhase, isAnswerSubmitted, isVictory]);

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted || isVictory) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentPhase.correctIndex;

    if (isCorrect) {
      const damage = currentPhase.damage || 25;
      const newHp = Math.max(0, bossHp - damage);
      setBossHp(newHp);
      setDamageDealt(damage);
      setIsBossDamaged(true);
      setCorrectAnswersCount(prev => prev + 1);
      incrementCombo();

      soundFx.playBossHit();
      soundFx.playCombo(combo + 1);

      const earnedXp = Math.round(50 * (1 + combo * 0.1));
      setTotalXpEarned(prev => prev + earnedXp);

      setTimeout(() => {
        setIsBossDamaged(false);
      }, 600);

      if (newHp === 0) {
        setTimeout(() => {
          setIsVictory(true);
          soundFx.playBossDefeated();
          addXp(challenge.xpReward || 250);
          addCoins(50);
        }, 800);
      }
    } else {
      soundFx.playIncorrect();
      loseHeart();
      resetCombo();
      setIsBossAttacking(true);

      setTimeout(() => {
        setIsBossAttacking(false);
      }, 600);
    }
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex + 1 < challenge.phases.length) {
      setCurrentPhaseIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setDamageDealt(0);
    } else {
      // Finished all phases; if boss still has HP, cycle with remaining HP
      if (bossHp > 0) {
        setCurrentPhaseIndex(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
      } else {
        setIsVictory(true);
      }
    }
  };

  const handleFinishBattle = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const result: GameResult = {
      challengeId: challenge.id,
      gameType: 'boss_battle',
      isSuccess: isVictory,
      score: isVictory ? 100 : Math.round(((challenge.bossMaxHp - bossHp) / challenge.bossMaxHp) * 100),
      maxScore: 100,
      xpEarned: isVictory ? (challenge.xpReward || 250) + totalXpEarned : totalXpEarned,
      coinsEarned: isVictory ? 50 : 15,
      timeSpentSeconds: timeSpent,
      accuracy: Math.round((correctAnswersCount / (currentPhaseIndex + 1)) * 100),
      maxCombo: combo,
      heartsRemaining: hearts,
    };
    onComplete(result);
  };

  const handleAskAi = () => {
    if (selectedOption !== null && selectedOption !== currentPhase.correctIndex) {
      askAiAboutMistake(
        currentPhase.question,
        currentPhase.options[selectedOption],
        currentPhase.options[currentPhase.correctIndex],
        currentPhase.explanation
      );
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 md:p-6 select-none">
      {/* BOSS ARENA HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-red-500/30 p-6 shadow-2xl shadow-red-950/40 mb-6">
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Boss visual & animated avatar */}
          <div className="flex items-center gap-4">
            <motion.div 
              animate={
                isBossDamaged 
                  ? { x: [-10, 10, -10, 10, 0], scale: [1, 0.9, 1.05, 1], filter: 'brightness(1.5) saturate(2)' }
                  : isBossAttacking 
                  ? { scale: [1, 1.25, 1], y: [0, -10, 0] }
                  : { y: [0, -6, 0] }
              }
              transition={{ duration: isBossDamaged ? 0.4 : 2.5, repeat: isBossDamaged || isBossAttacking ? 0 : Infinity }}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-red-600 to-violet-900 flex items-center justify-center border-2 border-red-400/50 shadow-lg shadow-red-500/30 text-4xl"
            >
              {challenge.bossAvatar || '🐉'}
              {isBossDamaged && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -40, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-6 text-red-400 font-extrabold text-2xl drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)]"
                >
                  -{damageDealt} HP!
                </motion.div>
              )}
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                  <Swords className="w-3 h-3" /> BOSS BATTLE
                </span>
                <span className="text-xs text-slate-400 font-medium">Phase {currentPhaseIndex + 1}/{challenge.phases.length}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide mt-1 flex items-center gap-2">
                {challenge.bossName}
              </h2>
              <p className="text-xs md:text-sm text-red-200/70">{challenge.bossTitle}</p>
            </div>
          </div>

          {/* Boss Health Bar */}
          <div className="w-full md:w-64 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-red-400 flex items-center gap-1">
                <Skull className="w-3.5 h-3.5" /> BOSS HP
              </span>
              <span className="text-white font-mono">{bossHp} / {challenge.bossMaxHp}</span>
            </div>
            <div className="w-full h-4 bg-slate-800/90 rounded-full overflow-hidden border border-red-500/30 p-0.5 relative">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${hpPercentage}%` }}
                transition={{ duration: 0.4 }}
                className={`h-full rounded-full transition-colors ${
                  hpPercentage > 50 
                    ? 'bg-gradient-to-r from-red-500 to-amber-500' 
                    : hpPercentage > 20 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                    : 'bg-gradient-to-r from-red-600 to-rose-600 animate-pulse'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* COMBAT QUESTION CARD */}
      {!isVictory ? (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Attack Power: +{currentPhase.damage} DMG
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Damage Deal: Easy = 15, Medium = 25, Hard = 40
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 leading-relaxed">
            {currentPhase.question}
          </h3>

          {currentPhase.codeSnippet && (
            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-300 overflow-x-auto">
              <pre>{currentPhase.codeSnippet}</pre>
            </div>
          )}

          {/* Attack Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {currentPhase.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentPhase.correctIndex;
              let btnClass = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-200 shadow-lg shadow-emerald-500/20 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-red-500/15 dark:bg-red-500/20 border-red-500 text-red-700 dark:text-red-200 shadow-lg shadow-red-500/20 font-bold';
                } else {
                  btnClass = 'opacity-40 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 text-slate-400';
                }
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={!isAnswerSubmitted ? { scale: 1.02 } : {}}
                  whileTap={!isAnswerSubmitted ? { scale: 0.98 } : {}}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswerSubmitted}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left font-medium transition-all relative ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm md:text-base">{option}</span>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback & Actions */}
          <AnimatePresence>
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedOption === currentPhase.correctIndex ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-emerald-500" /> Critical Hit! {currentPhase.damage} Damage to Boss!
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold text-sm flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-red-500" /> Attack Missed! Boss struck back (-1 Heart).
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentPhase.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {selectedOption !== currentPhase.correctIndex && (
                    <button
                      onClick={handleAskAi}
                      className="px-3.5 py-2 rounded-xl bg-violet-600/15 dark:bg-violet-600/20 hover:bg-violet-600/25 text-violet-700 dark:text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Bot className="w-4 h-4" /> Ask AI Why
                    </button>
                  )}

                  <button
                    onClick={handleNextPhase}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-red-600/20 flex items-center gap-2 transition-transform active:scale-95"
                  >
                    Next Strike <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* VICTORY CELEBRATION SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-indigo-50/50 to-slate-50 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 border-2 border-amber-400 dark:border-amber-500/40 p-8 text-center shadow-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/40 text-slate-950 font-black"
          >
            🏆
          </motion.div>

          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
            QUEST COMPLETE
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3 mb-2 tracking-wide">
            🎉 BOSS DEFEATED!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto mb-6">
            You successfully conquered <span className="text-amber-600 dark:text-amber-300 font-bold">{challenge.bossName}</span> and mastered this domain!
          </p>

          {/* REWARDS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto mb-8">
            <div className="p-3 rounded-2xl bg-white dark:bg-indigo-500/10 border border-slate-200 dark:border-indigo-500/20 shadow-sm flex flex-col items-center">
              <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mb-1" />
              <span className="text-xl font-black text-slate-900 dark:text-white">+{challenge.xpReward || 250} XP</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">Experience</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-amber-500/10 border border-slate-200 dark:border-amber-500/20 shadow-sm flex flex-col items-center">
              <Coins className="w-5 h-5 text-amber-500 dark:text-amber-400 mb-1" />
              <span className="text-xl font-black text-slate-900 dark:text-white">+50</span>
              <span className="text-xs text-amber-600 dark:text-amber-300 font-medium">Coins</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col items-center">
              <Trophy className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mb-1" />
              <span className="text-base font-black text-slate-900 dark:text-white">Mastery</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-300 font-medium">Domain Cleared</span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-rose-500/10 border border-slate-200 dark:border-rose-500/20 shadow-sm flex flex-col items-center">
              <Flame className="w-5 h-5 text-rose-500 dark:text-rose-400 mb-1" />
              <span className="text-xl font-black text-slate-900 dark:text-white">{combo}x</span>
              <span className="text-xs text-rose-600 dark:text-rose-300 font-medium">Max Combo</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleFinishBattle}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              Continue Adventure <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
