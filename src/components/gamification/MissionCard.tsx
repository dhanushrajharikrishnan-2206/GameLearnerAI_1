import React from 'react';
import { Target, Flame, Sparkles, Code, CheckCircle, Zap } from 'lucide-react';
import { Mission } from '../../types';
import { useGamification } from '../../context/GamificationContext';

interface MissionCardProps {
  mission: Mission;
  onNavigate?: (url: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onNavigate }) => {
  const { claimMissionReward } = useGamification();
  const percentage = Math.min(100, Math.round((mission.currentProgress / mission.maxProgress) * 100));
  const isReadyToClaim = mission.currentProgress >= mission.maxProgress;

  const getIcon = () => {
    switch (mission.icon) {
      case 'Code':
        return <Code className="w-5 h-5 text-indigo-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Target className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex-shrink-0">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                {mission.category}
              </span>
              {mission.isCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                  <CheckCircle className="w-3 h-3 fill-emerald-500/20" /> Done
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {mission.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {mission.description}
            </p>
          </div>
        </div>

        {/* Reward pills */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20">
            <Zap className="w-3 h-3 fill-current" />
            <span>+{mission.rewardXp} XP</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
            <span>+{mission.rewardCoins} Coins</span>
          </div>
        </div>
      </div>

      {/* Progress & action row */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Progress</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {mission.currentProgress} / {mission.maxProgress}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isReadyToClaim
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-indigo-500 to-electric-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div>
          {isReadyToClaim ? (
            <button
              onClick={() => claimMissionReward(mission.id)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all"
            >
              Claim
            </button>
          ) : (
            <button
              onClick={() => onNavigate && onNavigate(mission.actionUrl)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 font-semibold text-xs transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
