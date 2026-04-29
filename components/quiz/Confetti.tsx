"use client";

// Confetti — framer-driven physics burst. ~36 colored shards launch
// from the upper-center with a randomised velocity, gravity-arc fall,
// rotation, and timed fade. Each piece has its own initial vector so
// the rhythm reads as natural rather than the lockstep "rectangles
// drift down" you get from a CSS-keyframe approach.
//
// Two themed palettes so Saif's celebration leans sea-and-sun and
// Layla's leans saffron-and-madder. Mixed shapes (rectangles, circles,
// diamonds) so the burst feels organic. Pure-deterministic seed so the
// visual is consistent across renders without being mechanical.
//
// Reduced-motion: renders nothing — celebration is implied by the page
// state, not the burst.

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface Props {
  /** Render N pieces. Default 40. */
  count?: number;
  /** "layla" for warm saffron mix, "saif" for sea-and-sun mix. */
  theme?: "layla" | "saif";
  /** Pixels above the launch point — used to seed the burst origin
   *  relative to the parent. The parent should be position: relative. */
}

const PALETTES: Record<NonNullable<Props["theme"]>, string[]> = {
  layla: [
    "var(--saffron, #E8A33D)",
    "var(--saffron-soft, #F4C783)",
    "var(--wool, #F0E4C9)",
    "var(--madder, #B5341E)",
    "#F4C783",
    "var(--indigo, #1B2D5C)",
  ],
  saif: [
    "var(--sunset-gold, #F4B860)",
    "#F4C783",
    "var(--foam, #F0F4F2)",
    "#1B6478",
    "#0E5E7B",
    "#F4D77A",
  ],
};

type Shape = "rect" | "circle" | "diamond";

interface Piece {
  startX: number; // px from center
  velocityX: number; // px end horizontal drift
  velocityY: number; // px end fall depth (negative = up first, then gravity)
  apex: number; // px peak rise above origin
  spinStart: number; // deg
  spinEnd: number; // deg
  delay: number; // s
  duration: number; // s
  size: number; // px
  shape: Shape;
  color: string;
}

function seedPieces(count: number, palette: string[]): Piece[] {
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random — sin-hash so the burst is consistent
    // across renders but reads as organic.
    const r = (n: number) => {
      const x = Math.sin(i * 9301 + n * 49297) * 233280;
      return x - Math.floor(x);
    };
    // Origin spread around horizontal center: ±60px
    const startX = (r(1) - 0.5) * 120;
    // End drift can be left-OR-right of start: ±260px
    const velocityX = (r(2) - 0.5) * 520;
    // Fall depth: 60–110vh below origin
    const velocityY = 600 + r(3) * 400;
    // Peak rise: 60–180px above origin (gives the gravity arc)
    const apex = 60 + r(4) * 120;
    const spinStart = (r(5) - 0.5) * 220;
    const spinEnd = spinStart + (r(6) - 0.5) * 1080;
    const delay = r(7) * 0.35;
    const duration = 1.8 + r(8) * 1.4;
    const size = 7 + r(9) * 9;
    const shapeRoll = r(10);
    const shape: Shape =
      shapeRoll < 0.55 ? "rect" : shapeRoll < 0.85 ? "diamond" : "circle";
    const color = palette[Math.floor(r(11) * palette.length)] ?? palette[0]!;
    pieces.push({
      startX,
      velocityX,
      velocityY,
      apex,
      spinStart,
      spinEnd,
      delay,
      duration,
      size,
      shape,
      color,
    });
  }
  return pieces;
}

export function Confetti({ count = 40, theme = "layla" }: Props) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () => seedPieces(count, PALETTES[theme]),
    [count, theme],
  );

  if (reduce) return null;

  return (
    <div className="confetti-root" aria-hidden>
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} piece={p} />
      ))}
      <style>{`
        .confetti-root {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 60;
        }
      `}</style>
    </div>
  );
}

function ConfettiPiece({ piece }: { piece: Piece }) {
  const radius = piece.shape === "circle" ? piece.size : 2;
  const aspect = piece.shape === "rect" ? 1.55 : 1;
  return (
    <motion.span
      initial={{
        x: piece.startX,
        y: 0,
        rotate: piece.spinStart,
        opacity: 0,
      }}
      animate={{
        // Three-keyframe arc: launch up, peak, then fall past viewport.
        x: [piece.startX, piece.startX + piece.velocityX * 0.45, piece.startX + piece.velocityX],
        y: [0, -piece.apex, piece.velocityY],
        rotate: [piece.spinStart, (piece.spinStart + piece.spinEnd) / 2, piece.spinEnd],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        delay: piece.delay,
        duration: piece.duration,
        // Slow ease-out on the way up, longer ease-in on the fall —
        // mirrors actual confetti gravity.
        ease: [0.18, 0.7, 0.4, 1],
        times: [0, 0.45, 1],
        opacity: {
          delay: piece.delay,
          duration: piece.duration,
          times: [0, 0.08, 0.85, 1],
          ease: "linear",
        },
      }}
      style={{
        position: "absolute",
        top: -28,
        left: "50%",
        width: piece.size * aspect,
        height: piece.size,
        background: piece.color,
        borderRadius: radius,
        transform: piece.shape === "diamond" ? "rotate(45deg)" : undefined,
        boxShadow: "0 1px 0 rgba(0,0,0,0.18)",
        willChange: "transform, opacity",
      }}
    />
  );
}
