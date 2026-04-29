"use client";

// DiveConceptVisual — small animated SVG diagram tied to each dive's
// theme. Used in two surfaces:
//   1. PreDive  — as a "Today's lesson" preview pane so each dive's
//                 entry screen feels distinct.
//   2. DiveScene's ProblemOverlay — as the concept diagram beside the
//                 question, so the kid has something visual to anchor
//                 the answer to instead of pure text.
//
// Each variant is ~50 lines of SVG with subtle CSS keyframe motion,
// honoring prefers-reduced-motion. No images, no third-party libs.

import type { DiveKey } from "@/app/sea/page";

interface Props {
  diveKey: DiveKey;
  /** Optional depth (5/10/15) — only Pressure honors it for the
   *  drop-line marker. Other variants ignore. */
  depth?: number;
  /** Layout density: "full" for predive preview, "compact" for the
   *  in-question diagram so it sits above the answer grid. */
  size?: "full" | "compact";
}

export function DiveConceptVisual({ diveKey, depth, size = "full" }: Props) {
  return (
    <div className={`dcv dcv-${size}`}>
      {diveKey === "shallowBank" && <BuoyancyDiagram />}
      {diveKey === "deepReef" && <PressureDiagram depth={depth} />}
      {diveKey === "coralGarden" && <FilterFeedDiagram />}
      {diveKey === "lungOfSea" && <BreathDiagram />}
      {diveKey === "refractionTrial" && <RefractionDiagram />}
      <style>{`
        .dcv {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          overflow: hidden;
          /* Soft tinted frame so the diagram reads as part of the
             concept pane, not a separate tile pasted in. */
          background: linear-gradient(180deg, rgba(8,55,74,0.4) 0%, rgba(5,30,44,0.6) 100%);
          box-shadow: inset 0 0 0 1px rgba(244,184,96,0.18);
        }
        .dcv > svg { width: 100%; height: auto; display: block; }
        .dcv-full > svg { max-width: 100%; }
        .dcv-compact > svg { max-width: 100%; }
        @media (prefers-reduced-motion: reduce) {
          .dcv * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Shallow Bank — buoyancy. A water tank with three objects sitting at
 *  the depth their density commands: a hollow body (top), a balanced
 *  body+stone (middle), a heavy stone (bottom). Up-arrows show
 *  buoyancy, down-arrows gravity. Gentle sway sells "in water". */
function BuoyancyDiagram() {
  return (
    <svg viewBox="0 0 360 180" className="ltr-internal">
      <defs>
        <linearGradient id="dcvWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B6478" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#08374A" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="360" height="36" fill="rgba(244,184,96,0.10)" />
      <text x="14" y="22" fill="#F4B860" fontSize="9" letterSpacing="2" opacity="0.9">
        SURFACE
      </text>

      <rect x="0" y="36" width="360" height="144" fill="url(#dcvWater)" />

      {/* Wave motion */}
      <path
        d="M 20 38 Q 60 34 100 38 T 180 38 T 260 38 T 340 38"
        stroke="#F0F4F2"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
        className="dcv-wave"
      />

      {/* Object 1 — body floating near surface (less dense than water) */}
      <g className="dcv-float dcv-float-1">
        <ellipse cx="80" cy="55" rx="14" ry="6" fill="#C9956A" />
        <text x="80" y="76" textAnchor="middle" fontSize="8" fill="#F0F4F2" opacity="0.7">FLOATS</text>
        <line x1="80" y1="40" x2="80" y2="48" stroke="#F4D77A" strokeWidth="1.2" markerEnd="url(#dcvUp)" />
      </g>

      {/* Object 2 — body + stone, balanced mid-depth */}
      <g className="dcv-float dcv-float-2">
        <ellipse cx="180" cy="100" rx="14" ry="6" fill="#C9956A" />
        <ellipse cx="180" cy="112" rx="10" ry="6" fill="#5A3618" />
        <text x="180" y="130" textAnchor="middle" fontSize="8" fill="#F0F4F2" opacity="0.7">SINKS SLOWLY</text>
        <line x1="180" y1="86" x2="180" y2="92" stroke="#F4D77A" strokeWidth="1.2" markerEnd="url(#dcvUp)" />
        <line x1="180" y1="120" x2="180" y2="126" stroke="#E07856" strokeWidth="1.2" markerEnd="url(#dcvDown)" />
      </g>

      {/* Object 3 — heavy stone, bottom (much denser) */}
      <g className="dcv-float dcv-float-3">
        <ellipse cx="280" cy="148" rx="12" ry="7" fill="#3D2517" />
        <text x="280" y="165" textAnchor="middle" fontSize="8" fill="#F0F4F2" opacity="0.7">SINKS FAST</text>
        <line x1="280" y1="138" x2="280" y2="143" stroke="#F4D77A" strokeWidth="1.0" markerEnd="url(#dcvUp)" />
      </g>

      <defs>
        <marker id="dcvUp" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 3 0 L 6 6 L 0 6 Z" fill="#F4D77A" />
        </marker>
        <marker id="dcvDown" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 3 6 L 0 0 L 6 0 Z" fill="#E07856" />
        </marker>
      </defs>

      <style>{`
        .dcv-wave { animation: dcvWaveSlide 5s linear infinite; }
        @keyframes dcvWaveSlide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        .dcv-float { animation: dcvFloatSway 4.2s ease-in-out infinite; transform-origin: center; }
        .dcv-float-2 { animation-delay: 0.6s; }
        .dcv-float-3 { animation-delay: 1.2s; }
        @keyframes dcvFloatSway {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Deep Reef — pressure. Vertical depth column with a bubble at the
 *  given depth — the bubble cyclically compresses, demonstrating how
 *  air gets squeezed at depth. Surface band + dashed depth marker. */
function PressureDiagram({ depth = 10 }: { depth?: number }) {
  // Map depth (1..15) to y in viewBox (40..150)
  const y = 40 + Math.min(15, Math.max(1, depth)) * (110 / 15);
  return (
    <svg viewBox="0 0 360 180" className="ltr-internal">
      <defs>
        <linearGradient id="dcvPressure" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B6478" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#051E2C" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Air band */}
      <rect x="0" y="0" width="360" height="36" fill="rgba(244,184,96,0.10)" />
      <text x="14" y="22" fill="#F4B860" fontSize="9" letterSpacing="2" opacity="0.9">SURFACE · 1 atm</text>

      {/* Water column */}
      <rect x="0" y="36" width="360" height="144" fill="url(#dcvPressure)" />

      {/* Depth gridlines */}
      {[5, 10, 15].map((d) => {
        const yy = 40 + d * (110 / 15);
        return (
          <g key={d}>
            <line x1="20" y1={yy} x2="340" y2={yy} stroke="#0E5E7B" strokeOpacity="0.55" strokeDasharray="3 4" />
            <text x="26" y={yy - 3} fontSize="9" fill="#88A8B5" letterSpacing="1">{d}m</text>
          </g>
        );
      })}

      {/* Active depth marker */}
      <line x1="20" y1={y} x2="340" y2={y} stroke="#F4B860" strokeWidth="1.2" strokeDasharray="4 3" />
      <rect x="290" y={y - 9} width="50" height="18" fill="#08374A" stroke="#F4B860" strokeWidth="1" />
      <text x="315" y={y + 3} textAnchor="middle" fontSize="9" fill="#F4D77A" fontWeight="600" letterSpacing="1">
        {(1 + depth / 10).toFixed(1)} atm
      </text>

      {/* Compressing bubble — falls in size as depth increases */}
      <g className="dcv-bubble" style={{ transformOrigin: `180px ${y}px` }}>
        <circle cx="180" cy={y} r="14" fill="rgba(240,244,242,0.18)" stroke="#F0F4F2" strokeOpacity="0.55" />
        <ellipse cx="174" cy={y - 4} rx="4" ry="2" fill="rgba(255,255,255,0.55)" />
      </g>

      <style>{`
        .dcv-bubble { animation: dcvSqueeze 3s ease-in-out infinite; }
        @keyframes dcvSqueeze {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.6); opacity: 0.85; }
        }
      `}</style>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Coral Garden — filter feeding. An open oyster on a coral rock. Tiny
 *  plankton dots stream in from the left and exit cleaner on the
 *  right. Communicates "filter feeder" without a single word. */
function FilterFeedDiagram() {
  return (
    <svg viewBox="0 0 360 180" className="ltr-internal">
      <defs>
        <linearGradient id="dcvCoral" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B6478" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0A3A4A" stopOpacity="0.65" />
        </linearGradient>
        <radialGradient id="dcvOyster" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#F4D77A" />
          <stop offset="60%" stopColor="#C9956A" />
          <stop offset="100%" stopColor="#5A3618" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="360" height="180" fill="url(#dcvCoral)" opacity="0.7" />

      {/* Coral rock */}
      <path d="M 60 168 Q 90 130 130 138 Q 170 124 210 142 Q 250 130 290 152 Q 320 162 320 180 L 40 180 Z"
        fill="#1F3540" stroke="#0E5E7B" strokeOpacity="0.65" strokeWidth="0.8" />
      <ellipse cx="120" cy="146" rx="14" ry="6" fill="#2C4A55" opacity="0.6" />
      <ellipse cx="240" cy="148" rx="18" ry="7" fill="#2C4A55" opacity="0.6" />

      {/* Open oyster (top + bottom shells) */}
      <g transform="translate(180 124)">
        <path d="M -36 0 Q -36 18 0 22 Q 36 18 36 0 Q 36 12 0 14 Q -36 12 -36 0 Z" fill="#3D2A1E" />
        <path d="M -34 0 Q -34 -16 0 -20 Q 34 -16 34 0 Q 34 -10 0 -12 Q -34 -10 -34 0 Z" fill="#3D2A1E" />
        <ellipse cx="0" cy="-2" rx="28" ry="10" fill="url(#dcvOyster)" opacity="0.85" />
        <circle cx="0" cy="-2" r="3.5" fill="#FFF8E5" />
      </g>

      {/* Plankton flow — three streams of dots, looping */}
      {[0, 1, 2].map((row) => (
        <g key={row} className={`dcv-flow dcv-flow-${row}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <circle
              key={i}
              cx={20 + i * 60}
              cy={90 + row * 14}
              r="1.6"
              fill="#F0F4F2"
              opacity="0.8"
            />
          ))}
        </g>
      ))}

      {/* Direction arrow */}
      <path d="M 30 70 L 80 70 L 75 65 M 80 70 L 75 75" stroke="#F4B860" strokeWidth="1" fill="none" />
      <text x="34" y="64" fontSize="8" fill="#F4B860" letterSpacing="2">CURRENT</text>

      <style>{`
        .dcv-flow { animation: dcvFlow 4s linear infinite; }
        .dcv-flow-1 { animation-delay: 0.5s; animation-duration: 5s; }
        .dcv-flow-2 { animation-delay: 1s; animation-duration: 6s; }
        @keyframes dcvFlow {
          0% { transform: translateX(-40px); opacity: 0; }
          15% { opacity: 0.9; }
          70% { opacity: 0.9; }
          100% { transform: translateX(120px); opacity: 0; }
        }
      `}</style>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Lung of the Sea — breath + heart rhythm. A serene, glowing 
 *  Breathe-style lotus that expands and contracts, plus a slow 
 *  heart-rate trace below. Beautiful and calm, avoiding anatomy. */
function BreathDiagram() {
  return (
    <svg viewBox="0 0 360 180" className="ltr-internal">
      <defs>
        <radialGradient id="dcvPetal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#88A8B5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1B6478" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="360" height="180" fill="rgba(8,55,74,0.3)" />

      {/* Serene Breathe Flower */}
      <g transform="translate(180 75)">
        <g className="dcv-lung">
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <circle cx="0" cy="-14" r="22" fill="url(#dcvPetal)" style={{ mixBlendMode: "screen" }} className="dcv-petal" />
            </g>
          ))}
          {/* Center glow */}
          <circle cx="0" cy="0" r="8" fill="#FFF8E5" opacity="0.6" style={{ filter: "blur(2px)" }} />
        </g>
      </g>

      {/* Heart rate trace */}
      <text x="20" y="155" fontSize="9" fill="#88A8B5" letterSpacing="2">CALM RHYTHM</text>
      <line x1="20" y1="170" x2="340" y2="170" stroke="rgba(136,168,181,0.2)" strokeWidth="0.6" />
      <path
        className="dcv-pulse"
        d="M 20 170 L 120 170 L 128 162 L 133 182 L 138 152 L 143 170 L 260 170 L 268 162 L 273 182 L 278 152 L 283 170 L 340 170"
        stroke="#F4D77A"
        strokeWidth="1.2"
        fill="none"
      />

      <style>{`
        .dcv-lung { animation: dcvBreath 6s ease-in-out infinite; }
        .dcv-petal { animation: dcvPetalSpread 6s ease-in-out infinite; }
        
        @keyframes dcvBreath {
          0%, 100% { transform: scale(0.65) rotate(0deg); opacity: 0.6; }
          50% { transform: scale(1.1) rotate(45deg); opacity: 1; }
        }
        @keyframes dcvPetalSpread {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        
        .dcv-pulse {
          stroke-dasharray: 450;
          stroke-dashoffset: 450;
          animation: dcvBeat 6s linear infinite;
        }
        @keyframes dcvBeat {
          0% { stroke-dashoffset: 450; }
          100% { stroke-dashoffset: -450; }
        }
      `}</style>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Refraction Trial — light bending. A sun symbol above water emits a
 *  ray that bends as it crosses the surface, plus a vertical color
 *  spectrum showing red disappearing first as depth increases. */
function RefractionDiagram() {
  return (
    <svg viewBox="0 0 360 180" className="ltr-internal">
      <defs>
        <linearGradient id="dcvSpectrum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E07856" />
          <stop offset="20%" stopColor="#F4B860" />
          <stop offset="45%" stopColor="#1B6478" />
          <stop offset="100%" stopColor="#051E2C" />
        </linearGradient>
        <radialGradient id="dcvSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF4D8" />
          <stop offset="60%" stopColor="#F4B860" />
          <stop offset="100%" stopColor="#F4B860" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="360" height="60" fill="rgba(244,215,122,0.08)" />
      <rect x="0" y="60" width="360" height="120" fill="rgba(8,55,74,0.45)" />

      {/* Sun */}
      <circle cx="60" cy="32" r="26" fill="url(#dcvSun)" />
      <circle cx="60" cy="32" r="9" fill="#FFF4D8" />

      {/* Surface line */}
      <line x1="0" y1="60" x2="360" y2="60" stroke="#F4B860" strokeWidth="1" opacity="0.7" />
      <text x="280" y="56" fontSize="9" fill="#F4B860" letterSpacing="2">SURFACE</text>

      {/* Bending light ray — straight in air, refracts at surface, bends */}
      <path
        d="M 70 38 L 150 60 L 220 160"
        stroke="#FFF4D8"
        strokeWidth="2"
        fill="none"
        className="dcv-ray"
      />
      <path
        d="M 70 38 L 150 60 L 200 160"
        stroke="#FFF4D8"
        strokeWidth="0.8"
        strokeDasharray="3 3"
        fill="none"
        opacity="0.5"
      />
      {/* Bend label */}
      <text x="155" y="74" fontSize="8" fill="#F4D77A" letterSpacing="1">BENDS</text>

      {/* Color spectrum bar — depth-loss demonstration */}
      <rect x="295" y="68" width="14" height="100" fill="url(#dcvSpectrum)" rx="3" />
      <text x="318" y="74" fontSize="8" fill="#E07856">RED</text>
      <text x="318" y="98" fontSize="8" fill="#F4B860">GOLD</text>
      <text x="318" y="124" fontSize="8" fill="#88A8B5">BLUE</text>
      <text x="318" y="160" fontSize="8" fill="#88A8B5" opacity="0.5">DARK</text>

      <style>{`
        .dcv-ray {
          stroke-dasharray: 240;
          stroke-dashoffset: 240;
          animation: dcvRayDraw 3.6s ease-in-out infinite;
        }
        @keyframes dcvRayDraw {
          0% { stroke-dashoffset: 240; opacity: 0.2; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -240; opacity: 0.2; }
        }
      `}</style>
    </svg>
  );
}
