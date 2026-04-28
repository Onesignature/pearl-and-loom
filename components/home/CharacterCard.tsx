"use client";

import { useI18n } from "@/lib/i18n/provider";
import { LaylaPortrait, SaifPortrait } from "@/components/portraits/Portraits";
import type { DictPath } from "@/lib/i18n/provider";

interface CharacterCardProps {
  who: "layla" | "saif";
  onClick?: () => void;
  locked?: boolean;
  progress?: { current: number; total: number; label: DictPath };
}

export function CharacterCard({ who, onClick, locked = false, progress }: CharacterCardProps) {
  const { t, fmt, lang } = useI18n();
  const isLayla = who === "layla";
  const nameKey = (isLayla ? "home.layla.name" : "home.saif.name") as DictPath;
  const roleKey = (isLayla ? "home.layla.role" : "home.saif.role") as DictPath;
  const taglineKey = (isLayla ? "home.layla.tagline" : "home.saif.tagline") as DictPath;

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className="char-card"
      style={{
        background: isLayla
          ? "linear-gradient(170deg, #2C1F1A 0%, #1B2D5C 50%, #2A2522 100%)"
          : "linear-gradient(170deg, #08374A 0%, #0E5E7B 50%, #051E2C 100%)",
      }}
    >
      <div style={{ position: "relative", height: 360, overflow: "hidden" }}>
        {isLayla ? <LaylaPortrait /> : <SaifPortrait />}
      </div>
      <div style={{ padding: "22px 26px 26px" }}>
        <div
          className="font-display"
          style={{
            fontSize: 36,
            color: "var(--wool)",
            letterSpacing: "0.06em",
            lineHeight: 1,
            fontFamily:
              lang === "ar"
                ? "var(--font-tajawal), sans-serif"
                : "var(--font-cormorant), serif",
          }}
        >
          {t(nameKey)}
        </div>
        <div
          style={{
            fontSize: 12,
            color: isLayla ? "var(--saffron)" : "var(--sunset-gold)",
            marginTop: 8,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {t(roleKey)}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "rgba(240,228,201,0.65)",
            marginTop: 10,
            lineHeight: 1.6,
          }}
        >
          {t(taglineKey)}
        </div>
        {progress && (
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              color: "var(--wool)",
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: 28,
                color: isLayla ? "var(--saffron)" : "var(--sunset-gold)",
              }}
            >
              {fmt(progress.current)}
            </span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              / {fmt(progress.total)} {t(progress.label)}
            </span>
          </div>
        )}
      </div>
      <style>{`
        .char-card {
          border: 1px solid rgba(240,228,201,0.15);
          padding: 0;
          cursor: pointer;
          text-align: start;
          color: var(--wool);
          width: 360px;
          overflow: hidden;
          font-family: var(--font-tajawal), sans-serif;
          transition: transform 0.4s var(--ease-loom), border-color 0.3s;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .char-card:hover:not(:disabled) {
          transform: translateY(-4px);
          border-color: rgba(240,228,201,0.35);
        }
        .char-card:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </button>
  );
}
