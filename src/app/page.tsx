"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import TypingArea from "@/components/TypingArea";
import ResultCard from "@/components/ResultCard";
import StatsPage from "@/components/StatsPage";
import LearnPage from "@/components/LearnPage";
import AchievementToast from "@/components/AchievementToast";

import {
  UserSettings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  loadResults,
  saveResult,
  loadDailyStats,
  checkAchievements,
} from "@/lib/store";
import { TestResult, getWeakChars } from "@/lib/typingEngine";

type AppTab = "test" | "stats" | "learn";
type TestPhase = "idle" | "result";

export default function Home() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<AppTab>("test");
  const [testPhase, setTestPhase] = useState<TestPhase>("idle");
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [allResults, setAllResults] = useState<TestResult[]>([]);
  const [dailyStats, setDailyStats] = useState(loadDailyStats());
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [weakChars, setWeakChars] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = loadSettings();
    const savedResults = loadResults();
    setSettings(savedSettings);
    setAllResults(savedResults);
    setDailyStats(loadDailyStats());

    // Compute weak chars from last 10 results
    if (savedResults.length > 0) {
      const recent = savedResults.slice(0, 10);
      const combinedErrorMap: Record<string, number> = {};
      const combinedTiming: Record<string, number[]> = {};
      for (const r of recent) {
        for (const [ch, cnt] of Object.entries(r.errorMap)) {
          combinedErrorMap[ch] = (combinedErrorMap[ch] ?? 0) + cnt;
        }
        for (const [ch, times] of Object.entries(r.charTiming)) {
          if (!combinedTiming[ch]) combinedTiming[ch] = [];
          combinedTiming[ch].push(...times);
        }
      }
      setWeakChars(getWeakChars(combinedErrorMap, combinedTiming));
    }

    setMounted(true);
  }, []);

  const handleSettingChange = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        saveSettings(updated);
        return updated;
      });
      // Reset test when core settings change
      if (key === "language" || key === "duration" || key === "mode") {
        setTestPhase("idle");
        setCurrentResult(null);
      }
    },
    []
  );

  const handleTestComplete = useCallback(
    (result: TestResult) => {
      saveResult(result);
      const updatedResults = [result, ...allResults];
      setAllResults(updatedResults);
      setDailyStats(loadDailyStats());
      setCurrentResult(result);
      setTestPhase("result");

      // Update weak chars
      const combinedErrorMap: Record<string, number> = {};
      const combinedTiming: Record<string, number[]> = {};
      for (const r of updatedResults.slice(0, 10)) {
        for (const [ch, cnt] of Object.entries(r.errorMap)) {
          combinedErrorMap[ch] = (combinedErrorMap[ch] ?? 0) + cnt;
        }
        for (const [ch, times] of Object.entries(r.charTiming)) {
          if (!combinedTiming[ch]) combinedTiming[ch] = [];
          combinedTiming[ch].push(...times);
        }
      }
      setWeakChars(getWeakChars(combinedErrorMap, combinedTiming));

      // Check achievements
      const unlocked = checkAchievements(updatedResults);
      if (unlocked.length > 0) {
        setNewAchievements(unlocked);
      }
    },
    [allResults]
  );

  const handleRetry = useCallback(() => {
    setTestPhase("idle");
    setCurrentResult(null);
  }, []);

  const handleNewTest = useCallback(() => {
    setTestPhase("idle");
    setCurrentResult(null);
  }, []);

  const isAr = settings.language === "ar";

  if (!mounted) {
    // SSR skeleton
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--accent)", fontSize: "24px", fontFamily: "monospace" }}>TypeMaster</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        settings={settings}
        onSettingChange={handleSettingChange}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "test") {
            setTestPhase("idle");
            setCurrentResult(null);
          }
        }}
      />

      <main
        style={{
          flex: 1,
          padding: "48px 24px",
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {activeTab === "test" && (
          <div className="animate-fadeIn">
            {testPhase === "idle" ? (
              <TypingArea
                settings={settings}
                onTestComplete={handleTestComplete}
                weakChars={weakChars}
              />
            ) : currentResult ? (
              <ResultCard
                result={currentResult}
                settings={settings}
                onRetry={handleRetry}
                onNewTest={handleNewTest}
              />
            ) : null}
          </div>
        )}

        {activeTab === "stats" && (
          <StatsPage
            results={allResults}
            dailyStats={dailyStats}
            settings={settings}
          />
        )}

        {activeTab === "learn" && (
          <LearnPage settings={settings} />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          fontSize: "12px",
          color: "var(--text-muted)",
          fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
          direction: isAr ? "rtl" : "ltr",
        }}
      >
        <span>TypeMaster v1.0</span>
        <span>·</span>
        <span>{isAr ? "بيانات محفوظة محلياً فقط" : "all data stored locally"}</span>
        {weakChars.length > 0 && (
          <>
            <span>·</span>
            <span style={{ color: "var(--accent)" }}>
              {isAr ? `حروف تحتاج تدريب: ${weakChars.slice(0, 4).join(" ")}` : `focus chars: ${weakChars.slice(0, 4).join(" ")}`}
            </span>
          </>
        )}
      </footer>

      {/* Achievement Toast */}
      {newAchievements.length > 0 && (
        <AchievementToast
          achievementIds={newAchievements}
          onDismiss={() => setNewAchievements([])}
          isAr={isAr}
        />
      )}
    </div>
  );
}
