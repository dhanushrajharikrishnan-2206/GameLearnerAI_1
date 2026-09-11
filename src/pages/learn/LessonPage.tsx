import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  Zap,
  ArrowLeft,
  ArrowRight,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Code2
} from 'lucide-react';
import { lessonService } from '../../services/lessonService';
import { Lesson } from '../../types';
import { useGamification } from '../../context/GamificationContext';
import { DifficultyBadge } from '../../components/gamification/DifficultyBadge';
import { Skeleton } from '../../components/common/SkeletonLoader';
import { AiMessageRenderer } from '../../components/ai/AiMessageRenderer';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { awardXp } = useGamification();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [completed, setCompleted] = useState<boolean>(false);
  const [selectedCheckpointAnswer, setSelectedCheckpointAnswer] = useState<number | null>(null);
  const [isCheckpointSubmitted, setIsCheckpointSubmitted] = useState(false);

  // AI Tutor chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      text: "👋 Hi! I'm your AI In-Lesson Tutor. Ask me any conceptual question about this lesson or request a code snippet!",
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const data = await lessonService.getLessonById(lessonId || 'lesson_py_functions');
        setLesson(data);
      } catch (err) {
        console.error('Failed to load lesson', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isThinking) return;

    const queryText = inputQuery.trim();
    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await lessonService.askAiTutor(queryText, lesson?.title);
      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: response.answer,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Lesson AI Tutor error', err);
      const fallbackMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: "Functions encapsulate logic into reusable blocks. A recursive function must always have a well-defined base case to terminate, otherwise it causes a stack overflow!",
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCompleteLesson = async () => {
    awardXp(lesson?.xpReward || 250, `Completed: ${lesson?.title}`);
    navigate(`/quiz/${lesson?.associatedQuizId || 'quiz_py_functions'}`);
  };

  if (loading || !lesson) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="lg:col-span-2 h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Lesson Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/learn')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {lesson.worldTitle}
              </span>
              <DifficultyBadge difficulty={lesson.difficulty} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>~{lesson.estimatedMinutes} min</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-xs border border-indigo-500/30">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+{lesson.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* 3-Column Modern Learning Experience Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Navigation / Outline (3 Cols) */}
        <div className="lg:col-span-3 p-4 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-20">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Lesson Outline
          </h3>
          <ul className="space-y-1.5 text-xs">
            {lesson.blocks.map((b, idx) => (
              <li
                key={b.id}
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold cursor-pointer transition-colors flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {idx + 1}
                </span>
                <span className="truncate">{b.title || `Section ${idx + 1}`}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => navigate('/quiz/quiz_py_functions')}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 hover:text-white text-indigo-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Jump to Quiz Drill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Column: Core Lesson Content & Code Blocks (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
              <strong className="font-bold text-white block mb-1">Learning Target:</strong>
              {lesson.overview}
            </div>

            {lesson.blocks.map((block) => (
              <div key={block.id} className="space-y-3">
                {block.title && (
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-indigo-500" />
                    {block.title}
                  </h3>
                )}

                {block.type === 'text' && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {block.content}
                  </p>
                )}

                {block.type === 'code' && (
                  <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5 text-indigo-400">
                        <Code2 className="w-3.5 h-3.5" /> {block.codeLanguage || 'python'}
                      </span>
                      <span>Read-only snippet</span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{block.codeSnippet}</code>
                    </pre>
                    {block.content && (
                      <div className="p-3 bg-slate-900/50 border-t border-slate-800/80 text-xs text-slate-400">
                        {block.content}
                      </div>
                    )}
                  </div>
                )}

                {block.type === 'callout' && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Sparkles className="w-4 h-4" />
                      <span>{block.title}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{block.content}</p>
                  </div>
                )}

                {block.type === 'checkpoint' && block.checkpointQuestion && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-cyan-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mini Checkpoint Question</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {block.checkpointQuestion.question}
                    </p>

                    <div className="space-y-2">
                      {block.checkpointQuestion.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => {
                            setSelectedCheckpointAnswer(oIdx);
                            setIsCheckpointSubmitted(true);
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                            isCheckpointSubmitted
                              ? oIdx === block.checkpointQuestion?.correctIndex
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : selectedCheckpointAnswer === oIdx
                                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                              : selectedCheckpointAnswer === oIdx
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {isCheckpointSubmitted && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 animate-in fade-in">
                        {block.checkpointQuestion.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => navigate('/learn')}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Map</span>
            </button>
            <button
              onClick={handleCompleteLesson}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-electric-500 text-white font-extrabold text-xs shadow-glow-indigo hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Complete & Start Adaptive Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: AI Tutor Coach Panel ("Ask GameLearn AI") (3 Cols) */}
        <div className="lg:col-span-3 p-4 rounded-3xl bg-white border border-emerald-200 shadow-md flex flex-col h-[520px] sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-900">Ask GameLearn AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700">Online</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-2xl ${
                  m.sender === 'ai'
                    ? 'bg-emerald-50/80 border border-emerald-100 text-slate-800'
                    : 'bg-emerald-600 text-white ml-6 shadow-sm'
                }`}
              >
                <div className={`text-[10px] font-bold mb-1 ${m.sender === 'ai' ? 'text-emerald-700' : 'text-emerald-100'}`}>
                  {m.sender === 'ai' ? 'AI Coach' : 'You'}
                </div>
                <AiMessageRenderer content={m.text} isUser={m.sender === 'user'} />
              </div>
            ))}
            {isThinking && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>AI Tutor thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleAskAi} className="mt-3 pt-3 border-t border-emerald-100 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about recursion, scope, or code..."
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-white border border-emerald-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isThinking || !inputQuery.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
