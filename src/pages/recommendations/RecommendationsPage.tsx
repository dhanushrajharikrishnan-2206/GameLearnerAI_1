import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Brain,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Cpu,
  Layers,
  Code
} from 'lucide-react';
import { recommendationService } from '../../services/recommendationService';
import { AIRecommendation, StrengthsWeaknesses } from '../../types';
import { DifficultyBadge } from '../../components/gamification/DifficultyBadge';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [diagnostics, setDiagnostics] = useState<StrengthsWeaknesses | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [recs, diag] = await Promise.all([
        recommendationService.getRecommendations(),
        recommendationService.getStrengthsAndWeaknesses()
      ]);
      setRecommendations(recs);
      setDiagnostics(diag);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getPriorityBadge = (priority: AIRecommendation['priority']) => {
    switch (priority) {
      case 'High Priority':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Recommended':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'Optional':
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getRecIcon = (iconName: string) => {
    switch (iconName) {
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5 text-indigo-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-amber-400" />;
      default:
        return <Code className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4 animate-pulse" />
            <span>AI Curriculum Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Personalized AI Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Targeted drills dynamically generated based on your quiz error vectors and response speed.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-44 rounded-3xl" count={3} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Recommended For You Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Recommended For You
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                          {getRecIcon(rec.icon)}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {rec.subject}
                          </span>
                          <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {rec.topic}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase ${getPriorityBadge(
                            rec.priority
                          )}`}
                        >
                          {rec.priority}
                        </span>
                        <DifficultyBadge difficulty={rec.difficulty} size="sm" />
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      <strong className="text-indigo-400 block mb-0.5">Why this is recommended:</strong>
                      {rec.reason}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {rec.expectedTime}
                      </span>
                      <span className="flex items-center gap-1 text-indigo-400 font-bold">
                        <Zap className="w-3.5 h-3.5 fill-current" /> +{rec.rewardXp} XP
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(rec.actionUrl)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-electric-500 hover:brightness-110 text-white font-extrabold text-xs shadow-glow-indigo transition-all flex items-center gap-1.5"
                    >
                      <span>Start Drill</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Weaknesses Diagnostics Breakdown */}
          {diagnostics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Verified Strengths
                    </h3>
                    <p className="text-xs text-slate-400">High mastery and low response latency</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {diagnostics.strengths.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {str.topic}
                        </h4>
                        <span className="text-[11px] text-emerald-400 font-semibold">{str.trend}</span>
                      </div>
                      <span className="text-sm font-black text-emerald-400">{str.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses / Opportunities */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Opportunities for Mastery
                    </h3>
                    <p className="text-xs text-slate-400">Targeted reinforcement will elevate your rank</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {diagnostics.weaknesses.map((weak, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {weak.topic}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{weak.recommendation}</p>
                      </div>
                      <span className="text-sm font-black text-rose-400">{weak.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
