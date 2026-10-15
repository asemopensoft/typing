"use client";
import React, { useState } from "react";
import { TestResult, charMastery } from "@/lib/typingEngine";
import { DailyStats, getOverallStats, loadAchievements, Achievement } from "@/lib/store";
import { UserSettings } from "@/lib/store";

interface StatsPageProps {
  results: TestResult[];
  dailyStats: DailyStats[];
  settings: UserSettings;
}

const KEYBOARD_ROWS_EN = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

function KeyHeatmap({ errorMap, timingMap, isAr }: {
  errorMap: Record<string, number>;
  timingMap: Record<string, number[]>;
  isAr: boolean;
}) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const getKeyColor = (key: string): string => {
    const errors = errorMap[key] ?? 0;
    const timings = timingMap[key] ?? [];
    if (errors === 0 && timings.length === 0) return "var(--bg-card)";
    const mastery = charMastery(errors, timings, timings.length);
    if (mastery >= 80) return "rgba(76,175,125,0.4)";
    if (mastery >= 60) return "rgba(226,183,20,0.35)";
    if (mastery >= 40) return "rgba(229,146,86,0.45)";
    return "rgba(229,86,86,0.5)";
  };

  const getKeyBorder = (key: string): string => {
    const errors = errorMap[key] ?? 0;
    const timings = timingMap[key] ?? [];
    if (errors === 0 && timings.length === 0) return "var(--border)";
    const mastery = charMastery(errors, timings, timings.length);
    if (mastery >= 80) return "rgba(76,175,125,0.6)";
    if (mastery >= 60) return "rgba(226,183,20,0.6)";
    if (mastery >= 40) return "rgba(229,146,86,0.7)";
    return "rgba(229,86,86,0.7)";
  };

  const getMastery = (key: string) => {
    const errors = errorMap[key] ?? 0;
    const timings = timingMap[key] ?? [];
    return charMastery(errors, timings, timings.length);
  };

  return (
    <div>
      <h3 style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {isAr ? "خريطة لوحة المفاتيح الحرارية" : "keyboard heatmap"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
        {KEYBOARD_ROWS_EN.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: "5px", paddingLeft: `${ri * 14}px` }}>
            {row.map((key) => (
              <div
                key={key}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "8px",
                  background: getKeyColor(key),
                  border: `1px solid ${getKeyBorder(key)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-primary)",
                  cursor: "default",
                  position: "relative",
                  transition: "transform 0.15s ease",
                  transform: hoveredKey === key ? "translateY(-3px)" : "none",
                  boxShadow: hoveredKey === key ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {key}
                {hoveredKey === key && (
                  <div style={{
                    position: "absolute",
                    top: "-48px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--bg-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    fontSize: "11px",
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}>
                    <div style={{ fontWeight: "600", marginBottom: "2px" }}>
                      {isAr ? "إتقان" : "mastery"}: {getMastery(key)}%
                    </div>
                    <div style={{ color: "var(--error)" }}>
                      {isAr ? "أخطاء" : "errors"}: {errorMap[key] ?? 0}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginTop: "16px", justifyContent: "center" }}>
        {[
          { color: "rgba(76,175,125,0.4)", label: isAr ? "ممتاز" : "great" },
          { color: "rgba(226,183,20,0.35)", label: isAr ? "جيد" : "good" },
          { color: "rgba(229,146,86,0.45)", label: isAr ? "متوسط" : "ok" },
          { color: "rgba(229,86,86,0.5)", label: isAr ? "يحتاج تدريب" : "needs work" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: item.color }} />
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniChart({ data, color = "var(--accent)", height = 60 }: { data: number[]; color?: string; height?: number }) {
  if (data.length < 2) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "12px" }}>—</div>;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill="url(#chartGrad)"
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function StatsPage({ results, dailyStats, settings }: StatsPageProps) {
  const isAr = settings.language === "ar";
  const overall = getOverallStats(results);
  const achievements = loadAchievements();

  // Global timing map
  const globalTimingMap: Record<string, number[]> = {};
  for (const r of results) {
    for (const [ch, times] of Object.entries(r.charTiming)) {
      if (!globalTimingMap[ch]) globalTimingMap[ch] = [];
      globalTimingMap[ch].push(...times);
    }
  }

  const last20 = results.slice(0, 20).reverse();
  const wpmTrend = last20.map((r) => r.wpm);
  const accTrend = last20.map((r) => r.accuracy);

  const formatTime = (seconds: number) => {
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  if (results.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", color: "var(--text-muted)" }}>
          <i className="fa-solid fa-chart-simple" />
        </div>
        <p style={{ fontSize: "16px", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
          {isAr ? "لا توجد إحصاءات بعد. أكمل اختباراً لترى تقدمك!" : "No stats yet. Complete a test to see your progress!"}
        </p>
      </div>
    );
  }

  return (
    <div
      className="animate-fadeIn"
      style={{ maxWidth: "900px", margin: "0 auto", direction: isAr ? "rtl" : "ltr" }}
    >
      {/* Overall Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: isAr ? "أفضل WPM" : "best WPM", value: overall.bestWPM, color: "var(--accent)" },
          { label: isAr ? "متوسط WPM" : "avg WPM", value: overall.avgWPM },
          { label: isAr ? "متوسط دقة" : "avg acc", value: `${overall.avgAccuracy}%` },
          { label: isAr ? "اختبارات" : "tests", value: overall.totalTests },
          { label: isAr ? "وقت التدريب" : "total time", value: formatTime(overall.totalTime) },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: "700", color: s.color ?? "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
              {s.value}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isAr ? "تطور السرعة" : "WPM trend (last 20)"}
          </h3>
          <MiniChart data={wpmTrend} color="var(--accent)" height={80} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{isAr ? "قديم" : "older"}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{isAr ? "حديث" : "recent"}</span>
          </div>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isAr ? "تطور الدقة" : "accuracy trend (last 20)"}
          </h3>
          <MiniChart data={accTrend} color="var(--correct)" height={80} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{isAr ? "قديم" : "older"}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{isAr ? "حديث" : "recent"}</span>
          </div>
        </div>
      </div>

      {/* Keyboard Heatmap */}
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
        <KeyHeatmap
          errorMap={overall.globalErrorMap}
          timingMap={globalTimingMap}
          isAr={isAr}
        />
      </div>

      {/* Achievements */}
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {isAr ? "الإنجازات" : "achievements"}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
          {achievements.map((ach: Achievement) => (
            <div
              key={ach.id}
              style={{
                background: ach.unlockedAt ? "rgba(226,183,20,0.08)" : "var(--bg-card)",
                border: `1px solid ${ach.unlockedAt ? "rgba(226,183,20,0.3)" : "var(--border)"}`,
                borderRadius: "10px",
                padding: "12px",
                opacity: ach.unlockedAt ? 1 : 0.4,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "8px", color: ach.unlockedAt ? "var(--accent)" : "var(--text-muted)" }}>
                <i className={ach.icon} />
              </div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: ach.unlockedAt ? "var(--accent)" : "var(--text-secondary)", marginBottom: "2px" }}>
                {isAr ? ach.nameAr : ach.name}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4, fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
                {isAr ? ach.descriptionAr : ach.description}
              </div>
              {ach.unlockedAt && (
                <div style={{ fontSize: "10px", color: "var(--accent)", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <i className="fa-solid fa-check" />
                  <span>{new Date(ach.unlockedAt).toLocaleDateString(isAr ? "ar" : "en")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tests */}
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
        <h3 style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {isAr ? "آخر الاختبارات" : "recent tests"}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {results.slice(0, 10).map((r, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto auto",
                gap: "16px",
                alignItems: "center",
                padding: "10px 14px",
                background: "var(--bg-card)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                {new Date(r.timestamp).toLocaleString(isAr ? "ar" : "en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: "600" }}>
                {r.wpm} WPM
              </span>
              <span style={{ color: r.accuracy >= 95 ? "var(--correct)" : r.accuracy >= 85 ? "var(--accent)" : "var(--error)", fontFamily: "var(--font-mono)" }}>
                {r.accuracy}%
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                {Math.round(r.duration)}s
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                {r.language.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
