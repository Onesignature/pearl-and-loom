"use client";

// Sadu seal — the project's signature loader. Two layered geometric
// motifs draw themselves in via stroked path-length animation, hold
// briefly, then unwind and repeat. Reads as a hand inking a Bedouin
// stamp on cloth. Used as the Suspense fallback on every route that
// needs one.
//
// Layers:
//   1. Outer six-point star (paired al-mthalath triangles, the most
//      ancient Sadu motif).
//   2. Inner al-eyoun diamond (the guardian eye, woven on tent
//      dividers).
//   3. Center pearl — fades in last, like the prize at the heart of the
//      cloth.
//
// Reduced-motion: the seal renders fully drawn, no pathLength cycle.

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  size?: number;
  caption?: string;
  /** "loom" tints saffron-on-charcoal; "sea" tints gold-on-deep-blue. */
  theme?: "loom" | "sea";
}

const THEMES = {
  loom: {
    bg: "rgba(20, 12, 8, 0.0)",
    stroke: "var(--saffron, #E8A33D)",
    pearl: "var(--saffron-soft, #F4C783)",
    glow: "rgba(232, 163, 61, 0.5)",
    captionColor: "var(--saffron, #E8A33D)",
  },
  sea: {
    bg: "rgba(5, 30, 44, 0.0)",
    stroke: "var(--sunset-gold, #F4B860)",
    pearl: "#FFE4B0",
    glow: "rgba(244, 184, 96, 0.6)",
    captionColor: "var(--sunset-gold, #F4B860)",
  },
} as const;

export function SaduSeal({
  size = 88,
  caption,
  theme = "loom",
}: Props) {
  const reduce = useReducedMotion();
  const t = THEMES[theme];

  // Cycle keyframes: draw in, hold, unwind, hold-empty, repeat.
  // Hold values + cubic-bezier give the pen a "considered" pause at the
  // top of each cycle.
  const drawCycle = reduce
    ? { pathLength: 1, opacity: 1 }
    : {
        pathLength: [0, 1, 1, 0, 0],
        opacity: [0.4, 1, 1, 0.5, 0.4],
      };

  const baseTransition = reduce
    ? { duration: 0 }
    : {
        duration: 3.4,
        repeat: Infinity,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        times: [0, 0.4, 0.55, 0.9, 1],
      };

  return (
    <div
      className="sadu-seal-wrap"
      role="status"
      aria-live="polite"
      aria-label={caption ?? "Loading"}
    >
      {/* Saffron radial glow behind the seal — breathes in sync with the
          draw cycle. */}
      <motion.div
        aria-hidden
        className="sadu-seal-glow"
        style={{ width: size * 1.8, height: size * 1.8, background: `radial-gradient(circle, ${t.glow} 0%, transparent 65%)` }}
        animate={reduce ? {} : { opacity: [0.45, 0.85, 0.45] }}
        transition={reduce ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="ltr-internal"
        style={{ position: "relative", overflow: "visible" }}
      >
        <defs>
          <radialGradient id="saduPearlGrad" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor={t.pearl} />
            <stop offset="100%" stopColor={t.stroke} />
          </radialGradient>
        </defs>

        {/* Layer 1 — outer six-point star (two overlapping triangles, the
            paired al-mthalath). Drawn first, holds the longest. */}
        <motion.path
          d="M 60 8 L 105 86 L 15 86 Z"
          stroke={t.stroke}
          strokeWidth={2.4}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          initial={false}
          animate={drawCycle}
          transition={baseTransition}
        />
        <motion.path
          d="M 60 112 L 15 34 L 105 34 Z"
          stroke={t.stroke}
          strokeWidth={2.4}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          initial={false}
          animate={drawCycle}
          transition={
            reduce
              ? { duration: 0 }
              : { ...baseTransition, delay: 0.18 }
          }
        />

        {/* Layer 2 — inner al-eyoun diamond. */}
        <motion.path
          d="M 60 32 L 88 60 L 60 88 L 32 60 Z"
          stroke={t.stroke}
          strokeWidth={2}
          strokeLinejoin="round"
          fill="none"
          initial={false}
          animate={drawCycle}
          transition={
            reduce
              ? { duration: 0 }
              : { ...baseTransition, delay: 0.32 }
          }
        />
        <motion.path
          d="M 60 44 L 76 60 L 60 76 L 44 60 Z"
          stroke={t.stroke}
          strokeWidth={1.4}
          strokeLinejoin="round"
          fill="none"
          opacity={0.6}
          initial={false}
          animate={drawCycle}
          transition={
            reduce
              ? { duration: 0 }
              : { ...baseTransition, delay: 0.46 }
          }
        />

        {/* Layer 3 — center pearl, fades in last. */}
        <motion.circle
          cx={60}
          cy={60}
          r={5}
          fill="url(#saduPearlGrad)"
          initial={false}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1, 1, 0.6] }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 3.4,
                  repeat: Infinity,
                  times: [0, 0.4, 0.55, 0.9, 1],
                  ease: "easeInOut",
                }
          }
          style={{ transformOrigin: "60px 60px", transformBox: "fill-box" } as React.CSSProperties}
        />
      </svg>

      {caption && (
        <div className="sadu-seal-caption" style={{ color: t.captionColor }}>
          {caption}
        </div>
      )}

      <style>{`
        .sadu-seal-wrap {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 8px;
        }
        .sadu-seal-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .sadu-seal-caption {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 12px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          opacity: 0.78;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}

/** Convenience full-page loader — use as a Suspense fallback. */
export function SaduSealFallback({
  theme = "loom",
  caption,
  background = "transparent",
}: {
  theme?: "loom" | "sea";
  caption?: string;
  background?: string;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
        zIndex: 80,
      }}
    >
      <SaduSeal size={96} theme={theme} caption={caption} />
    </div>
  );
}
