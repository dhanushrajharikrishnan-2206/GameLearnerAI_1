import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPBarProps {
  currentXp: number;
  xpToNextLevel: number;
  className?: string;
  showDetails?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXp,
  xpToNextLevel,
  className = '',
  showDetails = true
}) => {
  const percentage = Math.min(100, Math.round((currentXp / xpToNextLevel) * 100));

  return (
    <div className={`w-full ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>XP Progress</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-100">{currentXp.toLocaleString()}</span>
            {' '}/ {xpToNextLevel.toLocaleString()} XP ({percentage}%)
          </div>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/60 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-electric-500 shadow-glow-indigo relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </motion.div>
      </div>
    </div>
  );
};
