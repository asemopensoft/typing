"use client";
import React, { useEffect, useState } from "react";
import { loadAchievements } from "@/lib/store";

interface ToastProps {
  achievementIds: string[];
  onDismiss: () => void;
  isAr: boolean;
}

export default function AchievementToast({ achievementIds, onDismiss, isAr }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const achievements = loadAchievements().filter((a) => achievementIds.includes(a.id));

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (achievements.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: isAr ? "auto" : "24px",
        left: isAr ? "24px" : "auto",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
        direction: isAr ? "rtl" : "ltr",
      }}
    >
      {achievements.map((ach) => (
        <div
          key={ach.id}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--accent)",
            borderRadius: "12px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(226,183,20,0.15)",
            minWidth: "260px",
          }}
        >
          <span style={{ fontSize: "26px", color: "var(--accent)", display: "flex", alignItems: "center" }}>
            <i className={ach.icon} />
          </span>
          <div>
            <div style={{ fontSize: "11px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>
              {isAr ? "إنجاز جديد!" : "Achievement Unlocked!"}
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
              {isAr ? ach.nameAr : ach.name}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
              {isAr ? ach.descriptionAr : ach.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
