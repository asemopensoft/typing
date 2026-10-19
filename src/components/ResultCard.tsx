"use client";
import React from "react";
import { TestResult } from "@/lib/typingEngine";
import { UserSettings } from "@/lib/store";

interface ResultCardProps {
  result: TestResult;
  settings: UserSettings;
  onRetry: () => void;
  onNewTest: () => void;
}

function StatBox({
  label,
  value,
  color,
  unit,
}: {
  label: string;
  value: string | number;
  color?: string;
  unit?: string;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "20px 24px",
        textAlign: "center",
        flex: "1",
        minWidth: "120px",
      }}
    >
      <div
        style={{
          fontSize: "38px",
          fontWeight: "700",
          color: color ?? "var(--text-primary)",
          fontFamily: "var(--font-mono)",
          lineHeight: 1,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: "16px", color: "var(--text-secondary)", marginLeft: "4px" }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </div>
    </div>
  );
}

export default function ResultCard({ result, settings, onRetry, onNewTest }: ResultCardProps) {
  const isAr = settings.language === "ar";

  // Top errors
  const topErrors = Object.entries(result.errorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Char timing avg
  const timingEntries = Object.entries(result.charTiming)
    .map(([char, times]) => ({
      char,
      avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  const wpmColor =
    result.wpm >= 80
      ? "var(--correct)"
      : result.wpm >= 50
      ? "var(--accent)"
      : "var(--text-primary)";

  const accColor =
    result.accuracy >= 98
      ? "var(--correct)"
      : result.accuracy >= 90
      ? "var(--accent)"
      : "var(--error)";

  return (
    <div
      className="animate-fadeIn"
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        direction: isAr ? "rtl" : "ltr",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "16px",
          color: "var(--text-secondary)",
          marginBottom: "32px",
          fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
        }}
      >
        {isAr ? "نتائج الاختبار" : "test results"}
      </h2>

      {/* Main Stats */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatBox label="WPM" value={result.wpm} color={wpmColor} />
        <StatBox
          label={isAr ? "سرعة خام" : "raw WPM"}
          value={result.rawWpm}
          color="var(--text-secondary)"
        />
        <StatBox
          label={isAr ? "دقة" : "accuracy"}
          value={result.accuracy}
          unit="%"
          color={accColor}
        />
        <StatBox
          label={isAr ? "أخطاء" : "errors"}
          value={result.errorChars}
          color={result.errorChars > 0 ? "var(--error)" : "var(--correct)"}
        />
        <StatBox
          label={isAr ? "وقت" : "time"}
          value={Math.round(result.duration)}
          unit="s"
        />
      </div>

      {/* Analysis */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {/* Error Map */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            }}
          >
            {isAr ? "الحروف الأكثر خطأً" : "most missed keys"}
          </h3>
          {topErrors.length === 0 ? (
            <p style={{ color: "var(--correct)", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="fa-solid fa-circle-check" />
              <span>{isAr ? "لا أخطاء! أداء مثالي" : "No errors! Perfect"}</span>
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {topErrors.map(([char, count]) => (
                <div
                  key={char}
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid rgba(229,86,86,${Math.min(count / 5, 1)})`,
                    borderRadius: "8px",
                    padding: "8px 12px",
                    textAlign: "center",
                    minWidth: "60px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--error)",
                      fontWeight: "600",
                    }}
                  >
                    {char === " " ? "⎵" : char}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    ×{count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slow Keys */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            }}
          >
            {isAr ? "أبطأ الحروف" : "slowest keys (ms)"}
          </h3>
          {timingEntries.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              {isAr ? "بيانات غير كافية" : "not enough data yet"}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {timingEntries.map(({ char, avg }) => (
                <div key={char} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "var(--bg-card)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      color: "var(--accent)",
                      minWidth: "32px",
                      textAlign: "center",
                    }}
                  >
                    {char === " " ? "⎵" : char}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      background: "var(--bg-card)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min((avg / 600) * 100, 100)}%`,
                        background: avg > 400 ? "var(--error)" : avg > 250 ? "var(--accent)" : "var(--correct)",
                        borderRadius: "3px",
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-mono)",
                      minWidth: "45px",
                      textAlign: "right",
                    }}
                  >
                    {avg}ms
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Adaptive tip */}
      {topErrors.length > 0 && (
        <div
          style={{
            background: "rgba(226,183,20,0.06)",
            border: "1px solid rgba(226,183,20,0.2)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "20px", color: "var(--accent)", display: "flex", alignItems: "center" }}><i className="fa-solid fa-bullseye" /></span>
          <div>
            <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: "600", marginBottom: "4px" }}>
              {isAr ? "توصية التدريب التكيفي" : "Adaptive Training Tip"}
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
              {isAr
                ? `تكرر لديك أخطاء في: ${topErrors.slice(0, 3).map(([c]) => c === " " ? "المسافة" : `"${c}"`).join("، ")}. سيُخصص التمرين القادم لتحسين هذه الحروف.`
                : `You frequently missed: ${topErrors.slice(0, 3).map(([c]) => c === " " ? "space" : `"${c}"`).join(", ")}. Next test will focus on these characters.`}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          id="result-retry-btn"
          onClick={onRetry}
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: "10px",
            padding: "12px 32px",
            color: "#0f0f14",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "700",
            fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          <i className="fa-solid fa-rotate-right" />
          <span>{isAr ? "أعد الاختبار" : "retry"}</span>
        </button>
        <button
          id="result-new-btn"
          onClick={onNewTest}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px 32px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-secondary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          }}
        >
          <i className="fa-solid fa-plus" />
          <span>{isAr ? "نص جديد" : "new test"}</span>
        </button>
      </div>
    </div>
  );
}
