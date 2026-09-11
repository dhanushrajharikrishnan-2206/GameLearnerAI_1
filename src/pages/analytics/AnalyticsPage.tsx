import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Zap,
  Clock,
  Target,
  Flame,
  Award,
  TrendingUp,
  Brain,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsSummary } from '../../types';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await analyticsService.getAnalyticsSummary(timeframe);
      setData(res);
      setLoading(false);
    };
    fetchData();
  }, [timeframe]);

  const handleDownloadReport = async () => {
    setDownloading(true);
    const { downloadUrl, filename } = await analyticsService.downloadReport();
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Skeleton className="h-28" count={6} />
        </div>
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  const chartData = timeframe === '7d' ? data.weeklyActivity : data.monthlyActivity;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Learner Performance Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Cognitive Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into your accuracy velocity, XP compounding rates, and subject distribution.
          </p>
        </div>

        {/* Timeframe & Export */}
        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {(['7d', '30d', '90d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                  timeframe === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>{downloading ? 'Generating...' : 'Download Report'}</span>
          </button>
        </div>
      </div>

      {/* 6 High-Level KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total XP</span>
          <div className="text-xl font-black text-indigo-500 mt-1">{data.totalXp.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+18% this month</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Learning Hours</span>
          <div className="text-xl font-black text-cyan-400 mt-1">{data.learningHours} hrs</div>
          <span className="text-[10px] text-slate-400 font-semibold">Across 4 subjects</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Accuracy</span>
          <div className="text-xl font-black text-emerald-400 mt-1">{data.averageAccuracy}%</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Tier: Exceptional</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Questions Solved</span>
          <div className="text-xl font-black text-purple-400 mt-1">{data.questionsSolved}</div>
          <span className="text-[10px] text-slate-400 font-semibold">82% first-try pass</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Current Streak</span>
          <div className="text-xl font-black text-amber-500 mt-1">{data.currentStreak} Days</div>
          <span className="text-[10px] text-amber-500 font-semibold">🔥 Unbroken</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Skills Mastered</span>
          <div className="text-xl font-black text-blue-400 mt-1">{data.skillsMastered}</div>
          <span className="text-[10px] text-slate-400 font-semibold">Of 12 in Tree</span>
        </div>
      </div>

      {/* Primary Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy and Focus Minutes Trend */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
            Accuracy & Focus Duration
          </h3>
          <p className="text-xs text-slate-400 mb-6">Daily accuracy percentages vs study time.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Accuracy %"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  name="Study Minutes"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Velocity Over Time */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
            XP Compounding Growth
          </h3>
          <p className="text-xs text-slate-400 mb-6">Experience points accumulated across adaptive quizzes.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
                <Bar dataKey="xp" name="Earned XP" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Mastery vs Cohort Benchmark */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
            Domain Mastery vs Level 12 Cohort
          </h3>
          <p className="text-xs text-slate-400 mb-6">Comparing your scores with global benchmarks.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topicMastery}>
                <XAxis dataKey="topic" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '1rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="mastery" name="Your Mastery" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="benchmark" name="Benchmark" fill="#475569" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
              Solved Question Difficulty Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown of challenge tiers faced.</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.difficultyDistribution}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.difficultyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '1rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
            High volume in Medium & Hard proves advanced adaptive progression.
          </div>
        </div>
      </div>
    </div>
  );
};
