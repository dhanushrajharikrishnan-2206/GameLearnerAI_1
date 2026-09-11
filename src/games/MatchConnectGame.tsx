import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Link2, Sparkles, ArrowRight, Bot } from 'lucide-react';
import { MatchConnectChallenge } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';

interface MatchConnectGameProps {
  challenge: MatchConnectChallenge;
  onComplete: (isCorrect: boolean, xpEarned: number) => void;
  onExit?: () => void;
}

export const MatchConnectGame: React.FC<MatchConnectGameProps> = ({ challenge, onComplete, onExit }) => {
  const { awardXp, incrementCombo, loseHeart } = useGamification();

  // Scramble rights initially
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [failedPair, setFailedPair] = useState<{ leftId: string; rightId: string } | null>(null);

  const leftItems = challenge.pairs.map((p) => ({ id: p.id, text: p.left }));
  const [shuffledRights] = useState(() =>
    [...challenge.pairs].sort(() => Math.random() - 0.5).map((p) => ({ id: p.id, text: p.right }))
  );

  const handleLeftClick = (id: string) => {
    if (matchedPairIds.includes(id)) return;
    setSelectedLeft(id);
    setFailedPair(null);

    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedPairIds.includes(id)) return;
    setSelectedRight(id);
    setFailedPair(null);

    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Successful match!
      incrementCombo();
      const updated = [...matchedPairIds, leftId];
      setMatchedPairIds(updated);
      setSelectedLeft(null);
      setSelectedRight(null);
      setFailedPair(null);

      if (updated.length === challenge.pairs.length) {
        awardXp(challenge.xpReward, `Match & Connect: ${challenge.title}`);
      }
    } else {
      // Incorrect match!
      loseHeart();
      setFailedPair({ leftId, rightId });
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setFailedPair(null);
      }, 700);
    }
  };

  const isAllMatched = matchedPairIds.length === challenge.pairs.length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-400 mb-1">
          <Link2 className="w-4 h-4 text-cyan-400" />
          <span>Match & Connect</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {challenge.instruction}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Tap a concept on the left, then tap its matching definition on the right.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Column (Concepts) */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Concepts / Algorithms
          </span>
          {leftItems.map((item) => {
            const isMatched = matchedPairIds.includes(item.id);
            const isSelected = selectedLeft === item.id;
            const isFailed = failedPair?.leftId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                disabled={isMatched}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all ${
                  isMatched
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm opacity-75'
                    : isFailed
                    ? 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300 animate-shake'
                    : isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-800 dark:text-indigo-300 shadow-sm scale-102'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column (Definitions) */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Definitions / Complexity
          </span>
          {shuffledRights.map((item) => {
            const isMatched = matchedPairIds.includes(item.id);
            const isSelected = selectedRight === item.id;
            const isFailed = failedPair?.rightId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                disabled={isMatched}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                  isMatched
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm opacity-75'
                    : isFailed
                    ? 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300 animate-shake'
                    : isSelected
                    ? 'bg-cyan-50 dark:bg-cyan-600/20 border-cyan-500 text-cyan-800 dark:text-cyan-300 shadow-sm scale-102'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-400 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion & Next */}
      {isAllMatched && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>All pairs connected perfectly! +{challenge.xpReward} XP</span>
          </div>

          <button
            onClick={() => onComplete(true, challenge.xpReward)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow-emerald transition-all flex items-center gap-1.5"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
