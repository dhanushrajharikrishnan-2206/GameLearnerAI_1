import React, { useState, useEffect } from 'react';
import {
  GitFork,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Terminal,
  Repeat,
  Code,
  Box,
  Layers,
  RotateCcw,
  Cpu,
  GitBranch,
  ArrowRight,
  Info
} from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import { SkillNode } from '../../types';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const SkillTreePage: React.FC = () => {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Programming', 'Algorithms', 'Data Structures', 'AI & Machine Learning'];

  useEffect(() => {
    let isMounted = true;
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const data = await assessmentService.getSkillTree(selectedCategory);
        if (isMounted) {
          setSkills(data);
        }
      } catch (err) {
        console.error('Error fetching skill tree:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchSkills();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const getSkillIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'Terminal':
        return <Terminal {...props} />;
      case 'Repeat':
        return <Repeat {...props} />;
      case 'Code':
        return <Code {...props} />;
      case 'Box':
        return <Box {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'RotateCcw':
        return <RotateCcw {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'GitBranch':
        return <GitBranch {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <GitFork className="w-4 h-4" />
            <span>Mastery Progression Graph</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Interactive Skill Tree
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Unlock prerequisites, advance through cognitive tiers, and master specialized disciplines.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Tier 3: Emerald & Mint Mastery Nodes
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Skill Graph */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-44 rounded-3xl" count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const isTier3 = skill.level === 3;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isTier3
                    ? skill.isMastered
                      ? 'bg-gradient-to-br from-emerald-500/20 via-slate-900 to-emerald-950/50 border-emerald-400/60 shadow-glow-emerald hover:border-emerald-300'
                      : skill.isUnlocked
                      ? 'bg-gradient-to-br from-emerald-950/25 to-slate-900 border-emerald-500/40 hover:border-emerald-400 shadow-glow-emerald hover:scale-[1.01]'
                      : 'bg-emerald-950/15 border-emerald-900/30 opacity-60'
                    : skill.isMastered
                    ? 'bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/40 shadow-glow-gold hover:border-amber-400'
                    : skill.isUnlocked
                    ? 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                {/* Category badge & Level */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isTier3 ? 'text-emerald-400' : 'text-indigo-400'
                    }`}
                  >
                    {skill.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isTier3
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Tier {skill.level} {isTier3 && '🌿'}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div
                    className={`p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isTier3 && skill.isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : skill.isMastered
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : skill.isUnlocked
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {skill.isUnlocked ? getSkillIcon(skill.icon) : <Lock className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {skill.completedChallenges}/{skill.totalChallenges} Challenges
                    </p>
                  </div>
                </div>

                {/* Mastery bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Mastery</span>
                    <span
                      className={
                        isTier3
                          ? 'text-emerald-400 font-extrabold'
                          : skill.isMastered
                          ? 'text-amber-400 font-extrabold'
                          : 'text-indigo-400 font-bold'
                      }
                    >
                      {skill.masteryPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTier3
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-glow-emerald'
                          : skill.isMastered
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-indigo-500 to-electric-500'
                      }`}
                      style={{ width: `${skill.masteryPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Prerequisite status */}
                {skill.prerequisites.length > 0 && !skill.isUnlocked && (
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Prerequisite: {skill.prerequisites.join(', ')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-white border border-emerald-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-emerald-700">
                  {selectedSkill.category} • Tier {selectedSkill.level}
                </span>
                {selectedSkill.level === 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-[10px] font-extrabold">
                    Emerald Tier
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                ✕ Close
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900">{selectedSkill.name}</h3>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Mastery Level:</span>
                <span className="font-bold text-slate-900">{selectedSkill.masteryPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total XP Earned:</span>
                <span className="font-bold text-emerald-700">+{selectedSkill.xp} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Interactive Drills:</span>
                <span className="font-bold text-slate-800">
                  {selectedSkill.completedChallenges} of {selectedSkill.totalChallenges} Completed
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSkill(null)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all"
            >
              Practice This Skill Branch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
