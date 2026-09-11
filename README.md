# 🎮 GameLearn AI — AI-Powered Gamified Learning Platform

**GameLearn AI** is a production-grade, hackathon-level frontend and backend web application designed to make education feel like an interactive adventure:

$$\text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Adapt} \longrightarrow \text{Earn XP} \longrightarrow \text{Level Up} \longrightarrow \text{Master}$$

---

## 🌿 Design Aesthetics & Theme
- **Lush Light Green Theme**: Featuring fresh sage & mint tinted backgrounds (`#f0fdf4`, `#f2f9f5`), crisp white cards with mint borders (`#d1fae5`, `#bbf7d0`), and vivid emerald gradients (`from-emerald-600 to-teal-500`).
- **Interactive Theme Switcher**: Dedicated toggle in the navbar (`🌿 Light Green` vs `☀️ Clean Light`) and on the Settings page.
- **Glassmorphism & Micro-animations**: Delicate frosted translucent cards, glowing border utilities, animated XP progress bars, and reactive interactive badges.

---

## 🗄️ Backend Architecture & SQLite Database

The platform includes a dedicated **Node.js + Express REST API** integrated with a persistent **SQLite relational database** powered by Node 24's native `node:sqlite` (`DatabaseSync`).

- **Database File**: `server/data/gamelearn.db`
- **Zero Native Build Dependencies**: Runs directly on Windows with no external C++ compilers or `node-gyp` required.
- **ACID-Compliant & High Performance**: Operates with Write-Ahead Logging (`PRAGMA journal_mode = WAL`) and automatic foreign key integrity.

### 📋 Database Tables & Schema

1. **`users`**:
   - `id` (UUID Primary Key)
   - `name`, `email` (Unique), `password_hash`, `salt` (Cryptographically hashed using `node:crypto.scryptSync`)
   - `avatar`, `title` (e.g. "Algorithm Alchemist")
   - `level`, `xp`, `xp_to_next_level`, `streak`, `longest_streak`, `coins`, `overall_mastery`, `learning_time_minutes`
   - `skill_level` ('Beginner' | 'Intermediate' | 'Advanced')
   - `learning_goal`, `daily_goal_minutes`, `joined_date`, `created_at`, `updated_at`

2. **`user_interests`**:
   - Stores chosen topics/interests selected during onboarding or from the profile:
     - `Programming`, `AI & Machine Learning`, `Data Science`, `Algorithms`, `Mathematics`, `Computer Science`, `Cybersecurity`, etc.
   - Foreign key constraint linked to `users(id)` with `ON DELETE CASCADE`.

3. **`user_topics`**:
   - Tracks completed and in-progress specific learning topics, masteries, scores, and completion timestamps.

4. **`user_game_history`**:
   - Records every session of the 8 interactive mini-games and the Recursion Beast Boss Battle (score, accuracy, XP awarded, coins awarded, timestamp).

5. **`user_achievements`**:
   - Stores all unlocked badges and milestone achievements per user.

---

## 🛡️ REST API Endpoints (`http://localhost:5000/api`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Diagnostic status, SQLite connection, and total registered users | No |
| `POST` | `/api/auth/register` | Register new user account, hash password, save chosen topics, return JWT | No |
| `POST` | `/api/auth/login` | Authenticate user credentials against SQLite database, return JWT | No |
| `GET` | `/api/auth/me` | Fetch active session & chosen topics from Bearer token | Yes |
| `POST` | `/api/auth/logout` | Terminate session | No |
| `GET` | `/api/user/profile` | Retrieve learner profile and chosen topics list | Yes |
| `PUT` | `/api/user/profile` | Update profile details and synchronize chosen topics in database | Yes |
| `POST` | `/api/user/xp` | Award XP, calculate dynamic level-ups, and persist | Yes |
| `GET` | `/api/user/topics` | Get chosen and completed topic history | Yes |
| `POST` | `/api/user/topics` | Save topic progress or completion score | Yes |
| `GET` | `/api/user/games` | Retrieve gameplay history for mini-games and boss battles | Yes |
| `POST` | `/api/user/games` | Record mini-game run and award XP/coins in SQLite | Yes |
| `GET` | `/api/leaderboard` | Live leaderboard generated from registered database users | No |
| `GET` | `/api/analytics/summary` | Live platform analytics with database metrics | No |

---

## 🚀 Getting Started & Running Locally

### 1. Start the Backend API Server
```bash
npm run server
```
*Server starts at `http://localhost:5000` and initializes `server/data/gamelearn.db`.*

### 2. Start the Frontend Development Server
```bash
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

### 3. Pre-Seeded Demo Account
For instant evaluation and testing:
- **Email**: `alex@example.com`
- **Password**: `password123`
- *(You can also click the **"Instant Demo Login"** button on the `/login` page or create a completely new account on `/register`)*

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, Framer Motion, Recharts, Lucide React
- **Backend**: Node.js 24 (ESM), Express 5, CORS
- **Database**: SQLite 3.53 via built-in `node:sqlite`
- **Authentication**: Native `node:crypto` (`scryptSync` salted hashing + HMAC-SHA256 signed bearer tokens)
