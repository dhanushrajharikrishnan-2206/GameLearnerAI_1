import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Flame,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  ArrowUpRight,
  Shield,
  RotateCcw,
  Target,
  BookOpen,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { XPBar } from '../../components/gamification/XPBar';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { DifficultyBadge } from '../../components/gamification/DifficultyBadge';
import { MissionCard } from '../../components/gamification/MissionCard';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsSummary } from '../../types';
import { DashboardSkeleton } from '../../components/common/SkeletonLoader';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { missions } = useGamification();
  const navigate = useNavigate();

  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const data = await analyticsService.getAnalyticsSummary(timeframe === '7d' ? '7d' : '30d');
      setAnalyticsData(data);
      setLoading(false);
    };
    fetchAnalytics();
  }, [timeframe]);

  if (loading || !analyticsData || !user) {
    return <DashboardSkeleton />;
  }

  const chartData = timeframe === '7d' ? analyticsData.weeklyActivity : analyticsData.monthlyActivity;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Good morning, {user.name.split(' ')[0]} 👋
            </h1>
            <LevelBadge level={user.level} size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ready to continue your learning adventure?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/quiz/quiz_py_functions')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-extrabold text-xs shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Adaptive Challenge</span>
          </button>
        </div>
      </div>

      {/* Chosen Topics & Database Status Banner */}
      <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">Your Chosen Learning Topics</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-200">
                <Database className="w-3 h-3 text-emerald-600" />
                SQLite Synced
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {(user.interests && user.interests.length > 0
                ? user.interests
                : ['Programming', 'AI & Machine Learning', 'Data Science']
              ).map((topic) => (
                <span
                  key={topic}
                  className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="self-start sm:self-auto text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors"
        >
          <span>Manage Topics</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* XP Card */}
        <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold mb-2">
            <span>Total XP</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {user.xp.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {(user.xpToNextLevel - user.xp).toLocaleString()} to Lvl {user.level + 1}
            </p>
          </div>
          <div className="mt-3">
            <XPBar currentXp={user.xp} xpToNextLevel={user.xpToNextLevel} showDetails={false} />
          </div>
        </div>

        {/* Level Card */}
        <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mb-2">
            <span>Rank Level</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              Level {user.level}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold truncate mt-0.5">
              {user.title}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Tier: Gold</span>
            <span>Top 5%</span>
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-500 font-bold mb-2">
            <span>Daily Streak</span>
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {user.streak} Days
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              3 days to Freeze Bonus
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i < (user.streak % 7 || 7)
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-slate-100'
                }`}
                title={day}
              />
            ))}
          </div>
        </div>

        {/* Weekly Time Card */}
        <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold mb-2">
            <span>Study Time</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {user.learningTimeMinutes ? `${(user.learningTimeMinutes / 60).toFixed(1)} hrs` : '47.3 hrs'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Goal: {(user.dailyGoalMinutes || 30) * 7}m / week
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-emerald-600 font-semibold">
            <span>+14% vs last week</span>
            <span>On Pace</span>
          </div>
        </div>

        {/* Mastery Card */}
        <div className="col-span-2 lg:col-span-1 p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold mb-2">
            <span>Overall Mastery</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              {user.overallMastery}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              8 of 10 skills verified
            </p>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${user.overallMastery}%` }} />
          </div>
        </div>
      </div>

      {/* 🎮 5-MINUTE ADVENTURE PRIMARY HERO BANNER (Section 13 & 14) */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 border-2 border-emerald-300/60 shadow-2xl shadow-emerald-600/15 overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> YOUR ADVENTURE
              </span>
              <span className="text-emerald-200">•</span>
              <span className="text-xs text-amber-300 font-bold">Session Ready (5 Minutes)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Start Your 5-Minute Adventure
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50 mt-1.5 leading-relaxed">
              Dynamically synthesized from your recent accuracy, streak momentum, and algorithmic weak spots. Clear 4 tactical micro-challenges to unlock the <strong className="text-amber-300">Recursion Beast</strong>.
            </p>

            {/* Upcoming challenges preview pipeline */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[11px] font-semibold text-emerald-100 mr-1">Includes:</span>
              <span className="px-2.5 py-1 rounded-lg text-xs bg-white/95 border border-emerald-200 text-emerald-950 shadow-sm font-bold">
                1. Quick Choice
              </span>
              <span className="text-emerald-200">→</span>
              <span className="px-2.5 py-1 rounded-lg text-xs bg-white/95 border border-emerald-200 text-emerald-950 shadow-sm font-bold">
                2. Match & Connect
              </span>
              <span className="text-emerald-200">→</span>
              <span className="px-2.5 py-1 rounded-lg text-xs bg-white/95 border border-emerald-200 text-emerald-950 shadow-sm font-bold">
                3. Code Builder
              </span>
              <span className="text-emerald-200">→</span>
              <span className="px-2.5 py-1 rounded-lg text-xs bg-white/95 border border-emerald-200 text-emerald-950 shadow-sm font-bold">
                4. Debug Detective
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigate('/adventure')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm shadow-xl shadow-emerald-950/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <span>START 5-MINUTE ADVENTURE</span>
              <ChevronRight className="w-5 h-5 text-emerald-700" />
            </button>
          </div>
        </div>
      </div>

      {/* BOSS BATTLE SPOTLIGHT & MINI-GAMES SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Boss Battle Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50/90 via-white to-red-50/60 dark:from-red-950/60 dark:via-slate-900 dark:to-slate-900 border border-rose-200/90 dark:border-red-500/40 shadow-sm dark:shadow-lg dark:shadow-red-950/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 dark:bg-red-500/20 text-rose-600 dark:text-red-300 border border-rose-300 dark:border-red-500/40 flex items-center gap-1">
                ⚔️ BOSS BATTLE
              </span>
              <span className="text-xs font-mono text-rose-600 dark:text-red-400 font-bold">100 HP</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              The Recursion Beast 🐉
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Devourer of call stacks and infinite loops. Strike with precision code answers to deal heavy damage!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+250 XP • +50 Coins</span>
            <button
              onClick={() => navigate('/play/boss-recursion-beast')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Fight Boss
            </button>
          </div>
        </div>

        {/* Speed Round Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border border-amber-200/90 dark:border-amber-500/40 shadow-sm dark:shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 flex items-center gap-1">
                ⚡ SPEED ROUND
              </span>
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">60 Seconds</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Web Dev Blitz ⏱️
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Rapid-fire challenge! Answer as many questions as possible before the clock expires for combo multipliers.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+80 XP • Speed Bonus</span>
            <button
              onClick={() => navigate('/play/sr-web-fundamentals')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Start Blitz
            </button>
          </div>
        </div>

        {/* Code Builder Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/60 dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-900 border border-cyan-200/90 dark:border-cyan-500/40 shadow-sm dark:shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 flex items-center gap-1">
                🧩 CODE BUILDER
              </span>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">Python</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Puzzle Assembly 💻
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Assemble interactive syntax blocks into working algorithms and verify output live!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">+55 XP • Syntax Mastery</span>
            <button
              onClick={() => navigate('/play/cb-array-filter')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Assemble
            </button>
          </div>
        </div>
      </div>

      {/* AI Insight Section (Requirement #11 prominent highlight) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-950/40 to-slate-900/60 border border-cyan-500/40 shadow-glow-cyan">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  AI Adaptive Insight
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                  Recommended Action
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Accuracy Drift Detected in Recursive Functions
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                You are consistently strong in programming logic, but your accuracy in recursion has dropped by <strong className="text-rose-400">12%</strong> this week. We recommend a medium-difficulty recursion challenge.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/quiz/quiz_py_functions')}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs shadow-glow-cyan transition-all active:scale-95 flex items-center justify-center gap-2 flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Recursion</span>
          </button>
        </div>
      </div>

      {/* Missions and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Missions (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Today's Missions</h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Resets in 11h 24m
            </span>
          </div>

          <div className="space-y-3">
            {missions.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                onNavigate={(url) => navigate(url)}
              />
            ))}
          </div>
        </div>

        {/* Skill Mastery Radar / Radar View */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-500" />
              Skill Mastery Radar
            </h3>
            <button
              onClick={() => navigate('/skill-tree')}
              className="text-xs text-indigo-500 hover:text-indigo-400 font-bold"
            >
              Tree &rarr;
            </button>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analyticsData.topicMastery}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="topic" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                <Radar
                  name="Mastery"
                  dataKey="mastery"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            {analyticsData.topicMastery.slice(0, 3).map((item) => (
              <div key={item.topic} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{item.topic}</span>
                <span className="text-indigo-500 font-extrabold">{item.mastery}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Weekly Learning Velocity
            </h3>
            <p className="text-xs text-slate-400">Track your daily focus minutes and earned XP output.</p>
          </div>

          {/* Timeframe filters */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === '7d'
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === '30d'
                  ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                name="Minutes Studied"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMinutes)"
              />
              <Area
                type="monotone"
                dataKey="xp"
                name="XP Earned"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorXp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
