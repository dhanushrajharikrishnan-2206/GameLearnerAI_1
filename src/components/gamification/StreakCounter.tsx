import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  className?: string;
  showTooltip?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  className = '',
  showTooltip = true
}) => {
  return (
    <div className="relative group cursor-pointer">
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold transition-all duration-300 group-hover:border-amber-500/60 group-hover:shadow-glow-gold ${className}`}
      >
        <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
        <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">{streak}</span>
        <span className="text-xs text-amber-600/80 dark:text-amber-400/80 font-semibold hidden sm:inline">Days</span>
      </div>

      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
          <div className="w-2 h-2 bg-slate-900 rotate-45 border-t border-l border-slate-700 -mb-1" />
          <div className="bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap text-center">
            <p className="font-bold text-amber-400">You're on fire! 🔥</p>
            <p className="text-slate-400 text-[11px] mt-0.5">3 more days to unlock the Consistency badge</p>
          </div>
        </div>
      )}
    </div>
  );
};
