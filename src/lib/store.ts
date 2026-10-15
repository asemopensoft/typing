// ==========================================
// TypeMaster — localStorage Store
// Persists results, settings, and stats
// ==========================================

import { TestResult } from "./typingEngine";

const STORAGE_KEYS = {
  RESULTS: "tm_results",
  SETTINGS: "tm_settings",
  DAILY_STATS: "tm_daily_stats",
  ACHIEVEMENTS: "tm_achievements",
};

export interface UserSettings {
  language: "en" | "ar";
  theme: "dark";
  duration: 15 | 30 | 60 | 120;
  mode: "common" | "medium" | "code" | "quotes";
  showLiveWPM: boolean;
  showKeyboard: boolean;
  soundEnabled: boolean;
  fontSize: "sm" | "md" | "lg";
  caretStyle: "line" | "block" | "underline";
}

export const DEFAULT_SETTINGS: UserSettings = {
  language: "en",
  theme: "dark",
  duration: 30,
  mode: "common",
  showLiveWPM: true,
  showKeyboard: true,
  soundEnabled: false,
  fontSize: "md",
  caretStyle: "line",
};

export interface DailyStats {
  date: string;
  testsCompleted: number;
  avgWPM: number;
  avgAccuracy: number;
  bestWPM: number;
  totalTime: number; // seconds
}

export interface Achievement {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  unlockedAt: string | null;
}

const ACHIEVEMENTS_DEF: Achievement[] = [
  {
    id: "first_test",
    name: "First Steps",
    nameAr: "الخطوة الأولى",
    description: "Complete your first test",
    descriptionAr: "أكمل اختبارك الأول",
    icon: "fa-solid fa-bullseye",
    unlockedAt: null,
  },
  {
    id: "wpm_50",
    name: "Speed Demon",
    nameAr: "السرعة الخارقة",
    description: "Reach 50 WPM",
    descriptionAr: "حقق 50 كلمة في الدقيقة",
    icon: "fa-solid fa-bolt",
    unlockedAt: null,
  },
  {
    id: "wpm_80",
    name: "Velocity",
    nameAr: "السرعة الفائقة",
    description: "Reach 80 WPM",
    descriptionAr: "حقق 80 كلمة في الدقيقة",
    icon: "fa-solid fa-rocket",
    unlockedAt: null,
  },
  {
    id: "wpm_100",
    name: "Century",
    nameAr: "الرقم القياسي",
    description: "Reach 100 WPM",
    descriptionAr: "حقق 100 كلمة في الدقيقة",
    icon: "fa-solid fa-crown",
    unlockedAt: null,
  },
  {
    id: "accuracy_100",
    name: "Perfectionist",
    nameAr: "الكمال",
    description: "100% accuracy in a test",
    descriptionAr: "دقة 100% في اختبار",
    icon: "fa-solid fa-star",
    unlockedAt: null,
  },
  {
    id: "streak_7",
    name: "Consistent",
    nameAr: "المثابرة",
    description: "7-day practice streak",
    descriptionAr: "7 أيام متتالية من التدريب",
    icon: "fa-solid fa-fire",
    unlockedAt: null,
  },
  {
    id: "tests_50",
    name: "Dedicated",
    nameAr: "المثابر",
    description: "Complete 50 tests",
    descriptionAr: "أكمل 50 اختباراً",
    icon: "fa-solid fa-trophy",
    unlockedAt: null,
  },
  {
    id: "arabic_master",
    name: "Arabic Master",
    nameAr: "أستاذ العربية",
    description: "Complete 10 Arabic tests",
    descriptionAr: "أكمل 10 اختبارات بالعربية",
    icon: "fa-solid fa-moon",
    unlockedAt: null,
  },
];

function isBrowser() {
  return typeof window !== "undefined";
}

// ---- Settings ----
export function loadSettings(): UserSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ---- Results ----
export function loadResults(): TestResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((r: TestResult) => ({
      ...r,
      timestamp: new Date(r.timestamp),
    }));
  } catch {
    return [];
  }
}

export function saveResult(result: TestResult) {
  if (!isBrowser()) return;
  const results = loadResults();
  results.unshift(result);
  // Keep last 200 results
  const trimmed = results.slice(0, 200);
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(trimmed));
  updateDailyStats(result);
  checkAchievements(trimmed);
}

// ---- Daily Stats ----
export function loadDailyStats(): DailyStats[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function updateDailyStats(result: TestResult) {
  const stats = loadDailyStats();
  const today = new Date().toISOString().split("T")[0];
  const idx = stats.findIndex((s) => s.date === today);
  if (idx >= 0) {
    const s = stats[idx];
    const newCount = s.testsCompleted + 1;
    stats[idx] = {
      ...s,
      testsCompleted: newCount,
      avgWPM: Math.round((s.avgWPM * s.testsCompleted + result.wpm) / newCount),
      avgAccuracy: Math.round(
        (s.avgAccuracy * s.testsCompleted + result.accuracy) / newCount
      ),
      bestWPM: Math.max(s.bestWPM, result.wpm),
      totalTime: s.totalTime + result.duration,
    };
  } else {
    stats.unshift({
      date: today,
      testsCompleted: 1,
      avgWPM: result.wpm,
      avgAccuracy: result.accuracy,
      bestWPM: result.wpm,
      totalTime: result.duration,
    });
  }
  localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats.slice(0, 90)));
}

// ---- Achievements ----
export function loadAchievements(): Achievement[] {
  if (!isBrowser()) return ACHIEVEMENTS_DEF;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!raw) return ACHIEVEMENTS_DEF;
    const saved: { id: string; unlockedAt: string | null }[] = JSON.parse(raw);
    return ACHIEVEMENTS_DEF.map((def) => {
      const found = saved.find((s) => s.id === def.id);
      return found ? { ...def, unlockedAt: found.unlockedAt } : def;
    });
  } catch {
    return ACHIEVEMENTS_DEF;
  }
}

export function checkAchievements(results: TestResult[]): string[] {
  const achievements = loadAchievements();
  const now = new Date().toISOString();
  const newlyUnlocked: string[] = [];

  const bestWPM = Math.max(...results.map((r) => r.wpm));
  const arTests = results.filter((r) => r.language === "ar").length;
  const totalTests = results.length;
  const hasPerfectAccuracy = results.some((r) => r.accuracy === 100);

  const checks: { id: string; condition: boolean }[] = [
    { id: "first_test", condition: totalTests >= 1 },
    { id: "wpm_50", condition: bestWPM >= 50 },
    { id: "wpm_80", condition: bestWPM >= 80 },
    { id: "wpm_100", condition: bestWPM >= 100 },
    { id: "accuracy_100", condition: hasPerfectAccuracy },
    { id: "tests_50", condition: totalTests >= 50 },
    { id: "arabic_master", condition: arTests >= 10 },
  ];

  const updated = achievements.map((ach) => {
    const check = checks.find((c) => c.id === ach.id);
    if (check && check.condition && !ach.unlockedAt) {
      newlyUnlocked.push(ach.id);
      return { ...ach, unlockedAt: now };
    }
    return ach;
  });

  localStorage.setItem(
    STORAGE_KEYS.ACHIEVEMENTS,
    JSON.stringify(updated.map((a) => ({ id: a.id, unlockedAt: a.unlockedAt })))
  );

  return newlyUnlocked;
}

// ---- Aggregate Stats ----
export function getOverallStats(results: TestResult[]) {
  if (results.length === 0) {
    return {
      bestWPM: 0,
      avgWPM: 0,
      avgAccuracy: 0,
      totalTests: 0,
      totalTime: 0,
      globalErrorMap: {} as Record<string, number>,
    };
  }
  const bestWPM = Math.max(...results.map((r) => r.wpm));
  const avgWPM = Math.round(results.reduce((s, r) => s + r.wpm, 0) / results.length);
  const avgAccuracy = Math.round(
    results.reduce((s, r) => s + r.accuracy, 0) / results.length
  );
  const totalTime = results.reduce((s, r) => s + r.duration, 0);

  const globalErrorMap: Record<string, number> = {};
  for (const r of results) {
    for (const [ch, cnt] of Object.entries(r.errorMap)) {
      globalErrorMap[ch] = (globalErrorMap[ch] ?? 0) + cnt;
    }
  }

  return { bestWPM, avgWPM, avgAccuracy, totalTests: results.length, totalTime, globalErrorMap };
}
