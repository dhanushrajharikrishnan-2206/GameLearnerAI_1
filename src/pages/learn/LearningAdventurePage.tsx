import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  Lock,
  Play,
  Clock,
  Zap,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  X
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { AdventureWorld, AdventureNode, Subject } from '../../types';
import { DifficultyBadge } from '../../components/gamification/DifficultyBadge';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const LearningAdventurePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [worlds, setWorlds] = useState<AdventureWorld[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(() => searchParams.get('subject') || 'python');
  const [selectedNode, setSelectedNode] = useState<AdventureNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subParam = searchParams.get('subject');
    if (subParam && subParam !== selectedSubject) {
      setSelectedSubject(subParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [worldsData, subjectsData] = await Promise.all([
          courseService.getAdventureWorlds(selectedSubject),
          courseService.getSubjects()
        ]);
        if (isMounted) {
          setWorlds(worldsData);
          setSubjects(subjectsData);
        }
      } catch (err) {
        console.error('Error loading adventure worlds:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedSubject]);

  const activeSubjectObj = subjects.find((s) => s.slug === selectedSubject) || subjects[0];

  const getNodeIcon = (status: AdventureNode['status']) => {
    switch (status) {
      case 'mastered':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'current':
        return <Play className="w-5 h-5 text-white fill-white" />;
      case 'available':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'locked':
      default:
        return <Lock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getNodeClass = (status: AdventureNode['status']) => {
    switch (status) {
      case 'mastered':
        return 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-300 shadow-glow-gold text-slate-950 ring-4 ring-amber-500/20';
      case 'completed':
        return 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-emerald-400 shadow-glow-emerald text-white';
      case 'current':
        return 'bg-gradient-to-tr from-indigo-600 to-purple-600 border-indigo-300 shadow-glow-indigo text-white animate-pulse ring-8 ring-indigo-500/30 scale-110';
      case 'available':
        return 'bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-300 shadow-sm';
      case 'locked':
      default:
        return 'bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Header & Subject Quick Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Interactive World Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            The Learning Adventure
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Journey through interconnected worlds. Unlock checkpoints, defeat quizzes, and conquer algorithms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/learn/explore"
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>Explore All Subjects</span>
          </Link>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subjects.map((s) => (
          <button
            key={s.slug}
            onClick={() => setSelectedSubject(s.slug)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedSubject === s.slug
                ? 'bg-gradient-to-r from-indigo-600 to-electric-500 text-white shadow-glow-indigo'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm'
            }`}
          >
            <span>{s.name}</span>
            {s.isAiRecommended && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/10 dark:bg-cyan-400/20 text-cyan-600 dark:text-cyan-300 text-[10px]">
                AI
              </span>
            )}
          </button>
        ))}
      </div>

      {/* World Map Container */}
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      ) : (
        <div className="space-y-12 relative">
          {worlds.map((world, wIdx) => (
            <div
              key={world.id}
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                world.isUnlocked
                  ? 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 shadow-md backdrop-blur-xl'
                  : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-900 opacity-60'
              }`}
            >
              {/* World Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-slate-200 dark:border-slate-800/80 mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {world.levelRange}
                    </span>
                    {!world.isUnlocked && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked World
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {world.title}: <span className="text-slate-600 dark:text-slate-300 font-bold">{world.subtitle}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">{world.description}</p>
                </div>
              </div>

              {/* RPG Node Map Pathway */}
              <div className="relative py-4 flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-slate-200 dark:to-slate-800 -translate-y-1/2 z-0" />

                {world.nodes.map((node, nIdx) => (
                  <div key={node.id} className="relative z-10 flex flex-col items-center text-center max-w-[200px]">
                    {/* Node Interactive Orb */}
                    <button
                      onClick={() => setSelectedNode(node)}
                      disabled={node.status === 'locked'}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl border-2 flex items-center justify-center transition-all duration-300 ${getNodeClass(
                        node.status
                      )}`}
                      title={`${node.title} (${node.status})`}
                    >
                      {getNodeIcon(node.status)}
                    </button>

                    {/* Node Label Card */}
                    <div className="mt-3">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <DifficultyBadge difficulty={node.difficulty} size="sm" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{node.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">+{node.xpReward} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Node Preview Drawer / Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/40 p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <DifficultyBadge difficulty={selectedNode.difficulty} size="sm" />
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                Status: {selectedNode.status}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedNode.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{selectedNode.description}</p>

            <div className="grid grid-cols-2 gap-3 my-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span>Est: {selectedNode.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Zap className="w-4 h-4 text-cyan-500 dark:text-cyan-400 fill-cyan-400" />
                <span>+{selectedNode.xpReward} XP Reward</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigate(`/lesson/${selectedNode.lessonId || 'lesson_py_functions'}`);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-glow-indigo hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Lesson</span>
                </button>
                <button
                  onClick={() => {
                    navigate(`/quiz/${selectedNode.quizId || 'quiz_py_functions'}`);
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Quiz</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Game Action */}
              <button
                onClick={() => {
                  navigate('/adventure');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Play 5-Minute Adventure Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
