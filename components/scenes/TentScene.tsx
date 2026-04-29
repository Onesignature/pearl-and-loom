"use client";

// Tent scene backdrop. Three time-of-day palettes — dusk (default), day,
// and dawn (unlocked from the souk's "Dawn Sky for the Tent" heirloom).
// When the brass-lantern heirloom is owned, an extra hung lantern element
// is rendered above the right-hand cushion as warm punctuation.

import { useSoukEffects } from "@/lib/souk/effects";

interface TentSceneProps {
  time?: "dusk" | "day" | "dawn";
  children?: React.ReactNode;
}

const PALETTE: Record<NonNullable<TentSceneProps["time"]>, string> = {
  dusk: "radial-gradient(ellipse 100% 80% at 50% 70%, #3D2A1E 0%, #1A130D 60%, #0A0805 100%)",
  day: "radial-gradient(ellipse 100% 80% at 50% 70%, #2A1810 0%, #0F0A06 70%, #050302 100%)",
  dawn: "radial-gradient(ellipse 100% 80% at 50% 75%, #4A2D1F 0%, #5C2D2A 30%, #2A1830 60%, #0E1228 100%)",
};

export function TentScene({ time = "dusk", children }: TentSceneProps) {
  const { dawnSky, brassLantern } = useSoukEffects();
  // Owned dawn-sky heirloom upgrades the default dusk to a dawn palette
  // on every TentScene-rendered surface (home, loom, chest, tapestry).
  const effectiveTime: NonNullable<TentSceneProps["time"]> =
    dawnSky && time === "dusk" ? "dawn" : time;
  const bg = PALETTE[effectiveTime];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        background: bg,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Ambient lantern glow — left, large */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineStart: "8%",
          top: "12%",
          width: 380,
          height: 380,
          background:
            effectiveTime === "dawn"
              ? "radial-gradient(circle, rgba(244,184,96,0.18) 0%, rgba(232,120,86,0.10) 40%, transparent 70%)"
              : "radial-gradient(circle, rgba(244,184,96,0.32) 0%, rgba(232,163,61,0.08) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Ambient lantern glow — right, smaller */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineEnd: "10%",
          bottom: "20%",
          width: 280,
          height: 280,
          background:
            "radial-gradient(circle, rgba(244,184,96,0.22) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Brass pearling lantern — hung from a rope, gentle sway. Renders
          only when the heirloom is owned. Sits above the right cushion. */}
      {brassLantern && <BrassLantern />}

      {/* Tent fabric drape */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "30%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 300"
      >
        <path
          d="M 0 0 L 0 100 Q 200 70 400 90 Q 683 60 966 90 Q 1166 70 1366 100 L 1366 0 Z"
          fill="rgba(0,0,0,0.6)"
        />
        <path
          d="M 0 100 Q 200 70 400 90 Q 683 60 966 90 Q 1166 70 1366 100"
          stroke="#5A4030"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Floor cushions hint */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "20%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 200"
      >
        <ellipse cx="200" cy="200" rx="220" ry="40" fill="#8C2614" opacity="0.3" />
        <ellipse cx="1166" cy="200" rx="220" ry="40" fill="#1B2D5C" opacity="0.4" />
      </svg>

      {children}
    </div>
  );
}

/** Brass pearling lantern hung from the tent ridge. Owned via the
 *  "heirloom.brass-lantern" souk item. Animated gentle sway + flame flicker. */
function BrassLantern() {
  return (
    <>
      <svg
        aria-hidden
        className="brass-lantern"
        style={{
          position: "absolute",
          insetInlineEnd: "16%",
          top: 0,
          width: 92,
          height: 220,
          pointerEvents: "none",
          filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))",
        }}
        viewBox="0 0 92 220"
      >
        <defs>
          <linearGradient id="brassBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8C36A" />
            <stop offset="50%" stopColor="#A07832" />
            <stop offset="100%" stopColor="#5A4218" />
          </linearGradient>
          <radialGradient id="brassFlame" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#FFE9B8" stopOpacity="1" />
            <stop offset="40%" stopColor="#F4B860" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="brassHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(244,184,96,0.55)" />
            <stop offset="100%" stopColor="rgba(244,184,96,0)" />
          </radialGradient>
        </defs>

        {/* Hanging rope */}
        <line x1="46" y1="0" x2="46" y2="60" stroke="#5A4030" strokeWidth="1.4" />

        {/* Halo behind the lantern */}
        <circle cx="46" cy="120" r="58" fill="url(#brassHalo)" />

        {/* Lantern body — gentle sway via group transform */}
        <g className="brass-lantern-sway" style={{ transformOrigin: "46px 60px" }}>
          {/* Crown ring */}
          <ellipse cx="46" cy="62" rx="14" ry="3" fill="url(#brassBody)" />
          <rect x="32" y="62" width="28" height="6" fill="url(#brassBody)" />

          {/* Glass cage — vertical brass bars */}
          <rect x="26" y="68" width="40" height="76" fill="rgba(60,30,10,0.45)" />
          <rect x="26" y="68" width="40" height="76" fill="none" stroke="url(#brassBody)" strokeWidth="1.2" />
          {[34, 42, 50, 58].map((x) => (
            <line key={x} x1={x} y1="68" x2={x} y2="144" stroke="url(#brassBody)" strokeWidth="0.7" />
          ))}
          <line x1="26" y1="100" x2="66" y2="100" stroke="url(#brassBody)" strokeWidth="0.7" opacity="0.5" />
          <line x1="26" y1="118" x2="66" y2="118" stroke="url(#brassBody)" strokeWidth="0.7" opacity="0.5" />

          {/* Flame inside */}
          <ellipse cx="46" cy="108" rx="10" ry="22" fill="url(#brassFlame)">
            <animate
              attributeName="ry"
              values="22;19;22;24;22"
              dur="1.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.95;0.8;1;0.85;0.95"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </ellipse>
          <circle cx="46" cy="116" r="3" fill="#FFE9B8" />

          {/* Base */}
          <rect x="30" y="144" width="32" height="6" fill="url(#brassBody)" />
          <ellipse cx="46" cy="152" rx="18" ry="3" fill="url(#brassBody)" />
          <ellipse cx="46" cy="156" rx="6" ry="2" fill="#3D2C10" />
        </g>
      </svg>
      <style>{`
        @keyframes brassSway {
          0%,100% { transform: rotate(-1.5deg); }
          50%     { transform: rotate( 1.5deg); }
        }
        .brass-lantern-sway {
          animation: brassSway 5.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .brass-lantern-sway { animation: none; }
        }
      `}</style>
    </>
  );
}
