"use client";

// Saffron-diamond chain showing the weave streak. Renders nothing until the
// streak is at least 1 (no shaming the new visitor). Appears at the top of
// the home stage, just under the navbar's ornament rule.

import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";

const VISIBLE_LINKS = 7;

export function StreakChain() {
  const { lang, fmt } = useI18n();
  const streak = useProgress((s) => s.streak);

  if (streak < 1) return null;

  const filled = Math.min(streak, VISIBLE_LINKS);
  const overflow = streak > VISIBLE_LINKS ? streak - VISIBLE_LINKS : 0;
  const dayWord =
    lang === "en"
      ? streak === 1
        ? "day weave streak"
        : "day weave streak"
      : streak === 1
        ? "يوم نسج"
        : "أيام نسج متتالية";

  return (
    <div className="streak-row" aria-label={`${streak} day weave streak`}>
      <div className="streak-chain" aria-hidden>
        {Array.from({ length: VISIBLE_LINKS }).map((_, i) => {
          const lit = i < filled;
          return (
            <svg key={i} width="14" height="14" viewBox="0 0 14 14">
              <path
                d="M 7 1 L 13 7 L 7 13 L 1 7 Z"
                fill={lit ? "var(--saffron)" : "rgba(232,163,61,0.18)"}
                stroke={lit ? "var(--saffron-soft)" : "rgba(232,163,61,0.3)"}
                strokeWidth="0.6"
              />
            </svg>
          );
        })}
        {overflow > 0 && (
          <span className="streak-overflow">+{fmt(overflow)}</span>
        )}
      </div>
      <div className="streak-label">
        <span className="streak-count">{fmt(streak)}</span>
        <span className="streak-word">{dayWord}</span>
      </div>
      <style>{`
        .streak-row {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 6px 14px;
          background: rgba(28,18,12,0.55);
          border: 1px solid rgba(232,163,61,0.32);
          backdrop-filter: blur(6px);
          color: var(--wool);
        }
        .streak-chain {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .streak-overflow {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          color: var(--saffron);
          letter-spacing: 0.18em;
          margin-inline-start: 4px;
        }
        .streak-label {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
        }
        .streak-count {
          font-family: var(--font-cormorant), serif;
          font-size: 16px;
          color: var(--saffron);
          line-height: 1;
        }
        .streak-word {
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(240,228,201,0.75);
        }
        @media (max-width: 480px) {
          .streak-row { padding: 4px 10px; gap: 10px; }
          .streak-word { font-size: 9px; letter-spacing: 0.18em; }
        }
      `}</style>
    </div>
  );
}
