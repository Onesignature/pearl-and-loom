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
  // Dhow bow scene — Saif standing on the deck of his boat. The hull + deck fill
  // the entire bottom-left of the frame edge-to-edge with a gunwale curving up to
  // the lifted bow on the right. Water peeks above the gunwale. Slice fills the
  // viewport so the deck always reaches the bottom corner.
  return (
    <svg
      viewBox="0 0 360 540"
      preserveAspectRatio="xMidYMax slice"
      style={{ width: "100%", height: "100%", display: "block" }}
      className="ltr-internal"
    >
      <defs>
        <linearGradient id="saifDeckWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A87648" />
          <stop offset="40%" stopColor="#8C5A2E" />
          <stop offset="100%" stopColor="#3D2517" />
        </linearGradient>
        <linearGradient id="saifHull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A3618" />
          <stop offset="60%" stopColor="#3D2517" />
          <stop offset="100%" stopColor="#1F140A" />
        </linearGradient>
        <linearGradient id="seaWaterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B6478" stopOpacity="0" />
          <stop offset="100%" stopColor="#0A3A4A" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="sodSkin" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#C9956A" />
          <stop offset="100%" stopColor="#7A4A2E" />
        </linearGradient>
        <linearGradient id="sodSkinDark" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#A87648" />
          <stop offset="100%" stopColor="#5A3618" />
        </linearGradient>
        <linearGradient id="sodKandura" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F4E8D0" />
          <stop offset="100%" stopColor="#C9B58C" />
        </linearGradient>
        <linearGradient id="sodGhutra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D9C49C" />
        </linearGradient>
        <radialGradient id="sodBodyShade" cx="65%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id="sodSunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4B860" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F4B860" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="280" cy="260" rx="220" ry="280" fill="url(#sodSunGlow)" />

      {/* Sea water surface visible above deck (behind dhow) */}
      <rect x="0" y="320" width="360" height="90" fill="url(#seaWaterGrad)" />
      <path
        d="M 0 340 Q 40 336 80 340 T 160 340"
        stroke="#1B6478"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 0 360 Q 60 356 120 360 T 240 360"
        stroke="#1B6478"
        strokeWidth="0.6"
        fill="none"
        opacity="0.3"
      />

      {/* Hull below deck — fills entire bottom region edge to edge */}
      <path
        d="M 0 540 L 360 540 L 360 350 Q 280 360 180 380 Q 80 400 0 410 Z"
        fill="url(#saifHull)"
      />

      {/* Deck plane — fills whole width, tilted up toward the right (bow rises) */}
      <path
        d="M 0 410 Q 80 400 180 380 Q 280 360 360 350 L 360 540 L 0 540 Z"
        fill="url(#saifDeckWood)"
      />

      {/* Plank seams running side to side across the deck */}
      {[
        { y0: 426, y1: 372 },
        { y0: 450, y1: 398 },
        { y0: 478, y1: 426 },
        { y0: 506, y1: 456 },
        { y0: 530, y1: 484 },
      ].map((s, i) => (
        <path
          key={i}
          d={`M 0 ${s.y0} Q 180 ${(s.y0 + s.y1) / 2 - 6} 360 ${s.y1}`}
          stroke="#3D2A1E"
          strokeWidth="0.9"
          fill="none"
          opacity="0.5"
        />
      ))}

      {/* Vertical plank divisions */}
      {[80, 160, 240, 320].map((x) => {
        const t = x / 360;
        const yTop = 410 - t * 60;
        return (
          <line
            key={x}
            x1={x}
            y1={yTop}
            x2={x + 6}
            y2={540}
            stroke="#3D2A1E"
            strokeWidth="0.7"
            opacity="0.4"
          />
        );
      })}

      {/* Gunwale — front edge of the deck where it meets the sea */}
      <path
        d="M 0 410 Q 80 400 180 380 Q 280 360 360 350"
        stroke="#1F140A"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 0 412 Q 80 402 180 382 Q 280 362 360 352"
        stroke="#A87648"
        strokeWidth="0.7"
        fill="none"
        opacity="0.6"
      />

      {/* Iron rivets along the gunwale */}
      {[20, 70, 120, 170, 220, 270, 320].map((x, i) => {
        const t = x / 360;
        const y = 410 - t * 60 + 6;
        return <circle key={i} cx={x} cy={y} r="1.3" fill="#1A0E08" />;
      })}

      {/* Bow upturn on the right edge — the lifted prow */}
      <path
        d="M 348 350 Q 360 322 358 300 Q 350 308 346 348 Z"
        fill="#3D2517"
        stroke="#1F140A"
        strokeWidth="0.8"
      />

      {/* Coiled rope on left side of deck */}
      <g transform="translate(60 470)">
        {[24, 20, 16, 12, 8].map((r, i) => (
          <ellipse
            key={i}
            cx="0"
            cy={i * -2}
            rx={r}
            ry={r * 0.32}
            fill={i % 2 ? "#A8895E" : "#8C7048"}
            stroke="#5A4030"
            strokeWidth="0.4"
          />
        ))}
      </g>

      {/* Dive stones piled on deck near bow */}
      <g transform="translate(290 410)">
        <ellipse cx="0" cy="6" rx="30" ry="5" fill="rgba(0,0,0,0.45)" />
        <ellipse cx="-6" cy="-2" rx="22" ry="11" fill="#3D2A1E" />
        <ellipse cx="-9" cy="-5" rx="14" ry="5" fill="#5A4030" />
        <ellipse cx="-12" cy="-7" rx="5" ry="2" fill="#7A5E40" opacity="0.7" />
        <ellipse cx="14" cy="2" rx="14" ry="7" fill="#3D2A1E" />
        <ellipse cx="13" cy="0" rx="9" ry="3" fill="#5A4030" />
      </g>

      {/* Saif's shadow on the deck */}
      <ellipse cx="180" cy="470" rx="44" ry="6" fill="rgba(0,0,0,0.35)" />

      {/* Saif figure — standing on the deck looking right toward sea */}
      <g transform="translate(180 235)">
        <g
          style={{
            animation: "saifBreathe 4s ease-in-out infinite",
            transformOrigin: "center",
          }}
        >
          {/* Legs — slightly braced, weight on the rear leg, front foot forward */}
          <path d="M -22 160 Q -24 200 -22 235 L -8 235 Q -8 200 -8 160 Z" fill="url(#sodKandura)" />
          <path d="M 6 160 Q 8 200 12 230 L 24 230 Q 26 200 22 160 Z" fill="url(#sodKandura)" />
          <ellipse cx="-15" cy="237" rx="13" ry="3" fill="#5A3618" />
          <ellipse cx="18" cy="232" rx="13" ry="3" fill="#5A3618" />

          {/* Kandura — full robe down to ankles */}
          <path
            d="M -34 28 Q -42 56 -38 162 L 38 162 Q 42 56 34 28 Q 22 16 0 16 Q -22 16 -34 28 Z"
            fill="url(#sodKandura)"
          />
          <path
            d="M -34 28 Q -42 56 -38 162 L 38 162 Q 42 56 34 28 Q 22 16 0 16 Q -22 16 -34 28 Z"
            fill="url(#sodBodyShade)"
          />
          <rect x="-38" y="92" width="76" height="6" fill="#6B4423" />
          <rect x="-38" y="92" width="76" height="2" fill="#8C5A2E" opacity="0.7" />
          <circle cx="0" cy="32" r="1.5" fill="#3D2A1E" />
          <circle cx="0" cy="44" r="1.5" fill="#3D2A1E" />
          <circle cx="0" cy="56" r="1.5" fill="#3D2A1E" />
          <path
            d="M -20 56 Q -22 110 -24 160"
            stroke="#A89270"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 20 56 Q 22 110 24 160"
            stroke="#A89270"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />

          {/* Arms with hands and taab rope */}
          <g>
            <path
              d="M 34 30 Q 50 70 54 130 Q 56 140 50 144 Q 44 140 40 130 Q 32 80 28 38 Z"
              fill="url(#sodKandura)"
            />
            <path
              d="M 34 30 Q 50 70 54 130 Q 56 140 50 144 Q 44 140 40 130 Q 32 80 28 38 Z"
              fill="url(#sodBodyShade)"
              opacity="0.6"
            />
            <path d="M 50 132 Q 56 138 56 146 L 42 146 Q 38 140 42 132 Z" fill="#D9C49C" />
            <ellipse cx="50" cy="150" rx="7" ry="6" fill="url(#sodSkin)" />
            <path
              d="M 46 154 L 46 158 M 50 155 L 50 160 M 54 154 L 54 158"
              stroke="url(#sodSkinDark)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            <path
              d="M -34 30 Q -50 70 -54 130 Q -56 140 -50 144 Q -44 140 -40 130 Q -32 80 -28 38 Z"
              fill="url(#sodKandura)"
            />
            <path
              d="M -34 30 Q -50 70 -54 130 Q -56 140 -50 144 Q -44 140 -40 130 Q -32 80 -28 38 Z"
              fill="url(#sodBodyShade)"
              opacity="0.4"
            />
            <path d="M -50 132 Q -56 138 -56 146 L -42 146 Q -38 140 -42 132 Z" fill="#D9C49C" />
            <ellipse cx="-50" cy="150" rx="7" ry="6" fill="url(#sodSkin)" />
            <path
              d="M -46 154 L -46 158 M -50 155 L -50 160 M -54 154 L -54 158"
              stroke="url(#sodSkinDark)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>

          {/* Neck */}
          <path d="M -8 4 Q -8 18 -6 24 L 6 24 Q 8 18 8 4 Z" fill="url(#sodSkinDark)" />

          {/* Head + face — proper expressive features */}
          <g>
            <path
              d="M -28 -8 Q -34 -36 -2 -40 Q 30 -38 30 -8 Q 28 12 22 18 L -22 18 Q -30 12 -28 -8 Z"
              fill="url(#sodGhutra)"
            />
            <ellipse cx="0" cy="-2" rx="20" ry="22" fill="url(#sodSkin)" />
            <path
              d="M -18 -4 Q -22 12 -16 18 Q -8 22 -2 18 Q -8 8 -18 -4 Z"
              fill="url(#sodSkinDark)"
              opacity="0.5"
            />
            <path
              d="M 4 -16 Q 14 -18 18 -10 Q 16 -2 8 -2 Q 4 -8 4 -16 Z"
              fill="#F4D6A8"
              opacity="0.4"
            />
            <path
              d="M -26 -8 Q -28 -28 -2 -32 Q 28 -30 28 -8 Q 24 -2 18 -2 Q 0 -6 -18 -2 Q -24 -2 -26 -8 Z"
              fill="url(#sodGhutra)"
            />
            <ellipse cx="0" cy="-22" rx="28" ry="3" fill="#1A1410" />
            <ellipse
              cx="0"
              cy="-22"
              rx="28"
              ry="3"
              fill="none"
              stroke="#3D2A1E"
              strokeWidth="0.6"
            />
            <path
              d="M -12 -8 Q -8 -10 -4 -8"
              stroke="#1A0E08"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 4 -8 Q 8 -10 12 -8"
              stroke="#1A0E08"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="-7" cy="-2" rx="2.4" ry="1.6" fill="#FFFFFF" />
            <ellipse cx="7" cy="-2" rx="2.4" ry="1.6" fill="#FFFFFF" />
            <circle cx="-6" cy="-2" r="1.4" fill="#1A0E08" />
            <circle cx="8" cy="-2" r="1.4" fill="#1A0E08" />
            <circle cx="-6" cy="-2.5" r="0.5" fill="#FFFFFF" />
            <circle cx="8" cy="-2.5" r="0.5" fill="#FFFFFF" />
            <path
              d="M 0 0 Q -2 6 -1 10 Q 1 12 4 10"
              stroke="url(#sodSkinDark)"
              strokeWidth="1.2"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M -5 14 Q 0 16 5 14"
              stroke="#5A3618"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M -10 8 Q 0 18 10 8"
              stroke="#3D2A1E"
              strokeWidth="0.6"
              fill="none"
              opacity="0.7"
            />
            <ellipse cx="0" cy="14" rx="12" ry="4" fill="#3D2A1E" opacity="0.18" />
            <path
              d="M 18 0 Q 22 0 22 6 Q 22 10 18 8"
              fill="url(#sodSkinDark)"
              stroke="#5A3618"
              strokeWidth="0.4"
            />
          </g>
        </g>
      </g>

      <style>{`
        @keyframes saifBreathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
      `}</style>
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
