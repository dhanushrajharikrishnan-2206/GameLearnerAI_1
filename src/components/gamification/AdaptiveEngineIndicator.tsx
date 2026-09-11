import React from 'react';
import { Cpu, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DifficultyLevel } from '../../types';

interface AdaptiveEngineIndicatorProps {
  currentDifficulty: DifficultyLevel;
  recentAccuracy: number;
  adaptationNotice?: string | null;
  compact?: boolean;
}

export const AdaptiveEngineIndicator: React.FC<AdaptiveEngineIndicatorProps> = ({
  currentDifficulty,
  recentAccuracy,
  adaptationNotice,
  compact = false
}) => {
  // Determine prediction direction based on accuracy threshold
  let nextAdjustment = 'Maintain';
  let trendIcon = <Minus className="w-3.5 h-3.5 text-amber-400" />;
  if (recentAccuracy >= 85) {
    nextAdjustment = currentDifficulty === 'Hard' ? 'Max Mastery' : 'Escalate to Hard';
    trendIcon = <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  } else if (recentAccuracy < 60) {
    nextAdjustment = currentDifficulty === 'Easy' ? 'Provide Hints' : 'De-escalate to Easy';
    trendIcon = <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-semibold flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          AI Engine: {currentDifficulty}
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-emerald-200 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Adaptive AI Engine
              </h4>
            </div>
            <p className="text-[11px] text-slate-500">Live Cognitive Skill Calibration</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Active</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center bg-emerald-50/70 rounded-xl p-2.5 border border-emerald-100">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Current Level</span>
          <p className="text-xs font-bold text-slate-900 mt-0.5">{currentDifficulty}</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Live Accuracy</span>
          <p className="text-xs font-bold text-emerald-700 mt-0.5">{recentAccuracy}%</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Shift</span>
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-800 mt-0.5">
            {trendIcon}
            <span className="truncate">{nextAdjustment}</span>
          </div>
        </div>
      </div>

      {adaptationNotice && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2 animate-bounce-gentle">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-semibold">{adaptationNotice}</span>
        </div>
      )}
    </div>
  );
};
