// Underwater FX layer — reusable atmospheric primitives.
// Ported from the Claude Design v2 sea realism pass.

export function GodRays({
  topPct = 12,
  intensity = 0.55,
}: {
  topPct?: number;
  intensity?: number;
}) {
  return (
    <svg
      style={{
        position: "absolute",
        top: `${topPct}%`,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
      preserveAspectRatio="none"
      viewBox="0 0 1366 900"
      aria-hidden
    >
      <defs>
        <linearGradient id="rayGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE9B8" stopOpacity={intensity} />
          <stop offset="50%" stopColor="#F4B860" stopOpacity={intensity * 0.5} />
          <stop offset="100%" stopColor="#0E5E7B" stopOpacity="0" />
        </linearGradient>
        <filter id="rayBlur">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <g filter="url(#rayBlur)">
        {[
          { x: 180, w: 80, sk: -8, dur: 9, dx: 30 },
          { x: 380, w: 140, sk: -14, dur: 11, dx: -40 },
          { x: 620, w: 60, sk: -4, dur: 8, dx: 25 },
          { x: 780, w: 110, sk: -10, dur: 13, dx: -30 },
          { x: 1020, w: 70, sk: -16, dur: 10, dx: 35 },
          { x: 1240, w: 90, sk: -8, dur: 12, dx: -28 },
        ].map((r, i) => (
          <polygon
            key={i}
            points={`${r.x},0 ${r.x + r.w},0 ${r.x + r.w + r.sk * 6},900 ${r.x + r.sk * 6},900`}
            fill="url(#rayGrad)"
            opacity="0.7"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0 0; ${r.dx} 0; 0 0`}
              dur={`${r.dur}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.85;0.4"
              dur={`${r.dur * 0.7}s`}
              repeatCount="indefinite"
            />
          </polygon>
        ))}
      </g>
    </svg>
  );
}

export function Caustics({
  bottom = 0,
  height = 240,
  opacity = 0.42,
}: {
  bottom?: number;
  height?: number;
  opacity?: number;
}) {
  return (
    <svg
      style={{
        position: "absolute",
        bottom,
        left: 0,
        width: "100%",
        height,
        pointerEvents: "none",
        opacity,
        mixBlendMode: "screen",
      }}
      preserveAspectRatio="none"
      viewBox="0 0 1366 240"
      aria-hidden
    >
      <defs>
        <radialGradient id="causticBlob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9B8" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#F4B860" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F4B860" stopOpacity="0" />
        </radialGradient>
        <filter id="causticBlur">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <g filter="url(#causticBlur)">
        {Array.from({ length: 28 }).map((_, i) => {
          const cx = (i * 53 + (i % 3) * 17) % 1366;
          const cy = 60 + ((i * 11) % 160);
          const rx = 18 + (i % 5) * 8;
          const ry = 5 + (i % 4) * 2;
          const dur = 4 + (i % 5);
          const dx = 12 + (i % 4) * 6;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="url(#causticBlob)"
              opacity={0.5 + (i % 4) * 0.12}
            >
              <animate
                attributeName="cx"
                values={`${cx};${cx + dx};${cx - dx};${cx}`}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values={`${rx};${rx * 1.2};${rx * 0.85};${rx}`}
                dur={`${dur * 1.2}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.85;0.3"
                dur={`${dur * 0.8}s`}
                repeatCount="indefinite"
              />
            </ellipse>
          );
        })}
      </g>
    </svg>
  );
}

interface ParticulateItem {
  l: number;
  t: number;
  s: number;
  dur: number;
  delay: number;
  op: number;
}

export function Particulates({ count = 40 }: { count?: number }) {
  const items: ParticulateItem[] = Array.from({ length: count }).map((_, i) => ({
    l: (i * 37 + (i % 7) * 11) % 100,
    t: (i * 23 + (i % 5) * 13) % 100,
    s: 1 + (i % 4) * 0.6,
    dur: 18 + (i % 6) * 3,
    delay: (i * 0.5) % 12,
    op: 0.18 + (i % 5) * 0.08,
  }));
  return (
    <div
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
      aria-hidden
    >
      {items.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: p.s,
            height: p.s,
            borderRadius: "50%",
            background: "rgba(240,244,242,0.85)",
            opacity: p.op,
            boxShadow: "0 0 4px rgba(240,244,242,0.5)",
            animation: `drift ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes drift {
          from { transform: translate(0, 0); }
          to { transform: translate(40px, -28px); }
        }
      `}</style>
    </div>
  );
}

export function BubbleTrail({
  x = "50%",
  y = "20%",
  count = 14,
}: {
  x?: string;
  y?: string;
  count?: number;
}) {
  const items = Array.from({ length: count }).map((_, i) => ({
    dx: (i % 2 ? -1 : 1) * (3 + (i % 4) * 2),
    s: 3 + (i % 5) * 2,
    dur: 4 + (i % 4),
    delay: i * 0.45,
  }));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 30,
        height: "100%",
        pointerEvents: "none",
        transform: "translateX(-50%)",
      }}
      aria-hidden
    >
      {items.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${b.dx * 4}px`,
            bottom: 0,
            width: b.s,
            height: b.s,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(240,244,242,0.4) 60%, transparent)",
            border: "0.5px solid rgba(255,255,255,0.5)",
            animation: `bubbleRise ${b.dur}s ${b.delay}s ease-in infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bubbleRise {
          0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
          15% { opacity: 0.9; }
          90% { opacity: 0.7; }
          100% { transform: translate(-12px, -100vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function SaifSwimmer({ swimming = true }: { swimming?: boolean }) {
  const kickDur = swimming ? "0.9s" : "2.6s";
  return (
    <svg viewBox="0 0 150 250" style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id="skinG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9956A" />
          <stop offset="100%" stopColor="#8A5A3A" />
        </linearGradient>
        <linearGradient id="kanduraG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4E8D0" />
          <stop offset="60%" stopColor="#D9C49C" />
          <stop offset="100%" stopColor="#8C7048" />
        </linearGradient>
        <radialGradient id="bodyShade" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ropeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9B57A" />
          <stop offset="100%" stopColor="#8C7048" />
        </linearGradient>
      </defs>

      <line x1="75" y1="32" x2="75" y2="-200" stroke="url(#ropeG)" strokeWidth="1.6" opacity="0.75" />

      <g style={{ transformOrigin: "75px 100px", transformBox: "fill-box" }}>
        {/* Left leg with kicking + zibel dive stone */}
        <g
          style={{
            transformOrigin: "65px 130px",
            animation: `legKickL ${kickDur} ease-in-out infinite`,
          }}
        >
          <path d="M 60 130 Q 50 162 48 192 L 60 196 Q 64 166 70 132 Z" fill="url(#skinG)" />
          <path d="M 48 192 Q 46 200 44 210 L 56 212 Q 60 202 60 196 Z" fill="#7A4A2E" />
          <ellipse cx="50" cy="214" rx="8" ry="3" fill="#5A3618" />
          {/* Zibel — dive stone lashed to LEFT FOOT, follows the kick */}
          <line x1="48" y1="216" x2="44" y2="232" stroke="#C9A876" strokeWidth="1.2" opacity="0.9" />
          <line x1="52" y1="216" x2="48" y2="232" stroke="#8C7048" strokeWidth="0.7" opacity="0.7" />
          <ellipse cx="46" cy="240" rx="11" ry="3.5" fill="rgba(0,0,0,0.4)" />
          <ellipse cx="46" cy="236" rx="10" ry="6" fill="#3D2A1E" />
          <ellipse cx="44" cy="234" rx="6" ry="3" fill="#5A4030" />
          <ellipse cx="42" cy="233" rx="2" ry="1" fill="#7A5E40" opacity="0.7" />
        </g>

        {/* Right leg */}
        <g
          style={{
            transformOrigin: "85px 130px",
            animation: `legKickR ${kickDur} ease-in-out infinite`,
          }}
        >
          <path d="M 90 130 Q 100 162 102 192 L 90 196 Q 86 166 80 132 Z" fill="url(#skinG)" />
          <path d="M 102 192 Q 104 200 106 210 L 94 212 Q 90 202 90 196 Z" fill="#7A4A2E" />
          <ellipse cx="100" cy="214" rx="8" ry="3" fill="#5A3618" />
          <circle cx="104" cy="216" r="1.8" fill="rgba(255,255,255,0.7)">
            <animate attributeName="cy" values="216;220;216" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.9s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Torso — kandura */}
        <path
          d="M 56 70 Q 52 90 58 130 L 92 130 Q 98 90 94 70 Q 86 64 75 64 Q 64 64 56 70 Z"
          fill="url(#kanduraG)"
        />
        <path
          d="M 56 70 Q 52 90 58 130 L 92 130 Q 98 90 94 70 Q 86 64 75 64 Q 64 64 56 70 Z"
          fill="url(#bodyShade)"
        />
        <rect x="55" y="108" width="40" height="5" fill="#6B4423" />
        <rect x="55" y="108" width="40" height="2" fill="#8C5A2E" opacity="0.6" />

        {/* Left arm */}
        <g style={{ transformOrigin: "60px 72px", animation: "armSweep 2.6s ease-in-out infinite" }}>
          <path
            d="M 60 70 Q 50 56 42 38 Q 38 28 36 16 L 44 14 Q 48 26 50 36 Q 56 52 64 70 Z"
            fill="url(#skinG)"
          />
          <ellipse cx="40" cy="14" rx="5" ry="3.5" fill="#A87648" />
          <line x1="36" y1="14" x2="40" y2="10" stroke="#7A4A2E" strokeWidth="0.6" />
          <line x1="38" y1="13" x2="42" y2="9" stroke="#7A4A2E" strokeWidth="0.6" />
        </g>

        {/* Right arm */}
        <g
          style={{
            transformOrigin: "90px 72px",
            animation: "armSweep 2.6s ease-in-out infinite reverse",
          }}
        >
          <path
            d="M 90 70 Q 100 56 108 38 Q 112 28 114 16 L 106 14 Q 102 26 100 36 Q 94 52 86 70 Z"
            fill="url(#skinG)"
          />
          <ellipse cx="110" cy="14" rx="5" ry="3.5" fill="#A87648" />
          <line x1="114" y1="14" x2="110" y2="10" stroke="#7A4A2E" strokeWidth="0.6" />
          <line x1="112" y1="13" x2="108" y2="9" stroke="#7A4A2E" strokeWidth="0.6" />
        </g>

        {/* Head — tucked between arms, eyes closed (focused freediver) */}
        <g>
          <ellipse cx="75" cy="52" rx="14" ry="12" fill="#2A1810" />
          <ellipse cx="75" cy="50" rx="11" ry="13" fill="url(#skinG)" />
          <ellipse cx="80" cy="54" rx="3" ry="5" fill="#7A4A2E" opacity="0.4" />
          <line x1="70" y1="50" x2="74" y2="50" stroke="#1A0E08" strokeWidth="1.2" />
          <line x1="78" y1="50" x2="82" y2="50" stroke="#1A0E08" strokeWidth="1.2" />
          <path d="M 69 47 Q 72 46 75 47" stroke="#1A0E08" strokeWidth="0.8" fill="none" />
          <path d="M 76 47 Q 79 46 82 47" stroke="#1A0E08" strokeWidth="0.8" fill="none" />
          <rect x="73" y="56" width="4" height="3" rx="1" fill="#2A2522" />
          <line x1="72" y1="62" x2="78" y2="62" stroke="#5A3618" strokeWidth="1" />
          <path d="M 70 60 Q 75 66 80 60" stroke="#3D2A1E" strokeWidth="0.6" fill="none" />
        </g>

        <path d="M 64 70 Q 62 90 66 128" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none" />
      </g>

      {/* Exhale bubbles from nose */}
      <circle cx="76" cy="60" r="1.4" fill="rgba(255,255,255,0.85)">
        <animate attributeName="cy" values="60;48;36" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="r" values="1.4;1.8;2.4" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.6;0" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="78" cy="62" r="1" fill="rgba(255,255,255,0.7)">
        <animate
          attributeName="cy"
          values="62;52;38"
          dur="2.6s"
          begin="0.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.7;0.5;0"
          dur="2.6s"
          begin="0.6s"
          repeatCount="indefinite"
        />
      </circle>

      <style>{`
        @keyframes legKickL {
          0%, 100% { transform: rotate(-8deg) translateY(0); }
          50% { transform: rotate(12deg) translateY(-4px); }
        }
        @keyframes legKickR {
          0%, 100% { transform: rotate(10deg) translateY(-4px); }
          50% { transform: rotate(-6deg) translateY(0); }
        }
        @keyframes armSweep {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>
    </svg>
  );
}
