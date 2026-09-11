import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Code2,
  Brain,
  RotateCcw
} from 'lucide-react';
import { quizService } from '../../services/quizService';
import { Quiz, QuizQuestion, DifficultyLevel } from '../../types';
import { DifficultyBadge } from '../../components/gamification/DifficultyBadge';
import { AdaptiveEngineIndicator } from '../../components/gamification/AdaptiveEngineIndicator';
import { useGamification } from '../../context/GamificationContext';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const AdaptiveQuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { awardXp, triggerConfetti } = useGamification();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Timer per question
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Adaptive Engine Dynamic State
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('Medium');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [adaptationBanner, setAdaptationBanner] = useState<string | null>(null);

  // History tracking for final AI Analysis
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selectedOption: number; timeTaken: number }[]
  >([]);
  const [difficultyHistory, setDifficultyHistory] = useState<
    { questionIndex: number; difficulty: DifficultyLevel }[]
  >([{ questionIndex: 0, difficulty: 'Medium' }]);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const data = await quizService.getQuizById(quizId || 'quiz_py_functions');
      setQuiz(data);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  // Question Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  if (loading || !quiz) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  const currentQ: QuizQuestion = quiz.questions[currentIndex] || quiz.questions[0];
  const isCorrect = selectedOption === currentQ.correctAnswer;
  const progressPercent = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);

  // Live Adaptive Logic (Requirement #27 & #15)
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const answeredCorrectly = selectedOption === currentQ.correctAnswer;

    if (answeredCorrectly) {
      awardXp(currentQ.xpValue, `Question ${currentIndex + 1} Correct`);
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);
      setConsecutiveIncorrect(0);

      // ADAPTIVE TRIGGER: 2 or more consecutive correct answers escalates difficulty to Hard!
      if (newConsecutive >= 2 && currentDifficulty !== 'Hard') {
        setCurrentDifficulty('Hard');
        setAdaptationBanner(
          '🧠 Adaptive AI: Outstanding precision detected! Difficulty increased from Medium → Hard for upcoming challenge.'
        );
        triggerConfetti();
      }
    } else {
      const newIncorrect = consecutiveIncorrect + 1;
      setConsecutiveIncorrect(newIncorrect);
      setConsecutiveCorrect(0);

      // ADAPTIVE TRIGGER: repeated mistake adjusts difficulty down
      if (newIncorrect >= 2 && currentDifficulty !== 'Easy') {
        setCurrentDifficulty('Easy');
        setAdaptationBanner(
          '🧠 Adaptive AI: Challenge difficulty adjusted to Easy. Providing focused hint scaffolding.'
        );
      }
    }

    // Record submission history
    const record = {
      questionId: currentQ.id,
      selectedOption,
      timeTaken: timerSeconds
    };
    setUserAnswers((prev) => [...prev, record]);
  };

  const handleNextQuestion = async () => {
    const nextIdx = currentIndex + 1;
    setDifficultyHistory((prev) => [
      ...prev,
      { questionIndex: nextIdx, difficulty: currentDifficulty }
    ]);

    if (nextIdx < quiz.questions.length) {
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setTimerSeconds(0);
      setAdaptationBanner(null);
    } else {
      // Quiz completed! Submit to service and navigate to AI Results
      setLoading(true);
      const finalResult = await quizService.submitQuiz(
        quiz.id,
        [...userAnswers, { questionId: currentQ.id, selectedOption: selectedOption!, timeTaken: timerSeconds }],
        difficultyHistory
      );
      // Persist results in sessionStorage for results page
      sessionStorage.setItem('last_quiz_result', JSON.stringify(finalResult));
      navigate(`/quiz/${quiz.id}/result`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Gamified Quiz Header */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>
            <DifficultyBadge difficulty={currentDifficulty} size="sm" isPulsing={!!adaptationBanner} />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate max-w-xs sm:max-w-md">
            {quiz.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Question Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{timerSeconds}s</span>
          </div>

          {/* XP pool */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-xs border border-indigo-500/30">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+{currentQ.xpValue} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Dynamic Adaptation Notice Banner (Requirement #15 & #40 Hackathon Demo) */}
      <AnimatePresence>
        {adaptationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-indigo-950 border border-cyan-400/50 text-cyan-200 text-xs shadow-glow-cyan flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }}>
                <Brain className="w-4 h-4" />
              </div>
              <span className="font-semibold leading-relaxed">{adaptationBanner}</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 font-mono text-[10px] font-extrabold text-cyan-300 uppercase">
              ADAPTED
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
            <span>Topic: {currentQ.topic}</span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Need Hint?'}</span>
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Code Snippet block if present */}
        {currentQ.codeSnippet && (
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[10px] font-mono text-indigo-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> {currentQ.codeLanguage || 'python'}
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{currentQ.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Hint Box */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{currentQ.hint}</span>
          </motion.div>
        )}

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isThisSelected = selectedOption === idx;
            const isThisCorrect = idx === currentQ.correctAnswer;

            let optionStyle =
              'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-indigo-500/50';

            if (isAnswerSubmitted) {
              if (isThisCorrect) {
                optionStyle =
                  'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald font-bold';
              } else if (isThisSelected) {
                optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
              } else {
                optionStyle = 'opacity-50 border-slate-800 text-slate-500';
              }
            } else if (isThisSelected) {
              optionStyle =
                'bg-indigo-600/15 border-indigo-500 text-indigo-400 dark:text-indigo-300 shadow-glow-indigo font-bold';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerSubmitted}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/60 flex items-center justify-center text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswerSubmitted && (
                  <div>
                    {isThisCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isThisSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation Card */}
        {isAnswerSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="font-extrabold text-sm flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Correct! +{currentQ.xpValue} XP Earned</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Incorrect — Review Concept</span>
                </>
              )}
            </div>
            <p className="text-slate-300 mt-1">{currentQ.explanation}</p>
          </motion.div>
        )}

        {/* Action Button Row */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => navigate('/learn')}
            className="text-xs text-slate-400 hover:text-slate-200 font-semibold"
          >
            Leave Challenge
          </button>

          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-glow-indigo transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Submit Answer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-glow-indigo hover:brightness-110 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>{currentIndex + 1 < quiz.questions.length ? 'Next Adaptive Question' : 'View AI Analysis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Adaptive Engine Live Telemetry Card at bottom */}
      <AdaptiveEngineIndicator
        currentDifficulty={currentDifficulty}
        recentAccuracy={userAnswers.length > 0 ? Math.round((userAnswers.filter((a, i) => a.selectedOption === (quiz.questions[i]?.correctAnswer ?? 0)).length / userAnswers.length) * 100) : 84}
        adaptationNotice={adaptationBanner}
      />
    </div>
  );
};
