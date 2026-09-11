import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { MemoryMatchChallenge, MemoryCard } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';

interface MemoryMatchGameProps {
  challenge: MemoryMatchChallenge;
  onComplete: (isCorrect: boolean, xpEarned: number) => void;
  onExit?: () => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ challenge, onComplete, onExit }) => {
  const { awardXp, incrementCombo, loseHeart } = useGamification();

  const [cards] = useState<MemoryCard[]>(() =>
    [...challenge.cards].sort(() => Math.random() - 0.5)
  );
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.includes(cards[index].matchId)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.matchId === card2.matchId && card1.id !== card2.id) {
        // Matched!
        incrementCombo();
        const updatedMatched = [...matchedIds, card1.matchId];
        setMatchedIds(updatedMatched);
        setTimeout(() => setFlippedIndices([]), 400);

        if (updatedMatched.length * 2 === cards.length) {
          awardXp(challenge.xpReward, `Memory Match: ${challenge.title}`);
        }
      } else {
        // Not matched
        loseHeart();
        setTimeout(() => setFlippedIndices([]), 900);
      }
    }
  };

  const isAllComplete = matchedIds.length * 2 === cards.length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-400 mb-1">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Memory Match</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {challenge.instruction}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Flip cards to discover and connect matching concepts and algorithmic runtimes.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx);
          const isMatched = matchedIds.includes(card.matchId);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-28 rounded-2xl border cursor-pointer p-3 text-center flex flex-col items-center justify-center transition-all duration-300 select-none ${
                isMatched
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm dark:shadow-glow-emerald'
                  : isFlipped
                  ? 'bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm dark:shadow-glow-indigo'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-400 dark:hover:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300 shadow-sm'
              }`}
            >
              {isFlipped || isMatched ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 block">
                    {card.type}
                  </span>
                  <span className="text-xs font-bold leading-tight line-clamp-3 text-slate-900 dark:text-white">
                    {card.content}
                  </span>
                </motion.div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isAllComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Memory Grid Cleared! +{challenge.xpReward} XP</span>
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
