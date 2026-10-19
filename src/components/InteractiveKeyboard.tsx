"use client";
import React, { useEffect, useState, useRef } from "react";

interface InteractiveKeyboardProps {
  pressedKey: string | null;
  isCorrect: boolean | null;
  language?: string;
  show?: boolean;
}

const ROWS = [
  ["~`", "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)", "-_", "=+", "Backspace"],
  ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[{", "]}", "\\|"],
  ["Caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";:", "'\"|", "Enter"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", ",<", ".>", "/?", "Shift"],
  ["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
];

const ARABIC_LABELS: Record<string, string> = {
  q: "\u0636", w: "\u0635", e: "\u062b", r: "\u0642", t: "\u0641", y: "\u063a", u: "\u0639", i: "\u0647", o: "\u062e", p: "\u062d",
  a: "\u0634", s: "\u0633", d: "\u064a", f: "\u0628", g: "\u0644", h: "\u0627", j: "\u062a", k: "\u0646", l: "\u0645",
  z: "\u0626", x: "\u0621", c: "\u0624", v: "\u0631", b: "\u0644\u0627", n: "\u0649", m: "\u0629",
};

const FINGER_COLORS: Record<string, string> = {
  "~`": "#7c4dab", "1!": "#7c4dab", "Tab": "#7c4dab", "Caps": "#7c4dab",
  "q": "#7c4dab", "a": "#7c4dab", "z": "#7c4dab",
  "2@": "#9b5ab5", "w": "#9b5ab5", "s": "#9b5ab5", "x": "#9b5ab5",
  "3#": "#b567bc", "e": "#b567bc", "d": "#b567bc", "c": "#b567bc",
  "4$": "#d47fc4", "5%": "#d47fc4", "r": "#d47fc4", "t": "#d47fc4",
  "f": "#d47fc4", "g": "#d47fc4", "v": "#d47fc4", "b": "#d47fc4",
  "6^": "#b8b52f", "7&": "#b8b52f", "y": "#b8b52f", "u": "#b8b52f",
  "h": "#b8b52f", "j": "#b8b52f", "n": "#b8b52f", "m": "#b8b52f",
  "8*": "#9ec82b", "i": "#9ec82b", "k": "#9ec82b", ",<": "#9ec82b",
  "9(": "#7ed44a", "o": "#7ed44a", "l": "#7ed44a", ".>": "#7ed44a",
  "0)": "#4ab870", "-_": "#4ab870", "=+": "#4ab870", "Backspace": "#4ab870",
  "p": "#4ab870", "[{": "#4ab870", "]}": "#4ab870", "\\|": "#4ab870",
  ";:": "#4ab870", "'\"|": "#4ab870", "Enter": "#4ab870", "/?": "#4ab870",
  "Shift": "#7c4dab", "Space": "#4a90d9", "Ctrl": "#444", "Alt": "#444",
};

function getKeyWidth(key: string): number {
  switch (key) {
    case "Backspace": return 2.0;
    case "Tab": return 1.5;
    case "Caps": return 1.75;
    case "Enter": return 2.25;
    case "Shift": return 2.5;
    case "Space": return 6.5;
    case "Ctrl": case "Alt": return 1.5;
    case "\\|": return 1.5;
    default: return 1;
  }
}

function matchesKey(rowKey: string, pressedKey: string): boolean {
  if (rowKey === "Space") return pressedKey === " ";
  const pk = pressedKey.toLowerCase();
  const rk = rowKey.toLowerCase();
  if (rk === pk) return true;
  if (rowKey.length === 2 || rowKey.length === 3) {
    return rowKey[0] === pressedKey || rowKey[1] === pressedKey || rowKey[0].toLowerCase() === pk;
  }
  const specials: Record<string, string> = {
    Backspace: "backspace", Tab: "tab", Caps: "capslock",
    Enter: "enter", Ctrl: "control", Alt: "alt"
  };
  return specials[rowKey]?.toLowerCase() === pk;
}

function hexToRgb(hex: string): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return "200,200,200";
  return `${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)}`;
}

export default function InteractiveKeyboard({
  pressedKey,
  isCorrect,
  language = "en",
  show = true,
}: InteractiveKeyboardProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [keyOk, setKeyOk] = useState<boolean | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAr = language === "ar";

  useEffect(() => {
    if (pressedKey !== null) {
      setActiveKey(pressedKey);
      setKeyOk(isCorrect);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setActiveKey(null);
        setKeyOk(null);
      }, 130);
    }
  }, [pressedKey, isCorrect]);

  if (!show) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "18px 12px 20px",
        background: "linear-gradient(135deg,rgba(18,18,30,0.97) 0%,rgba(22,22,42,0.97) 100%)",
        borderRadius: "20px",
        border: "1px solid rgba(226,183,20,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.04)",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Interactive keyboard"
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "80%", height: "60%",
          background: "radial-gradient(ellipse,rgba(226,183,20,0.03) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Label */}
      <div
        style={{
          textAlign: "center", marginBottom: "12px", fontSize: "9px",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(226,183,20,0.35)", fontFamily: "'Roboto Mono',monospace",
        }}
      >
        {"\u2328"} KEYBOARD
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
        {ROWS.map((row, ri) => (
          <div
            key={ri}
            style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: "center", width: "100%" }}
          >
            {row.map((key) => {
              const isActive = !!activeKey && matchesKey(key, activeKey);
              const fc = FINGER_COLORS[key] ?? "#333";
              const wu = getKeyWidth(key);
              const isSpecial = wu > 1;
              let label = key;
              if (isAr && ARABIC_LABELS[key]) label = ARABIC_LABELS[key];
              else if (key.length === 2) label = key[0];
              else if (key.length === 1) label = key.toUpperCase();

              const bgColor = isActive
                ? keyOk === false
                  ? "rgba(229,86,86,0.9)"
                  : "rgba(226,183,20,0.92)"
                : `rgba(${hexToRgb(fc)},0.10)`;

              const borderColor = isActive
                ? keyOk === false ? "#e55656" : "#e2b714"
                : `rgba(${hexToRgb(fc)},0.28)`;

              const glow = isActive
                ? keyOk === false
                  ? "0 0 18px rgba(229,86,86,0.65),0 3px 8px rgba(0,0,0,0.5)"
                  : "0 0 22px rgba(226,183,20,0.75),0 3px 8px rgba(0,0,0,0.5)"
                : "0 2px 5px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.04),inset 0 -2px 0 rgba(0,0,0,0.25)";

              return (
                <div
                  key={key}
                  style={{
                    width: `${wu * 50}px`,
                    minWidth: `${wu * 50}px`,
                    height: "42px",
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "7px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "default",
                    transition: "all 0.07s cubic-bezier(0.2,0,0.4,1)",
                    transform: isActive ? "translateY(2px) scale(0.95)" : "translateY(0) scale(1)",
                    boxShadow: glow,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Shine */}
                  <div
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "45%",
                      background: isActive
                        ? "rgba(255,255,255,0.18)"
                        : "linear-gradient(180deg,rgba(255,255,255,0.06) 0%,transparent 100%)",
                      borderRadius: "6px 6px 0 0",
                      pointerEvents: "none",
                      transition: "background 0.07s ease",
                    }}
                  />
                  {/* Finger dot */}
                  {!isActive && (
                    <div
                      style={{
                        position: "absolute", bottom: "3px", left: "50%",
                        transform: "translateX(-50%)",
                        width: "5px", height: "2px", borderRadius: "1px",
                        background: fc, opacity: 0.45,
                      }}
                    />
                  )}
                  {/* Label */}
                  <span
                    style={{
                      fontSize: isSpecial ? "9px" : "13px",
                      color: isActive ? (keyOk === false ? "#fff" : "#1a1800") : "rgba(255,255,255,0.82)",
                      fontFamily: isAr ? "'Cairo',sans-serif" : "'Roboto Mono',monospace",
                      fontWeight: 700,
                      letterSpacing: isSpecial ? "0.04em" : "0",
                      transition: "color 0.07s ease",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger legend */}
      <div
        style={{
          display: "flex", justifyContent: "center", gap: "16px",
          marginTop: "14px", flexWrap: "wrap",
        }}
      >
        {[
          { c: "#7c4dab", l: isAr ? "\u062e\u0646\u0635\u0631 \u064a\u0633\u0627\u0631" : "L-Pinky" },
          { c: "#d47fc4", l: isAr ? "\u0633\u0628\u0627\u0628\u0629 \u064a\u0633\u0627\u0631" : "L-Index" },
          { c: "#b8b52f", l: isAr ? "\u0633\u0628\u0627\u0628\u0629 \u064a\u0645\u064a\u0646" : "R-Index" },
          { c: "#4ab870", l: isAr ? "\u062e\u0646\u0635\u0631 \u064a\u0645\u064a\u0646" : "R-Pinky" },
          { c: "#4a90d9", l: isAr ? "\u0625\u0628\u0647\u0627\u0645" : "Thumbs" },
        ].map((item) => (
          <div key={item.l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "9px", height: "9px", borderRadius: "2px",
                background: item.c, opacity: 0.75,
              }}
            />
            <span
              style={{
                fontSize: "9px", color: "rgba(255,255,255,0.3)",
                fontFamily: "'Roboto Mono',monospace",
              }}
            >
              {item.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}