"use client";

// HikmaCounter — saffron pill that shows the learner's running ✦ score
// in the header. The number is a pure derivation from progress state.
// On every change the displayed number tweens from the prior value to
// the new one (spring-eased), and the chip flashes a brief saffron halo
// — a small but observable feedback loop the kid notices the first time
// a lesson lands. Reduced-motion: tween + flash both disabled.
//
// All animations are driven by framer motion values + imperative
// `animate()` calls so we never do setState inside an effect — React 19
// strict mode lints that and rightly so.

import { useEffect, useMemo, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { computeHikma, hikmaTier } from "@/lib/hikma/points";

export function HikmaCounter() {
  const { t, fmt, lang } = useI18n();
  const loomLessonsCompleted = useProgress((s) => s.loomLessonsCompleted);
  const pearls = useProgress((s) => s.pearls);
  const achievements = useProgress((s) => s.achievements);
  const streak = useProgress((s) => s.streak);
  const reduce = useReducedMotion();

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

  // Spring-tween the displayed number across point changes.
  const numberMV = useMotionValue(points);
  const rounded = useTransform(numberMV, (v) => Math.round(v));
  const formatted = useTransform(rounded, (v) => fmt(v));

  // Imperative motion values for the flash halo + spark pulse — driven
  // straight from the effect so we never need to call setState during
  // a render cycle.
  const flashOpacity = useMotionValue(0);
  const flashScale = useMotionValue(0.92);
  const sparkScale = useMotionValue(1);

  const prev = useRef(points);

  useEffect(() => {
    if (prev.current === points) return;
    if (reduce) {
      numberMV.set(points);
      prev.current = points;
      return;
    }
    const numberCtl = animate(numberMV, points, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    });
    // Halo: punch in then fade out + grow.
    flashOpacity.set(0.95);
    flashScale.set(0.92);
    const opacityCtl = animate(flashOpacity, 0, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    });
    const scaleCtl = animate(flashScale, 1.18, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    });
    // Spark: brief pulse.
    const sparkCtl = animate(sparkScale, [1, 1.32, 1], {
      duration: 0.55,
      ease: "easeInOut",
    });
    prev.current = points;
    return () => {
      numberCtl.stop();
      opacityCtl.stop();
      scaleCtl.stop();
      sparkCtl.stop();
    };
  }, [points, numberMV, flashOpacity, flashScale, sparkScale, reduce]);

  return (
    <div
      className="hikma-chip"
      title={`${tierLabel} · ${points} ${t("hikma.points")}`}
    >
      <motion.span
        aria-hidden
        className="hikma-flash"
        style={{ opacity: flashOpacity, scale: flashScale }}
      />
      <motion.span
        className="hikma-spark"
        aria-hidden
        style={{ scale: sparkScale }}
      >
        ✦
      </motion.span>
      <motion.span className="hikma-number">{formatted}</motion.span>
      <span className="hikma-tier" aria-label={t("hikma.label")}>
        {tierLabel}
      </span>

      <style>{`
        .hikma-chip {
          position: relative;
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
          overflow: visible;
        }
        .hikma-flash {
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          background: radial-gradient(
            ellipse at center,
            rgba(244,200,90,0.55),
            rgba(244,200,90,0.18) 55%,
            transparent 75%
          );
          pointer-events: none;
          z-index: 0;
          opacity: 0;
        }
        .hikma-spark {
          color: var(--saffron);
          font-size: 14px;
          text-shadow: 0 0 8px rgba(232,163,61,0.55);
          z-index: 1;
        }
        .hikma-number {
          font-weight: 600;
          color: var(--saffron);
          letter-spacing: 0.04em;
          z-index: 1;
          /* Tabular numerals so the value doesn't jiggle horizontally
             as digits change width during the tween. */
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          min-width: 1.6em;
          text-align: end;
        }
        .hikma-tier {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,228,201,0.65);
          padding-inline-start: 8px;
          border-inline-start: 1px solid rgba(232,163,61,0.3);
          z-index: 1;
        }
        ${lang === "ar" ? `.hikma-chip { font-family: var(--font-tajawal), sans-serif; }` : ""}
        @media (max-width: 900px) {
          .hikma-tier { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hikma-flash { display: none; }
        }
      `}</style>
    </div>
  );
}
