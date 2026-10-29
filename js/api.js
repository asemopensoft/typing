/**
 * Barqtype Unified API & Client Auth Layer (v2.0)
 * Offline-first sync, JWT authentication, and interactive UI modals
 */
(function (window, document) {
  'use strict';

  const TOKEN_KEY = 'barq_token';
  const USER_KEY = 'barq_user';
  const PENDING_TESTS_KEY = 'barq_pending_tests';

  function getServerUrl() {
    if (typeof window !== 'undefined' && window.location) {
      const custom = localStorage.getItem('tm_server_url');
      if (custom && custom.trim()) return custom.trim().replace(/\/$/, '');

      const host = (window.location.hostname || '').toLowerCase();
      const proto = window.location.protocol || '';
      if (proto === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '') {
        return 'http://localhost:3001';
      }
      return window.location.origin;
    }
    return 'http://localhost:3001';
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);

    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);

    notifyAuthChanged(user);
  }

  function getCurrentUser() {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  function isLoggedIn() {
    return !!(getToken() && getCurrentUser());
  }

  const authSubscribers = [];
  function onAuthChange(cb) {
    if (typeof cb === 'function') authSubscribers.push(cb);
  }

  function notifyAuthChanged(user) {
    authSubscribers.forEach(cb => {
      try { cb(user); } catch (e) { console.error(e); }
    });
    updateAuthWidgetUI();
  }

  // ── Network Request Helper ───────────────────────────────────
  async function request(endpoint, options = {}) {
    const url = `${getServerUrl()}${endpoint}`;
    const headers = options.headers || {};
    headers['Content-Type'] = 'application/json';

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `HTTP error ${res.status}`);
      }
      return data;
    } catch (err) {
      throw err;
    }
  }

  // ── Auth APIs ────────────────────────────────────────────────
  async function register(username, password, email, displayName) {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        email,
        display_name: displayName
      })
    });
    setSession(data.token, data.user);
    flushPendingSync();
    return data;
  }

  async function login(username, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setSession(data.token, data.user);
    flushPendingSync();
    return data;
  }

  function logout() {
    setSession(null, null);
    showToast('تم تسجيل الخروج بنجاح');
  }

  async function getMe() {
    if (!getToken()) return null;
    try {
      const data = await request('/api/auth/me');
      if (data && data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      if (err.message && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
        setSession(null, null);
      }
    }
    return getCurrentUser();
  }

  // ── Data APIs ────────────────────────────────────────────────
  async function saveTestResult(resultData) {
    if (!isLoggedIn()) {
      // Offline / guest queue
      try {
        const pending = JSON.parse(localStorage.getItem(PENDING_TESTS_KEY) || '[]');
        pending.push(resultData);
        if (pending.length > 50) pending.shift();
        localStorage.setItem(PENDING_TESTS_KEY, JSON.stringify(pending));
      } catch (e) {}
      return { offline: true };
    }

    try {
      return await request('/api/results/test', {
        method: 'POST',
        body: JSON.stringify(resultData)
      });
    } catch (err) {
      console.warn('Sync failed, queued locally:', err.message);
      return { queued: true };
    }
  }

  async function getMyStats() {
    return await request('/api/results/my-stats');
  }

  async function syncLearnProgress(progressList) {
    if (!isLoggedIn()) return { offline: true };
    try {
      return await request('/api/learn/sync', {
        method: 'POST',
        body: JSON.stringify({ progress: progressList })
      });
    } catch (err) {
      console.warn('Learn progress sync error:', err.message);
      return { error: err.message };
    }
  }

  async function getLearnProgress() {
    if (!isLoggedIn()) return { progress: [] };
    return await request('/api/learn/progress');
  }

  async function saveDictationResult(dictData) {
    if (!isLoggedIn()) return { offline: true };
    try {
      return await request('/api/dictation/save', {
        method: 'POST',
        body: JSON.stringify(dictData)
      });
    } catch (err) {
      console.warn('Dictation save error:', err.message);
      return { error: err.message };
    }
  }

  async function getLeaderboard(lang = 'ar', duration = 30) {
    const durParam = duration ? `&duration=${duration}` : '';
    return await request(`/api/leaderboard?lang=${encodeURIComponent(lang)}${durParam}`);
  }

  async function flushPendingSync() {
    if (!isLoggedIn()) return;
    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_TESTS_KEY) || '[]');
      if (pending.length > 0) {
        for (const test of pending) {
          await request('/api/results/test', {
            method: 'POST',
            body: JSON.stringify(test)
          }).catch(() => {});
        }
        localStorage.removeItem(PENDING_TESTS_KEY);
      }
      // Trigger learn sync if available
      if (window.syncLearnWithCloud) window.syncLearnWithCloud();
    } catch (e) {}
  }

  // ── UI Styles Injection ──────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('barq-auth-styles')) return;
    const style = document.createElement('style');
    style.id = 'barq-auth-styles';
    style.textContent = `
      .barq-auth-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f1f5f9;
        font-family: inherit;
        font-size: 13px;
        font-weight: 600;
        padding: 5px 12px;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      }
      .barq-auth-btn:hover {
        background: rgba(56, 189, 248, 0.15);
        border-color: rgba(56, 189, 248, 0.5);
        color: #38bdf8;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(56, 189, 248, 0.25);
      }
      .barq-user-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(56, 189, 248, 0.15));
        border: 1px solid rgba(245, 158, 11, 0.4);
        color: var(--text, #fef3c7);
        padding: 4px 10px 4px 6px;
        border-radius: 999px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 700;
        transition: all 0.2s ease;
      }
      .barq-user-pill:hover {
        border-color: #f59e0b;
        box-shadow: 0 0 16px rgba(245, 158, 11, 0.35);
        transform: translateY(-1px);
      }
      .barq-user-av {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 800;
      }
      .barq-leader-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: rgba(234, 179, 8, 0.12);
        border: 1px solid rgba(234, 179, 8, 0.35);
        color: var(--accent, #fef08a);
        font-size: 13px;
        font-weight: 600;
        padding: 5px 11px;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .barq-leader-btn:hover {
        background: rgba(234, 179, 8, 0.25);
        border-color: #eab308;
        transform: translateY(-1px);
        box-shadow: 0 0 12px rgba(234, 179, 8, 0.3);
      }

      /* ── MODALS ── */
      .barq-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(10, 15, 29, 0.85);
        backdrop-filter: blur(10px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.25s ease, visibility 0.25s ease;
      }
      .barq-modal-overlay.open {
        opacity: 1;
        visibility: visible;
      }
      .barq-modal-card {
        background: #111827;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        width: 100%;
        max-width: 440px;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.15);
        overflow: hidden;
        transform: translateY(20px) scale(0.97);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        color: #f3f4f6;
        direction: rtl;
        font-family: inherit;
      }
      .barq-modal-overlay.open .barq-modal-card {
        transform: translateY(0) scale(1);
      }
      .barq-modal-card.wide {
        max-width: 650px;
      }
      .barq-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 22px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .barq-modal-title {
        font-size: 17px;
        font-weight: 800;
        color: #f9fafb;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .barq-modal-close {
        background: transparent;
        border: none;
        color: #9ca3af;
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        transition: color 0.15s ease;
      }
      .barq-modal-close:hover {
        color: #f87171;
      }
      .barq-modal-body {
        padding: 22px;
      }
      .barq-tabs {
        display: flex;
        background: rgba(31, 41, 55, 0.8);
        border-radius: 12px;
        padding: 4px;
        margin-bottom: 20px;
        gap: 4px;
      }
      .barq-tab-btn {
        flex: 1;
        background: transparent;
        border: none;
        color: #9ca3af;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        padding: 9px 12px;
        border-radius: 9px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .barq-tab-btn.active {
        background: #3b82f6;
        color: #fff;
        box-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);
      }
      .barq-form-group {
        margin-bottom: 14px;
        text-align: right;
      }
      .barq-form-label {
        display: block;
        font-size: 12px;
        font-weight: 700;
        color: #9ca3af;
        margin-bottom: 6px;
      }
      .barq-form-input {
        width: 100%;
        box-sizing: border-box;
        background: rgba(17, 24, 39, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #fff;
        font-family: inherit;
        font-size: 14px;
        padding: 10px 14px;
        border-radius: 10px;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .barq-form-input:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
      }
      .barq-submit-btn {
        width: 100%;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        border: none;
        color: #fff;
        font-family: inherit;
        font-size: 15px;
        font-weight: 800;
        padding: 12px;
        border-radius: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 10px;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.35);
      }
      .barq-submit-btn:hover {
        background: linear-gradient(135deg, #60a5fa, #3b82f6);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
      }
      .barq-err-msg {
        color: #f87171;
        font-size: 13px;
        margin-top: 10px;
        text-align: center;
        min-height: 18px;
      }

      /* ── Leaderboard Table ── */
      .barq-lb-filters {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        gap: 10px;
        flex-wrap: wrap;
      }
      .barq-lb-table-wrap {
        max-height: 420px;
        overflow-y: auto;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
      }
      .barq-lb-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        text-align: right;
      }
      .barq-lb-table th {
        background: #1f2937;
        color: #9ca3af;
        padding: 10px 14px;
        font-weight: 700;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      .barq-lb-table td {
        padding: 12px 14px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        color: #e5e7eb;
      }
      .barq-lb-table tr:hover {
        background: rgba(56, 189, 248, 0.06);
      }
      .barq-lb-table tr.my-row {
        background: rgba(245, 158, 11, 0.15) !important;
        font-weight: 800;
      }
      .barq-rank-badge {
        display: inline-block;
        width: 26px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        border-radius: 50%;
        font-weight: 800;
        font-size: 12px;
      }
      .barq-rank-1 { background: #eab308; color: #713f12; }
      .barq-rank-2 { background: #94a3b8; color: #1e293b; }
      .barq-rank-3 { background: #b45309; color: #fef3c7; }

      /* ── Profile Modal Classes ── */
      .barq-profile-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--bdr, rgba(255, 255, 255, 0.08));
      }
      .barq-profile-avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f59e0b, #e8af47);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 800;
        color: #17242d;
        box-shadow: 0 4px 14px rgba(232, 175, 71, 0.35);
        flex-shrink: 0;
      }
      .barq-profile-meta {
        text-align: right;
        flex: 1;
        min-width: 0;
      }
      .barq-profile-name {
        font-size: 19px;
        font-weight: 800;
        color: var(--text, #f9fafb);
        line-height: 1.25;
        word-break: break-word;
      }
      .barq-profile-handle {
        font-size: 12px;
        color: var(--sub, #9ca3af);
        margin-top: 3px;
        font-family: inherit;
      }
      .barq-profile-loading {
        text-align: center;
        padding: 20px;
        color: var(--sub, #9ca3af);
      }
      .barq-profile-stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        text-align: center;
      }
      .barq-stat-card {
        background: var(--bg3, rgba(255, 255, 255, 0.04));
        padding: 12px;
        border-radius: 12px;
        border: 1px solid var(--bdr, rgba(255, 255, 255, 0.06));
      }
      .barq-stat-val {
        font-size: 22px;
        font-weight: 900;
        line-height: 1.1;
      }
      .barq-stat-lbl {
        font-size: 11px;
        color: var(--sub, #9ca3af);
        margin-top: 4px;
        font-weight: 700;
      }
      .stat-val-blue { color: #38bdf8; }
      .stat-val-green { color: #4ade80; }
      .stat-val-gold { color: #e8af47; }
      .stat-val-tests { color: var(--text, #f4f3ef); }
      .stat-val-orange { color: #fb923c; }
      .stat-val-purple { color: #c084fc; }
      .barq-profile-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      .barq-profile-btn-lb {
        flex: 1;
        background: var(--bg3, #374151);
        color: var(--text, #f3f4f6);
        border: 1px solid var(--bdr, rgba(255, 255, 255, 0.1));
        border-radius: 10px;
        padding: 11px;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .barq-profile-btn-lb:hover {
        background: var(--bg4, #4b5563);
        transform: translateY(-1px);
      }
      .barq-profile-btn-logout {
        flex: 1;
        background: #dc2626;
        color: #ffffff;
        border: none;
        border-radius: 10px;
        padding: 11px;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }
      .barq-profile-btn-logout:hover {
        background: #b91c1c;
        transform: translateY(-1px);
      }

      /* ── Toast ── */
      .barq-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(50px);
        background: rgba(17, 24, 39, 0.95);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 10px 22px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
        z-index: 100000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        opacity: 0;
        pointer-events: none;
        transition: all 0.25s ease;
      }
      .barq-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function showToast(msg) {
    let t = document.getElementById('barq-toast-el');
    if (!t) {
      t = document.createElement('div');
      t.id = 'barq-toast-el';
      t.className = 'barq-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  // ── Render Header Widget ─────────────────────────────────────
  function updateAuthWidgetUI() {
    const container = document.getElementById('barq-auth-widget');
    if (!container) return;

    const user = getCurrentUser();
    if (user) {
      const initial = (user.display_name || user.username || 'U').charAt(0).toUpperCase();
      container.innerHTML = `
        <button class="barq-leader-btn" onclick="window.BarqAPI.openLeaderboardModal()" title="لوحة المتصدرين">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> <span>المتصدرين</span>
        </button>
        <button class="barq-user-pill" onclick="window.BarqAPI.openProfileModal()" title="الملف الشخصي">
          <span class="barq-user-av">${initial}</span>
          <span>${escapeHtml(user.display_name || user.username)}</span>
        </button>
      `;
    } else {
      container.innerHTML = `
        <button class="barq-leader-btn" onclick="window.BarqAPI.openLeaderboardModal()" title="لوحة المتصدرين">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> <span>المتصدرين</span>
        </button>
        <button class="barq-auth-btn" onclick="window.BarqAPI.openAuthModal('login')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> <span>تسجيل الدخول</span>
        </button>
      `;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function mountAuthWidget() {
    injectStyles();
    let widget = document.getElementById('barq-auth-widget');
    if (!widget) {
      const ctrls = document.querySelector('header .ctrls');
      if (ctrls) {
        widget = document.createElement('div');
        widget.id = 'barq-auth-widget';
        widget.style.display = 'inline-flex';
        widget.style.alignItems = 'center';
        widget.style.gap = '8px';
        widget.style.margin = '0 6px';
        // Insert right at the start or inside ctrls
        ctrls.insertBefore(widget, ctrls.firstChild);
      }
    }
    updateAuthWidgetUI();
  }

  // ── Modal Templates & Handlers ───────────────────────────────
  function ensureModals() {
    if (document.getElementById('barq-auth-modal')) return;

    // 1. Auth Modal
    const authModal = document.createElement('div');
    authModal.id = 'barq-auth-modal';
    authModal.className = 'barq-modal-overlay';
    authModal.innerHTML = `
      <div class="barq-modal-card">
        <div class="barq-modal-header">
          <div class="barq-modal-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> حساب Barqtype</div>
          <button class="barq-modal-close" onclick="window.BarqAPI.closeModals()">&times;</button>
        </div>
        <div class="barq-modal-body">
          <div class="barq-tabs">
            <button class="barq-tab-btn active" id="barq-tab-login" onclick="window.BarqAPI.switchAuthTab('login')">تسجيل الدخول</button>
            <button class="barq-tab-btn" id="barq-tab-register" onclick="window.BarqAPI.switchAuthTab('register')">حساب جديد</button>
          </div>

          <form id="barq-auth-form" onsubmit="window.BarqAPI.handleAuthSubmit(event)">
            <div class="barq-form-group">
              <label class="barq-form-label" id="barq-lbl-user">اسم المستخدم أو البريد</label>
              <input type="text" id="barq-inp-user" class="barq-form-input" required autocomplete="username" placeholder="مثال: typing_master">
            </div>

            <div class="barq-form-group" id="barq-group-name" style="display:none">
              <label class="barq-form-label">الاسم الظاهر (Display Name)</label>
              <input type="text" id="barq-inp-name" class="barq-form-input" placeholder="اسمك الذي يظهر للآخرين">
            </div>

            <div class="barq-form-group" id="barq-group-email" style="display:none">
              <label class="barq-form-label">البريد الإلكتروني (اختياري)</label>
              <input type="email" id="barq-inp-email" class="barq-form-input" placeholder="name@example.com">
            </div>

            <div class="barq-form-group">
              <label class="barq-form-label">كلمة المرور</label>
              <input type="password" id="barq-inp-pass" class="barq-form-input" required autocomplete="current-password" placeholder="••••••••">
            </div>

            <button type="submit" class="barq-submit-btn" id="barq-submit-btn">تسجيل الدخول</button>
            <div class="barq-err-msg" id="barq-auth-err"></div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(authModal);

    // 2. Profile & Stats Modal
    const profileModal = document.createElement('div');
    profileModal.id = 'barq-profile-modal';
    profileModal.className = 'barq-modal-overlay';
    profileModal.innerHTML = `
      <div class="barq-modal-card">
        <div class="barq-modal-header">
          <div class="barq-modal-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> الملف الشخصي والإحصائيات</div>
          <button class="barq-modal-close" onclick="window.BarqAPI.closeModals()">&times;</button>
        </div>
        <div class="barq-modal-body" id="barq-profile-body">
          <div style="text-align:center;padding:20px;color:#9ca3af">جارِ التحميل...</div>
        </div>
      </div>
    `;
    document.body.appendChild(profileModal);

    // 3. Leaderboard Modal
    const lbModal = document.createElement('div');
    lbModal.id = 'barq-lb-modal';
    lbModal.className = 'barq-modal-overlay';
    lbModal.innerHTML = `
      <div class="barq-modal-card wide">
        <div class="barq-modal-header">
          <div class="barq-modal-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> لوحة المتصدرين العامة (Top Racers)</div>
          <button class="barq-modal-close" onclick="window.BarqAPI.closeModals()">&times;</button>
        </div>
        <div class="barq-modal-body">
          <div class="barq-lb-filters">
            <div class="barq-tabs" style="margin:0">
              <button class="barq-tab-btn active" id="barq-lb-lang-ar" onclick="window.BarqAPI.setLeaderboardFilter('ar', null)">عربي</button>
              <button class="barq-tab-btn" id="barq-lb-lang-en" onclick="window.BarqAPI.setLeaderboardFilter('en', null)">English</button>
            </div>
            <div class="barq-tabs" style="margin:0">
              <button class="barq-tab-btn" id="barq-lb-dur-15" onclick="window.BarqAPI.setLeaderboardFilter(null, 15)">15s</button>
              <button class="barq-tab-btn active" id="barq-lb-dur-30" onclick="window.BarqAPI.setLeaderboardFilter(null, 30)">30s</button>
              <button class="barq-tab-btn" id="barq-lb-dur-60" onclick="window.BarqAPI.setLeaderboardFilter(null, 60)">60s</button>
            </div>
          </div>
          <div class="barq-lb-table-wrap" id="barq-lb-content">
            <div style="text-align:center;padding:30px;color:#9ca3af">جارِ جلب المتصدرين...</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(lbModal);

    // Close on overlay click
    [authModal, profileModal, lbModal].forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === this) closeModals();
      });
    });
  }

  let curAuthMode = 'login';
  function switchAuthTab(mode) {
    curAuthMode = mode;
    const isLogin = mode === 'login';
    document.getElementById('barq-tab-login').classList.toggle('active', isLogin);
    document.getElementById('barq-tab-register').classList.toggle('active', !isLogin);
    document.getElementById('barq-group-name').style.display = isLogin ? 'none' : 'block';
    document.getElementById('barq-group-email').style.display = isLogin ? 'none' : 'block';
    document.getElementById('barq-lbl-user').textContent = isLogin ? 'اسم المستخدم أو البريد' : 'اسم المستخدم (User ID)';
    document.getElementById('barq-submit-btn').textContent = isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب ومزامنة النتائج';
    document.getElementById('barq-auth-err').textContent = '';
  }

  function openAuthModal(mode = 'login') {
    ensureModals();
    switchAuthTab(mode);
    document.getElementById('barq-auth-modal').classList.add('open');
    document.getElementById('barq-inp-user').focus();
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    const errEl = document.getElementById('barq-auth-err');
    errEl.textContent = '';

    const user = document.getElementById('barq-inp-user').value.trim();
    const pass = document.getElementById('barq-inp-pass').value;

    try {
      if (curAuthMode === 'login') {
        await login(user, pass);
        showToast('تم تسجيل الدخول بنجاح!');
      } else {
        const email = document.getElementById('barq-inp-email').value.trim();
        const dName = document.getElementById('barq-inp-name').value.trim();
        await register(user, pass, email, dName);
        showToast('تم إنشاء الحساب ومزامنة البيانات!');
      }
      closeModals();
    } catch (err) {
      errEl.textContent = err.message || 'حدث خطأ في الاتصال';
    }
  }

  async function openProfileModal() {
    ensureModals();
    const user = getCurrentUser();
    if (!user) return openAuthModal('login');

    const modal = document.getElementById('barq-profile-modal');
    const body = document.getElementById('barq-profile-body');
    modal.classList.add('open');

    body.innerHTML = `
      <div class="barq-profile-header">
        <div class="barq-profile-avatar">
          ${(user.display_name || user.username).charAt(0).toUpperCase()}
        </div>
        <div class="barq-profile-meta">
          <div class="barq-profile-name">${escapeHtml(user.display_name || user.username)}</div>
          <div class="barq-profile-handle">@${escapeHtml(user.username)} ${user.email ? `&bull; ${escapeHtml(user.email)}` : ''}</div>
        </div>
      </div>
      <div id="barq-stats-grid" class="barq-profile-loading">جارِ جلب الإحصائيات...</div>
      <div class="barq-profile-actions">
        <button class="barq-profile-btn-lb" onclick="window.BarqAPI.openLeaderboardModal()"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> المتصدرين</button>
        <button class="barq-profile-btn-logout" onclick="window.BarqAPI.logout();window.BarqAPI.closeModals()">تسجيل الخروج</button>
      </div>
    `;

    try {
      const data = await getMyStats();
      const s = data.stats || {};
      const r = data.raceStats || {};
      const d = data.dictationStats || {};

      document.getElementById('barq-stats-grid').innerHTML = `
        <div class="barq-profile-stats-grid">
          <div class="barq-stat-card">
            <div class="barq-stat-val stat-val-blue">${s.best_wpm || 0}</div>
            <div class="barq-stat-lbl">أفضل WPM</div>
          </div>
          <div class="barq-stat-card">
            <div class="barq-stat-val stat-val-green">${s.avg_wpm || 0}</div>
            <div class="barq-stat-lbl">متوسط WPM</div>
          </div>
          <div class="barq-stat-card">
            <div class="barq-stat-val stat-val-gold">${s.avg_accuracy || 0}%</div>
            <div class="barq-stat-lbl">متوسط الدقة</div>
          </div>
          <div class="barq-stat-card">
            <div class="barq-stat-val stat-val-tests">${s.total_tests || 0}</div>
            <div class="barq-stat-lbl">اختبارات مكتملة</div>
          </div>
          <div class="barq-stat-card">
            <div class="barq-stat-val stat-val-orange">${r.race_wins || 0}</div>
            <div class="barq-stat-lbl">انتصارات السباق</div>
          </div>
          <div class="barq-stat-card">
            <div class="barq-stat-val stat-val-purple">${d.total_score || 0}</div>
            <div class="barq-stat-lbl">نقاط الإملاء</div>
          </div>
        </div>
      `;
    } catch (e) {
      document.getElementById('barq-stats-grid').innerHTML = '<div class="barq-profile-loading" style="color:#ef4444">تعذر جلب إحصائيات السيرفر</div>';
    }
  }

  let lbLang = 'ar';
  let lbDur = 30;

  function setLeaderboardFilter(lang, dur) {
    if (lang) {
      lbLang = lang;
      document.getElementById('barq-lb-lang-ar').classList.toggle('active', lang === 'ar');
      document.getElementById('barq-lb-lang-en').classList.toggle('active', lang === 'en');
    }
    if (dur !== null && dur !== undefined) {
      lbDur = dur;
      document.getElementById('barq-lb-dur-15').classList.toggle('active', dur === 15);
      document.getElementById('barq-lb-dur-30').classList.toggle('active', dur === 30);
      document.getElementById('barq-lb-dur-60').classList.toggle('active', dur === 60);
    }
    loadLeaderboardData();
  }

  async function loadLeaderboardData() {
    const content = document.getElementById('barq-lb-content');
    content.innerHTML = '<div style="text-align:center;padding:30px;color:#9ca3af">جارِ جلب المتصدرين...</div>';

    try {
      const data = await getLeaderboard(lbLang, lbDur);
      const list = data.leaderboard || [];
      const user = getCurrentUser();

      if (list.length === 0) {
        content.innerHTML = '<div style="text-align:center;padding:40px;color:#9ca3af">لا توجد نتائج مسجلة بعد لهذا الفلتر. كن أول من يتصدر!</div>';
        return;
      }

      let rows = '';
      list.forEach((item, idx) => {
        const rank = idx + 1;
        let rankBadge = `<span class="barq-rank-badge">${rank}</span>`;
        if (rank === 1) rankBadge = `<span class="barq-rank-badge barq-rank-1">1</span>`;
        else if (rank === 2) rankBadge = `<span class="barq-rank-badge barq-rank-2">2</span>`;
        else if (rank === 3) rankBadge = `<span class="barq-rank-badge barq-rank-3">3</span>`;

        const isMe = user && (user.id === item.user_id || user.username === item.username);
        const name = item.display_name || item.username;
        const dateStr = item.created_at ? item.created_at.split(' ')[0] : '';

        rows += `
          <tr class="${isMe ? 'my-row' : ''}">
            <td style="width:50px;text-align:center">${rankBadge}</td>
            <td><strong>${escapeHtml(name)}</strong></td>
            <td style="color:#38bdf8;font-weight:800;font-size:15px">${item.best_wpm} <span style="font-size:11px;color:#9ca3af">WPM</span></td>
            <td>${item.accuracy}%</td>
            <td style="color:#9ca3af;font-size:11px">${dateStr}</td>
          </tr>
        `;
      });

      content.innerHTML = `
        <table class="barq-lb-table">
          <thead>
            <tr>
              <th style="text-align:center">#</th>
              <th>المتسابق</th>
              <th>السرعة</th>
              <th>الدقة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } catch (e) {
      content.innerHTML = `<div style="text-align:center;padding:30px;color:#f87171">تعذر الاتصال بالسيرفر: ${e.message}</div>`;
    }
  }

  function openLeaderboardModal() {
    ensureModals();
    document.getElementById('barq-lb-modal').classList.add('open');
    loadLeaderboardData();
  }

  function closeModals() {
    document.querySelectorAll('.barq-modal-overlay').forEach(m => m.classList.remove('open'));
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModals();
  });

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mountAuthWidget();
      getMe();
    });
  } else {
    mountAuthWidget();
    getMe();
  }

  // ── Public API ───────────────────────────────────────────────
  window.BarqAPI = {
    getServerUrl,
    getToken,
    getCurrentUser,
    isLoggedIn,
    onAuthChange,
    register,
    login,
    logout,
    getMe,
    saveTestResult,
    getMyStats,
    syncLearnProgress,
    getLearnProgress,
    saveDictationResult,
    getLeaderboard,
    openAuthModal,
    openProfileModal,
    openLeaderboardModal,
    switchAuthTab,
    handleAuthSubmit,
    setLeaderboardFilter,
    closeModals,
    showToast
  };

})(window, document);
