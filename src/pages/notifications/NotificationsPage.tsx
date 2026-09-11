import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Sparkles,
  Flame,
  Trophy,
  Award,
  CheckCircle2,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { AppNotification } from '../../types';
import { Skeleton } from '../../components/common/SkeletonLoader';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemClick = (notif: AppNotification) => {
    notificationService.markAsRead(notif.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  };

  const getIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'challenge':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'streak':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-purple-400" />;
      case 'leaderboard':
        return <Award className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unread') return !n.isRead;
    return n.category === selectedCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Alert Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Notifications & AI Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Updates on streaks, leaderboard shifts, and newly unlocked adaptive challenges.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'unread', 'challenge', 'streak', 'achievement', 'leaderboard'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-glow-indigo'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-2xl" count={4} />
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                !notif.isRead
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex-shrink-0">
                  {getIcon(notif.category)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
