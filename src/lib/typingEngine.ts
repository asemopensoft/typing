// ==========================================
// TypeMaster — Typing Engine Core
// Handles all WPM, accuracy, error tracking
// ==========================================

export interface KeystrokeData {
  char: string;
  expected: string;
  correct: boolean;
  timestamp: number; // performance.now()
  duration: number;  // ms since last keystroke
}

export interface CharState {
  char: string;
  state: "untyped" | "correct" | "error" | "current";
}

export interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  errorChars: number;
  totalChars: number;
  duration: number; // seconds
  keystrokes: KeystrokeData[];
  errorMap: Record<string, number>;   // char -> error count
  charTiming: Record<string, number[]>; // char -> list of ms to type
  timestamp: Date;
  language: "en" | "ar";
}

export interface TestConfig {
  duration: 15 | 30 | 60 | 120;
  language: "en" | "ar";
  mode: "time" | "words";
  wordCount?: number;
}

// Standard WPM: (correct chars / 5) / minutes
export function calculateWPM(correctChars: number, durationMs: number): number {
  if (durationMs <= 0) return 0;
  const minutes = durationMs / 60000;
  return Math.round(correctChars / 5 / minutes);
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export function buildErrorMap(keystrokes: KeystrokeData[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const k of keystrokes) {
    if (!k.correct) {
      map[k.expected] = (map[k.expected] ?? 0) + 1;
    }
  }
  return map;
}

export function buildCharTiming(keystrokes: KeystrokeData[]): Record<string, number[]> {
  const map: Record<string, number[]> = {};
  for (const k of keystrokes) {
    if (k.correct && k.duration > 0 && k.duration < 2000) {
      if (!map[k.char]) map[k.char] = [];
      map[k.char].push(k.duration);
    }
  }
  return map;
}

export function avgCharTiming(timings: Record<string, number[]>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [char, times] of Object.entries(timings)) {
    if (times.length > 0) {
      result[char] = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    }
  }
  return result;
}

// Get the weakest characters for adaptive training
export function getWeakChars(
  errorMap: Record<string, number>,
  timingMap: Record<string, number[]>,
  topN = 5
): string[] {
  const scored: Array<{ char: string; score: number }> = [];

  const allChars = new Set([...Object.keys(errorMap), ...Object.keys(timingMap)]);
  for (const char of allChars) {
    const errors = errorMap[char] ?? 0;
    const timings = timingMap[char] ?? [];
    const avgMs = timings.length > 0 ? timings.reduce((a, b) => a + b, 0) / timings.length : 0;
    // Score: errors weighted heavily + slow timing
    const score = errors * 10 + (avgMs > 300 ? (avgMs - 300) / 50 : 0);
    scored.push({ char, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((s) => s.char);
}

// Mastery level for a character 0-100
export function charMastery(
  errors: number,
  timings: number[],
  totalAttempts: number
): number {
  if (totalAttempts === 0) return 50; // unknown
  const errorRate = errors / (totalAttempts + errors);
  const avgMs = timings.length > 0 ? timings.reduce((a, b) => a + b, 0) / timings.length : 500;
  const speedScore = Math.max(0, Math.min(100, 100 - (avgMs - 100) / 4));
  const accuracyScore = (1 - errorRate) * 100;
  return Math.round(speedScore * 0.4 + accuracyScore * 0.6);
}
