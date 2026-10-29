// server/db.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'barqtype.db');
const db = new Database(dbPath);

// تفعيل وضع WAL لسرعة فائقة ودعم قراءة وكتابة متزامنة
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDatabase() {
  db.exec(`
    -- 1. جدول المستخدمين
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL COLLATE NOCASE,
      email TEXT UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. جدول نتائج التدريب الفردي
    CREATE TABLE IF NOT EXISTS test_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lang TEXT NOT NULL,
      mode TEXT NOT NULL,
      duration INTEGER NOT NULL,
      wpm REAL NOT NULL,
      raw_wpm REAL NOT NULL,
      accuracy REAL NOT NULL,
      error_count INTEGER NOT NULL,
      keystrokes INTEGER NOT NULL,
      consistency REAL,
      error_map TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. جدول نتائج السباقات المباشرة
    CREATE TABLE IF NOT EXISTS race_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_code TEXT NOT NULL,
      player1_id INTEGER,
      player2_id INTEGER,
      winner_id INTEGER,
      p1_wpm REAL,
      p2_wpm REAL,
      lang TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 4. جدول تقدم مسار التعلم
    CREATE TABLE IF NOT EXISTS learn_progress (
      user_id INTEGER NOT NULL,
      lang TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      best_wpm REAL DEFAULT 0,
      best_acc REAL DEFAULT 0,
      stars INTEGER DEFAULT 1,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, lang, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 5. جدول نتائج الإملاء الصوتي
    CREATE TABLE IF NOT EXISTS dictation_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lang TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      score INTEGER NOT NULL,
      accuracy REAL NOT NULL,
      wrong_words TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- إنشاء الفهارس لتحسين سرعة الاستعلامات ولوحة الصدارة
    CREATE INDEX IF NOT EXISTS idx_test_user ON test_results(user_id);
    CREATE INDEX IF NOT EXISTS idx_test_leaderboard ON test_results(lang, duration, wpm DESC);
    CREATE INDEX IF NOT EXISTS idx_race_users ON race_results(player1_id, player2_id);
    CREATE INDEX IF NOT EXISTS idx_dict_user ON dictation_results(user_id);
  `);
  console.log('✅ SQLite Database & Tables Initialized Successfully.');
}

initDatabase();

module.exports = db;
