"use client";

// Confetti — pure-CSS celebratory burst. ~36 colored rectangles drop
// from the top edge with randomised horizontal drift, rotation, and
// timing so the animation reads as natural rather than mechanical.
// Two themed palettes so Saif's celebration leans sea-and-sun and
// Layla's leans saffron-and-madder.

import { useMemo } from "react";

interface Props {
  /** Render N pieces. Default 36 — enough density without thrashing the GPU. */
  count?: number;
  /** Total animation duration in seconds. Default 3.2. */
  durationSec?: number;
  /** "layla" for warm saffron mix, "saif" for sea-and-sun mix. */
  theme?: "layla" | "saif";
}

const PALETTES: Record<NonNullable<Props["theme"]>, string[]> = {
  layla: [
    "var(--saffron)",
    "var(--saffron-soft)",
    "var(--wool)",
    "var(--madder)",
    "#F4C783",
    "#1B2D5C",
  ],
  saif: [
    "var(--sunset-gold)",
    "#F4C783",
    "var(--foam)",
    "#1B6478",
    "#0E5E7B",
    "#F4D77A",
  ],
};

interface Piece {
  left: number; // %
  delay: number; // s
  duration: number; // s
  rotate: number; // deg start
  rotateEnd: number; // deg end
  color: string;
  width: number; // px
  height: number; // px
  drift: number; // px horizontal sway amplitude
}

// Deterministic pseudo-random so the visual rhythm is consistent but
// readable — we don't actually need crypto-grade randomness here.
function seedPieces(count: number, palette: string[]): Piece[] {
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    const r = (n: number) => {
      const x = Math.sin(i * 9301 + n * 49297) * 233280;
      return x - Math.floor(x);
    };
    pieces.push({
      left: r(1) * 100,
      delay: r(2) * 0.6,
      duration: 2.4 + r(3) * 1.4,
      rotate: r(4) * 360,
      rotateEnd: r(5) * 720 - 360,
      color: palette[Math.floor(r(6) * palette.length)],
      width: 6 + r(7) * 8,
      height: 8 + r(8) * 12,
      drift: (r(9) - 0.5) * 160,
    });
  }
  return pieces;
}

export function Confetti({ count = 36, theme = "layla" }: Props) {
  const pieces = useMemo(
    () => seedPieces(count, PALETTES[theme]),
    [count, theme],
  );
  return (
    <div className="confetti-root" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            // Pass piece-specific values to the keyframes via custom props.
            ["--rot-start" as string]: `${p.rotate}deg`,
            ["--rot-end" as string]: `${p.rotateEnd}deg`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
      <style>{`
        .confetti-root {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 60;
        }
        .confetti-piece {
          position: absolute;
          top: -24px;
          display: block;
          border-radius: 2px;
          opacity: 0;
          animation-name: confettiFall;
          animation-timing-function: cubic-bezier(0.18, 0.7, 0.4, 1);
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }
        @keyframes confettiFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -10px, 0) rotate(var(--rot-start));
          }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% {
            opacity: 0;
            transform: translate3d(var(--drift), 105vh, 0) rotate(var(--rot-end));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .confetti-piece { animation: none !important; display: none; }
        }
      `}</style>
    </div>
  );
}
