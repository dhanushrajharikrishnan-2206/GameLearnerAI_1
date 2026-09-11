import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const HeartsRecoveryModal: React.FC = () => {
  const { isHeartsModalOpen, closeHeartsModal, restoreHearts } = useGamification();

  if (!isHeartsModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="relative max-w-md w-full rounded-3xl bg-slate-900 border border-rose-500/40 p-6 sm:p-8 text-center shadow-glow-rose space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shadow-glow-rose animate-pulse">
            <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">Out of Hearts!</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Don't worry! In GameLearn AI, mistakes are how you adapt and master difficult concepts.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => restoreHearts(5)}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-extrabold text-xs shadow-glow-emerald transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Quick Concept Refresher (+5 Hearts)</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => restoreHearts(3)}
              className="w-full p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-indigo-400" />
                <span>Instant Practice Retry (+3 Hearts)</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={closeHeartsModal}
            className="text-xs text-slate-400 hover:text-white underline font-semibold"
          >
            Dismiss
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
