// TypeMaster Race Server - Socket.io Online Multiplayer
// ======================================================
// Deploy to: Render.com | Railway.app | Fly.io
// ======================================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// ─── CORS: allow any origin (your deployed HTML can connect) ───
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// ─── Endpoints ────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    name: 'TypeMaster Race Server',
    version: '1.0.0',
    rooms: rooms.size,
    connections: io.engine.clientsCount,
    uptime: Math.floor(process.uptime()) + 's'
  });
});

app.get('/', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    status: 'ok',
    name: 'TypeMaster Race Server',
    version: '1.0.0',
    rooms: rooms.size,
    connections: io.engine.clientsCount,
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// ─── Room Store ───────────────────────────────────────────────
// rooms: Map<roomCode, RoomObject>
const rooms = new Map();

// RoomObject schema:
// {
//   code: string,          // e.g. "A7X3"
//   host: socketId,        // creator
//   players: {             // max 2
//     [socketId]: { id, name, progress, wpm, acc, finished, finTime }
//   },
//   state: 'waiting' | 'countdown' | 'racing' | 'finished',
//   text: string,          // shared typing text
//   lang: 'en' | 'ar',
//   startTime: number,
//   createdAt: number
// }

// ─── Utility: Generate unique 4-char room code ────────────────
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I confusion
  let code;
  let attempts = 0;
  do {
    code = Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    attempts++;
    if (attempts > 1000) break; // safety valve
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

// ─── Utility: Broadcast room state to both players ───────────
function broadcastRoom(code) {
  const room = rooms.get(code);
  if (!room) return;
  io.to(code).emit('room_state', {
    code: room.code,
    state: room.state,
    lang: room.lang,
    players: Object.values(room.players),
    hostId: room.host
  });
}

// ─── Arabic sample texts (Long rich passages) ─────────────────
const TEXTS_AR = [
  'المعرفة نور يضيء درب الإنسان في رحلته عبر الحياة فاطلب العلم ولو كان بعيداً فإن طلب العلم فريضة على كل مسلم والعمل به شرف لا يضاهيه شرف فكن دائماً حريصاً على تطوير مهاراتك وتوسيع مداركك لتكون عنصراً فاعلاً في مجتمعك وتسهم في بناء مستقبل مشرق لأمتك وأجيالك القادمة فالحياة لا تعطي ثمارها إلا للمجتهدين الذين لا يعرفون المستحيل',
  'الصبر مفتاح الفرج وكل أمر يبدأ صعباً ثم يلين مع الوقت والمثابرة فلا تيأس من رحمة الله واعلم أن النجاح رحلة طويلة تحتاج إلى العزيمة والإصرار وتجاوز العقبات بكل ثقة وتفاؤل فالأحلام العظيمة لا تتحقق إلا بالعمل الجاد والتوكل على الله في كل خطوة تخطوها في مسيرتك نحو القمة والتميز',
  'القراءة غذاء العقل والكتاب خير جليس في الزمان فاحرص على القراءة يومياً لتنمية مداركك وتوسيع آفاقك الفكرية والثقافية فالإنسان القارئ يعيش آلاف السنين بتجارب الآخرين ويتعلم من حكمة السابقين ويبني لنفسه عالماً غنياً بالمعرفة والقيم الإنسانية الرفيعة التي تجعله قادراً على مواجهة تحديات العصر',
  'الوقت كالسيف إن لم تقطعه قطعك فاستثمر كل لحظة فيما ينفعك ولا تضيع ساعات عمرك في ما لا يفيد فالناجحون هم من يعرفون قيمة الدقائق والثواني ويوجهون طاقتهم نحو تحقيق أهدافهم النبيلة وصناعة أثر طيب يبقى شاهداً على إنجازاتهم طوال الدهر فكل ثانية تمضي لا تعود أبداً فاجعل يومك أفضل من أمسك',
  'التعاون بين الناس أساس بناء المجتمعات القوية فالفرد لا يستطيع أن يكون جزيرة معزولة بل هو جزء من كل متكامل يتأثر به ويؤثر فيه وعندما تتضافر الجهود وتتكامل الطاقات تتحقق المعجزات وتنهض الأمم إلى أعلى مراتب المجد والازدهار فكن عوناً لأخيك وشارك في صنع الخير أينما كنت'
];

// ─── English sample texts (Long rich passages) ────────────────
const TEXTS_EN = [
  'The quick brown fox jumps over the lazy dog while the golden sun sets behind the distant misty mountains casting long warm shadows across the peaceful valley below and songbirds return to their high nests singing sweet evening melodies as cool darkness gently embraces the quiet landscape all around us',
  'Practice makes perfect and the more consistently you type the faster and more accurate you will become so keep your fingers resting lightly on the home row keys and let your thoughts flow effortlessly through your fingertips into beautiful words on the glowing screen without ever needing to look down at the mechanical keyboard',
  'Technology has completely transformed the modern world allowing ambitious people from distant continents to connect instantly and collaborate on groundbreaking scientific projects that shape the promising future of humanity with endless curiosity and relentless innovation driving us toward remarkable new digital horizons',
  'Discipline is the indispensable bridge between ambitious dreams and extraordinary accomplishments so establish clear meaningful objectives every single morning and commit yourself wholeheartedly to mastering your craft with unwavering passion focus and determination to achieve true excellence in everything you do',
  'Reading expansive literature broadens your intellectual horizons and awakens boundless creativity enabling you to explore diverse perspectives and understand the rich human experience with profound empathy and timeless wisdom that enriches your daily journey and guides your decision making through every challenge'
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

  // ── CREATE ROOM ──────────────────────────────────────────────
  // Helper to end a race and broadcast results immediately
  function endRoomRace(code) {
    const room = rooms.get(code);
    if (!room || room.state === 'finished') return;
    room.state = 'finished';
    if (room.timer) { clearTimeout(room.timer); room.timer = null; }
    if (room.graceTimer) { clearTimeout(room.graceTimer); room.graceTimer = null; }

    const ps = Object.values(room.players);
    // Fair & rock-solid podium sorting:
    // 1. If both finished 100%: fastest finTime wins, then highest WPM
    // 2. If one finished 100% and other didn't: finisher is #1
    // 3. If neither finished 100% (time up): highest progress %, then WPM, then accuracy
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
  }

  // ── CREATE ROOM ──────────────────────────────────────────────
  socket.on('create_room', ({ name, lang, duration }) => {
    // Leave any existing room first
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
  socket.on('join_room', ({ code, name }) => {
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

    // Leave any existing room
    const existing = getRoomOfSocket(socket.id);
    if (existing) {
      leaveRoom(socket, existing.code, existing.room);
    }

    room.players[socket.id] = {
      id: socket.id,
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
      socket.emit('error_msg', { message: 'need_two_players' });
      return;
    }
    if (room.state !== 'waiting') return;

    // Pick random text
    const texts = room.lang === 'ar' ? TEXTS_AR : TEXTS_EN;
    room.text = texts[Math.floor(Math.random() * texts.length)];
    room.state = 'countdown';

    // Send countdown to both
    io.to(code).emit('countdown_start', { text: room.text, duration: room.duration });

    let count = 3;
    const cdInterval = setInterval(() => {
      io.to(code).emit('countdown_tick', { count });
      count--;
      if (count < 0) {
        clearInterval(cdInterval);
        room.state = 'racing';
        room.startTime = Date.now();
        // Reset all progress
        for (const pid in room.players) {
          room.players[pid].progress = 0;
          room.players[pid].wpm = 0;
          room.players[pid].finished = false;
          room.players[pid].finTime = null;
        }
        io.to(code).emit('race_go', { startTime: room.startTime, duration: room.duration });
        console.log(`[RACE] Room ${code} started with duration: ${room.duration}s`);

        // If timed mode (> 0 seconds), set server-side hard timeout
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

    // Broadcast opponent's progress to the other player
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

    // Check if all players finished
    const allPlayers = Object.values(room.players);
    const allFinished = allPlayers.every(p => p.finished);

    if (allFinished) {
      endRoomRace(code);
    } else {
      // Notify the other player that this player reached 100%
      socket.to(code).emit('opponent_finished', {
        id: socket.id,
        name: finisherName,
        wpm,
        acc,
        finTime
      });

      // Start 5-second final countdown grace period for the other player to wrap up
      if (!room.graceTimer) {
        console.log(`[GRACE] 5s countdown started in room ${code} after ${finisherName} finished`);
        io.to(code).emit('race_grace_period', { seconds: 5, finisher: finisherName });
        room.graceTimer = setTimeout(() => {
          endRoomRace(code);
        }, 5000);
      }
    }
  });

  // ── TIME UP (from client when countdown reaches 0) ───────────
  socket.on('time_up', ({ code, wpm, acc, progress }) => {
    const room = rooms.get(code);
    if (!room || room.state !== 'racing') return;
    if (room.players[socket.id]) {
      room.players[socket.id].wpm = wpm;
      room.players[socket.id].acc = acc;
      room.players[socket.id].progress = progress;
      room.players[socket.id].finished = true;
    }
    // Give a short 400ms buffer for any in-flight packets, then conclude
    if (!room.graceTimer) {
      room.graceTimer = setTimeout(() => {
        endRoomRace(code);
      }, 400);
    }
  });

  // ── PLAY AGAIN (resets room & syncs both players to lobby) ───
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
    // Transfer host if needed
    if (room.host === socket.id) {
      room.host = Object.keys(room.players)[0];
      room.players[room.host].isHost = true;
    }
    // If race was ongoing, notify opponent
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
║     TypeMaster Race Server v1.0.0         ║
║     Listening on port ${PORT}               ║
║     Ready for connections!                ║
╚═══════════════════════════════════════════╝
  `);
});
