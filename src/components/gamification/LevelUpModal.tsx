import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const LevelUpModal: React.FC = () => {
  const { isLevelUpModalOpen, closeLevelUpModal, newLevelInfo } = useGamification();

  if (!isLevelUpModalOpen || !newLevelInfo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative max-w-md w-full rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/50 p-8 text-center shadow-glow-indigo overflow-hidden"
        >
          {/* Background rays */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="p-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-glow-gold mb-5 animate-bounce">
              <Trophy className="w-12 h-12" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/40 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Level Up Celebration
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight">
              LEVEL {newLevelInfo.level}!
            </h2>

            <p className="text-indigo-200 text-sm font-semibold mt-1">
              Title Unlocked: <span className="text-amber-400 font-bold">{newLevelInfo.title}</span>
            </p>

            <p className="text-xs text-slate-400 max-w-xs mt-3">
              Your cognitive mastery expands! New higher-tier challenges and adaptive learning nodes have unlocked on your World Map.
            </p>

            <button
              onClick={closeLevelUpModal}
              className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-electric-500 text-white font-extrabold text-sm shadow-glow-indigo hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Adventure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
