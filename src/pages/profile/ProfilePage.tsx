import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Flame,
  Clock,
  Calendar,
  Edit3,
  Check,
  Award,
  Sparkles,
  Target,
  BookOpen,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LevelBadge } from '../../components/gamification/LevelBadge';
import { XPBar } from '../../components/gamification/XPBar';
import { mockAchievements } from '../../data/mockData';

const AVAILABLE_TOPICS = [
  'Programming',
  'AI & Machine Learning',
  'Data Science',
  'Algorithms',
  'Mathematics',
  'Computer Science',
  'Cybersecurity',
  'Web Development',
  'Aptitude',
  'English'
];

export const ProfilePage: React.FC = () => {
  const { user, updateUser, isBackendConnected } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Alex Chen');
  const [title, setTitle] = useState(user?.title || 'Algorithm Alchemist');
  const [learningGoal, setLearningGoal] = useState(user?.learningGoal || 'Skill Development');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoalMinutes || 30);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests && user.interests.length > 0
      ? user.interests
      : ['Programming', 'AI & Machine Learning', 'Data Science']
  );

  if (!user) return null;

  const toggleInterest = (topic: string) => {
    if (selectedInterests.includes(topic)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((t) => t !== topic));
      }
    } else {
      setSelectedInterests([...selectedInterests, topic]);
    }
  };

  const handleSave = () => {
    updateUser({
      name,
      title,
      learningGoal,
      dailyGoalMinutes: dailyGoal,
      interests: selectedInterests
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Profile Header Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 border-2 border-emerald-300/40 shadow-xl shadow-emerald-700/10 relative overflow-hidden text-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-300 shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
              <LevelBadge level={user.level} size="md" />
            </div>

            <p className="text-sm font-bold text-emerald-200">{user.title}</p>
            <p className="text-xs text-emerald-50 max-w-md">{user.learningGoal}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-emerald-100 pt-2 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" /> Joined {user.joinedDate}
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-current" /> {user.streak} Day Streak
              </span>
              <span className="flex items-center gap-1 text-emerald-200 font-bold">
                <Zap className="w-3.5 h-3.5 fill-current" /> {user.xp.toLocaleString()} XP
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                <Database className="w-3 h-3 text-emerald-300" /> SQLite Synced
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-600/60">
          <XPBar currentXp={user.xp} xpToNextLevel={user.xpToNextLevel} />
        </div>
      </div>

      {/* Profile Edit Mode */}
      {isEditing && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Edit Learner Profile & Topics</h3>
            <span className="text-xs text-emerald-700 font-semibold">Changes sync directly to SQLite Database</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Learner Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Learning Ambition</label>
              <input
                type="text"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Chosen Topics selection */}
            <div className="sm:col-span-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Manage Chosen Topics & Interests (Stored in SQLite Database)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TOPICS.map((topic) => {
                  const isSelected = selectedInterests.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleInterest(topic)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-emerald-100">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes to Database</span>
            </button>
          </div>
        </div>
      )}

      {/* Chosen Topics Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Chosen Topics & Learning Tracks</h3>
              <p className="text-xs text-slate-500">Persisted in SQLite database under your learner account</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>SQLite Active</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {(user.interests && user.interests.length > 0 ? user.interests : selectedInterests).map((topic) => (
            <div
              key={topic}
              className="px-3.5 py-2 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Subjects & Skill Badges Showcases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unlocked Badges Showcase */}
        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Showcase Badges
            </h3>
            <span className="text-xs text-emerald-600 font-bold">Top 4</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {mockAchievements.slice(0, 4).map((ach) => (
              <div
                key={ach.id}
                className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{ach.title}</h4>
                <span className="text-[10px] text-amber-600 font-extrabold uppercase">{ach.rarity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Learning Domains */}
        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Focus Domains
            </h3>
            <span className="text-xs text-slate-500">Target: {user.dailyGoalMinutes || 30}m / day</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Python Fundamentals', mastery: 84 },
              { name: 'Data Structures', mastery: 80 },
              { name: 'Algorithms & Complexity', mastery: 72 },
              { name: 'AI & Machine Learning', mastery: 65 }
            ].map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{d.name}</span>
                  <span className="text-emerald-700 font-bold">{d.mastery}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.mastery}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
