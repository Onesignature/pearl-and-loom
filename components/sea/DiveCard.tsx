"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { DiveDef } from "@/app/sea/page";

export function DiveCard({ dive, onClick }: { dive: DiveDef; onClick?: () => void }) {
  const { t, fmt, lang, dir } = useI18n();
  const locked = dive.state === "locked";
  const completed = dive.state === "completed";
  return (
    <button
      onClick={onClick}
      disabled={locked || !onClick}
      className={`dive-card${completed ? " completed" : ""}${locked ? " locked" : ""}`}
      style={{ opacity: locked ? 0.5 : 1 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          className="font-display"
          style={{
            fontSize: 30,
            color: locked
              ? "#88A8B5"
              : completed
                ? "rgba(180,230,160,0.95)"
                : "var(--sunset-gold)",
            width: 38,
            textAlign: "center",
          }}
        >
          {fmt(dive.id)}
        </div>
        <div style={{ flex: 1, textAlign: "start" }}>
          <div
            style={{
              fontFamily:
                lang === "ar"
                  ? "var(--font-tajawal), sans-serif"
                  : "var(--font-cormorant), serif",
              fontSize: 16,
              color: "var(--foam)",
              lineHeight: 1.2,
            }}
          >
            {t(`sea.titles.${dive.key}` as never)}
          </div>
          <div
            style={{
              fontSize: 11,
              color: completed
                ? "rgba(180,230,160,0.9)"
                : "rgba(240,244,242,0.6)",
              marginTop: 4,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {locked
              ? `🔒 ${t("loom.locked")}`
              : completed
                ? `✓ ${t("loom.completed")}`
                : `${fmt(dive.depth)}m · 1 ${t("dive.pearls").toUpperCase()}`}
          </div>
        </div>
        {!locked && (
          <div
            style={{
              color: completed
                ? "rgba(180,230,160,0.95)"
                : "var(--sunset-gold)",
              fontSize: completed ? 18 : 22,
              transform: dir === "rtl" ? "scaleX(-1)" : "none",
            }}
          >
            {completed ? "↻" : "→"}
          </div>
        )}
      </div>
      <style>{`
        .dive-card {
          padding: 14px 18px;
          background: rgba(8,55,74,0.6);
          border: 1px solid rgba(240,244,242,0.18);
          border-radius: 14px;
          backdrop-filter: blur(10px);
          color: var(--foam);
          cursor: pointer;
          font-family: var(--font-tajawal), sans-serif;
          transition: transform 0.3s var(--ease-water), background 0.3s, border-color 0.3s;
          width: 100%;
          text-align: start;
        }
        .dive-card:hover:not(:disabled) {
          transform: translateX(-4px);
          background: rgba(14,94,123,0.8);
        }
        .dive-card:disabled { cursor: not-allowed; }
        .dive-card.completed {
          border-color: rgba(112,180,98,0.6);
          background: linear-gradient(180deg, rgba(86,150,80,0.18) 0%, rgba(8,55,74,0.6) 100%);
        }
        .dive-card.locked { border-color: rgba(240,244,242,0.10); }
      `}</style>
    </button>
  );
}
