import React from 'react';
import { Trophy, Flame, Zap, Brain, Target, Award, Rocket, Crown, Lock } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, onClick }) => {
  const getIcon = () => {
    const props = { className: 'w-6 h-6' };
    switch (achievement.icon) {
      case 'Trophy':
        return <Trophy {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Brain':
        return <Brain {...props} />;
      case 'Target':
        return <Target {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'Rocket':
        return <Rocket {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      default:
        return <Trophy {...props} />;
    }
  };

  const rarityBorders = {
    Common: 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400',
    Rare: 'border-blue-500/40 shadow-glow-cyan group-hover:border-blue-500',
    Epic: 'border-purple-500/40 shadow-glow-indigo group-hover:border-purple-500',
    Legendary: 'border-amber-500/50 shadow-glow-gold group-hover:border-amber-400'
  };

  const rarityText = {
    Common: 'text-slate-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-400',
    Legendary: 'text-amber-400 font-extrabold'
  };

  const percentage = Math.min(100, Math.round((achievement.progress / achievement.maxProgress) * 100));

  return (
    <div
      onClick={onClick}
      className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
        achievement.unlocked
          ? `bg-white dark:bg-slate-900/90 ${rarityBorders[achievement.rarity]} hover:-translate-y-1`
          : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-70 hover:opacity-100'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`p-3 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
            achievement.unlocked
              ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
          }`}
        >
          {achievement.unlocked ? getIcon() : <Lock className="w-5 h-5 text-slate-500" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${rarityText[achievement.rarity]}`}>
              {achievement.rarity}
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              +{achievement.xpReward} XP
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
            {achievement.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
            {achievement.description}
          </p>

          {!achievement.unlocked && (
            <div className="mt-2.5">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Progress</span>
                <span>
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
              Unlocked: {achievement.unlockedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
