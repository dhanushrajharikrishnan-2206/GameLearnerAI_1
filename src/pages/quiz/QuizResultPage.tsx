import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  Zap,
  Clock,
  Target,
  ArrowRight,
  TrendingUp,
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Compass
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { DifficultyBadge } from '../../components/gamification/DifficultyBadge';
import { QuizResult } from '../../types';

export const QuizResultPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { triggerConfetti } = useGamification();

  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    // Trigger celebration confetti upon arriving at results
    triggerConfetti();

    // Retrieve last result from sessionStorage or mock fallback
    const saved = sessionStorage.getItem('last_quiz_result');
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse last_quiz_result', e);
      }
    } else {
      // Fallback realistic demo result
      setResult({
        quizId: quizId || 'quiz_py_functions',
        quizTitle: 'Adaptive Challenge: Functions, Scope & Recursion',
        subject: 'Programming (Python)',
        score: 4,
        totalQuestions: 5,
        accuracy: 80,
        timeSpentSeconds: 68,
        xpEarned: 320,
        coinsEarned: 110,
        difficultyProgression: [
          { questionIndex: 0, difficulty: 'Medium' },
          { questionIndex: 1, difficulty: 'Medium' },
          { questionIndex: 2, difficulty: 'Hard' },
          { questionIndex: 3, difficulty: 'Hard' },
          { questionIndex: 4, difficulty: 'Hard' }
        ],
        answersBreakdown: [
          {
            questionId: 'q1',
            questionText: 'What is the output of the following Python snippet? (calc_bonus)',
            userAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            difficulty: 'Medium',
            timeTakenSeconds: 8.4
          },
          {
            questionId: 'q2',
            questionText: 'What data structure is args inside def log_stats(*args)?',
            userAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            difficulty: 'Medium',
            timeTakenSeconds: 11.2
          },
          {
            questionId: 'q3',
            questionText: 'What will this Python closure output when executed?',
            userAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            difficulty: 'Hard',
            timeTakenSeconds: 15.6
          },
          {
            questionId: 'q4',
            questionText: 'Consider countdown(n). What is the exact maximum depth of the call stack?',
            userAnswer: 0,
            correctAnswer: 1,
            isCorrect: false,
            difficulty: 'Hard',
            timeTakenSeconds: 18.2
          },
          {
            questionId: 'q5',
            questionText: 'What does list(map(..., filter(...))) return?',
            userAnswer: 0,
            correctAnswer: 0,
            isCorrect: true,
            difficulty: 'Hard',
            timeTakenSeconds: 14.6
          }
        ],
        aiAnalysis: {
          overallSummary:
            'Phenomenal mastery displayed! The adaptive AI detected exceptional rapid comprehension in first-class functions and closures, dynamically scaling question difficulty up to Hard.',
          strengths: [
            'Instant recognition of default parameter overrides',
            'Strong comprehension of Python LEGB lexical scoping rules',
            'Swift response times during introductory algorithmic checks'
          ],
          growthAreas: [
            'Recursion call stack unwinding under multiple recursive branches',
            'Evaluating combined filter-map higher order pipelining'
          ],
          accuracyTrendNote: 'Your accuracy increased by +18% compared to prior sessions.',
          responseTimeNote: 'Average time per question was 13.6s (24% faster than global benchmark).',
          recommendedNextStep: {
            title: 'Practice Recursion – Medium Difficulty Drill',
            reason:
              'Targeted drill focusing on base-case identification and recursive call stack depth.',
            difficulty: 'Medium',
            actionUrl: '/quiz/quiz_py_functions'
          }
        }
      });
    }
  }, [quizId]);

  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Banner Celebration */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-indigo-950/90 via-purple-950/70 to-slate-900 border border-indigo-500/40 shadow-glow-indigo text-center relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-glow-gold mb-4 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Challenge Complete
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">{result.quizTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
          AI Adaptive difficulty dynamically calibrated to your performance in real time.
        </p>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Final Score</span>
            <p className="text-2xl font-black text-white mt-0.5">
              {result.score}/{result.totalQuestions}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">{result.accuracy}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total XP</span>
            <p className="text-2xl font-black text-cyan-300 mt-0.5">+{result.xpEarned}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Time Taken</span>
            <p className="text-2xl font-black text-slate-300 mt-0.5">{result.timeSpentSeconds}s</p>
          </div>
        </div>
      </div>

      {/* Adaptive Difficulty Progression Timeline (Requirement #15 & #16) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Dynamic Difficulty Progression
            </h3>
            <p className="text-xs text-slate-400">
              How the AI adapted question difficulty as you answered.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full">
            AI Engine Telemetry
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
          {result.answersBreakdown.map((item, idx) => (
            <div
              key={item.questionId}
              className={`flex-1 min-w-[120px] p-3 rounded-2xl border text-center ${
                item.isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {item.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className="text-[11px] font-bold">Q{idx + 1}</span>
              </div>
              <div className="mt-1">
                <DifficultyBadge difficulty={item.difficulty} size="sm" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{item.timeTakenSeconds}s</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Performance Analysis Section (Requirement #16) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 shadow-glow-indigo space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                AI Cognitive Diagnostics
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                Synthesized
              </span>
            </div>
            <h2 className="text-lg font-black text-white">AI Performance Analysis</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {result.aiAnalysis.overallSummary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strong Cognitive Areas
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.aiAnalysis.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Opportunities for Mastery
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.aiAnalysis.growthAreas.map((gro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{gro}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Next Step Box (Requirement #16 & #40 Hackathon Story) */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-cyan-500/50 shadow-glow-cyan flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                Recommended Next Step
              </span>
              <DifficultyBadge
                difficulty={result.aiAnalysis.recommendedNextStep.difficulty}
                size="sm"
              />
            </div>
            <h3 className="text-base font-black text-white">
              {result.aiAnalysis.recommendedNextStep.title}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {result.aiAnalysis.recommendedNextStep.reason}
            </p>
          </div>

          <button
            onClick={() => navigate(result.aiAnalysis.recommendedNextStep.actionUrl)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs shadow-glow-cyan transition-all active:scale-95 flex items-center gap-2 flex-shrink-0"
          >
            <span>Start Recommended Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Nav actions */}
      <div className="flex items-center justify-between pt-4">
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          Return to Dashboard
        </Link>
        <Link
          to="/learn"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo transition-all flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>Continue World Adventure</span>
        </Link>
      </div>
    </div>
  );
};
