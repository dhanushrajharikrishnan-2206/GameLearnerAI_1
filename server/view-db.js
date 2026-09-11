import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'gamelearn.db');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Database file not found at:', dbPath);
  process.exit(1);
}

const db = new DatabaseSync(dbPath);

console.log('\n======================================================');
console.log('🗄️   GAMELEARN AI — SQLITE DATABASE VIEWER');
console.log('======================================================\n');

// 1. Users Table (Login Details & Stats)
console.log('👤 [USERS TABLE] — User Login Credentials & Progress:');
const users = db.prepare(`
  SELECT id, name, email, title, level, xp, coins, streak, skill_level, learning_goal, created_at
  FROM users
  ORDER BY created_at DESC
`).all();
console.table(users);

// 2. User Interests / Chosen Topics
console.log('\n🎯 [USER_INTERESTS TABLE] — Chosen Topics per User:');
const interests = db.prepare(`
  SELECT u.email as user_email, u.name as user_name, ui.interest as chosen_topic
  FROM user_interests ui
  JOIN users u ON u.id = ui.user_id
  ORDER BY u.name, ui.interest
`).all();
console.table(interests);

// 3. User Topics Completed
console.log('\n📚 [USER_TOPICS TABLE] — Completed & In-Progress Learning Topics:');
const topics = db.prepare(`
  SELECT u.email as user_email, ut.topic_id, ut.topic_title, ut.category, ut.score, ut.status, ut.completed_at
  FROM user_topics ut
  JOIN users u ON u.id = ut.user_id
  ORDER BY ut.updated_at DESC
`).all();
if (topics.length > 0) {
  console.table(topics);
} else {
  console.log('   (No completed topic records yet)');
}

// 4. User Game History
console.log('\n🎮 [USER_GAME_HISTORY TABLE] — Mini-Game & Boss Battle History:');
const games = db.prepare(`
  SELECT u.email as user_email, gh.game_type, gh.score, gh.accuracy, gh.xp_earned, gh.coins_earned, gh.played_at
  FROM user_game_history gh
  JOIN users u ON u.id = gh.user_id
  ORDER BY gh.played_at DESC
  LIMIT 10
`).all();
if (games.length > 0) {
  console.table(games);
} else {
  console.log('   (No game sessions recorded yet)');
}

// Also export to readable JSON file for direct inspection in editor
const exportData = {
  exportedAt: new Date().toISOString(),
  databaseFile: dbPath,
  totalUsers: users.length,
  users: users.map(u => {
    const userTopics = interests.filter(i => i.user_email === u.email).map(i => i.chosen_topic);
    return {
      ...u,
      chosenTopics: userTopics
    };
  }),
  completedTopics: topics,
  gameHistory: games
};

const exportFilePath = path.join(__dirname, 'data', 'database_viewer.json');
fs.writeFileSync(exportFilePath, JSON.stringify(exportData, null, 2), 'utf-8');
console.log(`\n💾 Exported human-readable JSON to: ${exportFilePath}\n`);
