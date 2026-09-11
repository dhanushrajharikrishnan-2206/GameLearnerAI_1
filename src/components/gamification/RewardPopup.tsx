import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Coins, X } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const RewardPopup: React.FC = () => {
  const { rewardNotifications, dismissReward } = useGamification();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {rewardNotifications.map((reward) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-500/40 shadow-glow-indigo backdrop-blur-xl min-w-[280px]"
          >
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 animate-bounce">
              {reward.type === 'coins' ? (
                <Coins className="w-5 h-5 text-amber-400" />
              ) : (
                <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400" />
              )}
            </div>

            <div className="flex-1">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {reward.title}
              </div>
              <div className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300">
                +{reward.amount} {reward.type.toUpperCase()}
              </div>
            </div>

            <button
              onClick={() => dismissReward(reward.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
