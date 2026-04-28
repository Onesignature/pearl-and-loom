"use client";

import { useI18n } from "@/lib/i18n/provider";

interface LessonCardProps {
  index: number;
  title: string;
  state: "available" | "locked" | "completed";
  onClick?: () => void;
}

export function LessonCard({ index, title, state, onClick }: LessonCardProps) {
  const { fmt, lang, dir, t } = useI18n();
  const locked = state === "locked";
  return (
    <button
      onClick={onClick}
      disabled={locked || !onClick}
      className="lesson-card paper-bg"
      style={{ opacity: locked ? 0.5 : 1 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          className="font-display"
          style={{
            fontSize: 32,
            color: locked ? "var(--ink-soft)" : "var(--madder)",
            width: 38,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {fmt(index)}
        </div>
        <div style={{ flex: 1, textAlign: "start" }}>
          <div
            style={{
              fontFamily:
                lang === "ar"
                  ? "var(--font-tajawal), sans-serif"
                  : "var(--font-cormorant), serif",
              fontSize: 18,
              color: "var(--ink)",
              lineHeight: 1.2,
              letterSpacing: lang === "ar" ? "0" : "0.04em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--ink-soft)",
              marginTop: 4,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {locked ? `🔒 ${t("loom.locked")}` : t("loom.plusOneRow")}
          </div>
        </div>
        {!locked && (
          <div
            style={{
              color: "var(--saffron)",
              fontSize: 22,
              transform: dir === "rtl" ? "scaleX(-1)" : "none",
            }}
          >
            →
          </div>
        )}
      </div>
      <style>{`
        .lesson-card {
          padding: 16px 20px;
          cursor: pointer;
          font-family: var(--font-tajawal), sans-serif;
          transition: transform 0.3s var(--ease-loom), box-shadow 0.3s;
          border-radius: 0;
          border: none;
          width: 100%;
          text-align: start;
        }
        .lesson-card:hover:not(:disabled) {
          transform: translateX(4px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .lesson-card:disabled { cursor: not-allowed; }
      `}</style>
    </button>
  );
}
