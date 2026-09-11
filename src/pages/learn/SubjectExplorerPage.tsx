import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Sparkles,
  BookOpen,
  ArrowRight,
  Code,
  Cpu,
  Layers,
  Binary,
  Database,
  BrainCircuit,
  Terminal,
  Clock,
  Zap
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { Subject, DifficultyLevel } from '../../types';
import { DifficultyBadge } from '../../components/gamification/DifficultyBadge';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const SubjectExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'mastery' | 'name' | 'recommended'>('recommended');

  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const data = await courseService.getSubjects();
        if (isMounted) {
          setSubjects(data);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const getSubjectIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Code':
        return <Code {...props} className="text-indigo-400" />;
      case 'Cpu':
        return <Cpu {...props} className="text-blue-400" />;
      case 'Layers':
        return <Layers {...props} className="text-cyan-400" />;
      case 'Sparkles':
        return <Sparkles {...props} className="text-purple-400" />;
      case 'Binary':
        return <Binary {...props} className="text-emerald-400" />;
      case 'Database':
        return <Database {...props} className="text-amber-400" />;
      case 'BrainCircuit':
        return <BrainCircuit {...props} className="text-pink-400" />;
      default:
        return <Terminal {...props} className="text-teal-400" />;
    }
  };

  const filteredSubjects = subjects
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = difficultyFilter === 'All' || s.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'recommended') {
        return (b.isAiRecommended ? 1 : 0) - (a.isAiRecommended ? 1 : 0);
      }
      if (sortBy === 'mastery') {
        return b.masteryPercentage - a.masteryPercentage;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Subject Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Explore Courses & Domains
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick a knowledge domain and embark on an adaptive learning expedition.
          </p>
        </div>

        <button
          onClick={() => navigate('/learn')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-electric-500 text-white font-bold text-xs shadow-glow-indigo hover:brightness-110 transition-all flex items-center gap-2"
        >
          <span>Open World Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subjects, keywords, tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Difficulty:</span>
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <span className="text-slate-700">|</span>

          <span className="text-xs text-slate-400 font-semibold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="recommended">AI Recommended</option>
            <option value="mastery">Mastery %</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-56 rounded-3xl" count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/50 hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
                    {getSubjectIcon(subject.icon)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {subject.isAiRecommended && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Recommended
                      </span>
                    )}
                    <DifficultyBadge difficulty={subject.difficulty} size="sm" />
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {subject.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {subject.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {subject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & Launch */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-400">Mastery</span>
                  <span className="text-indigo-500 font-bold">{subject.masteryPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{ width: `${subject.masteryPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {subject.completedLessons}/{subject.totalLessons} Lessons
                  </span>
                  <button
                    onClick={() => navigate('/learn')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-600 hover:text-white text-indigo-400 font-bold text-xs transition-all flex items-center gap-1"
                  >
                    <span>Adventure</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
