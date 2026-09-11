import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Database,
  RefreshCw,
  User,
  Mail,
  Zap,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Download,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  Lock,
  ArrowLeft,
  Search,
  Check
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface DbUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar: string;
  title: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  skill_level: string;
  learning_goal: string;
  created_at: string;
  chosenTopics: string[];
  completedTopicsCount: number;
}

interface DatabaseInfo {
  databaseStatus: string;
  databasePath: string;
  totalUsers: number;
  users: DbUser[];
}

export const DatabaseViewerPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<DatabaseInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isAdmin = user?.role === 'admin' || (user?.email && user.email.toLowerCase().includes('admin'));

  const fetchDatabase = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('gamelearn_token');
      const res = await axios.get('http://localhost:5000/api/admin/database', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setData(res.data);
    } catch (err: any) {
      console.error('Failed to load database:', err);
      if (err.response?.status === 403) {
        setError('Access Denied (403): Administrator permissions are required to inspect the database.');
      } else if (err.response?.status === 401) {
        setError('Authentication required (401): Please log in as an administrator.');
      } else {
        setError('Could not connect to backend database on http://localhost:5000.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, [isAdmin]);

  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gamelearn_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSwitchToAdmin = async () => {
    await logout();
    navigate('/login');
  };

  // -------------------------------------------------------------
  // ACCESS DENIED VIEW (When user is NOT an admin)
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Access Restricted • Administrator Only</span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2">
          Database Viewer Restricted
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
          The SQLite relational database inspector contains live authentication credentials, user profiles, and platform logs. Access is strictly granted to <strong>Administrator</strong> accounts only.
        </p>

        {/* Current user role badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 max-w-md mx-auto mb-6 text-left flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-800">{user?.name || 'Logged in User'}</div>
            <div className="text-slate-500 font-mono text-[11px]">{user?.email}</div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold uppercase text-[10px]">
              Role: {user?.role || 'student'}
            </span>
            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Non-Admin</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <button
            onClick={handleSwitchToAdmin}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-glow-emerald hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In as Admin</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ADMIN DATABASE VIEWER (When user IS an admin)
  // -------------------------------------------------------------
  const token = localStorage.getItem('gamelearn_token') || '';
  const externalViewerUrl = `http://localhost:5000/database?token=${encodeURIComponent(token)}`;

  const filteredUsers = (data?.users || []).filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.role && u.role.toLowerCase().includes(term)) ||
      (u.chosenTopics && u.chosenTopics.some((t) => t.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">SQLite Database Inspector</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wide">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct live relational records from <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono text-[11px]">server/data/gamelearn.db</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDatabase}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportJson}
            disabled={!data}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Database KPI Stat Cards */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-center">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Total Registered</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{data.totalUsers}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">SQLite User Rows</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-center">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Total Topics Saved</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {data.users.reduce((acc, u) => acc + (u.chosenTopics?.length || 0), 0)}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">User Chosen Tracks</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-center">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Database Engine</span>
            <div className="text-lg font-black text-slate-900 mt-1">node:sqlite</div>
            <span className="text-[10px] text-emerald-600 font-semibold">SQLite 3.53 WAL Mode</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm text-center">
            <span className="text-[11px] text-slate-500 font-bold uppercase">External Web View</span>
            <a
              href={externalViewerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-2.5"
            >
              <span>Open in Port 5000</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">User Login Details & Chosen Topics</h3>
            <span className="text-xs text-slate-500 font-semibold">
              {data ? `${filteredUsers.length} of ${data.users.length} account(s) matching filter` : 'Loading...'}
            </span>
          </div>

          {/* Search Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, topic..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-emerald-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-emerald-100 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-3 pl-2">User / Learner</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Login Email</th>
                <th className="pb-3">Level & XP</th>
                <th className="pb-3">Coins / Streak</th>
                <th className="pb-3">Chosen Topics (Interests)</th>
                <th className="pb-3">Goal & Skill</th>
                <th className="pb-3 pr-2">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-300" />
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-emerald-700">{u.title}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5">
                    {u.role === 'admin' ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-extrabold uppercase">
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold uppercase">
                        Student
                      </span>
                    )}
                  </td>

                  <td className="py-3.5">
                    <div className="font-mono text-slate-800 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 inline-block text-[11px]">
                      {u.email}
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span className="font-bold text-slate-900">Lvl {u.level}</span>
                    <div className="text-[11px] text-emerald-700 font-semibold">{u.xp.toLocaleString()} XP</div>
                  </td>

                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{u.coins} 🪙</span>
                      <span>•</span>
                      <span className="text-amber-600">{u.streak} 🔥</span>
                    </div>
                  </td>

                  <td className="py-3.5 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {u.chosenTopics && u.chosenTopics.length > 0 ? (
                        u.chosenTopics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No topics yet</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5">
                    <div className="font-semibold text-slate-800">{u.skill_level}</div>
                    <div className="text-[10px] text-slate-500">{u.learning_goal}</div>
                  </td>

                  <td className="py-3.5 pr-2 text-slate-500 text-[11px] font-mono">
                    {u.created_at || 'Seeded account'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DatabaseViewerPage;
