import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Flame,
  Volume2,
  VolumeX,
  Clock,
  ArrowLeft,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { DifficultyLevel } from '../types';
import { DifficultyBadge } from '../components/gamification/DifficultyBadge';
import { useGamification } from '../context/GamificationContext';

interface GameContainerProps {
  title: string;
  topic: string;
  difficulty: DifficultyLevel;
  timeRemainingSeconds?: number;
  score?: number;
  totalQuestions?: number;
  currentIndex?: number;
  onQuit?: () => void;
  children: React.ReactNode;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  title,
  topic,
  difficulty,
  timeRemainingSeconds,
  score,
  totalQuestions,
  currentIndex,
  onQuit,
  children
}) => {
  const {
    hearts,
    maxHearts,
    combo,
    isAudioEnabled,
    toggleAudio
  } = useGamification();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Game HUD Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Left: Quit & Title */}
        <div className="flex items-center gap-3">
          {onQuit && (
            <button
              onClick={onQuit}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Exit Activity"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                {topic}
              </span>
              <DifficultyBadge difficulty={difficulty} size="sm" />
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {title}
            </h2>
          </div>
        </div>

        {/* Center/Right: Gaming HUD Metrics */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          {/* Combo Multiplier Pill */}
          {combo >= 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-400 font-black text-xs shadow-glow-gold animate-bounce-gentle"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Combo ×{combo}</span>
            </motion.div>
          )}

          {/* Hearts / Lives Display */}
          <div className="flex items-center gap-1">
            {Array.from({ length: maxHearts }).map((_, i) => (
              <motion.div
                key={i}
                animate={i < hearts ? { scale: 1 } : { scale: 0.9, opacity: 0.4 }}
              >
                <Heart
                  className={`w-4 h-4 ${
                    i < hearts
                      ? 'fill-rose-500 text-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                      : 'fill-slate-700 text-slate-600'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Optional Timer */}
          {timeRemainingSeconds !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{timeRemainingSeconds}s</span>
            </div>
          )}

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isAudioEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Optional Step Progress */}
      {totalQuestions && currentIndex !== undefined && (
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-electric-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      )}

      {/* Active Game Canvas Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};
