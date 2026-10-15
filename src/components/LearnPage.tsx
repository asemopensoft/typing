"use client";
import React, { useState } from "react";
import { UserSettings } from "@/lib/store";

interface LearnPageProps {
  settings: UserSettings;
}

interface Lesson {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  level: 1 | 2 | 3 | 4 | 5;
  icon: string;
  keys: string[];
  practiceText: string;
  practiceTextAr: string;
}

const LESSONS: Lesson[] = [
  {
    id: "home-row",
    titleEn: "Home Row",
    titleAr: "الصف الأساسي",
    descEn: "Master the foundation: ASDF JKL; — where your fingers rest",
    descAr: "أتقن الأساس: ASDF JKL; — حيث ترتاح أصابعك",
    level: 1,
    icon: "fa-solid fa-house",
    keys: ["a","s","d","f","j","k","l",";"],
    practiceText: "fall flask glad half jag lads safe ask glad fall sag dad fad lad",
    practiceTextAr: "في من إلى على هذا كان ما لا مع عن أن إن لم لن",
  },
  {
    id: "top-row",
    titleEn: "Top Row",
    titleAr: "الصف العلوي",
    descEn: "Add the top row: QWER YUIOP",
    descAr: "تعلم الصف العلوي: QWER YUIOP",
    level: 2,
    icon: "fa-solid fa-arrow-up",
    keys: ["q","w","e","r","t","y","u","i","o","p"],
    practiceText: "your type quite port write tower power quiet outer wirey toy",
    practiceTextAr: "التي يكون تكون الذي الذين وهو وهي نحن أنت أكثر",
  },
  {
    id: "bottom-row",
    titleEn: "Bottom Row",
    titleAr: "الصف السفلي",
    descEn: "Complete the keyboard: ZXCV BNM",
    descAr: "أكمل لوحة المفاتيح: ZXCV BNM",
    level: 2,
    icon: "fa-solid fa-arrow-down",
    keys: ["z","x","c","v","b","n","m"],
    practiceText: "black zinc move verb next calm brim zinc venom blame combine",
    practiceTextAr: "مثل حتى فإن وقد كما بما ولا لكن بعد قبل حيث عند",
  },
  {
    id: "numbers-symbols",
    titleEn: "Numbers & Symbols",
    titleAr: "الأرقام والرموز",
    descEn: "Master numbers 0-9 and common symbols",
    descAr: "أتقن الأرقام 0-9 والرموز الشائعة",
    level: 3,
    icon: "fa-solid fa-arrow-down-1-9",
    keys: ["1","2","3","4","5","6","7","8","9","0"],
    practiceText: "score 42 points, win by 100, order 7 items, code 3.14",
    practiceTextAr: "يوم 24 ساعة، عام 365 يوم، 100 متسابق",
  },
  {
    id: "capital-letters",
    titleEn: "Capital Letters",
    titleAr: "الحروف الكبيرة",
    descEn: "Practice using Shift for capital letters",
    descAr: "تدرب على استخدام Shift للحروف الكبيرة",
    level: 3,
    icon: "fa-solid fa-font",
    keys: ["Shift"],
    practiceText: "The Quick Brown Fox Jumps Over The Lazy Dog. Hello World! TypeMaster.",
    practiceTextAr: "اللغة العربية جميلة. تعلم الطباعة. مرحباً بك.",
  },
  {
    id: "words-speed",
    titleEn: "Speed Training",
    titleAr: "تدريب السرعة",
    descEn: "Common words to build typing rhythm and speed",
    descAr: "كلمات شائعة لبناء إيقاع وسرعة الطباعة",
    level: 4,
    icon: "fa-solid fa-bolt",
    keys: [],
    practiceText: "the quick brown fox jumps over the lazy dog",
    practiceTextAr: "من جد وجد ومن زرع حصد العلم في الصغر كالنقش على الحجر",
  },
  {
    id: "punctuation",
    titleEn: "Punctuation",
    titleAr: "علامات الترقيم",
    descEn: "Periods, commas, apostrophes, and more",
    descAr: "النقاط والفواصل وعلامات الاستفهام",
    level: 3,
    icon: "fa-solid fa-pen-nib",
    keys: [".",",","!","?","'",'"',":",";"],
    practiceText: "Hello, world! It's great. What's your name? Yes: confirmed.",
    practiceTextAr: "مرحباً، كيف حالك؟ هذا رائع! نعم، بالتأكيد.",
  },
  {
    id: "code-basics",
    titleEn: "Coding Keys",
    titleAr: "مفاتيح البرمجة",
    descEn: "Essential symbols for developers: ()[]{}",
    descAr: "الرموز الأساسية للمطورين: ()[]{}",
    level: 4,
    icon: "fa-solid fa-code",
    keys: ["(",")","{","}","[","]","<",">","=","/","\\"],
    practiceText: "function hello() { return (true && false) ? [1,2] : {}; }",
    practiceTextAr: "دالة مرحبا() { إرجاع (صحيح); }",
  },
  {
    id: "professional",
    titleEn: "Professional Texts",
    titleAr: "النصوص الاحترافية",
    descEn: "Real-world texts: emails, reports, articles",
    descAr: "نصوص واقعية: إيميلات، تقارير، مقالات",
    level: 5,
    icon: "fa-solid fa-file-lines",
    keys: [],
    practiceText: "Dear team, please find attached the quarterly report. Best regards, Management.",
    practiceTextAr: "عزيزي الفريق، يرجى الاطلاع على التقرير المرفق. مع التحية، الإدارة.",
  },
];

const FINGER_MAP: Record<string, string> = {
  q: "L4", a: "L4", z: "L4",
  w: "L3", s: "L3", x: "L3",
  e: "L2", d: "L2", c: "L2",
  r: "L1", f: "L1", v: "L1", t: "L1", g: "L1", b: "L1",
  y: "R1", h: "R1", n: "R1", u: "R1", j: "R1", m: "R1",
  i: "R2", k: "R2", ",": "R2",
  o: "R3", l: "R3", ".": "R3",
  p: "R4", ";": "R4", "/": "R4",
};

const FINGER_NAMES: Record<string, { en: string; ar: string; color: string }> = {
  L4: { en: "Left Pinky", ar: "خنصر اليسار", color: "#e55656" },
  L3: { en: "Left Ring", ar: "بنصر اليسار", color: "#e5a256" },
  L2: { en: "Left Middle", ar: "وسطى اليسار", color: "#e2b714" },
  L1: { en: "Left Index", ar: "سبابة اليسار", color: "#4caf7d" },
  R1: { en: "Right Index", ar: "سبابة اليمين", color: "#56c8e5" },
  R2: { en: "Right Middle", ar: "وسطى اليمين", color: "#7d56e5" },
  R3: { en: "Right Ring", ar: "بنصر اليمين", color: "#e556c8" },
  R4: { en: "Right Pinky", ar: "خنصر اليمين", color: "#a256e5" },
};

export default function LearnPage({ settings }: LearnPageProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [practicingKey, setPracticingKey] = useState<string | null>(null);
  const isAr = settings.language === "ar";

  const levels = [1, 2, 3, 4, 5];

  if (selectedLesson) {
    return (
      <div className="animate-fadeIn" style={{ maxWidth: "900px", margin: "0 auto", direction: isAr ? "rtl" : "ltr" }}>
        <button
          onClick={() => setSelectedLesson(null)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "13px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: isAr ? "var(--font-arabic)" : "inherit",
          }}
        >
          ← {isAr ? "العودة للدروس" : "back to lessons"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <span style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(232,175,71,0.15)", border: "1px solid rgba(232,175,71,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", color: "var(--accent)" }}>
            <i className={selectedLesson.icon} />
          </span>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
              {isAr ? selectedLesson.titleAr : selectedLesson.titleEn}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
              {isAr ? selectedLesson.descAr : selectedLesson.descEn}
            </p>
          </div>
        </div>

        {/* Key Guide */}
        {selectedLesson.keys.length > 0 && (
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {isAr ? "المفاتيح المستهدفة" : "target keys"}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
              {selectedLesson.keys.map((key) => {
                const finger = FINGER_MAP[key.toLowerCase()];
                const fingerInfo = finger ? FINGER_NAMES[finger] : null;
                return (
                  <div
                    key={key}
                    onClick={() => setPracticingKey(practicingKey === key ? null : key)}
                    style={{
                      background: practicingKey === key ? "rgba(226,183,20,0.15)" : "var(--bg-card)",
                      border: `2px solid ${practicingKey === key ? "var(--accent)" : fingerInfo ? fingerInfo.color + "40" : "var(--border)"}`,
                      borderRadius: "10px",
                      padding: "12px 16px",
                      cursor: "pointer",
                      textAlign: "center",
                      minWidth: "60px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ fontSize: "24px", fontFamily: "var(--font-mono)", fontWeight: "700", color: fingerInfo ? fingerInfo.color : "var(--text-primary)" }}>
                      {key}
                    </div>
                    {fingerInfo && (
                      <div style={{ fontSize: "10px", color: fingerInfo.color, marginTop: "4px", opacity: 0.8 }}>
                        {isAr ? fingerInfo.ar : fingerInfo.en}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Practice Text */}
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isAr ? "نص التدريب" : "practice text"}
          </h3>
          <p style={{
            fontSize: "20px",
            color: "var(--text-primary)",
            lineHeight: "2",
            fontFamily: isAr ? "var(--font-arabic)" : "var(--font-mono)",
            direction: isAr ? "rtl" : "ltr",
            letterSpacing: isAr ? "0" : "0.05em",
          }}>
            {isAr ? selectedLesson.practiceTextAr : selectedLesson.practiceText}
          </p>
        </div>

        <div
          style={{
            background: "rgba(226,183,20,0.06)",
            border: "1px solid rgba(226,183,20,0.2)",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "20px", color: "var(--accent)", display: "flex", alignItems: "center" }}><i className="fa-solid fa-lightbulb" /></span>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
            {isAr
              ? "انتقل لتبويب الاختبار وابدأ الكتابة بعد حفظ المفاتيح. التدريب المتكرر هو السر!"
              : "Switch to the Test tab and start typing after memorizing the keys. Repetition is the key to mastery!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn" style={{ maxWidth: "900px", margin: "0 auto", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
          {isAr ? "مسار التعلم" : "Learning Path"}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
          {isAr ? "اتبع الدروس بالترتيب لتبني أساساً قوياً في الطباعة" : "Follow lessons in order to build a solid typing foundation"}
        </p>
      </div>

      {levels.map((level) => {
        const levelLessons = LESSONS.filter((l) => l.level === level);
        return (
          <div key={level} style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: level === 1 ? "var(--accent)" : "var(--bg-card)",
                border: level === 1 ? "none" : "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "700",
                color: level === 1 ? "#0f0f14" : "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
              }}>
                {level}
              </div>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {isAr ? `المستوى ${level}` : `Level ${level}`}
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
              {levelLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  id={`lesson-${lesson.id}`}
                  onClick={() => setSelectedLesson(lesson)}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "16px 18px",
                    cursor: "pointer",
                    textAlign: isAr ? "right" : "left",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)";
                  }}
                >
                  <span style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "rgba(232,175,71,0.1)",
                    border: "1px solid rgba(232,175,71,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    color: "var(--accent)",
                    flexShrink: 0,
                  }}>
                    <i className={lesson.icon} />
                  </span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "4px", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
                      {isAr ? lesson.titleAr : lesson.titleEn}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", fontFamily: isAr ? "var(--font-arabic)" : "inherit" }}>
                      {isAr ? lesson.descAr : lesson.descEn}
                    </div>
                    {lesson.keys.length > 0 && (
                      <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
                        {lesson.keys.slice(0, 6).map((k) => (
                          <span key={k} style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            padding: "1px 6px",
                            fontSize: "11px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-muted)",
                          }}>
                            {k}
                          </span>
                        ))}
                        {lesson.keys.length > 6 && (
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", alignSelf: "center" }}>
                            +{lesson.keys.length - 6}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
