import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, CheckCircle2, XCircle, ArrowRight, Bot, Code2, AlertTriangle } from 'lucide-react';
import { DebugDetectiveChallenge } from '../types/game.types';
import { useGamification } from '../context/GamificationContext';

interface DebugDetectiveGameProps {
  challenge: DebugDetectiveChallenge;
  onComplete: (isCorrect: boolean, xpEarned: number) => void;
  onExit?: () => void;
}

export const DebugDetectiveGame: React.FC<DebugDetectiveGameProps> = ({ challenge, onComplete, onExit }) => {
  const { awardXp, incrementCombo, loseHeart, askAiAboutMistake } = useGamification();

  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [stage, setStage] = useState<'find_line' | 'pick_fix' | 'result'>('find_line');

  const bugLine = challenge.codeLines.find((l) => l.isBug);

  const handleLineClick = (lineNum: number) => {
    if (stage !== 'find_line') return;
    setSelectedLine(lineNum);
  };

  const handleConfirmLine = () => {
    if (selectedLine === null) return;
    if (selectedLine === bugLine?.lineNumber) {
      // Correct line identified! Move to fix stage
      incrementCombo();
      setStage('pick_fix');
    } else {
      loseHeart();
      // give feedback
    }
  };

  const handleFixSubmit = (fixIdx: number) => {
    setSelectedFix(fixIdx);
    setStage('result');
    const correct = fixIdx === challenge.correctFixIndex;

    if (correct) {
      incrementCombo();
      awardXp(challenge.xpReward, `Debug Detective: ${challenge.title}`);
    } else {
      loseHeart();
    }
  };

  const isOverallCorrect =
    selectedLine === bugLine?.lineNumber && selectedFix === challenge.correctFixIndex;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-rose-400 mb-1">
          <Bug className="w-4 h-4 text-rose-500" />
          <span>Debug Detective</span>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {challenge.instruction}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {stage === 'find_line'
            ? 'Inspect the code snippet and click the exact line causing the bug.'
            : 'Bug identified! Now select the correct fix to patch the vulnerability.'}
        </p>
      </div>

      {/* Code Inspection Block with clickable line numbers */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs shadow-inner">
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[10px]">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Code2 className="w-3 h-3" /> buggy_script.py
          </span>
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 1 Bug Present
          </span>
        </div>

        <div className="p-3 divide-y divide-slate-900">
          {challenge.codeLines.map((line) => {
            const isSelected = selectedLine === line.lineNumber;
            const isThisBug = line.isBug;

            let lineStyle = 'hover:bg-slate-900 cursor-pointer';
            if (stage !== 'find_line') {
              if (isThisBug) {
                lineStyle = 'bg-rose-500/20 text-rose-300 font-bold border-l-4 border-l-rose-500';
              }
            } else if (isSelected) {
              lineStyle = 'bg-indigo-600/30 text-indigo-200 font-bold border-l-4 border-l-indigo-500';
            }

            return (
              <div
                key={line.lineNumber}
                onClick={() => handleLineClick(line.lineNumber)}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${lineStyle}`}
              >
                <span className="text-slate-600 select-none w-6 text-right font-semibold">
                  {line.lineNumber}
                </span>
                <span className="text-emerald-300 flex-1">{line.code}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage 1 action */}
      {stage === 'find_line' && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            {selectedLine ? `Line ${selectedLine} selected` : 'Click a line above'}
          </span>
          <button
            onClick={handleConfirmLine}
            disabled={selectedLine === null}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-glow-indigo transition-all"
          >
            Identify Bug on Line {selectedLine || ''}
          </button>
        </div>
      )}

      {/* Stage 2: Pick the Correct Fix */}
      {stage === 'pick_fix' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-700 dark:text-rose-300">
            <strong>Bug spotted on line {bugLine?.lineNumber}!</strong> {challenge.bugDescription}
          </div>

          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Select the correct fix:</span>
          <div className="space-y-2">
            {challenge.fixOptions.map((fix, fIdx) => (
              <button
                key={fIdx}
                onClick={() => handleFixSubmit(fIdx)}
                className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-left text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all flex items-center justify-between"
              >
                <span>{fix}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stage 3: Result & Explanation */}
      {stage === 'result' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md"
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase flex items-center gap-1.5 ${
                isOverallCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isOverallCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Bug Fixed & Tested (+{challenge.xpReward} XP)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Incorrect Fix Selected (-1 Heart)
                </>
              )}
            </span>

            {!isOverallCorrect && (
              <button
                onClick={() =>
                  askAiAboutMistake({
                    questionText: challenge.instruction,
                    userAnswer: `Line ${selectedLine} with fix: ${challenge.fixOptions[selectedFix!]}`,
                    correctAnswer: `Line ${bugLine?.lineNumber} with fix: ${challenge.fixOptions[challenge.correctFixIndex]}`,
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
              onClick={() => onComplete(isOverallCorrect, isOverallCorrect ? challenge.xpReward : 0)}
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
