import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ChevronUp, ChevronDown, CheckCircle2, XCircle, ArrowRight, Bot } from 'lucide-react';
import { SortLogicChallenge, SortLogicStep } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';

interface SortLogicGameProps {
  challenge: SortLogicChallenge;
  onComplete: (isCorrect: boolean, xpEarned: number) => void;
  onExit?: () => void;
}

export const SortLogicGame: React.FC<SortLogicGameProps> = ({ challenge, onComplete, onExit }) => {
  const { awardXp, incrementCombo, loseHeart, askAiAboutMistake } = useGamification();

  // Shuffle steps initially
  const [currentSteps, setCurrentSteps] = useState<SortLogicStep[]>(() =>
    [...challenge.steps].sort(() => Math.random() - 0.5)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentSteps.length) return;

    const updated = [...currentSteps];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCurrentSteps(updated);
  };

  const handleVerify = () => {
    if (isSubmitted) return;
    const correctOrder = currentSteps.every((step, idx) => step.order === idx + 1);
    setIsCorrect(correctOrder);
    setIsSubmitted(true);

    if (correctOrder) {
      incrementCombo();
      awardXp(challenge.xpReward, `Logic Sorted: ${challenge.title}`);
    } else {
      loseHeart();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-400 mb-1">
          <ArrowUpDown className="w-4 h-4 text-cyan-400" />
          <span>Sort the Logic</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {challenge.instruction}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Use the arrow controls to sequence the algorithm steps from start to finish.
        </p>
      </div>

      {/* Draggable / Movable Steps List */}
      <div className="space-y-2.5">
        {currentSteps.map((step, idx) => {
          return (
            <motion.div
              key={step.id}
              layout
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isSubmitted
                  ? step.order === idx + 1
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold">{step.label}</span>
              </div>

              {!isSubmitted && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-20 transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveStep(idx, 'down')}
                    disabled={idx === currentSteps.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-20 transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Validation Row */}
      {!isSubmitted ? (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleVerify}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-electric-500 hover:brightness-110 text-white font-extrabold text-xs shadow-glow-indigo transition-all"
          >
            Verify Step Sequence
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md"
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase flex items-center gap-1.5 ${
                isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Logical Flow Correct! (+{challenge.xpReward} XP)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Sequence Error Detected (-1 Heart)
                </>
              )}
            </span>

            {!isCorrect && (
              <button
                onClick={() =>
                  askAiAboutMistake({
                    questionText: challenge.instruction,
                    userAnswer: currentSteps.map((s) => s.label).join(' -> '),
                    correctAnswer: [...challenge.steps]
                      .sort((a, b) => a.order - b.order)
                      .map((s) => s.label)
                      .join(' -> '),
                    explanation: challenge.explanation,
                    topic: challenge.topic
                  })
                }
                className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-500/40 flex items-center gap-1.5 transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                <span>Ask AI Why</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{challenge.explanation}</p>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onComplete(isCorrect, isCorrect ? challenge.xpReward : 0)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-electric-500 hover:brightness-110 text-white font-extrabold text-xs shadow-glow-indigo transition-all flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
