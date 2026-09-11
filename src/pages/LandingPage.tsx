import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  BrainCircuit,
  Compass,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Target,
  BarChart3,
  Users,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LevelBadge } from '../components/gamification/LevelBadge';
import { DifficultyBadge } from '../components/gamification/DifficultyBadge';

export const LandingPage: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    await loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f2f9f5] text-slate-900 transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Floating Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl bg-white/90 border border-emerald-100 backdrop-blur-xl shadow-sm">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 flex items-center justify-center text-white shadow-glow-emerald">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900">
              GameLearn<span className="text-emerald-600">.AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-indigo-500 transition-colors">How It Works</a>
            <a href="#adaptive-ai" className="hover:text-indigo-500 transition-colors">Adaptive AI</a>
            <a href="#gamification" className="hover:text-indigo-500 transition-colors">Gamification</a>
            <a href="#why-us" className="hover:text-indigo-500 transition-colors">Why Us</a>
            <a href="#testimonials" className="hover:text-indigo-500 transition-colors">Learners</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="px-2.5 py-1.5 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors text-xs font-bold flex items-center gap-1 shadow-sm"
              title={theme === 'light-green' ? 'Light Green Theme (click for Clean Light)' : 'Clean Light (click for Light Green)'}
            >
              <span>{theme === 'light-green' ? '🌿 Light Green' : '☀️ Clean Light'}</span>
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-block px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={handleDemoClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-electric-500 text-white text-xs sm:text-sm font-extrabold shadow-glow-indigo hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Next-Gen Adaptive Learning Platform
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Turn Learning Into an{' '}
            <span className="text-gradient-brand">Adventure.</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            GameLearn AI adapts every challenge to your skill level, helping you learn smarter, stay motivated, and level up faster.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-electric-500 text-white font-extrabold text-base shadow-glow-indigo hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <span>Start Your Adventure</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-extrabold text-base border border-slate-200 dark:border-slate-800 shadow-md hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500/30" />
              <span>Explore Demo (Instant Access)</span>
            </button>
          </div>

          {/* Social Proof badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-Time Cognitive Scaling
            </span>
            <span className="flex items-center gap-1.5 hidden sm:flex">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free Demo Mode
            </span>
          </div>

          {/* Hero Mockup: Futuristic Game Dashboard Card */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-3xl p-3 bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-transparent border border-indigo-500/30 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-2xl bg-slate-900 border border-slate-800/90 p-5 sm:p-7 text-left overflow-hidden shadow-2xl">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Kishore Kumar"
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-base">Kishore Kumar</h3>
                      <LevelBadge level={12} size="sm" />
                    </div>
                    <p className="text-xs text-indigo-400 font-semibold">Algorithm Alchemist • Global Rank #4</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>14 Day Streak</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
                    <Zap className="w-4 h-4 fill-indigo-400 text-indigo-400" />
                    <span>8,420 XP</span>
                  </div>
                </div>
              </div>

              {/* Grid Content Mockup */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {/* Adventure Resume Card */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/40 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Continue Your Adventure
                    </span>
                    <DifficultyBadge difficulty="Medium" size="sm" />
                  </div>
                  <h4 className="text-lg font-black text-white">Python Fundamentals — Functions</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    Master closures, *args parameter unpacking, and lexical scope chains.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>⏱️ 20 min</span>
                      <span>⚡ +250 XP</span>
                    </div>
                    <button
                      onClick={handleDemoClick}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo transition-all flex items-center gap-1.5"
                    >
                      <span>Resume</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Adaptive AI Engine preview */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                      <BrainCircuit className="w-4 h-4 text-emerald-600" /> Adaptive Engine
                    </div>
                    <p className="text-xs text-slate-700">
                      Recent Accuracy: <strong className="text-emerald-700">84%</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Adaptive Difficulty calibrating upwards for algorithms drill.
                    </p>
                  </div>
                  <div className="mt-3 p-2 rounded-xl bg-emerald-100/70 border border-emerald-300 text-[11px] text-emerald-800">
                    Next Challenge: <span className="font-bold text-emerald-950">Hard</span> (Auto-scaled)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: Learn -> Practice -> Adapt -> Earn -> Level Up -> Master */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">The Learning Loop</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              How GameLearn AI Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Transform passive lectures into an addictive, high-retention cognitive adventure.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
            {[
              { step: '01', title: 'Learn', desc: 'Bite-sized visual lessons & code', icon: Code2, color: 'text-indigo-400' },
              { step: '02', title: 'Practice', desc: 'Interactive live checkpoints', icon: Target, color: 'text-blue-400' },
              { step: '03', title: 'Adapt', desc: 'Real-time AI difficulty shifts', icon: BrainCircuit, color: 'text-cyan-400' },
              { step: '04', title: 'Earn', desc: 'XP, badges & unlockable coins', icon: Zap, color: 'text-amber-400' },
              { step: '05', title: 'Level Up', desc: 'Ascend ranks & unlock worlds', icon: Trophy, color: 'text-purple-400' },
              { step: '06', title: 'Master', desc: 'Retain skills through spaced drills', icon: ShieldCheck, color: 'text-emerald-400' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/50 hover:-translate-y-1 transition-all text-center group"
                >
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Step {item.step}
                  </div>
                  <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Adaptive AI Engine Highlight */}
      <section id="adaptive-ai" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              <BrainCircuit className="w-3.5 h-3.5" /> Dynamic Cognitive Calibration
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              No More Too-Easy Boredom. No More Too-Hard Frustration.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Traditional platforms present the exact same static questions to everyone. GameLearn AI monitors response velocity, error patterns, and consecutive streaks to adjust difficulty live.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Speed & Accuracy Detection</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    If you solve challenges quickly, the AI automatically raises the bar to Hard, introducing edge-cases.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Intelligent Hint Scaffolding</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Struggling with a concept? The engine injects conceptual hints and steps back difficulty gracefully to rebuild confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-glow-indigo">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">AI Difficulty Transition Live Flow</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">Active Demonstration</span>
            </div>

            <div className="space-y-4 mt-5">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Question 1 (Medium)</p>
                  <p className="text-sm font-bold text-white">Default Argument Evaluation</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold">✓ Correct (8.4s)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Question 2 (Medium)</p>
                  <p className="text-sm font-bold text-white">Positional *args Mutability</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold">✓ Correct (11.2s)</span>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/50 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                <div>
                  <p className="text-xs font-bold text-cyan-300">AI Adaptation Triggered</p>
                  <p className="text-xs text-slate-300">2 consecutive rapid answers detected. Scaling to Hard.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/60 border border-rose-500/40 flex items-center justify-between">
                <div>
                  <p className="text-xs text-rose-400 font-bold uppercase">Question 3 (Hard — Scaled)</p>
                  <p className="text-sm font-bold text-white">Lexical Scopes & Nested Closures</p>
                </div>
                <span className="text-xs text-amber-400 font-bold">Max Mastery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Features Grid */}
      <section id="gamification" className="py-20 px-4 sm:px-6 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Addictive Gamification</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Built Like an RPG, Engineered for Mastery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 w-fit mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">World Adventure Maps</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Progress through themed worlds like "The Loop Realm" and "The Citadel of Dynamic Programming" with unlocked and mastered nodes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition-all">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Streaks & Missions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Keep the flame alive! Complete daily quests to earn bonus coins, streak protectors, and seasonal unlockable cosmetic titles.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/50 transition-all">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 w-fit mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Global Leaderboards</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Compete with students, friends, and engineers worldwide. Rise from Novice to Grandmaster Architect on weekly ladders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section: Why GameLearn AI */}
      <section id="why-us" className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Why GameLearn AI Outperforms Generic LMS Platforms
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
            <div className="grid grid-cols-3 p-4 bg-slate-50 dark:bg-slate-800/80 font-bold text-xs sm:text-sm border-b border-slate-200 dark:border-slate-800">
              <div>Features</div>
              <div className="text-indigo-600 dark:text-indigo-400 font-extrabold">GameLearn AI</div>
              <div className="text-slate-400">Traditional LMS</div>
            </div>

            {[
              ['Difficulty Calibration', 'Dynamic Real-Time AI Scaling', 'Static fixed quizzes'],
              ['Learning Architecture', 'RPG World Maps & Skill Trees', 'Boring long video lists'],
              ['Retention Mechanics', 'Daily Streaks, Missions, XP', 'Sporadic email reminders'],
              ['Diagnostics & Insights', 'Personalized AI Weakness Radar', 'Basic raw percentage marks'],
              ['Tutor Support', 'Instant In-Lesson AI Tutor', 'Slow forum responses']
            ].map(([feat, gl, trad], i) => (
              <div key={i} className="grid grid-cols-3 p-4 text-xs sm:text-sm border-b border-slate-100 dark:border-slate-800/60 items-center">
                <div className="font-semibold text-slate-800 dark:text-slate-200">{feat}</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {gl}
                </div>
                <div className="text-slate-400">{trad}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Loved by Hackers & Learners</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The adaptive engine is unreal. As soon as I answered two recursion problems right, the questions instantly demanded deeper call stack analysis!",
                author: "Aarav Sharma",
                role: "CS Student @ IIT",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
              },
              {
                quote: "I actually look forward to practicing dynamic programming every evening just to protect my 14-day streak and earn coins.",
                author: "Elena Rostova",
                role: "Aspiring Data Scientist",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
              },
              {
                quote: "The skill tree makes computer science feel like a skill build in an RPG game. You genuinely see where your knowledge connects.",
                author: "Marcus Chen",
                role: "Software Engineer",
                avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
              }
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.author}</h4>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-tr from-indigo-900 via-purple-900 to-indigo-950 text-white border border-indigo-500/40 shadow-glow-indigo text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-500/20 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight relative z-10">
            Ready to Level Up Your Mind?
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto relative z-10">
            Join thousands of learners on the ultimate AI-driven educational quest today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-indigo-950 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              Start Free Journey
            </Link>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600/60 hover:bg-indigo-600 text-white font-bold text-sm border border-indigo-400/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Demo Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
              G
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">GameLearn AI</span>
            <span>© 2026. Production Hackathon Build.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-indigo-500">Sign In</Link>
            <button onClick={handleDemoClick} className="hover:text-indigo-500">Demo Account</button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-500">Documentation</a>
            <a href="#" className="hover:text-indigo-500">Terms</a>
            <a href="#" className="hover:text-indigo-500">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
