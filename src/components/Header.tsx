"use client";
import React from "react";
import { UserSettings } from "@/lib/store";

interface HeaderProps {
  settings: UserSettings;
  onSettingChange: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  activeTab: "test" | "stats" | "learn";
  onTabChange: (tab: "test" | "stats" | "learn") => void;
}

export default function Header({ settings, onSettingChange, activeTab, onTabChange }: HeaderProps) {
  const isAr = settings.language === "ar";

  return (
    <header
      style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            background: "var(--accent)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#0f0f14",
          }}
        >
          T
        </div>
        <span
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--accent)",
            letterSpacing: "-0.5px",
          }}
        >
          TypeMaster
        </span>
      </div>

      {/* Nav Tabs */}
      <nav style={{ display: "flex", gap: "4px" }}>
        {(
          [
            { id: "test", label: "اختبار", labelEn: "Test", icon: "fa-solid fa-keyboard" },
            { id: "stats", label: "إحصاءات", labelEn: "Stats", icon: "fa-solid fa-chart-simple" },
            { id: "learn", label: "تعلّم", labelEn: "Learn", icon: "fa-solid fa-graduation-cap" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: "6px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
              background: activeTab === tab.id ? "var(--accent)" : "transparent",
              color: activeTab === tab.id ? "#0f0f14" : "var(--text-secondary)",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                (e.target as HTMLButtonElement).style.color = "var(--text-primary)";
                (e.target as HTMLButtonElement).style.background = "var(--bg-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                (e.target as HTMLButtonElement).style.color = "var(--text-secondary)";
                (e.target as HTMLButtonElement).style.background = "transparent";
              }
            }}
          >
            <i className={tab.icon} />
            <span>{isAr ? tab.label : tab.labelEn}</span>
          </button>
        ))}
      </nav>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Language Toggle */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-card)",
            borderRadius: "8px",
            padding: "2px",
            border: "1px solid var(--border)",
          }}
        >
          {(["en", "ar"] as const).map((lang) => (
            <button
              key={lang}
              id={`lang-toggle-${lang}`}
              onClick={() => onSettingChange("language", lang)}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                background: settings.language === lang ? "var(--accent)" : "transparent",
                color: settings.language === lang ? "#0f0f14" : "var(--text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              {lang === "en" ? "EN" : "ع"}
            </button>
          ))}
        </div>

        {/* Duration */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-card)",
            borderRadius: "8px",
            padding: "2px",
            border: "1px solid var(--border)",
            gap: "1px",
          }}
        >
          {([15, 30, 60] as const).map((d) => (
            <button
              key={d}
              id={`duration-${d}`}
              onClick={() => onSettingChange("duration", d)}
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "var(--font-mono)",
                background: settings.duration === d ? "rgba(226,183,20,0.15)" : "transparent",
                color: settings.duration === d ? "var(--accent)" : "var(--text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              {d}s
            </button>
          ))}
        </div>

        {/* Mode */}
        <select
          id="word-mode-select"
          value={settings.mode}
          onChange={(e) => onSettingChange("mode", e.target.value as UserSettings["mode"])}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "5px 10px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            outline: "none",
          }}
        >
          <option value="common">{isAr ? "شائع" : "common"}</option>
          <option value="medium">{isAr ? "متوسط" : "medium"}</option>
          <option value="code">{isAr ? "كود" : "code"}</option>
          <option value="quotes">{isAr ? "اقتباسات" : "quotes"}</option>
        </select>
      </div>
    </header>
  );
}
