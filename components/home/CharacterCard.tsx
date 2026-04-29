"use client";

import { useI18n } from "@/lib/i18n/provider";
import { SaifPortrait } from "@/components/portraits/Portraits";
import { CinematicLaylaPortrait } from "@/components/portraits/CinematicLaylaPortrait";
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
      <div
        className="char-portrait"
        style={{
          position: "relative",
          height: 240,
          overflow: "hidden",
        }}
      >
        {isLayla ? <CinematicLaylaPortrait /> : <SaifPortrait />}
      </div>
      <div className="char-body" style={{ padding: "16px 22px 20px" }}>
        <div
          className="font-display char-name"
          style={{
            fontSize: 30,
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
          className="char-role"
          style={{
            fontSize: 11,
            color: isLayla ? "var(--saffron)" : "var(--sunset-gold)",
            marginTop: 6,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {t(roleKey)}
        </div>
        <div
          className="char-tagline"
          style={{
            fontSize: 12,
            color: "rgba(240,228,201,0.65)",
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          {t(taglineKey)}
        </div>
        {progress && (
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              color: "var(--wool)",
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: 24,
                color: isLayla ? "var(--saffron)" : "var(--sunset-gold)",
                lineHeight: 1,
              }}
            >
              {fmt(progress.current)}
            </span>
            <span style={{ fontSize: 11, opacity: 0.6 }}>
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
          width: 308px;
          flex: 0 0 auto;
          overflow: hidden;
          font-family: var(--font-tajawal), sans-serif;
          transition: transform 0.4s var(--ease-loom), border-color 0.3s;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        @media (max-width: 720px) {
          .char-card {
            width: min(308px, 100%);
          }
        }
        @media (max-width: 480px) {
          .char-portrait { height: 180px !important; }
          .char-name { font-size: 26px !important; }
          .char-role { font-size: 10px !important; margin-top: 4px !important; }
          .char-tagline { font-size: 11px !important; margin-top: 6px !important; }
          .char-body { padding: 12px 16px 16px !important; }
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
