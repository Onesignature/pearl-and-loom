// Detailed character portraits — Layla at the loom, Saif on the dhow,
// plus underwater Saif silhouettes. Ported as React components from
// the Claude Design hand-off.

export function LaylaPortrait() {
  return (
    <svg
      viewBox="0 0 360 360"
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="laylaGlow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#F4B860" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#E8A33D" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1B2D5C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="laylaTent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D2A1E" />
          <stop offset="100%" stopColor="#1A130D" />
        </linearGradient>
      </defs>
      <rect width="360" height="360" fill="url(#laylaTent)" />
      <rect width="360" height="360" fill="url(#laylaGlow)" />
      <path d="M 0 80 L 180 30 L 360 80" stroke="#5A4030" strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M 0 110 L 180 65 L 360 110" stroke="#5A4030" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Lantern */}
      <g transform="translate(70 80)">
        <line x1="14" y1="0" x2="14" y2="20" stroke="#3D2A1E" strokeWidth="1" />
        <ellipse cx="14" cy="38" rx="14" ry="20" fill="#F4B860" opacity="0.85" />
        <ellipse cx="14" cy="38" rx="9" ry="14" fill="#FFEFD3" />
        <rect x="6" y="55" width="16" height="6" fill="#3D2A1E" />
        <ellipse cx="14" cy="38" rx="40" ry="32" fill="#F4B860" opacity="0.18" />
      </g>
      {/* Loom frame */}
      <g transform="translate(60 200)">
        <rect x="0" y="0" width="240" height="8" fill="#6B4423" />
        <rect x="0" y="120" width="240" height="14" fill="#6B4423" />
        <rect x="0" y="0" width="6" height="134" fill="#5A3618" />
        <rect x="234" y="0" width="6" height="134" fill="#5A3618" />
        {Array.from({ length: 30 }).map((_, i) => (
          <line
            key={i}
            x1={10 + i * 7.5}
            y1="8"
            x2={10 + i * 7.5}
            y2="120"
            stroke="#C9A876"
            strokeWidth="0.8"
            opacity="0.7"
          />
        ))}
        <rect x="10" y="98" width="220" height="22" fill="#B5341E" />
        <rect x="10" y="84" width="220" height="14" fill="#1B2D5C" />
        <g transform="translate(10 84)">
          {[...Array(11)].map((_, i) => (
            <path
              key={i}
              d={`M ${i * 20} 0 L ${i * 20 + 10} 14 L ${i * 20 + 20} 0 Z`}
              fill="#E8A33D"
              opacity="0.9"
            />
          ))}
        </g>
        <rect x="10" y="68" width="220" height="16" fill="#F0E4C9" />
        <rect x="10" y="56" width="220" height="12" fill="#E8A33D" opacity="0.35">
          <animate attributeName="opacity" values="0.2;0.55;0.2" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Layla silhouette */}
      <g transform="translate(170 130)">
        <path d="M -2 -10 Q -28 -6 -32 22 Q -34 50 -22 70 Q -10 78 4 70 L 0 38 Z" fill="#2A1810" />
        <path d="M -2 -10 Q 8 -8 12 4 Q 14 16 8 24 Q 2 30 -2 28 Q -4 20 -2 12 Z" fill="#D9A878" />
        <path d="M -32 60 Q -50 80 -56 130 L 30 130 Q 26 90 16 70 Q 2 64 -8 66 Z" fill="#8C2614" />
        <path d="M -10 70 Q 30 78 60 90 Q 70 92 70 96 Q 65 100 60 98 Q 30 92 -8 84 Z" fill="#D9A878" />
        <path
          d="M -25 95 L -10 102 L 5 95 L 20 102"
          stroke="#E8A33D"
          strokeWidth="1.5"
          fill="none"
        />
      </g>
    </svg>
  );
}

export function SaifPortrait() {
  return (
    <svg
      viewBox="0 0 360 360"
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="saifSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4B860" />
          <stop offset="40%" stopColor="#E07856" />
          <stop offset="75%" stopColor="#0E5E7B" />
          <stop offset="100%" stopColor="#051E2C" />
        </linearGradient>
        <linearGradient id="saifSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E5E7B" />
          <stop offset="100%" stopColor="#051E2C" />
        </linearGradient>
      </defs>
      <rect width="360" height="220" fill="url(#saifSky)" />
      <rect y="220" width="360" height="140" fill="url(#saifSea)" />
      <circle cx="280" cy="120" r="32" fill="#FFEFD3" opacity="0.85" />
      <circle cx="280" cy="120" r="50" fill="#F4B860" opacity="0.25" />
      {/* Distant dhow */}
      <g transform="translate(40 200)" opacity="0.7">
        <path d="M 0 12 L 60 12 L 55 22 L 5 22 Z" fill="#2A1810" />
        <path d="M 30 12 L 30 -30 L 50 12 Z" fill="#3D2A1E" />
      </g>
      {/* Sea ripples */}
      {[235, 250, 270, 290, 310, 330].map((y, i) => (
        <path
          key={y}
          d={`M 0 ${y} Q 90 ${y - 3} 180 ${y} T 360 ${y}`}
          stroke="#F4B860"
          strokeWidth="0.8"
          fill="none"
          opacity={0.5 - i * 0.07}
        />
      ))}
      {/* Dhow plank in foreground */}
      <g>
        <path d="M 60 280 L 360 240 L 360 360 L 0 360 Z" fill="#6B4423" />
        <path d="M 60 280 L 360 240 L 360 250 L 60 290 Z" fill="#8C5A2E" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${60 + i * 10} ${290 + i * 18} L ${360} ${250 + i * 18}`}
            stroke="#4A2F18"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        <ellipse cx="280" cy="280" rx="34" ry="8" fill="#C9A876" opacity="0.7" />
        <ellipse cx="280" cy="278" rx="30" ry="7" fill="#A8895E" />
        <ellipse cx="280" cy="276" rx="26" ry="6" fill="#8C7048" />
      </g>
      {/* Saif silhouette */}
      <g transform="translate(140 175)">
        <circle cx="0" cy="0" r="13" fill="#A87648" />
        <path
          d="M -16 -2 Q -18 -16 -2 -16 Q 16 -16 16 -2 Q 14 6 8 8 L -10 8 Q -16 6 -16 -2 Z"
          fill="#F0E4C9"
        />
        <path d="M -14 -2 L -18 14 L 16 14 L 14 -2 Z" fill="#F0E4C9" opacity="0.85" />
        <path
          d="M -18 14 Q -22 20 -26 80 Q -22 100 0 100 Q 22 100 26 80 Q 22 20 18 14 Z"
          fill="#F0E4C9"
        />
        <rect x="-22" y="58" width="44" height="6" fill="#6B4423" />
        <path d="M -22 22 Q -36 36 -34 60 L -28 62 Q -28 40 -16 28 Z" fill="#A87648" />
        <line x1="-32" y1="60" x2="-32" y2="200" stroke="#C9A876" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function SaifOnDeck() {
  return (
    <svg
      viewBox="0 0 360 540"
      style={{ width: "100%", height: "100%" }}
      className="ltr-internal"
    >
      <defs>
        <linearGradient id="deckG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8C5A2E" />
          <stop offset="100%" stopColor="#4A2F18" />
        </linearGradient>
      </defs>
      <path d="M 0 380 L 360 360 L 360 540 L 0 540 Z" fill="url(#deckG)" />
      {[400, 420, 440, 460, 480, 500].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="360"
          y2={y - 4}
          stroke="#3D2A1E"
          strokeWidth="1"
          opacity="0.6"
        />
      ))}
      {/* Coiled rope */}
      <g transform="translate(80 410)">
        {[28, 24, 20, 16].map((r, i) => (
          <ellipse
            key={i}
            cx="0"
            cy={i * -2}
            rx={r}
            ry={r * 0.3}
            fill={i % 2 ? "#A8895E" : "#8C7048"}
          />
        ))}
      </g>
      {/* Stone pile */}
      <g transform="translate(280 430)">
        <Stone size={56} />
        <g transform="translate(-30 10)">
          <Stone size={42} />
        </g>
        <g transform="translate(20 24)">
          <Stone size={36} />
        </g>
      </g>
      {/* Saif silhouette */}
      <g transform="translate(180 200)">
        <circle cx="0" cy="0" r="22" fill="#A87648" />
        <path
          d="M -28 -2 Q -32 -28 -2 -28 Q 28 -28 28 -2 Q 24 12 14 14 L -16 14 Q -28 12 -28 -2 Z"
          fill="#F0E4C9"
        />
        <path d="M -26 -2 L -32 26 L 28 26 L 24 -2 Z" fill="#F0E4C9" />
        <ellipse cx="0" cy="-14" rx="30" ry="3" fill="#2A2522" />
        <circle cx="-6" cy="0" r="1.5" fill="#2A2522" />
        <circle cx="6" cy="0" r="1.5" fill="#2A2522" />
        <path
          d="M -30 26 Q -36 40 -42 160 Q -36 180 0 180 Q 36 180 42 160 Q 36 40 30 26 Z"
          fill="#F0E4C9"
        />
        <rect x="-36" y="100" width="72" height="8" fill="#6B4423" />
        <path d="M -36 36 Q -56 60 -52 110 L -44 112 Q -44 70 -28 44 Z" fill="#A87648" />
        <path d="M 36 36 Q 56 60 52 110 L 44 112 Q 44 70 28 44 Z" fill="#A87648" />
        <line x1="-2" y1="2" x2="2" y2="2" stroke="#2A2522" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function SaifSwimmer() {
  return (
    <svg viewBox="0 0 90 130" style={{ width: 90, height: 130 }}>
      <circle cx="45" cy="22" r="14" fill="#A87648" />
      <path
        d="M 32 18 Q 28 6 45 4 Q 62 6 58 18 Q 56 24 50 26 L 40 26 Q 34 24 32 18 Z"
        fill="#F0E4C9"
      />
      <rect x="43" y="20" width="4" height="2" fill="#2A2522" />
      <path
        d="M 32 36 Q 28 40 26 90 Q 32 96 45 96 Q 58 96 64 90 Q 62 40 58 36 Z"
        fill="#F0E4C9"
        opacity="0.9"
      />
      <path d="M 32 40 Q 18 60 16 100 L 24 100 Q 26 64 36 46 Z" fill="#A87648" />
      <path d="M 58 40 Q 72 60 74 100 L 66 100 Q 64 64 54 46 Z" fill="#A87648" />
      <ellipse cx="45" cy="118" rx="14" ry="6" fill="#2A1810" />
      <line x1="45" y1="96" x2="45" y2="-100" stroke="#C9A876" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

export function Stone({ size = 30 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      style={{ display: "block", margin: "0 auto" }}
    >
      <defs>
        <radialGradient id={`stoneG-${size}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#8C7860" />
          <stop offset="60%" stopColor="#5A4030" />
          <stop offset="100%" stopColor="#2A1810" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="34" rx="24" ry="20" fill={`url(#stoneG-${size})`} />
      <ellipse cx="22" cy="28" rx="6" ry="3" fill="#A89078" opacity="0.6" />
    </svg>
  );
}

export function Oyster({ targeted = false }: { targeted?: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <defs>
        <radialGradient id="oysterG">
          <stop offset="0%" stopColor="#7A6B5A" />
          <stop offset="100%" stopColor="#3D2F22" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="36" rx="24" ry="16" fill="url(#oysterG)" />
      <path
        d="M 8 36 Q 12 22 30 22 Q 48 22 52 36 Q 48 32 30 30 Q 12 32 8 36 Z"
        fill="#5A4030"
      />
      {targeted && (
        <>
          <circle
            cx="30"
            cy="32"
            r="22"
            fill="none"
            stroke="var(--sunset-gold)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 30 32"
              to="360 30 32"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="30"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--sunset-gold)"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </>
      )}
    </svg>
  );
}
