import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Play, CheckCircle2, XCircle, ArrowRight, RotateCcw, Bot } from 'lucide-react';
import { CodeBuilderChallenge, CodeBlockToken } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';

interface CodeBuilderGameProps {
  challenge: CodeBuilderChallenge;
  onComplete: (isCorrect: boolean, xpEarned: number) => void;
  onExit?: () => void;
}

export const CodeBuilderGame: React.FC<CodeBuilderGameProps> = ({ challenge, onComplete, onExit }) => {
  const { awardXp, incrementCombo, loseHeart, askAiAboutMistake } = useGamification();

  const [placedTokens, setPlacedTokens] = useState<(CodeBlockToken | null)[]>(
    new Array(challenge.availableTokens.length).fill(null)
  );
  const [availableTokens, setAvailableTokens] = useState<CodeBlockToken[]>(() =>
    [...challenge.availableTokens].sort(() => Math.random() - 0.5)
  );

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);

  const handlePlaceToken = (token: CodeBlockToken) => {
    if (isSubmitted) return;
    const firstEmptyIndex = placedTokens.findIndex((t) => t === null);
    if (firstEmptyIndex === -1) return;

    const newPlaced = [...placedTokens];
    newPlaced[firstEmptyIndex] = token;
    setPlacedTokens(newPlaced);
    setAvailableTokens(availableTokens.filter((t) => t.id !== token.id));
  };

  const handleRemoveToken = (index: number) => {
    if (isSubmitted) return;
    const token = placedTokens[index];
    if (!token) return;

    const newPlaced = [...placedTokens];
    newPlaced[index] = null;
    setPlacedTokens(newPlaced);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleReset = () => {
    if (isSubmitted) return;
    setPlacedTokens(new Array(challenge.availableTokens.length).fill(null));
    setAvailableTokens([...challenge.availableTokens].sort(() => Math.random() - 0.5));
    setSimulatedOutput(null);
  };

  const handleExecute = () => {
    if (isSubmitted) return;
    const correct = placedTokens.every(
      (token, idx) => token !== null && token.correctSlot === idx
    );

    setIsCorrect(correct);
    setIsSubmitted(true);
    setSimulatedOutput(correct ? challenge.expectedOutput : 'SyntaxError or Unexpected Output');

    if (correct) {
      incrementCombo();
      awardXp(challenge.xpReward, `Code Builder: ${challenge.title}`);
    } else {
      loseHeart();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-400 mb-1">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Code Builder Puzzle</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {challenge.instruction}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Assemble code blocks in order to produce output: <code className="text-emerald-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">{challenge.expectedOutput}</code>
        </p>
      </div>

      {/* Assemble Canvas */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 font-mono">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Python Execution Script:</span>
          <button
            onClick={handleReset}
            disabled={isSubmitted}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 text-[11px]"
          >
            <RotateCcw className="w-3 h-3" /> Reset Blocks
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 min-h-[52px] p-3 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 shadow-inner">
          {placedTokens.map((token, idx) => (
            <div key={idx}>
              {token ? (
                <button
                  onClick={() => handleRemoveToken(idx)}
                  disabled={isSubmitted}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/30 border border-indigo-300 dark:border-indigo-500 text-indigo-700 dark:text-indigo-200 text-xs font-mono font-bold hover:bg-rose-50 hover:border-rose-400 dark:hover:bg-rose-500/20 dark:hover:border-rose-500 transition-colors shadow-sm"
                  title="Click to remove"
                >
                  {token.code}
                </button>
              ) : (
                <span className="inline-block px-3 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-600 text-xs font-mono">
                  [slot {idx + 1}]
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Blocks Pool */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
          Available Code Tokens (Tap to place):
        </span>
        <div className="flex flex-wrap gap-2">
          {availableTokens.map((token) => (
            <button
              key={token.id}
              onClick={() => handlePlaceToken(token)}
              disabled={isSubmitted}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold hover:border-indigo-400 active:scale-95 transition-all shadow-sm"
            >
              {token.code}
            </button>
          ))}
        </div>
      </div>

      {/* Execute / Results */}
      {!isSubmitted ? (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleExecute}
            disabled={placedTokens.some((t) => t === null)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-electric-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-glow-indigo transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Run Assembled Code</span>
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
                isCorrect ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Execution Success (+{challenge.xpReward} XP)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Script Failed (-1 Heart)
                </>
              )}
            </span>

            {!isCorrect && (
              <button
                onClick={() =>
                  askAiAboutMistake({
                    questionText: challenge.instruction,
                    userAnswer: placedTokens.map((t) => t?.code).join(' '),
                    correctAnswer: [...challenge.availableTokens]
                      .sort((a, b) => a.correctSlot - b.correctSlot)
                      .map((t) => t.code)
                      .join(' '),
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

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 block mb-0.5">Terminal Output:</span>
            <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
              {simulatedOutput}
            </span>
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
