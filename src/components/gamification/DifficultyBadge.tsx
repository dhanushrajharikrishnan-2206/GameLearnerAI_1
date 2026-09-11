import React from 'react';
import { DifficultyLevel } from '../../types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: 'sm' | 'md' | 'lg';
  isPulsing?: boolean;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = 'md',
  isPulsing = false,
  className = ''
}) => {
  const styles = {
    Easy: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-bold',
    lg: 'text-sm px-3.5 py-1.5 font-extrabold'
  };

  const dots = {
    Easy: 'bg-emerald-500',
    Medium: 'bg-amber-500',
    Hard: 'bg-rose-500'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase ${styles[difficulty]} ${sizes[size]} ${
        isPulsing ? 'animate-pulse ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[difficulty]} animate-ping opacity-75`} />
      <span>{difficulty}</span>
    </span>
  );
};
