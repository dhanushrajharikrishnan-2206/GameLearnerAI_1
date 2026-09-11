import React from 'react';
import { Shield } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div
      className={`inline-flex items-center font-bold rounded-full bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-indigo-200 border border-indigo-500/30 shadow-glow-indigo backdrop-blur-md ${sizeClasses[size]} ${className}`}
    >
      <Shield className={`${iconSizes[size]} text-indigo-400 fill-indigo-500/20`} />
      {showLabel && <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Lvl</span>}
      <span className="text-white font-extrabold">{level}</span>
    </div>
  );
};
