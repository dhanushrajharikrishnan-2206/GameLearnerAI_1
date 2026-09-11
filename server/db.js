import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { hashPassword } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const dbPath = path.join(dataDir, 'gamelearn.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize Tables Schema
 */
export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      avatar TEXT,
      title TEXT DEFAULT 'Algorithm Alchemist',
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 100,
      xp_to_next_level INTEGER DEFAULT 500,
      streak INTEGER DEFAULT 1,
      longest_streak INTEGER DEFAULT 1,
      coins INTEGER DEFAULT 50,
      overall_mastery INTEGER DEFAULT 15,
      learning_time_minutes INTEGER DEFAULT 30,
      joined_date TEXT,
      skill_level TEXT DEFAULT 'Intermediate',
      learning_goal TEXT DEFAULT 'Skill Development',
      daily_goal_minutes INTEGER DEFAULT 30,
      role TEXT DEFAULT 'student',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      interest TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, interest)
    );

    CREATE TABLE IF NOT EXISTS user_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      topic_title TEXT NOT NULL,
      category TEXT,
      status TEXT DEFAULT 'in_progress',
      score INTEGER DEFAULT 0,
      completed_at TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, topic_id)
    );

    CREATE TABLE IF NOT EXISTS user_game_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      game_type TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      accuracy INTEGER DEFAULT 0,
      xp_earned INTEGER DEFAULT 0,
      coins_earned INTEGER DEFAULT 0,
      played_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      title TEXT NOT NULL,
      xp_reward INTEGER DEFAULT 50,
      unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, achievement_id)
    );
  `);

  // Migrate existing databases to ensure role column exists
  try {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student';");
  } catch (err) {
    // Column already exists
  }

  // Ensure role column values are valid and admin accounts have 'admin'
  try {
    db.prepare("UPDATE users SET role = 'admin' WHERE LOWER(email) LIKE '%admin%'").run();
    db.prepare("UPDATE users SET role = 'student' WHERE role IS NULL OR role = ''").run();
  } catch (err) {
    // Ignore migration updates if already current
  }

  // Seed default demo student and admin users if needed
  seedDemoUser();
}

/**
 * Format raw SQLite user row + interests array into frontend User object
 */
export function formatUser(row, interests = []) {
  if (!row) return null;
  const role = row.role || (row.email && row.email.toLowerCase().includes('admin') ? 'admin' : 'student');
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role,
    avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: row.title || (role === 'admin' ? 'System Administrator' : 'Algorithm Alchemist'),
    level: Number(row.level || 1),
    xp: Number(row.xp || 0),
    xpToNextLevel: Number(row.xp_to_next_level || 500),
    streak: Number(row.streak || 1),
    longestStreak: Number(row.longest_streak || 1),
    coins: Number(row.coins || 50),
    overallMastery: Number(row.overall_mastery || 15),
    learningTimeMinutes: Number(row.learning_time_minutes || 30),
    joinedDate: row.joined_date || 'January 2026',
    skillLevel: row.skill_level || 'Intermediate',
    learningGoal: row.learning_goal || 'Skill Development',
    dailyGoalMinutes: Number(row.daily_goal_minutes || 30),
    interests: interests
  };
}

/**
 * Fetch interests for a user
 */
export function getUserInterests(userId) {
  const stmt = db.prepare('SELECT interest FROM user_interests WHERE user_id = ? ORDER BY id ASC');
  const rows = stmt.all(userId);
  return rows.map((r) => r.interest);
}

/**
 * Replace all interests for a user
 */
export function setUserInterests(userId, interests) {
  if (!Array.isArray(interests)) return;
  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare('DELETE FROM user_interests WHERE user_id = ?').run(userId);
    const insertStmt = db.prepare('INSERT OR IGNORE INTO user_interests (user_id, interest) VALUES (?, ?)');
    for (const interest of interests) {
      if (typeof interest === 'string' && interest.trim()) {
        insertStmt.run(userId, interest.trim());
      }
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

/**
 * Find user by email (includes password_hash and salt for auth)
 */
export function getUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
  return stmt.get(email.trim());
}

/**
 * Find user by id (without password)
 */
export function getUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const row = stmt.get(id);
  if (!row) return null;
  const interests = getUserInterests(id);
  return formatUser(row, interests);
}

/**
 * Create a new user in database
 */
export function createUser({
  name,
  email,
  password,
  role = 'student',
  interests = ['Programming', 'AI & Machine Learning'],
  skillLevel = 'Intermediate',
  learningGoal = 'Skill Development',
  dailyGoalMinutes = 30
}) {
  const id = crypto.randomUUID();
  const { hash, salt } = hashPassword(password);
  const now = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;
  const userRole = role === 'admin' || email.toLowerCase().includes('admin') ? 'admin' : 'student';

  const stmt = db.prepare(`
    INSERT INTO users (
      id, name, email, password_hash, salt, avatar, joined_date,
      skill_level, learning_goal, daily_goal_minutes, role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    name.trim(),
    email.trim().toLowerCase(),
    hash,
    salt,
    avatar,
    now,
    skillLevel,
    learningGoal,
    dailyGoalMinutes,
    userRole
  );

  setUserInterests(id, interests);
  return getUserById(id);
}

/**
 * Update user profile
 */
export function updateUser(userId, updates) {
  const allowed = [
    'name', 'avatar', 'title', 'level', 'xp', 'xp_to_next_level',
    'streak', 'longest_streak', 'coins', 'overall_mastery',
    'learning_time_minutes', 'skill_level', 'learning_goal', 'daily_goal_minutes',
    'role'
  ];

  const sets = [];
  const values = [];

  // Map camelCase to snake_case if passed
  const keyMap = {
    xpToNextLevel: 'xp_to_next_level',
    longestStreak: 'longest_streak',
    overallMastery: 'overall_mastery',
    learningTimeMinutes: 'learning_time_minutes',
    skillLevel: 'skill_level',
    learningGoal: 'learning_goal',
    dailyGoalMinutes: 'daily_goal_minutes'
  };

  for (const [key, value] of Object.entries(updates)) {
    const dbKey = keyMap[key] || key;
    if (allowed.includes(dbKey) && value !== undefined) {
      sets.push(`${dbKey} = ?`);
      values.push(value);
    }
  }

  if (sets.length > 0) {
    sets.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);
    const sql = `UPDATE users SET ${sets.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);
  }

  if (updates.interests && Array.isArray(updates.interests)) {
    setUserInterests(userId, updates.interests);
  }

  return getUserById(userId);
}

/**
 * Add XP and calculate level-ups
 */
export function addXp(userId, amount) {
  const user = getUserById(userId);
  if (!user) return null;

  let newXp = user.xp + amount;
  let newLevel = user.level;
  let xpToNextLevel = user.xpToNextLevel;
  let leveledUp = false;

  while (newXp >= xpToNextLevel) {
    newLevel += 1;
    xpToNextLevel += 2500;
    leveledUp = true;
  }

  updateUser(userId, {
    xp: newXp,
    level: newLevel,
    xp_to_next_level: xpToNextLevel,
    coins: user.coins + (leveledUp ? 25 : 5)
  });

  return { newXp, newLevel, leveledUp, xpToNextLevel };
}

/**
 * Record a game session
 */
export function recordGameSession(userId, { gameType, score, accuracy, xpEarned, coinsEarned }) {
  const stmt = db.prepare(`
    INSERT INTO user_game_history (user_id, game_type, score, accuracy, xp_earned, coins_earned)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(userId, gameType, score || 0, accuracy || 100, xpEarned || 0, coinsEarned || 0);

  if (xpEarned > 0) {
    addXp(userId, xpEarned);
  }

  return { success: true };
}

/**
 * Get user game history
 */
export function getUserGameHistory(userId, limit = 20) {
  const stmt = db.prepare(`
    SELECT * FROM user_game_history WHERE user_id = ? ORDER BY played_at DESC LIMIT ?
  `);
  return stmt.all(userId, limit);
}

/**
 * Save or complete a learning topic
 */
export function saveUserTopic(userId, { topicId, topicTitle, category, status = 'completed', score = 100 }) {
  const stmt = db.prepare(`
    INSERT INTO user_topics (user_id, topic_id, topic_title, category, status, score, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, topic_id) DO UPDATE SET
      status = excluded.status,
      score = excluded.score,
      completed_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
  `);
  stmt.run(userId, topicId, topicTitle, category || 'General', status, score);
  return getUserTopics(userId);
}

/**
 * Get all completed/in-progress topics for a user
 */
export function getUserTopics(userId) {
  const stmt = db.prepare(`
    SELECT * FROM user_topics WHERE user_id = ? ORDER BY updated_at DESC
  `);
  return stmt.all(userId);
}

/**
 * Get Leaderboard calculated directly from registered users
 */
export function getLeaderboard(limit = 10) {
  const stmt = db.prepare(`
    SELECT id, name, avatar, title, level, xp, streak, coins
    FROM users
    ORDER BY xp DESC, streak DESC
    LIMIT ?
  `);
  const rows = stmt.all(limit);
  return rows.map((r, index) => ({
    rank: index + 1,
    id: r.id,
    name: r.name,
    avatar: r.avatar,
    title: r.title,
    level: Number(r.level),
    xp: Number(r.xp),
    streak: Number(r.streak),
    coins: Number(r.coins)
  }));
}

/**
 * Seed initial demo student and administrator accounts
 */
function seedDemoUser() {
  // 1. Ensure Demo Student Account (alex@example.com)
  const existingStudent = getUserByEmail('alex@example.com');
  if (!existingStudent) {
    const { hash, salt } = hashPassword('password123');
    const demoId = 'demo-user-alex-001';
    db.prepare(`
      INSERT INTO users (
        id, name, email, password_hash, salt, avatar, title, level, xp, xp_to_next_level,
        streak, longest_streak, coins, overall_mastery, learning_time_minutes,
        joined_date, skill_level, learning_goal, daily_goal_minutes, role
      ) VALUES (
        ?, 'Alex Chen', 'alex@example.com', ?, ?,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'Algorithm Alchemist', 14, 4820, 5000, 12, 18, 420, 68, 1420,
        'September 2025', 'Intermediate', 'Skill Development', 30, 'student'
      )
    `).run(demoId, hash, salt);

    setUserInterests(demoId, [
      'Programming',
      'AI & Machine Learning',
      'Data Science',
      'Computer Science'
    ]);

    // Seed completed topics
    db.prepare(`
      INSERT OR IGNORE INTO user_topics (user_id, topic_id, topic_title, category, status, score)
      VALUES
        (?, 'algo-01', 'Divide and Conquer Algorithms', 'Algorithms', 'completed', 95),
        (?, 'py-01', 'Python Asynchronous Paradigms', 'Programming', 'completed', 100),
        (?, 'db-01', 'SQL Indexing & Query Optimizations', 'Databases', 'completed', 90)
    `).run(demoId, demoId, demoId);

    console.log('✅ SQLite Database seeded with demo student: alex@example.com / password123 (role: student)');
  } else {
    // Ensure student role
    db.prepare("UPDATE users SET role = 'student' WHERE LOWER(email) = 'alex@example.com'").run();
  }

  // 2. Ensure Demo Administrator Account (admin@gamelearn.ai)
  const existingAdmin = getUserByEmail('admin@gamelearn.ai');
  if (!existingAdmin) {
    const { hash: adminHash, salt: adminSalt } = hashPassword('admin123');
    const adminId = 'demo-admin-sarah-001';
    db.prepare(`
      INSERT INTO users (
        id, name, email, password_hash, salt, avatar, title, level, xp, xp_to_next_level,
        streak, longest_streak, coins, overall_mastery, learning_time_minutes,
        joined_date, skill_level, learning_goal, daily_goal_minutes, role
      ) VALUES (
        ?, 'Sarah Jenkins (Admin)', 'admin@gamelearn.ai', ?, ?,
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        'System Administrator', 50, 99999, 100000, 99, 99, 9999, 100, 5000,
        'January 2025', 'Advanced', 'System Management & Education', 60, 'admin'
      )
    `).run(adminId, adminHash, adminSalt);

    setUserInterests(adminId, [
      'System Architecture',
      'Database Engineering',
      'Cybersecurity',
      'AI & Machine Learning'
    ]);

    db.prepare(`
      INSERT OR IGNORE INTO user_topics (user_id, topic_id, topic_title, category, status, score)
      VALUES
        (?, 'sys-01', 'Distributed Database Architectures', 'Databases', 'completed', 100),
        (?, 'sec-01', 'Zero Trust & Access Control', 'Cybersecurity', 'completed', 100)
    `).run(adminId, adminId);

    console.log('✅ SQLite Database seeded with demo admin: admin@gamelearn.ai / admin123 (role: admin)');
  } else {
    // Ensure admin role
    db.prepare("UPDATE users SET role = 'admin' WHERE LOWER(email) = 'admin@gamelearn.ai'").run();
  }
}
