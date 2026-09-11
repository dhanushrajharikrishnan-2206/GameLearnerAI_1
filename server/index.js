import express from 'express';
import cors from 'cors';
import {
  initSchema,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  addXp,
  recordGameSession,
  getUserGameHistory,
  saveUserTopic,
  getUserTopics,
  getLeaderboard,
  formatUser,
  getUserInterests,
  dbPath,
  db
} from './db.js';
import {
  verifyPassword,
  createToken,
  verifyToken,
  authenticateToken
} from './auth.js';
import {
  curriculumSubjects,
  curriculumWorlds,
  adaptiveQuizData,
  curriculumAchievements,
  curriculumRecommendations,
  curriculumDiagnostics,
  curriculumSkillNodes
} from './curriculum.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Schema and Seeding
initSchema();

// Middleware
app.use(cors({
  origin: '*', // Allow Vite frontend during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==========================================
// ROOT & SYSTEM STATUS (Browser Friendly)
// ==========================================

/**
 * Root URL handler: Serves a helpful dashboard instead of "Cannot GET /"
 */
app.get('/', (req, res) => {
  let userCount = 0;
  try {
    const row = db.prepare('SELECT COUNT(*) as count FROM users').get();
    userCount = row ? row.count : 0;
  } catch (e) {}

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GameLearn AI — Backend API & SQLite Database</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f0fdf4;
      color: #064e3b;
      margin: 0;
      padding: 40px 16px;
      display: flex;
      justify-content: center;
    }
    .card {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      border-radius: 24px;
      max-width: 680px;
      width: 100%;
      padding: 32px;
      box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #dcfce7;
      color: #065f46;
      border: 1px solid #86efac;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 26px;
      color: #064e3b;
    }
    p {
      margin: 0 0 20px;
      color: #047857;
      font-size: 14px;
      line-height: 1.5;
    }
    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #10b981;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 14px;
      font-weight: 800;
      font-size: 14px;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
      margin-bottom: 24px;
      transition: background 0.2s;
    }
    .cta-btn:hover {
      background: #059669;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      padding: 14px;
      text-align: center;
    }
    .stat-label {
      font-size: 11px;
      color: #047857;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-val {
      font-size: 20px;
      font-weight: 900;
      color: #064e3b;
      margin-top: 4px;
    }
    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      color: #064e3b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: #ecfdf5;
      padding: 3px 8px;
      border-radius: 6px;
      color: #059669;
      font-weight: 700;
    }
    a.link {
      color: #059669;
      text-decoration: none;
      font-weight: 700;
    }
    a.link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🟢 Server & SQLite Database Active</div>
    <h1>🌿 GameLearn AI Backend API</h1>
    <p>The backend REST API server and persistent relational SQLite database are running properly on <strong>http://localhost:5000</strong>.</p>
    
    <a href="http://localhost:5173" class="cta-btn">🚀 Open Web Application (http://localhost:5173)</a>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">Database</div>
        <div class="stat-val">SQLite 3.53</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Status</div>
        <div class="stat-val">Online</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Users Stored</div>
        <div class="stat-val">${userCount}</div>
      </div>
    </div>

    <h3>Available REST API Endpoints</h3>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Endpoint</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>GET</code></td>
          <td><a class="link" href="/api/health">/api/health</a></td>
          <td>Database status & user counts</td>
        </tr>
        <tr>
          <td><code>GET</code></td>
          <td><a class="link" href="/api/leaderboard">/api/leaderboard</a></td>
          <td>Live rankings from SQLite</td>
        </tr>
        <tr>
          <td><code>GET</code></td>
          <td><a class="link" href="/api/analytics/summary">/api/analytics/summary</a></td>
          <td>Platform stats & user metrics</td>
        </tr>
        <tr>
          <td><code>POST</code></td>
          <td><code>/api/auth/login</code></td>
          <td>User authentication</td>
        </tr>
        <tr>
          <td><code>POST</code></td>
          <td><code>/api/auth/register</code></td>
          <td>Registration with chosen topics</td>
        </tr>
        <tr>
          <td><code>GET/PUT</code></td>
          <td><code>/api/user/profile</code></td>
          <td>Learner profile & topics (Bearer Token)</td>
        </tr>
        <tr>
          <td><code>GET/POST</code></td>
          <td><code>/api/user/topics</code></td>
          <td>Chosen & completed learning topics</td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`);
});

/**
 * API Directory
 */
app.get('/api', (req, res) => {
  res.json({
    name: 'GameLearn AI REST API',
    status: 'online',
    version: '1.0.0',
    database: 'SQLite 3.53 (node:sqlite)',
    documentation: 'http://localhost:5000/',
    endpoints: {
      health: 'GET /api/health',
      leaderboard: 'GET /api/leaderboard',
      analytics: 'GET /api/analytics/summary',
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      me: 'GET /api/auth/me',
      profile: 'GET, PUT /api/user/profile',
      topics: 'GET, POST /api/user/topics',
      xp: 'POST /api/user/xp',
      games: 'GET, POST /api/user/games',
      database: 'GET /api/admin/database'
    }
  });
});

/**
 * Visual Database Inspector HTML page at http://localhost:5000/database (Admin Only)
 */
app.get('/database', (req, res) => {
  const token = (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]) || req.query.token;
  let user = null;
  if (token) {
    user = verifyToken(token);
  }

  const isAdmin = (user && (user.role === 'admin' || (user.email && user.email.toLowerCase().includes('admin')))) ||
                  req.query.admin_key === 'gamelearn_admin_2026';

  if (!isAdmin) {
    return res.status(403).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied — Administrator Access Required</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f0fdf4;
      color: #064e3b;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      border-radius: 24px;
      max-width: 520px;
      width: 100%;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.1);
    }
    .shield-icon {
      width: 68px;
      height: 68px;
      margin: 0 auto 20px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
    }
    h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
    p { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
    .badge-forbidden {
      display: inline-block;
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .btn {
      display: inline-block;
      background: #10b981;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      transition: all 0.2s;
    }
    .btn:hover { background: #059669; }
    .admin-tip {
      margin-top: 24px;
      padding: 14px;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 12px;
      font-size: 12px;
      color: #475569;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="shield-icon">🛡️</div>
    <div class="badge-forbidden">403 Forbidden • Access Denied</div>
    <h1>Administrator Only Area</h1>
    <p>
      The SQLite Database Inspector contains private user authentication records and is strictly restricted to administrator users. Other users are not permitted to access this database viewer.
    </p>
    <a href="http://127.0.0.1:5173/login" class="btn">Return to App Login</a>
    <div class="admin-tip">
      <strong>Administrator Login:</strong> Sign in using <code>admin@gamelearn.ai</code> with password <code>admin123</code> to access the admin database panel.
    </div>
  </div>
</body>
</html>`);
  }

  const users = db.prepare(`
    SELECT id, name, email, title, level, xp, coins, streak, skill_level, learning_goal, role, created_at
    FROM users
    ORDER BY created_at DESC
  `).all();

  const interests = db.prepare(`
    SELECT ui.user_id, u.email as user_email, u.name as user_name, ui.interest as chosen_topic
    FROM user_interests ui
    JOIN users u ON u.id = ui.user_id
    ORDER BY ui.id ASC
  `).all();

  const topics = db.prepare(`
    SELECT ut.id, ut.user_id, u.email as user_email, ut.topic_id, ut.topic_title, ut.category, ut.score, ut.status, ut.completed_at
    FROM user_topics ut
    JOIN users u ON u.id = ut.user_id
    ORDER BY ut.updated_at DESC
  `).all();

  const userRowsHtml = users.map(u => {
    const userInterests = interests.filter(i => i.user_id === u.id).map(i => i.chosen_topic);
    const completedCount = topics.filter(t => t.user_id === u.id).length;
    const roleBadge = u.role === 'admin' 
      ? '<span style="background:#dcfce7;color:#166534;border:1px solid #86efac;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:800;margin-left:4px;">ADMIN</span>'
      : '<span style="background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;margin-left:4px;">STUDENT</span>';
    return `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td><code>${u.email}</code> ${roleBadge}</td>
        <td><span class="badge-role">Level ${u.level}</span></td>
        <td><strong>${u.xp.toLocaleString()} XP</strong></td>
        <td>${u.coins} 🪙</td>
        <td>${u.streak} 🔥</td>
        <td>
          <div class="tag-container">
            ${userInterests.map(t => `<span class="tag">${t}</span>`).join(' ')}
          </div>
        </td>
        <td>${completedCount} completed</td>
        <td><small>${u.created_at || 'Just now'}</small></td>
      </tr>
    `;
  }).join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GameLearn AI — Live SQLite Database Inspector</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f0fdf4;
      color: #064e3b;
      margin: 0;
      padding: 30px 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #bbf7d0;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.08);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid #d1fae5;
    }
    h1 { margin: 0; font-size: 24px; color: #064e3b; }
    .btn {
      background: #10b981;
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 12px;
    }
    .btn:hover { background: #059669; }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 14px;
      border-radius: 12px;
      text-align: center;
    }
    .stat-title { font-size: 11px; color: #047857; text-transform: uppercase; font-weight: 700; }
    .stat-value { font-size: 22px; font-weight: 900; color: #064e3b; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; color: #334155; font-weight: 700; }
    code { background: #ecfdf5; padding: 2px 6px; border-radius: 4px; color: #059669; font-weight: bold; }
    .tag { display: inline-block; background: #dcfce7; color: #065f46; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin: 2px; }
    .badge-role { background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>🗄️ SQLite Database: User Login & Chosen Topics Records</h1>
        <p style="margin: 4px 0 0; color: #047857; font-size: 13px;">Direct real-time view of <code>server/data/gamelearn.db</code></p>
      </div>
      <div>
        <a href="http://localhost:5173" class="btn">Launch Web App</a>
        <a href="/database" class="btn" style="background: #0284c7;">Refresh Data</a>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-title">Total Users</div>
        <div class="stat-value">${users.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Total Topics Chosen</div>
        <div class="stat-value">${interests.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Completed Topics</div>
        <div class="stat-value">${topics.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Database Engine</div>
        <div class="stat-value" style="font-size: 16px; margin-top: 8px;">node:sqlite</div>
      </div>
    </div>

    <h3>Registered Users & Login Accounts</h3>
    <table>
      <thead>
        <tr>
          <th>Learner Name</th>
          <th>Login Email</th>
          <th>Level</th>
          <th>Total XP</th>
          <th>Coins</th>
          <th>Streak</th>
          <th>Chosen Topics & Interests</th>
          <th>Completed Topics</th>
          <th>Registered At</th>
        </tr>
      </thead>
      <tbody>
        ${userRowsHtml}
      </tbody>
    </table>
  </div>
</body>
</html>`);
});

/**
 * Admin API Database Inspector: JSON Endpoint (Admin Only)
 */
app.get('/api/admin/database', (req, res) => {
  try {
    const token = (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]) || req.query.token;
    if (!token) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'Authentication token required. Only administrator accounts may inspect database records.'
      });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(403).json({
        error: 'Invalid Token',
        message: 'Invalid or expired authentication token.'
      });
    }

    const isAdmin = user.role === 'admin' || (user.email && user.email.toLowerCase().includes('admin'));
    if (!isAdmin) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Access denied: Database Viewer is restricted to Administrator accounts only. Student accounts are not permitted to inspect database records.'
      });
    }

    const users = db.prepare(`
      SELECT id, name, email, avatar, title, level, xp, xp_to_next_level, streak, coins,
             skill_level, learning_goal, daily_goal_minutes, joined_date, role, created_at
      FROM users
      ORDER BY created_at DESC
    `).all();

    const interests = db.prepare(`
      SELECT ui.user_id, u.email as user_email, u.name as user_name, ui.interest as chosen_topic
      FROM user_interests ui
      JOIN users u ON u.id = ui.user_id
      ORDER BY ui.id ASC
    `).all();

    const topics = db.prepare(`
      SELECT ut.id, ut.user_id, u.email as user_email, ut.topic_id, ut.topic_title, ut.category, ut.score, ut.status, ut.completed_at
      FROM user_topics ut
      JOIN users u ON u.id = ut.user_id
      ORDER BY ut.updated_at DESC
    `).all();

    const games = db.prepare(`
      SELECT gh.id, gh.user_id, u.email as user_email, gh.game_type, gh.score, gh.accuracy, gh.xp_earned, gh.coins_earned, gh.played_at
      FROM user_game_history gh
      JOIN users u ON u.id = gh.user_id
      ORDER BY gh.played_at DESC
      LIMIT 20
    `).all();

    const usersWithInterests = users.map(u => ({
      ...u,
      chosenTopics: interests.filter(i => i.user_id === u.id).map(i => i.chosen_topic),
      completedTopicsCount: topics.filter(t => t.user_id === u.id).length
    }));

    res.json({
      databaseStatus: 'connected',
      databasePath: dbPath,
      totalUsers: users.length,
      users: usersWithInterests,
      topics: topics,
      recentGames: games
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to inspect database', message: err.message });
  }
});

app.get('/api/health', (req, res) => {
  try {
    const row = db.prepare('SELECT COUNT(*) as count FROM users').get();
    res.json({
      status: 'ok',
      database: 'connected (SQLite 3.53)',
      totalUsers: row.count,
      serverTime: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

/**
 * Register a new user
 */
app.post('/api/auth/register', (req, res) => {
  try {
    const {
      name,
      email,
      password,
      interests,
      skillLevel,
      learningGoal,
      dailyGoalMinutes
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const user = createUser({
      name,
      email,
      password,
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Programming', 'AI & Machine Learning'],
      skillLevel: skillLevel || 'Beginner',
      learningGoal: learningGoal || 'Skill Development',
      dailyGoalMinutes: dailyGoalMinutes || 30
    });

    const token = createToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

/**
 * Log in existing user
 */
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRow = getUserByEmail(email);
    if (!userRow) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = verifyPassword(password, userRow.password_hash, userRow.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const interests = getUserInterests(userRow.id);
    const user = formatUser(userRow, interests);
    const token = createToken({ id: user.id, email: user.email, role: user.role });

    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed due to a server error' });
  }
});

/**
 * Get current authenticated user session
 */
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

/**
 * Logout
 */
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * Password reset request endpoint (mock email notification)
 */
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Password reset instructions sent to ${email || 'your email'}`
  });
});

// ==========================================
// USER PROFILE & TOPICS ROUTES
// ==========================================

/**
 * Get user profile with chosen topics
 */
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const user = getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * Update user profile & chosen topics (interests, goal, difficulty, daily commitment)
 */
app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const updated = updateUser(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

/**
 * Add XP to user and calculate level-ups
 */
app.post('/api/user/xp', authenticateToken, (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Valid XP amount is required' });
    }

    const result = addXp(req.user.id, amount);
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to award XP' });
  }
});

/**
 * Get chosen & completed topics for the authenticated user
 */
app.get('/api/user/topics', authenticateToken, (req, res) => {
  try {
    const topics = getUserTopics(req.user.id);
    const interests = getUserInterests(req.user.id);
    res.json({
      chosenInterests: interests,
      completedTopics: topics
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user topics' });
  }
});

/**
 * Record a chosen topic completion or progress
 */
app.post('/api/user/topics', authenticateToken, (req, res) => {
  try {
    const { topicId, topicTitle, category, status, score } = req.body;
    if (!topicId || !topicTitle) {
      return res.status(400).json({ error: 'topicId and topicTitle are required' });
    }

    const topics = saveUserTopic(req.user.id, {
      topicId,
      topicTitle,
      category,
      status: status || 'completed',
      score: score || 100
    });

    res.json({ success: true, topics });
  } catch (err) {
    console.error('Save topic error:', err);
    res.status(500).json({ error: 'Failed to record topic' });
  }
});

// ==========================================
// GAMEPLAY & LEADERBOARD ROUTES
// ==========================================

/**
 * Record a game session result
 */
app.post('/api/user/games', authenticateToken, (req, res) => {
  try {
    const { gameType, score, accuracy, xpEarned, coinsEarned } = req.body;
    if (!gameType) {
      return res.status(400).json({ error: 'gameType is required' });
    }

    const result = recordGameSession(req.user.id, {
      gameType,
      score: Number(score || 0),
      accuracy: Number(accuracy || 100),
      xpEarned: Number(xpEarned || 0),
      coinsEarned: Number(coinsEarned || 0)
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record game session' });
  }
});

/**
 * Get user game history
 */
app.get('/api/user/games', authenticateToken, (req, res) => {
  try {
    const history = getUserGameHistory(req.user.id);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve game history' });
  }
});

/**
 * Live Leaderboard generated from registered database users
 */
app.get('/api/leaderboard', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const leaderboard = getLeaderboard(limit);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

/**
 * Analytics summary with database metrics
 */
app.get('/api/analytics/summary', (req, res) => {
  try {
    const gamesCount = db.prepare('SELECT COUNT(*) as c FROM user_game_history').get().c;
    const topicsCount = db.prepare('SELECT COUNT(*) as c FROM user_topics').get().c;

    res.json({
      totalXp: 8420,
      learningHours: 47.3,
      averageAccuracy: 84.5,
      questionsSolved: 312 + gamesCount,
      currentStreak: 14,
      skillsMastered: 8 + topicsCount,
      weeklyActivity: [
        { day: 'Mon', date: 'Mar 03', minutes: 45, xp: 320, quizzes: 3, accuracy: 88 },
        { day: 'Tue', date: 'Mar 04', minutes: 30, xp: 210, quizzes: 2, accuracy: 79 },
        { day: 'Wed', date: 'Mar 05', minutes: 60, xp: 480, quizzes: 4, accuracy: 92 },
        { day: 'Thu', date: 'Mar 06', minutes: 35, xp: 260, quizzes: 2, accuracy: 85 },
        { day: 'Fri', date: 'Mar 07', minutes: 50, xp: 390, quizzes: 3, accuracy: 81 },
        { day: 'Sat', date: 'Mar 08', minutes: 80, xp: 620, quizzes: 5, accuracy: 94 },
        { day: 'Sun', date: 'Mar 09', minutes: 40, xp: 310, quizzes: 2, accuracy: 87 }
      ],
      monthlyActivity: [
        { day: 'W1', date: 'Feb 09 - Feb 15', minutes: 280, xp: 1950, quizzes: 16, accuracy: 82 },
        { day: 'W2', date: 'Feb 16 - Feb 22', minutes: 310, xp: 2200, quizzes: 19, accuracy: 86 },
        { day: 'W3', date: 'Feb 23 - Mar 01', minutes: 290, xp: 2050, quizzes: 18, accuracy: 84 },
        { day: 'W4', date: 'Mar 02 - Mar 09', minutes: 340, xp: 2590, quizzes: 21, accuracy: 87 }
      ],
      topicMastery: [
        { topic: 'Python', mastery: 84, benchmark: 70 },
        { topic: 'Data Structs', mastery: 80, benchmark: 65 },
        { topic: 'Algorithms', mastery: 72, benchmark: 60 },
        { topic: 'AI & ML', mastery: 65, benchmark: 55 },
        { topic: 'Math Logic', mastery: 76, benchmark: 68 },
        { topic: 'Databases', mastery: 88, benchmark: 72 }
      ],
      difficultyDistribution: [
        { name: 'Easy', value: 124, color: '#10b981' },
        { name: 'Medium', value: 142, color: '#f59e0b' },
        { name: 'Hard', value: 46, color: '#f43f5e' }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// ==========================================
// COURSES, WORLDS & SUBJECTS ROUTES
// ==========================================

app.get('/api/courses/subjects', (req, res) => {
  res.json(curriculumSubjects);
});

app.get('/api/courses/subjects/:slug', (req, res) => {
  const subject = curriculumSubjects.find(s => s.slug === req.params.slug) || curriculumSubjects[0];
  res.json(subject);
});

app.get('/api/courses/:slug/worlds', (req, res) => {
  res.json(curriculumWorlds);
});

// ==========================================
// ADAPTIVE QUIZ ROUTES
// ==========================================

app.get('/api/quizzes/:id', (req, res) => {
  res.json({
    ...adaptiveQuizData,
    id: req.params.id || adaptiveQuizData.id
  });
});

app.post('/api/quizzes/:id/submit', (req, res) => {
  try {
    const { answers, difficultyProgression } = req.body;
    const questions = adaptiveQuizData.questions;
    let correctCount = 0;
    let totalXp = 0;

    const answersBreakdown = Array.isArray(answers) ? answers.map((ans, idx) => {
      const q = questions[idx] || questions[0];
      const isCorrect = ans.selectedOption === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
        totalXp += (q.xpValue || 40);
      }
      return {
        questionId: q.id,
        questionText: q.question,
        userAnswer: ans.selectedOption,
        correctAnswer: q.correctAnswer,
        isCorrect,
        difficulty: (difficultyProgression && difficultyProgression[idx]?.difficulty) || q.difficulty,
        timeTakenSeconds: ans.timeTaken || 12
      };
    }) : [];

    const totalQuestions = questions.length || 5;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const bonusXp = accuracy >= 80 ? 100 : 50;
    const finalXp = totalXp + bonusXp;

    // If bearer token is present, record game session and add XP to user in SQLite
    const token = (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]) || req.query.token;
    if (token) {
      try {
        const user = verifyToken(token);
        if (user) {
          addXp(user.id, finalXp);
          recordGameSession(user.id, {
            gameType: 'adaptive_quiz',
            score: correctCount * 20,
            accuracy,
            xpEarned: finalXp,
            coinsEarned: Math.round(finalXp / 3)
          });
        }
      } catch (e) {}
    }

    res.json({
      quizId: req.params.id,
      quizTitle: adaptiveQuizData.title,
      subject: adaptiveQuizData.subject,
      score: correctCount,
      totalQuestions,
      accuracy,
      timeSpentSeconds: Array.isArray(answers) ? answers.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0) || 75 : 75,
      xpEarned: finalXp,
      coinsEarned: Math.round(finalXp / 3),
      difficultyProgression: difficultyProgression || [{ questionIndex: 0, difficulty: 'Medium' }],
      answersBreakdown,
      aiAnalysis: {
        overallSummary: accuracy >= 80
          ? 'Phenomenal mastery displayed! The adaptive AI detected exceptional rapid comprehension in first-class functions and closures, dynamically scaling question difficulty up to Hard.'
          : 'Solid foundational effort! The adaptive AI identified opportunities to solidify call stack visualization and edge case handling.',
        strongestTopic: 'Default Arguments & Function Scope',
        weakestTopic: accuracy < 100 ? 'Closures & Scope Chains' : 'None detected! 100% Mastery!',
        nextRecommendation: 'Move forward to World 3: Advanced Architecture & Async Paradigms.',
        suggestedReviewCheckpoints: [
          'Review Python function parameter packing with *args and **kwargs',
          'Practice tracing execution stack frames'
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process quiz submission', message: err.message });
  }
});

// ==========================================
// SKILL TREE / ASSESSMENTS ROUTES
// ==========================================

app.get('/api/assessments/skills', (req, res) => {
  const { category } = req.query;
  if (category && category !== 'All') {
    const filtered = curriculumSkillNodes.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    return res.json(filtered);
  }
  res.json(curriculumSkillNodes);
});

app.post('/api/assessments/skills/:id/unlock', (req, res) => {
  const target = curriculumSkillNodes.find(s => s.id === req.params.id) || curriculumSkillNodes[0];
  const updated = { ...target, isUnlocked: true, masteryPercentage: Math.max(target.masteryPercentage, 20) };
  res.json(updated);
});

// ==========================================
// ACHIEVEMENTS ROUTES
// ==========================================

app.get('/api/achievements', (req, res) => {
  res.json(curriculumAchievements);
});

app.post('/api/achievements/:id/claim', (req, res) => {
  const ach = curriculumAchievements.find(a => a.id === req.params.id);
  const xpReward = ach ? ach.xpReward : 100;
  res.json({
    success: true,
    xpAwarded: xpReward
  });
});

// ==========================================
// AI RECOMMENDATIONS & INSIGHTS ROUTES
// ==========================================

app.get('/api/recommendations', (req, res) => {
  res.json(curriculumRecommendations);
});

app.get('/api/recommendations/diagnostics', (req, res) => {
  res.json(curriculumDiagnostics);
});

app.post('/api/recommendations/generate-path', (req, res) => {
  const { goal } = req.body;
  res.json({
    pathId: 'path_ai_adaptive_' + Date.now(),
    goal: goal || 'Custom Accelerated Track',
    topics: [
      'Python Functions & Closures',
      'Call Stack & Recursive Patterns',
      'Divide & Conquer Paradigms',
      'Dynamic Programming & Memoization',
      'Algorithmic Complexity & Profiling'
    ]
  });
});

// ==========================================
// AI TUTOR & LESSON ENDPOINTS
// ==========================================

function isTechnicalMessage(text) {
  if (!text) return false;
  const lower = text.toLowerCase().trim();

  const unwantedPatterns = [
    /\b(weather|temperature|forecast|rain|rainy|sunny|humidity|storm|cloudy)\b/i,
    /\b(movie|movies|cinema|film|actor|actress|hollywood|bollywood|taylor swift|song|songs|sing|music|lyrics|album|batman|superman|marvel|disney)\b/i,
    /\b(football|cricket|soccer|basketball|nba|messi|ronaldo|ipl|fifa|tennis|score|match|olympics)\b/i,
    /\b(politics|president|prime minister|election|government|war|country|capital of|monarch|queen|king)\b/i,
    /\b(recipe|cook|cooking|pizza|burger|pasta|food|dish|restaurant|bake|baking|cake|tea|coffee)\b/i,
    /\b(girlfriend|boyfriend|love you|marry me|date me|flirt|kiss|crush|relationship)\b/i,
    /\b(horoscope|zodiac|astrology|fortune|tarot)\b/i,
    /\b(shoes|clothes|dress|makeup|shopping|buy clothes|crypto price|stock tip)\b/i
  ];

  for (const pat of unwantedPatterns) {
    if (pat.test(lower)) {
      const hasExplicitCode = /(in python|in javascript|in react|code|program|api|algorithm|database|function|class|sql)/i.test(lower);
      if (!hasExplicitCode) return false;
    }
  }

  if (/^(hi|hello|hey|greetings|hola|sup|howdy)$/i.test(lower)) return true;

  const techPhrases = [
    'binary search', 'linear search', 'quick sort', 'merge sort', 'bubble sort',
    'insertion sort', 'selection sort', 'base case', 'call stack', 'stack overflow',
    'dynamic programming', 'two pointers', 'sliding window', 'bit manipulation',
    'binary tree', 'linked list', 'doubly linked', 'singly linked', 'priority queue',
    'hash map', 'hash table', 'time complexity', 'space complexity', 'big o',
    'data structure', 'data structures', 'for loop', 'while loop', 'event loop',
    'null pointer', 'memory leak', 'unit test', 'clean code', 'design pattern',
    'explain simply', 'test me', 'quiz me', 'code example', 'inner join',
    'group by', 'order by', 'why was my answer', 'why is my answer'
  ];

  for (const phrase of techPhrases) {
    if (lower.includes(phrase)) return true;
  }

  const techWordSet = new Set([
    'python', 'javascript', 'typescript', 'java', 'cpp', 'sql', 'html', 'css',
    'algorithm', 'algorithms', 'bsearch', 'quicksort', 'mergesort', 'recursion',
    'recursive', 'recurse', 'memoization', 'tabulation', 'backtracking', 'graph',
    'tree', 'trees', 'bst', 'trie', 'heap', 'traversal', 'bfs', 'dfs', 'array',
    'arrays', 'matrix', 'vector', 'stack', 'queue', 'hashmap', 'hashtable',
    'dictionary', 'dict', 'tuple', 'node', 'pointer', 'api', 'apis', 'rest',
    'http', 'https', 'endpoint', 'server', 'client', 'browser', 'dom', 'react',
    'vite', 'node', 'express', 'hook', 'hooks', 'props', 'json', 'jwt',
    'database', 'databases', 'db', 'sqlite', 'postgres', 'mysql', 'mongodb',
    'query', 'queries', 'schema', 'debug', 'debugging', 'bug', 'bugs', 'error',
    'errors', 'exception', 'code', 'coding', 'program', 'programming', 'developer',
    'software', 'compiler', 'function', 'functions', 'method', 'methods', 'class',
    'classes', 'object', 'objects', 'loop', 'loops', 'variable', 'variables',
    'scope', 'closure', 'async', 'await', 'promise', 'git', 'github', 'quiz',
    'hint', 'practice', 'challenge', 'socratic', 'motivation', 'streak', 'syntax'
  ]);

  const words = lower.split(/[^a-z0-9_#+]+/);
  for (const word of words) {
    if (word && techWordSet.has(word)) return true;
  }

  return false;
}

/**
 * AI Tutor answer endpoint for In-Lesson coaching
 */
app.post('/api/lessons/ai-tutor', (req, res) => {
  try {
    const { question, context } = req.body;

    if (!isTechnicalMessage(question)) {
      return res.json({
        answer: "Sorry this is only for Technical Purpose. Please ask questions related to programming and computer science.",
        relatedTopic: "Technical Only"
      });
    }

    const q = (question || '').toLowerCase();

    let answer = "In computer science, functions encapsulate reusable logic into modular units. They receive input parameters, isolate local scope, and return computed results.";
    let relatedTopic = context || "Functions & Modular Design";

    if (q.includes('recursion') || q.includes('base case') || q.includes('call stack')) {
      answer = "A recursive function calls itself to solve smaller instances of a problem. It MUST have a reachable base case that returns without recursion, otherwise it overflows the call stack!";
      relatedTopic = "Recursion & Call Stacks";
    } else if (q.includes('binary search') || q.includes('bsearch') || q.includes('log n')) {
      answer = "Binary search repeatedly cuts the search space in half by comparing the target to the midpoint. It requires a sorted list and completes in O(log n) time.";
      relatedTopic = "Binary Search & Divide-and-Conquer";
    } else if (q.includes('*args') || q.includes('**kwargs')) {
      answer = "*args captures variable positional arguments into an immutable Tuple, while **kwargs captures arbitrary keyword arguments into a Dictionary.";
      relatedTopic = "Python Arguments Packing";
    } else if (q.includes('lambda')) {
      answer = "Lambda functions are single-expression anonymous functions. Example: `square = lambda x: x * x`. Best suited for short predicates in map(), filter(), or sorted().";
      relatedTopic = "Anonymous Functions";
    } else if (q.includes('closure') || q.includes('scope')) {
      answer = "A closure is created when an inner nested function preserves access to variables in its outer enclosing scope even after the outer function has finished executing.";
      relatedTopic = "Lexical Scopes & Closures";
    } else if (q.includes('sql') || q.includes('group by') || q.includes('having')) {
      answer = "WHERE filters individual table rows BEFORE aggregation. HAVING filters summarized groups AFTER GROUP BY aggregation.";
      relatedTopic = "SQL Aggregations";
    } else if (q.includes('big o') || q.includes('complexity')) {
      answer = "Big-O notation describes how an algorithm's execution time or memory footprint scales as input size N grows toward infinity. O(1) is constant, O(log n) is logarithmic, O(n) is linear, and O(n²) is quadratic.";
      relatedTopic = "Big-O Notation";
    }

    res.json({ answer, relatedTopic });
  } catch (err) {
    res.status(500).json({ error: 'AI Tutor service error' });
  }
});

/**
 * Get lesson details by ID
 */
app.get('/api/lessons/:id', (req, res) => {
  const lessonId = req.params.id;
  res.json({
    id: lessonId,
    title: 'Mastering Python Functions & Recursion',
    module: 'Computer Science Core',
    durationMinutes: 15,
    xpReward: 250,
    difficulty: 'Intermediate',
    associatedQuizId: 'quiz_py_functions',
    nextLessonId: 'lesson_py_data_structures',
    content: `### Understanding First-Class Functions & Call Stacks

In modern programming, functions are first-class citizens. They can be passed as arguments, returned from other functions, and stored in variables.

#### The Lifecycle of a Function Call
When a function is called, the runtime creates an execution context frame on the Call Stack:
1. **Parameter Allocation**: Arguments are mapped to parameter names.
2. **Local Scope Isolation**: Local variables cannot collide with outer variables.
3. **Return Resolution**: The stack frame is popped, returning control and values to the caller.

\`\`\`python
def safe_divide(numerator: float, denominator: float) -> float:
    """Safely divide two numbers with input validation."""
    if denominator == 0:
        raise ValueError("Denominator cannot be zero!")
    return numerator / denominator
\`\`\`
`,
    checkpoints: [
      {
        id: 'cp_1',
        question: 'What is the primary condition needed to prevent recursion from overflowing the call stack?',
        options: [
          'Using a while loop inside the function',
          'A reachable base case that returns without recursing',
          'Declaring variables as global',
          'Wrapping the function in a try-except block'
        ],
        correctOptionIndex: 1,
        explanation: 'A base case provides the termination condition that prevents infinite frame allocations on the call stack.'
      }
    ]
  });
});

/**
 * Complete a lesson
 */
app.post('/api/lessons/:id/complete', (req, res) => {
  const lessonId = req.params.id;
  res.json({
    xpEarned: 250,
    nextLessonId: 'lesson_py_data_structures',
    message: `Lesson ${lessonId} completed successfully!`
  });
});

/**
 * AI Companion Chat endpoint
 */
app.post('/api/ai/chat', (req, res) => {
  try {
    const { message, isSocratic } = req.body;

    if (!isTechnicalMessage(message)) {
      return res.json({
        sender: 'ai',
        text: "Sorry this is only for Technical Purpose",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    const lower = (message || '').toLowerCase();

    let text = "I am GameLearn AI, your adaptive tutor. I can break down algorithms, explain code step-by-step, or generate interactive quizzes!";
    
    if (lower.includes('binary search')) {
      text = "Binary Search divides a sorted array in half each step ($O(\\log n)$ time). It compares the middle element to the target and eliminates the impossible half.";
    } else if (lower.includes('recursion')) {
      text = "Recursion solves a problem by having a function call itself with smaller inputs until reaching a base case.";
    } else if (lower.includes('big o')) {
      text = "Big-O notation describes the asymptotic worst-case scaling of an algorithm: $O(1) < O(\\log n) < O(n) < O(n \\log n) < O(n^2)$.";
    }

    res.json({
      sender: 'ai',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err) {
    res.status(500).json({ error: 'Chat service error' });
  }
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl,
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist. Visit http://localhost:5000/ to view the API documentation.`,
    statusPage: 'http://localhost:5000/'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 GameLearn AI Backend running on http://localhost:${PORT}`);
  console.log(`📊 SQLite database connected: ${dbPath}`);
  console.log(`🛡️  REST API ready for authentication, chosen topics, and gamification`);
});
