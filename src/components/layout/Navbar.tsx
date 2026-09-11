import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Leaf,
  Menu,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  User as UserIcon,
  LogOut,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StreakCounter } from '../gamification/StreakCounter';
import { LevelBadge } from '../gamification/LevelBadge';
import { mockNotifications } from '../../data/mockData';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/learn?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b border-emerald-100 bg-white/95 backdrop-blur-xl transition-colors shadow-sm">
      <div className="flex items-center justify-between h-full px-4 md:px-6 gap-4">
        {/* Left: Mobile hamburger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-emerald-50 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, quizzes, Python, algorithms..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-emerald-50/50 border border-emerald-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
          </form>
        </div>

        {/* Right: Gamification stats & user controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Streak Indicator */}
          {user && <StreakCounter streak={user.streak} />}

          {/* Quick XP Chip */}
          {user && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-current text-emerald-500" />
              <span>{user.xp.toLocaleString()} XP</span>
            </div>
          )}

          {/* Level Badge */}
          {user && <LevelBadge level={user.level} size="sm" />}

          {/* Theme Toggle Button: Light Green vs Clean Light */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
            title={theme === 'light-green' ? 'Light Green Theme active (click for Clean Light)' : 'Clean Light active (click for Light Green)'}
          >
            {theme === 'light-green' ? (
              <>
                <Leaf className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
                <span className="hidden sm:inline">Light Green</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Clean Light</span>
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-500 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.actionUrl) navigate(notif.actionUrl);
                        setShowNotifications(false);
                      }}
                      className={`p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        !notif.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{notif.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.message}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-indigo-500 hover:text-indigo-400 font-bold inline-flex items-center gap-1"
                  >
                    <span>View all notifications</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] font-bold">
                        {user.title}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Learner Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={async () => {
                        await logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
