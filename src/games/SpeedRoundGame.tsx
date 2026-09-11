import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Trophy, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { SpeedRoundChallenge } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';

interface SpeedRoundGameProps {
  challenge: SpeedRoundChallenge;
  onComplete: (isCorrect: boolean, xpEarned: number) => void;
  onExit?: () => void;
}

export const SpeedRoundGame: React.FC<SpeedRoundGameProps> = ({ challenge, onComplete, onExit }) => {
  const { awardXp, incrementCombo, resetCombo, combo, triggerConfetti } = useGamification();

  const [timeLeft, setTimeLeft] = useState(challenge.durationSeconds || 60);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // 60-second countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (optionIdx: number) => {
    if (isFinished) return;
    const currentQ = challenge.items[currentIdx];
    const isCorrect = optionIdx === currentQ.correctAnswerIndex;

    if (isCorrect) {
      incrementCombo();
      setCorrectCount((prev) => prev + 1);
    } else {
      resetCombo();
    }

    if (currentIdx + 1 < challenge.items.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    if (isFinished) return;
    setIsFinished(true);

    const baseReward = correctCount * 25;
    const speedBonus = timeLeft * 2;
    const totalAward = baseReward + speedBonus;

    awardXp(totalAward, `Speed Round: ${correctCount} correct`);
    if (correctCount >= 3) {
      triggerConfetti();
    }
  };

  const currentQ = challenge.items[currentIdx] || challenge.items[0];
  const accuracy = Math.round((correctCount / Math.max(1, currentIdx + (isFinished ? 0 : 1))) * 100);

  return (
    <div className="space-y-6">
      {/* Speed Round Top Metric Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-indigo-500/10 dark:from-amber-500/20 dark:via-slate-900 dark:to-indigo-950 border border-amber-500/30">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-400 animate-pulse">
            <Zap className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              60s Blitz Challenge
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rapid Speed Round</h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm shadow-sm">
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{timeLeft}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
            <Trophy className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>{correctCount} Solved</span>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>
              Question {currentIdx + 1} of {challenge.items.length}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Accuracy: {accuracy}%</span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, oIdx) => (
              <button
                key={oIdx}
                onClick={() => handleAnswer(oIdx)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 active:scale-95 transition-all flex items-center gap-3 shadow-sm hover:shadow"
              >
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                  {String.fromCharCode(65 + oIdx)}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-amber-500/40 text-center space-y-4 shadow-xl"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">Speed Round Complete!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            You solved <strong className="text-amber-500 dark:text-amber-400">{correctCount}</strong> questions with{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">{accuracy}%</strong> accuracy.
          </p>

          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block uppercase">Base XP</span>
              <span className="font-bold text-slate-900 dark:text-white">+{correctCount * 25}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block uppercase">Speed Bonus</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">+{timeLeft * 2}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block uppercase">Total Earned</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                +{correctCount * 25 + timeLeft * 2} XP
              </span>
            </div>
          </div>

          <button
            onClick={() => onComplete(true, correctCount * 25 + timeLeft * 2)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-glow-gold transition-all"
          >
            Claim Speed Rewards
          </button>
        </motion.div>
      )}
    </div>
  );
};
