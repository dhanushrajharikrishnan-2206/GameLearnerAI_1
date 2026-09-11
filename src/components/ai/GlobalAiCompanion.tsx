import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ChevronRight,
  Lightbulb,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { ChatMessage } from '../../types/game.types';
import { useGamification } from '../../context/GamificationContext';
import { useAuth } from '../../context/AuthContext';
import { aiTutorService } from '../../services/aiTutorService';
import { soundFx } from '../../utils/soundEffects';
import { AiMessageRenderer } from './AiMessageRenderer';

type TutorMode = 'tutor' | 'hint' | 'practice' | 'quiz' | 'review' | 'motivation';

export const GlobalAiCompanion: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isChatOpen, 
    setIsChatOpen, 
    activeMistake, 
    awardXp
  } = useGamification();

  const [messages, setMessages] = useState<ChatMessage[]>(() => aiTutorService.getInitialMessages());
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<TutorMode>('tutor');
  const [isSocratic, setIsSocratic] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quizAnsweredMap, setQuizAnsweredMap] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedMistakeRef = useRef<string | null>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatOpen]);

  // Handle triggered mistake analysis from "Ask AI Why"
  useEffect(() => {
    if (activeMistake && isChatOpen) {
      const mistakeKey = `${activeMistake.questionText}-${activeMistake.userAnswer}`;
      if (lastProcessedMistakeRef.current === mistakeKey) return;
      lastProcessedMistakeRef.current = mistakeKey;

      const explainMistake = async () => {
        setIsTyping(true);
        const mistakePrompt = `Explain why my answer was wrong:\nQuestion: "${activeMistake.questionText}"\nMy Answer: "${activeMistake.userAnswer}"\nCorrect Answer: "${activeMistake.correctAnswer}"`;

        // Add user message
        const userMsg: ChatMessage = {
          id: `user-${Date.now()}`,
          sender: 'user',
          text: `Why was my answer "${activeMistake.userAnswer}" wrong for: "${activeMistake.questionText}"?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);

        const response = await aiTutorService.respondToMessage(mistakePrompt, {
          lastMistake: activeMistake,
          mode: 'review',
          currentStreak: user?.streak || 4
        });

        setIsTyping(false);
        setMessages(prev => [...prev, response]);
      };

      explainMistake();
    }
  }, [activeMistake, isChatOpen, user?.streak]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await aiTutorService.respondToMessage(text, {
        mode: activeMode,
        isSocratic,
        currentStreak: user?.streak || 4,
        skillLevel: user?.level ? `Level ${user.level}` : 'Intermediate'
      });

      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      setIsTyping(false);
      console.error('AI chat error', err);
    }
  };

  const handleResetChat = () => {
    setMessages(aiTutorService.getInitialMessages());
    setQuizAnsweredMap({});
  };

  const handleModeSelect = (mode: TutorMode) => {
    setActiveMode(mode);
    if (mode === 'quiz') {
      handleSendMessage('Quiz me with an interactive challenge!');
    } else if (mode === 'practice') {
      handleSendMessage('I want to practice with an interactive mini-game!');
    } else if (mode === 'hint') {
      handleSendMessage('Can you give me a subtle hint?');
    } else if (mode === 'motivation') {
      handleSendMessage('I need some motivation');
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInChatQuizAnswer = (msgId: string, selectedIdx: number, correctIdx: number, xp: number) => {
    if (quizAnsweredMap[msgId] !== undefined) return;

    setQuizAnsweredMap(prev => ({ ...prev, [msgId]: selectedIdx }));

    if (selectedIdx === correctIdx) {
      soundFx.playCorrect();
      awardXp(xp, 'AI In-Chat Challenge');
    } else {
      soundFx.playIncorrect();
    }
  };

  const handleLaunchGame = (gameId?: string) => {
    setIsChatOpen(false);
    if (gameId) {
      navigate(`/play/${gameId}`);
    } else {
      navigate('/adventure');
    }
  };

  const quickActions = [
    { label: 'Explain simply', prompt: 'Can you explain this concept in simple terms for a beginner?' },
    { label: 'Show code example', prompt: 'Can you provide a practical code example illustrating this?' },
    { label: 'Quiz me (+XP)', prompt: 'Quiz me with an interactive challenge!' },
    { label: 'Give me a hint', prompt: 'Can you give me a subtle hint without spoiling the full solution?' },
    { label: 'Practice arena', prompt: 'I want to practice with a real mini-game challenge!' }
  ];

  return (
    <>
      {/* FLOATING ACTION BUTTON (Desktop & Mobile) */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-600 text-white shadow-2xl shadow-emerald-600/30 border border-emerald-300/40 flex items-center gap-2 group cursor-pointer"
          aria-label="Open AI Tutor Chat"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-white" />
          </div>
          <span className="text-sm font-bold hidden sm:inline-block pr-1">
            GameLearn AI
          </span>
        </motion.button>
      )}

      {/* EXPANDABLE CHAT PANEL */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-16 sm:top-auto sm:bottom-6 sm:right-6 sm:inset-x-auto sm:w-[460px] sm:h-[650px] z-50 flex flex-col bg-white border border-emerald-200 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-emerald-950/15 overflow-hidden backdrop-blur-xl"
          >
            {/* CHAT HEADER */}
            <div className="px-5 py-4 bg-emerald-50/95 border-b border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                  <Bot className="w-5 h-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    GameLearn AI
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-800 border border-emerald-400/30">
                      Tutor
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-700">Personal Adaptive Companion</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Reset / New Session */}
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-800 hover:bg-emerald-100/60 transition-colors"
                  title="Start fresh conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Socratic Mode Toggle */}
                <button
                  onClick={() => setIsSocratic(!isSocratic)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                    isSocratic
                      ? 'bg-amber-500/20 text-amber-800 border-amber-500/40 shadow-sm'
                      : 'bg-white text-slate-600 border-emerald-200 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
                  title="Socratic mode guides you with probing questions instead of revealing direct answers"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Socratic {isSocratic ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-100/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODE SELECTION TABS */}
            <div className="px-4 py-2 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-medium">
              {(['tutor', 'hint', 'practice', 'quiz', 'review', 'motivation'] as TutorMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeSelect(mode)}
                  className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                    activeMode === mode
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/70'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* MESSAGE STREAM */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed relative group ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md'
                        : 'bg-emerald-50/70 text-slate-800 rounded-bl-none border border-emerald-100 shadow-sm'
                    }`}
                  >
                    {/* Socratic indicator badge */}
                    {msg.isSocratic && (
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                        <Lightbulb className="w-3 h-3" /> Socratic Guidance
                      </div>
                    )}

                    {/* Rich Markdown & Code Renderer */}
                    <AiMessageRenderer content={msg.text} isUser={msg.sender === 'user'} />

                    {/* Copy message button */}
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 rounded bg-white/80 shadow-sm border border-emerald-200/50 transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>

                    {/* IN-CHAT INTERACTIVE QUIZ CARD */}
                    {msg.action?.type === 'quiz_question' && msg.action.quizQuestion && (
                      <div className="mt-3 pt-3 border-t border-emerald-200/80 space-y-2.5 bg-white/70 p-3 rounded-xl border">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Knowledge Check
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            +{msg.action.quizQuestion.xp} XP
                          </span>
                        </div>
                        <p className="font-bold text-emerald-950 text-xs sm:text-sm">
                          {msg.action.quizQuestion.question}
                        </p>

                        <div className="space-y-1.5">
                          {msg.action.quizQuestion.options.map((opt, oIdx) => {
                            const isAnswered = quizAnsweredMap[msg.id] !== undefined;
                            const isSelected = quizAnsweredMap[msg.id] === oIdx;
                            const isCorrect = oIdx === msg.action!.quizQuestion!.correctIndex;

                            let optClass = 'bg-white border-emerald-200 hover:border-emerald-500 text-slate-800';
                            if (isAnswered) {
                              if (isCorrect) {
                                optClass = 'bg-emerald-100/90 border-emerald-500 text-emerald-900 font-bold';
                              } else if (isSelected) {
                                optClass = 'bg-red-50 border-red-500 text-red-700 font-semibold';
                              } else {
                                optClass = 'opacity-50 border-slate-200 text-slate-400';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleInChatQuizAnswer(
                                  msg.id, 
                                  oIdx, 
                                  msg.action!.quizQuestion!.correctIndex,
                                  msg.action!.quizQuestion!.xp
                                )}
                                disabled={isAnswered}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${optClass}`}
                              >
                                <span>{opt}</span>
                                {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {quizAnsweredMap[msg.id] !== undefined && (
                          <div className="mt-2 text-[11px] p-2.5 rounded-lg bg-emerald-50 text-slate-700 border border-emerald-200">
                            {quizAnsweredMap[msg.id] === msg.action.quizQuestion.correctIndex ? (
                              <span className="text-emerald-700 font-bold">✨ Correct! +{msg.action.quizQuestion.xp} XP awarded. </span>
                            ) : (
                              <span className="text-red-600 font-bold">Not quite. </span>
                            )}
                            {msg.action.quizQuestion.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* IN-CHAT GAME LAUNCH ACTION */}
                    {msg.action?.type === 'launch_game' && (
                      <div className="mt-3 pt-3 border-t border-emerald-200/80">
                        <button
                          onClick={() => handleLaunchGame(msg.action?.gameId)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                        >
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>{msg.action.label || 'Launch Interactive Challenge'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/70 w-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK ACTIONS PILLS */}
            <div className="px-4 py-2 bg-emerald-50/40 border-t border-emerald-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickActions.map((qa, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qa.prompt)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-emerald-200 whitespace-nowrap transition-colors shadow-sm cursor-pointer"
                >
                  {qa.label}
                </button>
              ))}
            </div>

            {/* INPUT FOOTER */}
            <div className="p-3 bg-emerald-50/70 border-t border-emerald-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isSocratic ? "Ask a thought or step..." : "Ask AI anything or request a quiz/code..."}
                  className="flex-1 bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-md shadow-emerald-600/30 transition-transform active:scale-95 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
