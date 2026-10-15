"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { KeystrokeData, calculateWPM, calculateAccuracy, buildErrorMap, buildCharTiming } from "@/lib/typingEngine";
import { TestResult } from "@/lib/typingEngine";
import { UserSettings } from "@/lib/store";
import { generateText } from "@/lib/wordPools";
import InteractiveKeyboard from "@/components/InteractiveKeyboard";

interface TypingAreaProps {
  settings: UserSettings;
  onTestComplete: (result: TestResult) => void;
  weakChars: string[];
}

type CharState = "untyped" | "correct" | "error" | "current";

interface DisplayChar {
  char: string;
  state: CharState;
}

export default function TypingArea({ settings, onTestComplete, weakChars }: TypingAreaProps) {
  const [text, setText] = useState<string>("");
  const [displayChars, setDisplayChars] = useState<DisplayChar[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [liveWPM, setLiveWPM] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);

  // For keyboard highlight â€“ use a counter trick so same key press fires effect repeatedly
  const [kbKey, setKbKey] = useState<{ key: string; correct: boolean; seq: number } | null>(null);

  const keystrokesRef = useRef<KeystrokeData[]>([]);
  const startTimeRef = useRef<number>(0);
  const lastKeystrokeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAr = settings.language === "ar";

  const initTest = useCallback(() => {
    const newText = generateText(settings.language, settings.mode, 80, weakChars);
    setText(newText);
    setDisplayChars(newText.split("").map((c) => ({ char: c, state: "untyped" as CharState })));
    setCurrentIndex(0);
    setStarted(false);
    setFinished(false);
    setTimeLeft(settings.duration);
    setLiveWPM(0);
    setLiveAccuracy(100);
    setErrorCount(0);
    setKbKey(null);
    keystrokesRef.current = [];
    startTimeRef.current = 0;
    lastKeystrokeRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [settings.language, settings.mode, settings.duration, weakChars]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
    setStarted(false);

    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const keystrokes = keystrokesRef.current;
    const correct = keystrokes.filter((k) => k.correct).length;
    const total = keystrokes.length;
    const errorMap = buildErrorMap(keystrokes);
    const charTiming = buildCharTiming(keystrokes);
    const errors = Object.values(errorMap).reduce((a, b) => a + b, 0);

    const result: TestResult = {
      wpm: calculateWPM(correct, elapsed * 1000),
      rawWpm: calculateWPM(total, elapsed * 1000),
      accuracy: calculateAccuracy(correct, total),
      correctChars: correct,
      errorChars: errors,
      totalChars: total,
      duration: elapsed,
      keystrokes,
      errorMap,
      charTiming,
      timestamp: new Date(),
      language: settings.language,
    };
    onTestComplete(result);
  }, [settings.language, onTestComplete]);

  useEffect(() => {
    if (started) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          const elapsed = performance.now() - startTimeRef.current;
          const correct = keystrokesRef.current.filter((k) => k.correct).length;
          const total = keystrokesRef.current.length;
          setLiveWPM(calculateWPM(correct, elapsed));
          setLiveAccuracy(calculateAccuracy(correct, total));
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finishTest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (finished) {
        if (e.key === "Tab" || e.key === "Enter") {
          e.preventDefault();
          initTest();
        }
        return;
      }

      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === "Escape") { initTest(); return; }
      if (e.key === "Tab") { e.preventDefault(); initTest(); return; }

      if (e.key === "Backspace") {
        e.preventDefault();
        // Highlight backspace key
        setKbKey({ key: "Backspace", correct: true, seq: Date.now() });
        if (currentIndex > 0) {
          setCurrentIndex((prev) => {
            const newIdx = prev - 1;
            setDisplayChars((chars) =>
              chars.map((c, i) => {
                if (i === newIdx) return { ...c, state: "current" };
                if (i === prev) return { ...c, state: "untyped" };
                return c;
              })
            );
            return newIdx;
          });
        }
        return;
      }

      if (e.key.length !== 1) return;

      // Start timer on first keystroke
      if (!started && currentIndex === 0) {
        setStarted(true);
        startTimeRef.current = performance.now();
        lastKeystrokeRef.current = startTimeRef.current;
      }

      const now = performance.now();
      const duration = lastKeystrokeRef.current > 0 ? now - lastKeystrokeRef.current : 0;
      lastKeystrokeRef.current = now;

      const expected = text[currentIndex];
      if (expected === undefined) return;
      const isCorrect = e.key === expected;

      if (!isCorrect) setErrorCount((prev) => prev + 1);

      // Highlight key immediately
      setKbKey({ key: e.key, correct: isCorrect, seq: now });

      const keystroke: KeystrokeData = {
        char: e.key,
        expected,
        correct: isCorrect,
        timestamp: now,
        duration,
      };
      keystrokesRef.current.push(keystroke);

      const newIndex = currentIndex + 1;
      setDisplayChars((chars) =>
        chars.map((c, i) => {
          if (i === currentIndex) return { ...c, state: isCorrect ? "correct" : "error" };
          if (i === newIndex) return { ...c, state: "current" };
          return c;
        })
      );
      setCurrentIndex(newIndex);

      if (newIndex >= text.length) {
        finishTest();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, finished, currentIndex, text, initTest, finishTest]);

  // Set first char as current on init
  useEffect(() => {
    if (displayChars.length > 0 && !started && !finished) {
      setDisplayChars((chars) =>
        chars.map((c, i) => (i === 0 ? { ...c, state: "current" } : c))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const timerPercent = (timeLeft / settings.duration) * 100;
  const circumference = 2 * Math.PI * 40;

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}
      tabIndex={0}
      aria-label="Typing area - start typing to begin"
    >
      {/* Stats Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "48px",
          marginBottom: "40px",
          alignItems: "center",
        }}
      >
        {/* Timer Circle */}
        <div style={{ position: "relative", width: "90px", height: "90px" }}>
          <svg width="90" height="90" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="45" cy="45" r="40" fill="none" stroke="var(--bg-card)" strokeWidth="4" />
            <circle
              cx="45" cy="45" r="40" fill="none"
              stroke={timeLeft <= 5 && started ? "var(--error)" : "var(--accent)"}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - timerPercent / 100)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "22px", fontWeight: "700",
                color: timeLeft <= 5 && started ? "var(--error)" : "var(--accent)",
                fontFamily: "var(--font-mono)",
                transition: "color 0.3s ease",
              }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* WPM */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "42px", fontWeight: "700",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)", lineHeight: 1,
            }}
          >
            {started ? liveWPM : "\u2014"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>WPM</div>
        </div>

        {/* Accuracy */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "42px", fontWeight: "700",
              color: started
                ? liveAccuracy >= 95
                  ? "var(--correct)"
                  : liveAccuracy >= 85
                  ? "var(--accent)"
                  : "var(--error)"
                : "var(--text-primary)",
              fontFamily: "var(--font-mono)", lineHeight: 1,
            }}
          >
            {started ? liveAccuracy : "\u2014"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            {isAr ? "\u062f\u0642\u0629 %" : "ACC %"}
          </div>
        </div>

        {/* Errors */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "42px", fontWeight: "700",
              color: errorCount > 0 ? "var(--error)" : "var(--text-primary)",
              fontFamily: "var(--font-mono)", lineHeight: 1,
            }}
          >
            {errorCount}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            {isAr ? "\u0623\u062e\u0637\u0627\u0621" : "errors"}
          </div>
        </div>
      </div>

      {/* Text Display */}
      <div
        style={{
          background: "var(--bg-secondary)",
          borderRadius: "16px",
          padding: "32px 36px",
          border: "1px solid var(--border)",
          position: "relative",
          cursor: "text",
          userSelect: "none",
        }}
        onClick={() => containerRef.current?.focus()}
      >
        <div
          style={{
            fontSize: settings.fontSize === "lg" ? "22px" : settings.fontSize === "sm" ? "16px" : "19px",
            lineHeight: "2.2",
            fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            direction: isAr ? "rtl" : "ltr",
            letterSpacing: isAr ? "0" : "0.04em",
            overflow: "hidden",
            maxHeight: "200px",
            wordBreak: "break-word",
          }}
        >
          {displayChars.map((dc, i) => (
            <span
              key={i}
              className={`typing-char ${dc.state}`}
              style={{
                color:
                  dc.state === "correct"
                    ? "var(--text-primary)"
                    : dc.state === "error"
                    ? "var(--error)"
                    : dc.state === "current"
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                position: "relative",
                borderLeft: dc.state === "current" && !isAr ? "2.5px solid var(--cursor)" : undefined,
                borderRight: dc.state === "current" && isAr ? "2.5px solid var(--cursor)" : undefined,
                animation: dc.state === "current" ? "caretBlink 1s step-end infinite" : undefined,
                paddingLeft: dc.state === "current" && !isAr ? "1px" : undefined,
                paddingRight: dc.state === "current" && isAr ? "1px" : undefined,
                textDecoration: dc.state === "error" ? "underline" : "none",
                textDecorationColor: "var(--error)",
                textUnderlineOffset: "3px",
              }}
              aria-label={dc.char}
            >
              {dc.char === " " ? "\u00A0" : dc.char}
            </span>
          ))}
        </div>

        {/* Start hint */}
        {!started && !finished && (
          <div
            style={{
              position: "absolute", bottom: "12px", left: "50%",
              transform: "translateX(-50%)",
              fontSize: "12px", color: "var(--text-muted)",
              pointerEvents: "none",
              fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            }}
          >
            {isAr
              ? "\u0627\u0628\u062f\u0623 \u0627\u0644\u0643\u062a\u0627\u0628\u0629 \u0644\u0628\u062f\u0621 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u2022 Tab \u0644\u0644\u0625\u0639\u0627\u062f\u0629"
              : "start typing to begin \u2022 tab to restart"}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
        <button
          id="restart-btn"
          onClick={initTest}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "8px 20px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          {isAr ? "\u0625\u0639\u0627\u062f\u0629" : "restart"}{" "}
          <kbd style={{ fontSize: "10px", opacity: 0.5 }}>Tab</kbd>
        </button>

        {/* Toggle keyboard */}
        <button
          id="toggle-keyboard-btn"
          onClick={() => setShowKeyboard((v) => !v)}
          style={{
            background: showKeyboard ? "rgba(226,183,20,0.1)" : "transparent",
            border: `1px solid ${showKeyboard ? "rgba(226,183,20,0.4)" : "var(--border)"}`,
            borderRadius: "8px",
            padding: "8px 16px",
            color: showKeyboard ? "var(--accent)" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
          }}
        >
          <i className="fa-solid fa-keyboard" />
          {isAr
            ? showKeyboard ? "إخفاء لوحة المفاتيح" : "إظهار لوحة المفاتيح"
            : showKeyboard ? "Hide Keyboard" : "Show Keyboard"}
        </button>
      </div>

      {/* Interactive Keyboard */}
      {showKeyboard && (
        <div style={{ marginTop: "28px" }}>
          <InteractiveKeyboard
            pressedKey={kbKey ? kbKey.key : null}
            isCorrect={kbKey ? kbKey.correct : null}
            language={settings.language}
            show={true}
          />
        </div>
      )}
    </div>
  );
}