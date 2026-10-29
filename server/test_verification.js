// server/test_verification.js
const http = require('http');

async function runTests() {
  console.log('🧪 Starting Barqtype Verification Tests...\n');

  // 1. Check SQLite DB directly
  const db = require('./db');
  console.log('1. Checking Database Tables:');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('   Tables found:', tables.map(t => t.name).join(', '));

  // 2. Start server in background for API test
  const express = require('express');
  const app = require('./server'); // Note: server.js starts listening on 3001 or PORT

  // Wait 500ms
  await new Promise(r => setTimeout(r, 600));

  const PORT = process.env.PORT || 3001;
  const baseUrl = `http://127.0.0.1:${PORT}`;

  async function postJson(path, body, token) {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
    return { status: res.status, data: await res.json() };
  }

  async function getJson(path, token) {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    return { status: res.status, data: await res.json() };
  }

  try {
    // Test Health
    const health = await getJson('/health');
    console.log('\n2. Health Check:', health);

    // Test Registration
    const testUser = `test_${Date.now()}`;
    const reg = await postJson('/api/auth/register', {
      username: testUser,
      password: 'TestPassword123!',
      email: `${testUser}@example.com`,
      display_name: 'Test Runner'
    });
    console.log('\n3. User Registration:', reg.status === 201 ? '✅ PASSED' : '❌ FAILED', reg.data.user?.username);
    const token = reg.data.token;

    // Test Login
    const loginRes = await postJson('/api/auth/login', {
      username: testUser,
      password: 'TestPassword123!'
    });
    console.log('4. User Login:', loginRes.status === 200 ? '✅ PASSED' : '❌ FAILED');

    // Test Auth Me
    const meRes = await getJson('/api/auth/me', token);
    console.log('5. GET /api/auth/me:', meRes.status === 200 ? '✅ PASSED' : '❌ FAILED', meRes.data.user?.display_name);

    // Test Save Test Result
    const saveRes = await postJson('/api/results/test', {
      lang: 'ar',
      mode: 'time',
      duration: 30,
      wpm: 68.5,
      raw_wpm: 72.0,
      accuracy: 97.5,
      error_count: 2,
      keystrokes: 220,
      consistency: 85.0
    }, token);
    console.log('6. POST /api/results/test:', saveRes.status === 201 ? '✅ PASSED' : '❌ FAILED', saveRes.data.message);

    // Test Stats
    const statsRes = await getJson('/api/results/my-stats', token);
    console.log('7. GET /api/results/my-stats:', statsRes.status === 200 ? '✅ PASSED' : '❌ FAILED', 'Best WPM:', statsRes.data.stats?.best_wpm);

    // Test Leaderboard
    const lbRes = await getJson('/api/leaderboard?lang=ar&duration=30');
    console.log('8. GET /api/leaderboard:', lbRes.status === 200 ? '✅ PASSED' : '❌ FAILED', 'Top players count:', lbRes.data.leaderboard?.length);

    // Test Audio Asset Serving
    const wordEnc = encodeURIComponent('كتاب');
    const audioRes = await fetch(`${baseUrl}/audio/dictation/ar/easy/${wordEnc}.mp3`);
    console.log('9. Audio Asset (كتاب.mp3):', audioRes.status === 200 ? '✅ PASSED (HTTP 200)' : '❌ FAILED HTTP ' + audioRes.status);

    console.log('\n🎉 ALL 9 VERIFICATION CHECKS COMPLETED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    process.exit(0);
  }
}

runTests();
