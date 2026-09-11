import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, CheckCircle2, XCircle, ArrowRight, Bot } from 'lucide-react';
import { FillGapChallenge } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';

interface FillGapGameProps {
  challenge: FillGapChallenge;
  onComplete: (isCorrect: boolean, xpEarned: number) => void;
  onExit?: () => void;
}

export const FillGapGame: React.FC<FillGapGameProps> = ({ challenge, onComplete, onExit }) => {
  const { awardXp, incrementCombo, loseHeart, askAiAboutMistake } = useGamification();

  const [selectedAnswers, setSelectedAnswers] = useState<{ [gapId: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (gapId: string, value: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [gapId]: value }));
  };

  const handleVerify = () => {
    if (isSubmitted) return;
    const isAllCorrect = challenge.gaps.every(
      (gap) => selectedAnswers[gap.id] === gap.correctAnswer
    );

    setIsSubmitted(true);

    if (isAllCorrect) {
      incrementCombo();
      awardXp(challenge.xpReward, `Fill the Gap: ${challenge.title}`);
    } else {
      loseHeart();
    }
  };

  const isAllCorrect = challenge.gaps.every(
    (gap) => selectedAnswers[gap.id] === gap.correctAnswer
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-400 mb-1">
          <PenTool className="w-4 h-4 text-cyan-400" />
          <span>Fill the Gap</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {challenge.instruction}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Select the correct tokens to complete the Python implementation.
        </p>
      </div>

      {/* Code Display with interactive dropdowns / chips for gaps */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-300 space-y-4 shadow-inner">
        {challenge.gaps.map((gap, idx) => {
          const selected = selectedAnswers[gap.id];
          const isGapCorrect = selected === gap.correctAnswer;

          return (
            <div key={gap.id} className="flex flex-wrap items-center gap-2">
              <span>{gap.textBefore}</span>

              {/* Gap Selector */}
              <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                {gap.options.map((opt) => {
                  const isChosen = selected === opt;
                  let optStyle =
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';

                  if (isSubmitted) {
                    if (opt === gap.correctAnswer) {
                      optStyle = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500';
                    } else if (isChosen) {
                      optStyle = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500';
                    }
                  } else if (isChosen) {
                    optStyle = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-sm';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(gap.id, opt)}
                      disabled={isSubmitted}
                      className={optStyle}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <span>{gap.textAfter}</span>
            </div>
          );
        })}
      </div>

      {/* Action Row */}
      {!isSubmitted ? (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleVerify}
            disabled={challenge.gaps.some((g) => !selectedAnswers[g.id])}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-electric-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-glow-indigo transition-all"
          >
            Verify Completed Code
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md"
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase flex items-center gap-1.5 ${
                isAllCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isAllCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Code Syntax Complete (+{challenge.xpReward} XP)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Token Mismatch (-1 Heart)
                </>
              )}
            </span>

            {!isAllCorrect && (
              <button
                onClick={() =>
                  askAiAboutMistake({
                    questionText: challenge.instruction,
                    userAnswer: JSON.stringify(selectedAnswers),
                    correctAnswer: challenge.gaps.map((g) => g.correctAnswer).join(', '),
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
              onClick={() => onComplete(isAllCorrect, isAllCorrect ? challenge.xpReward : 0)}
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
