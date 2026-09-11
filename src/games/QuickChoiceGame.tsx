import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, Bot, Code2 } from 'lucide-react';
import { QuickChoiceChallenge } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';

interface QuickChoiceGameProps {
  challenge: QuickChoiceChallenge;
  onComplete: (isCorrect: boolean, xpEarned: number) => void;
  onExit?: () => void;
}

export const QuickChoiceGame: React.FC<QuickChoiceGameProps> = ({ challenge, onComplete, onExit }) => {
  const {
    awardXp,
    incrementCombo,
    loseHeart,
    askAiAboutMistake
  } = useGamification();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (idx: number) => {
    if (isSubmitted) return;
    setSelectedIdx(idx);
    setIsSubmitted(true);

    const isCorrect = idx === challenge.correctAnswerIndex;
    if (isCorrect) {
      incrementCombo();
      awardXp(challenge.xpReward, `Quick Choice: ${challenge.title}`);
    } else {
      loseHeart();
    }
  };

  const isCorrect = selectedIdx === challenge.correctAnswerIndex;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-400 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Choice Challenge</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
          {challenge.question}
        </h3>
      </div>

      {challenge.codeSnippet && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
          <div className="px-4 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10px] font-mono text-indigo-400 flex items-center gap-1.5">
            <Code2 className="w-3 h-3" /> {challenge.codeLanguage || 'python'}
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            <code>{challenge.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {challenge.options.map((opt, idx) => {
          const isThisSelected = selectedIdx === idx;
          const isThisCorrect = idx === challenge.correctAnswerIndex;

          let style =
            'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-indigo-500/50';

          if (isSubmitted) {
            if (isThisCorrect) {
              style = 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold shadow-sm';
            } else if (isThisSelected) {
              style = 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300 font-bold';
            } else {
              style = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
            }
          } else if (isThisSelected) {
            style = 'bg-indigo-50 dark:bg-indigo-600/15 border-indigo-500 text-indigo-800 dark:text-indigo-300 shadow-sm font-bold';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSubmit(idx)}
              disabled={isSubmitted}
              className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/60 flex items-center justify-center text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
              {isSubmitted && isThisCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
              {isSubmitted && isThisSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next action */}
      {isSubmitted && (
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
                  <CheckCircle2 className="w-4 h-4" /> Correct (+{challenge.xpReward} XP)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Incorrect (-1 Heart)
                </>
              )}
            </span>

            {!isCorrect && (
              <button
                onClick={() =>
                  askAiAboutMistake({
                    questionText: challenge.question,
                    userAnswer: challenge.options[selectedIdx!],
                    correctAnswer: challenge.options[challenge.correctAnswerIndex],
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
