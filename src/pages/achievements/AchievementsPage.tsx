import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Zap,
  Lock,
  CheckCircle2,
  Filter,
  X
} from 'lucide-react';
import { achievementService } from '../../services/achievementService';
import { Achievement } from '../../types';
import { AchievementBadge } from '../../components/gamification/AchievementBadge';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const data = await achievementService.getAchievements();
        if (isMounted) {
          setAchievements(data);
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchAchievements();
    return () => {
      isMounted = false;
    };
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXpRewards = achievements
    .filter((a) => a.unlocked)
    .reduce((acc, curr) => acc + curr.xpReward, 0);

  const filtered = achievements.filter((a) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unlocked') return a.unlocked;
    if (selectedCategory === 'locked') return !a.unlocked;
    return a.category === selectedCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Trophy Hall of Fame</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Badges & Achievements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Collect rare and legendary accolades across your learning adventure.
          </p>
        </div>

        {/* Stats Chips */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
            🏆 {unlockedCount}/{achievements.length} Unlocked
          </div>
          <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs">
            ⚡ +{totalXpRewards.toLocaleString()} XP Claimed
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'unlocked', 'locked', 'streak', 'learning', 'accuracy', 'mastery'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-glow-gold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-40 rounded-2xl" count={8} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((ach) => (
            <AchievementBadge
              key={ach.id}
              achievement={ach}
              onClick={() => setSelectedAchievement(ach)}
            />
          ))}
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-white border border-amber-400/40 p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedAchievement(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-glow-gold mb-4 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-extrabold text-[11px] uppercase tracking-wider mb-2 border border-amber-200">
              {selectedAchievement.rarity} Badge
            </div>

            <h3 className="text-xl font-black text-slate-900">{selectedAchievement.title}</h3>
            <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
              {selectedAchievement.description}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">XP Reward:</span>
              <span className="font-extrabold text-emerald-700">+{selectedAchievement.xpReward} XP</span>
            </div>

            <button
              onClick={() => setSelectedAchievement(null)}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
