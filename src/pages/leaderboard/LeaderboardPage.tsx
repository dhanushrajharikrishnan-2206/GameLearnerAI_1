import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Flame,
  Zap,
  Users,
  Globe,
  Sparkles,
  ArrowUp
} from 'lucide-react';
import { leaderboardService } from '../../services/leaderboardService';
import { LeaderboardEntry } from '../../types';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [scope, setScope] = useState<'global' | 'friends'>('global');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const data = await leaderboardService.getLeaderboard(timeframe, scope);
      setEntries(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, [timeframe, scope]);

  const topThree = entries.slice(0, 3);
  const restEntries = entries.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-glow-gold">
          <Crown className="w-5 h-5 fill-slate-950" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black flex items-center justify-center">
          3
        </div>
      );
    }
    return <span className="font-extrabold text-slate-400 text-sm">#{rank}</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Competitive Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rise through the tiers by conquering adaptive quizzes, maintaining streaks, and earning XP.
          </p>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setScope('global')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                scope === 'global' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global</span>
            </button>
            <button
              onClick={() => setScope('friends')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                scope === 'friends' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friends</span>
            </button>
          </div>

          <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {(['weekly', 'monthly', 'allTime'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  timeframe === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-96 rounded-3xl" />
      ) : (
        <div className="space-y-8">
          {/* Top 3 Podium Visual */}
          {topThree.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-8 max-w-4xl mx-auto">
              {/* Rank 2 (Silver) */}
              <div className="order-2 md:order-1 p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 text-center relative">
                <div className="w-8 h-8 mx-auto -mt-10 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center shadow-md mb-2">
                  2
                </div>
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-slate-400"
                />
                <h3 className="font-bold text-white text-sm mt-3">{topThree[1].name}</h3>
                <p className="text-[11px] text-slate-400">{topThree[1].title}</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <LevelBadge level={topThree[1].level} size="sm" />
                  <span className="font-extrabold text-xs text-indigo-400">
                    {topThree[1].xp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Rank 1 (Gold) */}
              <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/50 text-center shadow-glow-gold relative -mt-4">
                <div className="w-10 h-10 mx-auto -mt-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black flex items-center justify-center shadow-glow-gold mb-2 animate-bounce">
                  <Crown className="w-6 h-6 fill-slate-950" />
                </div>
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].name}
                  className="w-20 h-20 rounded-3xl mx-auto object-cover ring-4 ring-amber-400 shadow-xl"
                />
                <h3 className="font-black text-white text-base mt-3">{topThree[0].name}</h3>
                <p className="text-xs text-amber-400 font-bold">{topThree[0].title}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <LevelBadge level={topThree[0].level} size="sm" />
                  <span className="font-black text-sm text-cyan-300">
                    {topThree[0].xp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="order-3 p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 text-center relative">
                <div className="w-8 h-8 mx-auto -mt-10 rounded-full bg-amber-700 text-white font-black flex items-center justify-center shadow-md mb-2">
                  3
                </div>
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-amber-700"
                />
                <h3 className="font-bold text-white text-sm mt-3">{topThree[2].name}</h3>
                <p className="text-[11px] text-slate-400">{topThree[2].title}</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <LevelBadge level={topThree[2].level} size="sm" />
                  <span className="font-extrabold text-xs text-indigo-400">
                    {topThree[2].xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Full Ranking Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-l-indigo-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center">{getRankBadge(entry.rank)}</div>

                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {entry.name}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-extrabold">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{entry.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                      <Flame className="w-4 h-4 fill-current" />
                      <span>{entry.streak}d</span>
                    </div>

                    <LevelBadge level={entry.level} size="sm" />

                    <div className="text-right min-w-[90px]">
                      <div className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-end gap-1">
                        <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                        <span>{entry.xp.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Earned XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
