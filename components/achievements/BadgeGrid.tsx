"use client";

// Grid of all achievement badges. Locked badges render as grayscale
// silhouettes with the cultural footnote hidden until the milestone fires.

import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { ACHIEVEMENTS } from "@/lib/achievements/registry";
import { MOTIF_COMPONENTS } from "@/components/motifs";

export function BadgeGrid() {
  const { lang } = useI18n();
  const unlocked = useProgress((s) => s.achievements);
  const totalUnlocked = unlocked.length;

  return (
    <div className="badge-section">
      <div className="badge-head">
        <div className="badge-eyebrow">
          {lang === "en" ? "Wasm · Sadu Badges" : "الوُسوم · شارات السدو"}
        </div>
        <div className="badge-count">
          {totalUnlocked} / {ACHIEVEMENTS.length}
        </div>
      </div>
      <div className="badge-grid">
        {ACHIEVEMENTS.map((a) => {
          const Motif = MOTIF_COMPONENTS[a.motif];
          const earned = unlocked.includes(a.id);
          return (
            <div
              key={a.id}
              className={`badge-tile${earned ? " earned" : " locked"}`}
              title={lang === "en" ? a.taglineEn : a.taglineAr}
            >
              <div className="badge-motif" aria-hidden>
                {Motif ? (
                  <Motif
                    w="100%"
                    h="100%"
                    fg={earned ? "var(--saffron)" : "rgba(240,228,201,0.18)"}
                    bg="transparent"
                  />
                ) : null}
              </div>
              <div className="badge-meta">
                <div className="badge-title">
                  {lang === "en" ? a.titleEn : a.titleAr}
                </div>
                <div className="badge-tagline">
                  {earned
                    ? lang === "en"
                      ? a.noteEn
                      : a.noteAr
                    : lang === "en"
                      ? a.taglineEn
                      : a.taglineAr}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .badge-section {
          width: 100%;
          max-width: 880px;
          margin: 32px auto 0;
          color: var(--wool);
        }
        .badge-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(232,163,61,0.25);
        }
        .badge-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.92;
        }
        .badge-count {
          font-family: var(--font-cormorant), serif;
          font-size: 14px;
          color: var(--saffron);
          letter-spacing: 0.16em;
        }
        .badge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .badge-tile {
          display: flex;
          gap: 12px;
          padding: 12px 14px;
          border: 1px solid rgba(232,163,61,0.22);
          background: rgba(245,235,211,0.04);
          transition: background 0.25s, border-color 0.25s;
          min-height: 80px;
          align-items: center;
        }
        .badge-tile.earned {
          border-color: rgba(232,163,61,0.7);
          background: rgba(232,163,61,0.10);
        }
        .badge-tile.locked { opacity: 0.55; }
        .badge-motif {
          flex: 0 0 auto;
          width: 56px;
          height: 38px;
          border: 1px solid rgba(232,163,61,0.18);
          background: rgba(0,0,0,0.25);
        }
        .badge-meta { flex: 1; min-width: 0; }
        .badge-title {
          font-family: var(--font-cormorant), serif;
          font-size: 14px;
          color: var(--wool);
          letter-spacing: 0.04em;
        }
        .badge-tile.earned .badge-title { color: var(--saffron); }
        .badge-tagline {
          font-size: 11px;
          color: rgba(240,228,201,0.6);
          line-height: 1.4;
          margin-top: 3px;
        }
        @media (max-width: 480px) {
          .badge-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
