import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm ${className}`}>
      <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mb-3 border border-indigo-500/20">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
