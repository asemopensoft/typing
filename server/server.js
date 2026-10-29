// Barqtype Server - Socket.io Online Multiplayer & SQLite Backend API
// ======================================================================
// Deploy to: Render.com | Railway.app | Fly.io | Localhost
// ======================================================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'barqtype-ultra-secret-key-2026';

const app = express();
const server = http.createServer(app);

// ─── CORS & Middlewares ──────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

app.use(cors());
app.use(express.json());

// ─── Static Files & Assets ────────────────────────────────────
const publicDir = path.join(__dirname, 'public');
const rootDir = path.join(__dirname, '..');

// Serve audio assets generated from edge-tts
app.use('/audio', express.static(path.join(publicDir, 'audio')));

// Serve root project assets for full standalone operation
app.use('/css', express.static(path.join(rootDir, 'css')));
app.use('/js', express.static(path.join(rootDir, 'js')));
app.use('/logo', express.static(path.join(rootDir, 'logo')));
app.use(express.static(rootDir, { index: false }));

// ─── Auth Middleware ──────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

// ─── Health & Status Endpoints ────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Barqtype Multiplayer & API Server',
    version: '2.0.0',
    rooms: rooms.size,
    connections: io.engine.clientsCount,
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// ─── HTML Page Routes ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/dictation', (req, res) => {
  res.sendFile(path.join(rootDir, 'dictation.html'));
});

app.get('/dictation.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'dictation.html'));
});

app.get('/learn', (req, res) => {
  res.sendFile(path.join(rootDir, 'learn.html'));
});

app.get('/learn.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'learn.html'));
});

// ─── Auth REST Endpoints ──────────────────────────────────────

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, password, email, display_name } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
    }

    const cleanUsername = String(username).trim();
    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    const cleanEmail = email && String(email).trim() ? String(email).trim().toLowerCase() : null;
    const cleanDisplayName = display_name && String(display_name).trim() ? String(display_name).trim() : cleanUsername;

    // Check existing
    const existing = db.prepare(`
      SELECT id, username, email FROM users
      WHERE username = ? OR (email IS NOT NULL AND email = ?)
    `).get(cleanUsername, cleanEmail);

    if (existing) {
      if (existing.username.toLowerCase() === cleanUsername.toLowerCase()) {
        return res.status(409).json({ error: 'اسم المستخدم مسجل مسبقاً' });
      }
      return res.status(409).json({ error: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(String(password), salt);

    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, display_name)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(cleanUsername, cleanEmail, password_hash, cleanDisplayName);
    const userId = Number(info.lastInsertRowid);

    const token = jwt.sign({ id: userId, username: cleanUsername }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        username: cleanUsername,
        email: cleanEmail,
        display_name: cleanDisplayName
      }
    });
  } catch (err) {
    console.error('[AUTH REGISTER ERROR]', err);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
    }

    const cleanInput = String(username).trim();
    const user = db.prepare(`
      SELECT id, username, email, password_hash, display_name
      FROM users
      WHERE username = ? OR (email IS NOT NULL AND email = ?)
    `).get(cleanInput, cleanInput.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const valid = bcrypt.compareSync(String(password), user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        display_name: user.display_name
      }
    });
  } catch (err) {
    console.error('[AUTH LOGIN ERROR]', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, username, email, display_name, created_at
      FROM users WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'فشل جلب بيانات المستخدم' });
  }
});

// ─── Data Sync & Results Endpoints ───────────────────────────

// POST /api/results/test
app.post('/api/results/test', authMiddleware, (req, res) => {
  try {
    const {
      lang, mode, duration, wpm, raw_wpm, accuracy,
      error_count, keystrokes, consistency, error_map
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO test_results (
        user_id, lang, mode, duration, wpm, raw_wpm,
        accuracy, error_count, keystrokes, consistency, error_map
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id,
      lang || 'en',
      mode || 'common',
      parseInt(duration) || 30,
      parseFloat(wpm) || 0,
      parseFloat(raw_wpm) || 0,
      parseFloat(accuracy) || 0,
      parseInt(error_count) || 0,
      parseInt(keystrokes) || 0,
      consistency !== undefined ? parseFloat(consistency) : null,
      typeof error_map === 'object' ? JSON.stringify(error_map) : (error_map || null)
    );

    res.status(201).json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error('[SAVE TEST RESULT ERROR]', err);
    res.status(500).json({ error: 'فشل حفظ نتيجة الاختبار' });
  }
});

// GET /api/results/my-stats
app.get('/api/results/my-stats', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;

    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_tests,
        ROUND(COALESCE(MAX(wpm), 0), 1) as best_wpm,
        ROUND(COALESCE(AVG(wpm), 0), 1) as avg_wpm,
        ROUND(COALESCE(AVG(accuracy), 0), 1) as avg_accuracy,
        COALESCE(SUM(keystrokes), 0) as total_keystrokes,
        COALESCE(SUM(duration), 0) as total_time_spent
      FROM test_results
      WHERE user_id = ?
    `).get(userId);

    const recentTests = db.prepare(`
      SELECT id, lang, mode, duration, wpm, raw_wpm, accuracy, error_count, keystrokes, consistency, created_at
      FROM test_results
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 20
    `).all(userId);

    const dictationStats = db.prepare(`
      SELECT 
        COUNT(*) as total_dictations,
        COALESCE(SUM(score), 0) as total_score,
        ROUND(COALESCE(AVG(accuracy), 0), 1) as avg_accuracy
      FROM dictation_results
      WHERE user_id = ?
    `).get(userId);

    const raceStats = db.prepare(`
      SELECT 
        COUNT(*) as total_races,
        COALESCE(SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END), 0) as race_wins
      FROM race_results
      WHERE player1_id = ? OR player2_id = ?
    `).get(userId, userId, userId);

    res.json({
      stats,
      recentTests,
      dictationStats,
      raceStats
    });
  } catch (err) {
    console.error('[GET STATS ERROR]', err);
    res.status(500).json({ error: 'فشل جلب إحصائيات المستخدم' });
  }
});

// POST /api/learn/sync
app.post('/api/learn/sync', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    let items = req.body.progress;
    if (!items) {
      if (req.body.lesson_id) items = [req.body];
      else return res.status(400).json({ error: 'لا توجد بيانات تقدم' });
    }
    if (!Array.isArray(items)) items = [items];

    const insertStmt = db.prepare(`
      INSERT INTO learn_progress (user_id, lang, lesson_id, best_wpm, best_acc, stars, completed_at)
      VALUES (@user_id, @lang, @lesson_id, @best_wpm, @best_acc, @stars, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, lang, lesson_id) DO UPDATE SET
        best_wpm = MAX(learn_progress.best_wpm, excluded.best_wpm),
        best_acc = MAX(learn_progress.best_acc, excluded.best_acc),
        stars = MAX(learn_progress.stars, excluded.stars),
        completed_at = CURRENT_TIMESTAMP
    `);

    const syncTransaction = db.transaction((rows) => {
      for (const row of rows) {
        insertStmt.run({
          user_id: userId,
          lang: row.lang || 'ar',
          lesson_id: String(row.lesson_id),
          best_wpm: parseFloat(row.best_wpm) || 0,
          best_acc: parseFloat(row.best_acc) || 0,
          stars: parseInt(row.stars) || 1
        });
      }
    });

    syncTransaction(items);
    res.json({ success: true, count: items.length });
  } catch (err) {
    console.error('[LEARN SYNC ERROR]', err);
    res.status(500).json({ error: 'فشل مزامنة تقدم التعلم' });
  }
});

// GET /api/learn/progress
app.get('/api/learn/progress', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT lang, lesson_id, best_wpm, best_acc, stars, completed_at
      FROM learn_progress
      WHERE user_id = ?
    `).all(req.user.id);

    res.json({ progress: rows });
  } catch (err) {
    console.error('[LEARN GET PROGRESS ERROR]', err);
    res.status(500).json({ error: 'فشل جلب تقدم التعلم' });
  }
});

// POST /api/dictation/save
app.post('/api/dictation/save', authMiddleware, (req, res) => {
  try {
    const { lang, difficulty, score, accuracy, wrong_words } = req.body;
    const stmt = db.prepare(`
      INSERT INTO dictation_results (user_id, lang, difficulty, score, accuracy, wrong_words)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id,
      lang || 'ar',
      difficulty || 'easy',
      parseInt(score) || 0,
      parseFloat(accuracy) || 0,
      typeof wrong_words === 'object' ? JSON.stringify(wrong_words) : (wrong_words || null)
    );

    res.status(201).json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error('[DICTATION SAVE ERROR]', err);
    res.status(500).json({ error: 'فشل حفظ نتيجة الإملاء' });
  }
});

// GET /api/leaderboard
app.get('/api/leaderboard', (req, res) => {
  try {
    const lang = req.query.lang || 'ar';
    const duration = req.query.duration ? parseInt(req.query.duration) : null;

    let query = `
      SELECT 
        u.id as user_id,
        u.username,
        u.display_name,
        ROUND(MAX(t.wpm), 1) as best_wpm,
        ROUND(t.accuracy, 1) as accuracy,
        t.duration,
        t.lang,
        t.created_at
      FROM test_results t
      JOIN users u ON t.user_id = u.id
      WHERE t.lang = ?
    `;
    const params = [lang];

    if (duration && duration > 0) {
      query += ` AND t.duration = ?`;
      params.push(duration);
    }

    query += `
      GROUP BY u.id
      ORDER BY best_wpm DESC
      LIMIT 50
    `;

    const leaderboard = db.prepare(query).all(...params);
    res.json({ leaderboard });
  } catch (err) {
    console.error('[LEADERBOARD ERROR]', err);
    res.status(500).json({ error: 'فشل جلب قائمة المتصدرين' });
  }
});

// ─── Room Store (Socket.io) ───────────────────────────────────
const rooms = new Map();

// ─── Utility: Generate unique 4-char room code ────────────────
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  let attempts = 0;
  do {
    code = Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    attempts++;
    if (attempts > 1000) break;
  } while (rooms.has(code));
  return code;
}

// ─── Utility: Get room of a socket ────────────────────────────
function getRoomOfSocket(socketId) {
  for (const [code, room] of rooms.entries()) {
    if (room.players[socketId]) return { code, room };
  }
  return null;
}

// ─── Sample Race Texts ────────────────────────────────────────
const AR_TEXTS = [
  'السرعة الحقيقية في الكتابة تنبع من التركيز الذهني العميق وتوافق حركة الأصابع بمرونة فائقة مع الذاكرة العضلية فاستمر في التدريب يوميا حتى تبلغ قمة الاحتراف والإتقان في كل حرف تكتبه',
  'العلم في الصغر كالنقش على الحجر ومن يثابر في طلب التميز وتطوير مهاراته التقنية يحصد ثمار جهده إنجازات استثنائية تصنع فارقا حقيقيا في مستقبله المهني والشخصي',
  'البرمجة ليست مجرد كتابة سطور من الأكواد بل هي منهجية دقيقة في التفكير الخوارزمي لتحليل المسائل وتفكيكها إلى عناصر بسيطة يمكن معالجتها بأعلى كفاءة وأقل جهد ممكن',
  'إن مواجهة التحديات بروح إيجابية هي السمة المشتركة بين رواد الفكر والإبداع فالصعاب التي نمر بها تصقل خبراتنا وتبني شخصيتنا القوية القادرة على قيادة المبادرات الكبرى'
];

const EN_TEXTS = [
  'The true art of typing lies in developing steady muscle memory and maintaining effortless focus while your fingers glide smoothly across the mechanical keyboard with rhythm and confidence',
  'Consistent deliberate practice every day will transform your typing speed and accuracy into an effortless skill that empowers you to communicate and code with unprecedented fluency and speed',
  'Discipline is the indispensable bridge between ambitious dreams and extraordinary accomplishments so establish clear meaningful objectives every single morning and commit yourself wholeheartedly',
  'Reading expansive literature broadens your intellectual horizons and awakens boundless creativity enabling you to explore diverse perspectives and understand the rich human experience with wisdom'
];

// ─── Cleanup stale rooms (older than 30 min) ─────────────────
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.createdAt > 30 * 60 * 1000) {
      rooms.delete(code);
      console.log(`[CLEANUP] Removed stale room ${code}`);
    }
  }
}, 5 * 60 * 1000);

// ─── Socket.io Events ─────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[CONNECT] ${socket.id}`);

  // Helper to end a race and broadcast results immediately
  function endRoomRace(code) {
    const room = rooms.get(code);
    if (!room || room.state === 'finished') return;
    room.state = 'finished';
    if (room.timer) { clearTimeout(room.timer); room.timer = null; }
    if (room.graceTimer) { clearTimeout(room.graceTimer); room.graceTimer = null; }

    const ps = Object.values(room.players);
    // Fair & rock-solid podium sorting:
    const sorted = [...ps].sort((a, b) => {
      if (a.finished && b.finished) {
        if (a.finTime && b.finTime && a.finTime !== b.finTime) {
          return a.finTime - b.finTime;
        }
        return (b.wpm || 0) - (a.wpm || 0);
      }
      if (a.finished && !b.finished) return -1;
      if (!a.finished && b.finished) return 1;
      if ((b.progress || 0) !== (a.progress || 0)) {
        return (b.progress || 0) - (a.progress || 0);
      }
      if ((b.wpm || 0) !== (a.wpm || 0)) {
        return (b.wpm || 0) - (a.wpm || 0);
      }
      return (b.acc || 0) - (a.acc || 0);
    });

    const winner = sorted[0] || ps[0];
    const isTie = sorted.length > 1 && sorted[0].wpm === sorted[1].wpm && sorted[0].progress === sorted[1].progress;

    io.to(code).emit('race_results', {
      players: sorted,
      winner: winner,
      isTie: isTie,
      duration: room.duration
    });
    console.log(`[RESULTS] Room ${code} - Winner: ${winner?.name} (${winner?.wpm} WPM, ${winner?.progress}%)`);

    // ── Save race result to database ──
    try {
      const p1 = ps[0];
      const p2 = ps[1];
      const p1Id = (p1 && p1.userId) ? parseInt(p1.userId) : null;
      const p2Id = (p2 && p2.userId) ? parseInt(p2.userId) : null;
      const winnerId = (winner && winner.userId) ? parseInt(winner.userId) : null;

      const raceStmt = db.prepare(`
        INSERT INTO race_results (room_code, player1_id, player2_id, winner_id, p1_wpm, p2_wpm, lang)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      raceStmt.run(
        code,
        p1Id,
        p2Id,
        winnerId,
        p1 ? (p1.wpm || 0) : 0,
        p2 ? (p2.wpm || 0) : 0,
        room.lang || 'en'
      );
      console.log(`[DB] Saved race result for room ${code}`);
    } catch (dbErr) {
      console.error('[DB RACE SAVE ERROR]', dbErr.message);
    }
  }

  // ── CREATE ROOM ──────────────────────────────────────────────
  socket.on('create_room', ({ name, lang, duration, userId }) => {
    const existing = getRoomOfSocket(socket.id);
    if (existing) {
      leaveRoom(socket, existing.code, existing.room);
    }

    const code = generateCode();
    const durVal = typeof duration !== 'undefined' ? parseInt(duration) : 30;
    const room = {
      code,
      host: socket.id,
      players: {
        [socket.id]: {
          id: socket.id,
          userId: userId || null,
          name: name || 'Player 1',
          progress: 0,
          wpm: 0,
          acc: 100,
          finished: false,
          finTime: null,
          isHost: true
        }
      },
      state: 'waiting',
      text: '',
      lang: lang || 'en',
      duration: isNaN(durVal) ? 30 : durVal,
      startTime: null,
      timer: null,
      graceTimer: null,
      createdAt: Date.now()
    };

    rooms.set(code, room);
    socket.join(code);

    socket.emit('room_created', { code, roomState: { ...room, players: Object.values(room.players) } });
    console.log(`[CREATE] Room ${code} by ${name} (${socket.id}) - dur: ${room.duration}s`);
  });

  // ── SET DURATION (host only) ─────────────────────────────────
  socket.on('set_duration', ({ code, duration }) => {
    const room = rooms.get(code);
    if (!room || room.host !== socket.id || room.state !== 'waiting') return;
    room.duration = parseInt(duration);
    if (isNaN(room.duration)) room.duration = 30;
    console.log(`[DURATION] Room ${code} set duration to ${room.duration}s`);
    broadcastRoom(code);
  });

  // ── JOIN ROOM ────────────────────────────────────────────────
  socket.on('join_room', ({ code, name, userId }) => {
    const roomCode = code.toUpperCase().trim();
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit('join_error', { message: 'room_not_found' });
      return;
    }
    if (room.state !== 'waiting') {
      socket.emit('join_error', { message: 'race_already_started' });
      return;
    }
    const playerCount = Object.keys(room.players).length;
    if (playerCount >= 2) {
      socket.emit('join_error', { message: 'room_full' });
      return;
    }
    if (room.players[socket.id]) {
      socket.emit('join_error', { message: 'already_in_room' });
      return;
    }

    const existing = getRoomOfSocket(socket.id);
    if (existing) {
      leaveRoom(socket, existing.code, existing.room);
    }

    room.players[socket.id] = {
      id: socket.id,
      userId: userId || null,
      name: name || 'Player 2',
      progress: 0,
      wpm: 0,
      acc: 100,
      finished: false,
      finTime: null,
      isHost: false
    };

    socket.join(roomCode);
    socket.emit('room_joined', { code: roomCode, lang: room.lang, roomState: { ...room, players: Object.values(room.players) } });
    broadcastRoom(roomCode);

    console.log(`[JOIN] ${name} joined room ${roomCode}`);
  });

  // ── START RACE (host only) ───────────────────────────────────
  socket.on('start_race', ({ code }) => {
    const room = rooms.get(code);
    if (!room) return;
    if (room.host !== socket.id) {
      socket.emit('error_msg', { message: 'only_host_can_start' });
      return;
    }
    if (Object.keys(room.players).length < 2) {
      socket.emit('error_msg', { message: 'need_2_players' });
      return;
    }
    if (room.state !== 'waiting') return;

    const texts = room.lang === 'ar' ? AR_TEXTS : EN_TEXTS;
    room.text = texts[Math.floor(Math.random() * texts.length)];
    room.state = 'countdown';

    io.to(code).emit('race_countdown', { count: 3, text: room.text, duration: room.duration });
    console.log(`[COUNTDOWN] Room ${code} - text selected, 3s countdown`);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        io.to(code).emit('race_countdown', { count, text: room.text, duration: room.duration });
      } else {
        clearInterval(interval);
        room.state = 'racing';
        room.startTime = Date.now();
        io.to(code).emit('race_started', {
          startTime: room.startTime,
          text: room.text,
          duration: room.duration
        });
        console.log(`[RACE] Room ${code} started with duration: ${room.duration}s`);

        if (room.duration > 0) {
          if (room.timer) clearTimeout(room.timer);
          room.timer = setTimeout(() => {
            console.log(`[TIMEOUT] Room ${code} duration ${room.duration}s reached`);
            endRoomRace(code);
          }, room.duration * 1000 + 400);
        }
      }
    }, 1000);
  });

  // ── PROGRESS UPDATE ──────────────────────────────────────────
  socket.on('progress_update', ({ code, progress, wpm, acc }) => {
    const room = rooms.get(code);
    if (!room || room.state !== 'racing') return;
    if (!room.players[socket.id]) return;

    room.players[socket.id].progress = progress;
    room.players[socket.id].wpm = wpm;
    room.players[socket.id].acc = acc;

    socket.to(code).emit('opponent_progress', {
      id: socket.id,
      progress,
      wpm,
      acc
    });
  });

  // ── PLAYER FINISHED ──────────────────────────────────────────
  socket.on('race_finished', ({ code, wpm, acc, finTime }) => {
    const room = rooms.get(code);
    if (!room || room.state !== 'racing') return;
    if (!room.players[socket.id]) return;

    room.players[socket.id].finished = true;
    room.players[socket.id].wpm = wpm;
    room.players[socket.id].acc = acc;
    room.players[socket.id].finTime = finTime;
    room.players[socket.id].progress = 100;

    const finisherName = room.players[socket.id].name;
    console.log(`[FINISH] ${finisherName} finished in room ${code} - ${wpm} WPM in ${finTime}s`);

    const allPlayers = Object.values(room.players);
    const allFinished = allPlayers.every(p => p.finished);

    if (allFinished) {
      endRoomRace(code);
    } else {
      socket.to(code).emit('opponent_finished', {
        id: socket.id,
        name: finisherName,
        wpm,
        acc,
        finTime
      });

      if (!room.graceTimer) {
        console.log(`[GRACE] 5s countdown started in room ${code} after ${finisherName} finished`);
        io.to(code).emit('race_grace_period', { seconds: 5, finisher: finisherName });
        room.graceTimer = setTimeout(() => {
          endRoomRace(code);
        }, 5000);
      }
    }
  });

  // ── TIME UP ──────────────────────────────────────────────────
  socket.on('time_up', ({ code, wpm, acc, progress }) => {
    const room = rooms.get(code);
    if (!room || room.state !== 'racing') return;
    if (room.players[socket.id]) {
      room.players[socket.id].wpm = wpm;
      room.players[socket.id].acc = acc;
      room.players[socket.id].progress = progress;
      room.players[socket.id].finished = true;
    }
    if (!room.graceTimer) {
      room.graceTimer = setTimeout(() => {
        endRoomRace(code);
      }, 400);
    }
  });

  // ── PLAY AGAIN ───────────────────────────────────────────────
  socket.on('play_again', ({ code }) => {
    const room = rooms.get(code);
    if (!room) return;

    if (room.timer) { clearTimeout(room.timer); room.timer = null; }
    if (room.graceTimer) { clearTimeout(room.graceTimer); room.graceTimer = null; }

    room.state = 'waiting';
    room.text = '';
    room.startTime = null;
    for (const pid in room.players) {
      room.players[pid].progress = 0;
      room.players[pid].wpm = 0;
      room.players[pid].acc = 100;
      room.players[pid].finished = false;
      room.players[pid].finTime = null;
    }

    const updatedState = { ...room, players: Object.values(room.players) };
    io.to(code).emit('room_reset_lobby', { roomState: updatedState });
    broadcastRoom(code);
    console.log(`[RESET] Room ${code} reset for rematch by ${socket.id}`);
  });

  // ── LEAVE ROOM ────────────────────────────────────────────────
  socket.on('leave_room', ({ code }) => {
    const room = rooms.get(code);
    if (room) leaveRoom(socket, code, room);
  });

  // ── DISCONNECT ────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[DISCONNECT] ${socket.id}`);
    const found = getRoomOfSocket(socket.id);
    if (found) {
      leaveRoom(socket, found.code, found.room);
    }
  });
});

// ─── Broadcast Room State ─────────────────────────────────────
function broadcastRoom(code) {
  const room = rooms.get(code);
  if (!room) return;
  io.to(code).emit('room_updated', {
    ...room,
    players: Object.values(room.players)
  });
}

// ─── Leave Room Logic ─────────────────────────────────────────
function leaveRoom(socket, code, room) {
  const playerName = room.players[socket.id]?.name || 'Unknown';
  delete room.players[socket.id];
  socket.leave(code);

  const remaining = Object.keys(room.players).length;
  if (remaining === 0) {
    rooms.delete(code);
    console.log(`[DELETE] Room ${code} deleted (empty)`);
  } else {
    if (room.host === socket.id) {
      room.host = Object.keys(room.players)[0];
      room.players[room.host].isHost = true;
    }
    if (room.state === 'racing' || room.state === 'countdown') {
      room.state = 'waiting';
    }
    io.to(code).emit('player_left', {
      id: socket.id,
      name: playerName,
      newHostId: room.host
    });
    broadcastRoom(code);
    console.log(`[LEAVE] ${playerName} left room ${code}`);
  }
}

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║     Barqtype Race & API Server v2.0       ║
║     Listening on port ${PORT}               ║
║     SQLite & JWT Database Connected       ║
║     Ready for connections!                ║
╚═══════════════════════════════════════════╝
  `);
});
