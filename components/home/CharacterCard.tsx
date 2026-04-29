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
  /** When true, show a "Recommended for you" saffron pill above the portrait. */
  recommended?: boolean;
  /** True once the learner has finished the path's final quiz. */
  completed?: boolean;
  /** Best quiz score / 5, surfaced under the completed badge. */
  quizScore?: number | null;
}

export function CharacterCard({
  who,
  onClick,
  locked = false,
  progress,
  recommended = false,
  completed = false,
  quizScore = null,
}: CharacterCardProps) {
  const { t, fmt, lang } = useI18n();
  const isLayla = who === "layla";
  const nameKey = (isLayla ? "home.layla.name" : "home.saif.name") as DictPath;
  const roleKey = (isLayla ? "home.layla.role" : "home.saif.role") as DictPath;
  const taglineKey = (isLayla ? "home.layla.tagline" : "home.saif.tagline") as DictPath;

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`char-card${recommended ? " char-card--recommended" : ""}${completed ? " char-card--completed" : ""}`}
      style={{
        background: isLayla
          ? "linear-gradient(170deg, #2C1F1A 0%, #1B2D5C 50%, #2A2522 100%)"
          : "linear-gradient(170deg, #08374A 0%, #0E5E7B 50%, #051E2C 100%)",
      }}
    >
      {recommended && !completed && (
        <div className="char-recommended" aria-hidden>
          {lang === "en" ? "Recommended for you" : "موصى لك"}
        </div>
      )}
      {completed && (
        <div className="char-completed" aria-hidden>
          <span className="char-completed-glyph">✓</span>
          <span className="char-completed-text">
            {lang === "en" ? "Completed" : "مكتمل"}
            {quizScore !== null && (
              <span className="char-completed-score">
                {" "}
                · {fmt(quizScore)}/{fmt(5)}
              </span>
            )}
          </span>
        </div>
      )}
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
          position: relative;
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
        .char-card--recommended {
          border-color: rgba(232,163,61,0.55);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 0 0 1px rgba(232,163,61,0.35);
        }
        .char-recommended {
          position: absolute;
          top: 10px;
          inset-inline-end: 10px;
          z-index: 5;
          padding: 5px 10px;
          border-radius: 999px;
          background: linear-gradient(180deg, var(--saffron-soft) 0%, var(--saffron) 100%);
          color: var(--charcoal);
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(232,163,61,0.36);
        }
        .char-card--completed {
          border-color: rgba(112,180,98,0.65);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 0 0 1px rgba(112,180,98,0.35),
            0 0 24px rgba(112,180,98,0.18);
        }
        .char-completed {
          position: absolute;
          top: 10px;
          inset-inline-end: 10px;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px 5px 6px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(140,200,120,0.95) 0%, rgba(86,150,80,0.95) 100%);
          color: #fff;
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
          box-shadow:
            0 4px 14px rgba(86,150,80,0.45),
            inset 0 1px 0 rgba(225,245,210,0.5);
        }
        .char-completed-glyph {
          width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.22);
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0;
        }
        .char-completed-text { line-height: 1; }
        .char-completed-score {
          opacity: 0.85;
          font-weight: 500;
        }
        [dir="rtl"] .char-completed {
          padding: 5px 6px 5px 12px;
        }
      `}</style>
    </button>
  );
}
