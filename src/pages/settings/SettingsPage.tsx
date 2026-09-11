import React, { useState } from 'react';
import {
  Sun,
  Leaf,
  Bell,
  Shield,
  Clock,
  Check,
  Sliders
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'appearance' | 'learning' | 'notifications' | 'security'>('appearance');

  // Form states
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoalMinutes || 30);
  const [preferredDifficulty, setPreferredDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    user?.skillLevel || 'Intermediate'
  );
  const [soundEffects, setSoundEffects] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateUser({
      dailyGoalMinutes: dailyGoal,
      skillLevel: preferredDifficulty,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Sliders },
    { id: 'learning', label: 'Learning Preferences', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your GameLearn AI interactive platform experience and theme.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully saved!</span>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Nav list */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm'
                    : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-900'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3 p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-6">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Theme Palette</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your theme preference. Dark mode has been replaced with the refreshing Light Green theme.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light-green')}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                    theme === 'light-green'
                      ? 'bg-emerald-50 border-emerald-500 shadow-glow-emerald text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  <Leaf className="w-6 h-6 text-emerald-600 fill-emerald-500" />
                  <div className="font-bold text-sm text-emerald-900">Light Green Theme (Active)</div>
                  <p className="text-[11px] text-emerald-700">
                    Lush emerald, fresh mint highlights, soft soothing backgrounds, and vibrant gamification badges.
                  </p>
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                    theme === 'light'
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-glow-emerald text-slate-900 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Sun className="w-6 h-6 text-amber-500" />
                  <div className="font-bold text-sm text-slate-900">Clean Light Mode</div>
                  <p className="text-[11px] text-slate-500">
                    Clean, crisp daytime aesthetic with minimal neutral tones and subtle shadows.
                  </p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Learning Rhythm & Calibration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tune your daily goals and baseline adaptive difficulty thresholds.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Daily Commitment Goal: <span className="text-emerald-700 font-black">{dailyGoal} Minutes</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>10 min (Casual)</span>
                    <span>30 min (Steady)</span>
                    <span>60 min (Intense)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-100">
                  <label className="block font-bold text-slate-700 mb-2">
                    Default Starting Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setPreferredDifficulty(diff)}
                        className={`p-3 rounded-xl border text-center font-bold transition-all ${
                          preferredDifficulty === diff
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-200'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    The adaptive AI will still scale questions dynamically during active quizzes.
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800">Gamification Audio Feedback</h4>
                    <p className="text-[11px] text-slate-500">Play subtle audio on correct answers and level ups.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEffects}
                    onChange={(e) => setSoundEffects(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Alert Rules</h3>
                <p className="text-xs text-slate-500 mt-0.5">Control when and how you receive alerts.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div>
                    <h4 className="font-bold text-slate-800">Daily Streak Reminders</h4>
                    <p className="text-[11px] text-slate-500">Get notified 2 hours before your streak resets.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={streakReminders}
                    onChange={(e) => setStreakReminders(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div>
                    <h4 className="font-bold text-slate-800">AI Diagnostic Digests</h4>
                    <p className="text-[11px] text-slate-500">Weekly breakdown of cognitive strengths and growth vectors.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Security & Password</h3>
                <p className="text-xs text-slate-500 mt-0.5">Update credentials for your account.</p>
              </div>

              <div className="space-y-3 text-xs max-w-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-emerald-100 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow-emerald transition-all active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
