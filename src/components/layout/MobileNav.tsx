import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileQuestion,
  Award,
  User,
  X,
  Sparkles,
  GitFork,
  Trophy,
  BarChart3,
  Settings,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || (user?.email && user.email.toLowerCase().includes('admin'));

  const fullNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learn & Worlds', path: '/learn', icon: Compass },
    { name: 'Adaptive Quizzes', path: '/quiz/quiz_py_functions', icon: FileQuestion },
    { name: 'Skill Tree', path: '/skill-tree', icon: GitFork },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'AI Insights', path: '/recommendations', icon: Sparkles },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
    ...(isAdmin ? [{ name: 'Database Viewer', path: '/database', icon: Database }] : []),
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const bottomBarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learn', path: '/learn', icon: Compass },
    { name: 'Quiz', path: '/quiz/quiz_py_functions', icon: FileQuestion },
    { name: 'Ranks', path: '/leaderboard', icon: Award },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Slide-out Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-emerald-950/40 backdrop-blur-sm" onClick={onClose}>
          <div
            className="fixed inset-y-0 left-0 w-72 bg-white p-4 flex flex-col shadow-2xl border-r border-emerald-100 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-slate-900">
                  GameLearn<span className="text-emerald-600">.AI</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {user && (
              <div className="py-3 border-b border-emerald-100 flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40" />
                <div>
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Level {user.level} • {user.xp} XP</p>
                </div>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {fullNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm'
                          : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar on Small Screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-white/95 backdrop-blur-xl border-t border-emerald-100 flex items-center justify-around px-2 shadow-lg">
        {bottomBarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${
                  isActive
                    ? 'text-emerald-700 font-black'
                    : 'text-slate-500 hover:text-emerald-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};
