"use client";

// HikmaCounter — saffron pill that shows the learner's running ✦ score
// in the header. The number is a pure derivation from progress state, so
// it updates live as lessons + dives fire. Tier badge
// ("Novice / Weaver / Diver / Master") gives a visible level reading
// without inventing a new notion of "level" — it's just a re-projection
// of the same hikma total.

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { computeHikma, hikmaTier } from "@/lib/hikma/points";

export function HikmaCounter() {
  const { t, fmt, lang } = useI18n();
  const loomLessonsCompleted = useProgress((s) => s.loomLessonsCompleted);
  const pearls = useProgress((s) => s.pearls);
  const achievements = useProgress((s) => s.achievements);
  const streak = useProgress((s) => s.streak);

  const points = useMemo(
    () =>
      computeHikma({
        loomLessonsCompleted,
        pearls,
        achievements,
        streak,
      }),
    [loomLessonsCompleted, pearls, achievements, streak],
  );

  const tier = hikmaTier(points);
  const tierLabel = t(`hikma.tier.${tier}` as never);

  return (
    <div className="hikma-chip" title={`${tierLabel} · ${points} ${t("hikma.points")}`}>
      <span className="hikma-spark" aria-hidden>
        ✦
      </span>
      <span className="hikma-number">{fmt(points)}</span>
      <span className="hikma-tier" aria-label={t("hikma.label")}>
        {tierLabel}
      </span>

      <style>{`
        .hikma-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: linear-gradient(180deg, rgba(48,30,18,0.78) 0%, rgba(20,12,8,0.78) 100%);
          border: 1px solid rgba(232,163,61,0.55);
          border-radius: 999px;
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          letter-spacing: 0.04em;
          line-height: 1;
          min-height: 40px;
          backdrop-filter: blur(10px);
          box-shadow:
            inset 0 1px 0 rgba(245,235,211,0.06),
            0 0 14px rgba(232,163,61,0.18);
        }
        .hikma-spark {
          color: var(--saffron);
          font-size: 14px;
          text-shadow: 0 0 8px rgba(232,163,61,0.55);
        }
        .hikma-number {
          font-weight: 600;
          color: var(--saffron);
          letter-spacing: 0.04em;
        }
        .hikma-tier {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,228,201,0.65);
          padding-inline-start: 8px;
          border-inline-start: 1px solid rgba(232,163,61,0.3);
        }
        ${lang === "ar" ? `.hikma-chip { font-family: var(--font-tajawal), sans-serif; }` : ""}
        @media (max-width: 900px) {
          .hikma-tier { display: none; }
        }
      `}</style>
    </div>
  );
}
