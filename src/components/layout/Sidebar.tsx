import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileQuestion,
  GitFork,
  Trophy,
  Award,
  Sparkles,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { XPBar } from '../gamification/XPBar';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || (user?.email && user.email.toLowerCase().includes('admin'));

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learn & Worlds', path: '/learn', icon: Compass },
    { name: 'Adaptive Quizzes', path: '/quiz/quiz_py_functions', icon: FileQuestion },
    { name: 'Skill Tree', path: '/skill-tree', icon: GitFork },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'AI Insights', path: '/recommendations', icon: Sparkles },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
    ...(isAdmin ? [{ name: 'Database Viewer', path: '/database', icon: Database, isAdminOnly: true }] : []),
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative hidden lg:flex flex-col border-r border-emerald-100 bg-white/95 backdrop-blur-xl transition-all duration-300 z-20 shadow-sm ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-100">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 flex items-center justify-center text-white shadow-glow-emerald flex-shrink-0">
            <Sparkles className="w-5 h-5 fill-white/30" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-black text-lg tracking-tight text-slate-900">
                GameLearn<span className="text-emerald-600">.AI</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">
                Adaptive Adventure
              </span>
            </div>
          )}
        </NavLink>

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-800 border border-emerald-300 shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-emerald-50/70 hover:text-emerald-900'
                }`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 text-emerald-600" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
              {!isCollapsed && item.name === 'AI Insights' && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 text-[10px] font-bold">
                  AI
                </span>
              )}
              {!isCollapsed && (item as any).isAdminOnly && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wide shadow-xs">
                  Admin
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User XP Quick Card */}
      {user && !isCollapsed && (
        <div className="p-3 m-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Level {user.level}
              </span>
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">
                Rank #4
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-500">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{user.streak}d</span>
            </div>
          </div>
          <XPBar currentXp={user.xp} xpToNextLevel={user.xpToNextLevel} showDetails={false} />
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1">
            <span>{user.xp} XP</span>
            <span>{user.xpToNextLevel} XP</span>
          </div>
        </div>
      )}
    </aside>
  );
};
