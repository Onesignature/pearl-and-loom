"use client";

// Cinematic Layla portrait — three-quarter view, intimate framing.
// Replaces the silhouette LaylaPortrait on the home character card.
// Includes: thobe with tatreez embroidery, patterned shayla, hands threading
// weft, animated lantern flicker, drifting dust motes catching lantern light.

const MOTES = Array.from({ length: 18 }, (_, i) => ({
  // Deterministic positions — avoid hydration mismatch
  x: 30 + ((i * 53 + (i % 5) * 17) % 280),
  y: 60 + ((i * 37 + (i % 7) * 11) % 220),
  r: 0.8 + (i % 3) * 0.5,
  dur: 6 + (i % 6),
  delay: -((i * 0.55) % 8),
}));

export function CinematicLaylaPortrait() {
  return (
    <svg
      viewBox="0 0 360 360"
      style={{ width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="laylaPortraitGlow" cx="30%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#F4B860" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#E8A33D" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1B2D5C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="laylaPortraitTent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D2A1E" />
          <stop offset="100%" stopColor="#0F0A06" />
        </linearGradient>
        <linearGradient id="lpSkin" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#E8C29A" />
          <stop offset="100%" stopColor="#A87648" />
        </linearGradient>
        <linearGradient id="lpSkinDark" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#C9956A" />
          <stop offset="100%" stopColor="#7A4A2E" />
        </linearGradient>
        <linearGradient id="lpThobe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9A2B1A" />
          <stop offset="60%" stopColor="#7A1F12" />
          <stop offset="100%" stopColor="#4A140A" />
        </linearGradient>
        <linearGradient id="lpShayla" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D2F2A" />
          <stop offset="50%" stopColor="#2A1810" />
          <stop offset="100%" stopColor="#1A100A" />
        </linearGradient>
        <pattern id="lpTatreez" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="transparent" />
          <path d="M 7 2 L 12 7 L 7 12 L 2 7 Z" fill="#E8A33D" opacity="0.9" />
          <circle cx="7" cy="7" r="1.4" fill="#7A1F12" />
        </pattern>
      </defs>

      <rect width="360" height="360" fill="url(#laylaPortraitTent)" />
      <rect width="360" height="360" fill="url(#laylaPortraitGlow)" />

      <path d="M 0 80 L 180 30 L 360 80" stroke="#5A4030" strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M 0 110 L 180 65 L 360 110" stroke="#5A4030" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Animated flickering lantern */}
      <g transform="translate(20 50)">
        <line x1="14" y1="0" x2="14" y2="20" stroke="#3D2A1E" strokeWidth="1" />
        <ellipse cx="14" cy="38" rx="14" ry="20" fill="#F4B860" opacity="0.85">
          <animate
            attributeName="opacity"
            values="0.75;0.95;0.8;0.85"
            dur="4s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="14" cy="38" rx="9" ry="14" fill="#FFEFD3" />
        <rect x="6" y="55" width="16" height="6" fill="#3D2A1E" />
        <ellipse cx="14" cy="38" rx="50" ry="40" fill="#F4B860" opacity="0.18">
          <animate
            attributeName="opacity"
            values="0.14;0.22;0.18"
            dur="4s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>

      {/* Loom edge — warp threads visible at right */}
      <g>
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={260 + i * 5}
            y1="120"
            x2={250 + i * 5.5}
            y2="360"
            stroke="#C9A876"
            strokeWidth="0.8"
            opacity="0.55"
          />
        ))}
        <rect x="250" y="320" width="120" height="14" fill="#B5341E" opacity="0.85" />
        <rect x="248" y="334" width="124" height="10" fill="#1B2D5C" opacity="0.85" />
      </g>

      {/* Dust motes drifting in lantern light */}
      <g opacity="0.85">
        {MOTES.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r={m.r} fill="#FFEFD3">
            <animate
              attributeName="opacity"
              values="0.2;0.95;0.4;0.2"
              dur={`${m.dur}s`}
              begin={`${m.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${m.y};${m.y - 14};${m.y - 8}`}
              dur={`${m.dur}s`}
              begin={`${m.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* Layla — three-quarter view, intimate framing, weaving */}
      <g transform="translate(40 60) scale(0.85)">
        {/* Thobe upper */}
        <path
          d="M 130 230 Q 120 290 130 360 L 250 360 Q 260 290 250 230 Q 240 210 220 200 Q 200 195 190 195 Q 180 195 160 200 Q 140 210 130 230 Z"
          fill="url(#lpThobe)"
        />
        <rect x="172" y="208" width="36" height="80" fill="url(#lpTatreez)" />
        <rect x="172" y="208" width="36" height="80" fill="none" stroke="#3D0E08" strokeWidth="1" />

        {/* Right arm — extended to loom, threading weft */}
        <path
          d="M 240 220 Q 280 240 310 270 Q 318 280 310 286 Q 296 280 264 256 Q 244 244 234 232 Z"
          fill="url(#lpThobe)"
        />
        <path
          d="M 304 268 Q 314 274 314 284 L 296 290 Q 290 282 296 272 Z"
          fill="#7A1F12"
          stroke="#E8A33D"
          strokeWidth="1"
        />
        <path
          d="M 308 282 Q 326 294 340 308 Q 344 312 340 316 Q 332 318 322 310 Q 312 300 302 292 Z"
          fill="url(#lpSkin)"
        />
        <ellipse cx="338" cy="308" rx="11" ry="8" fill="url(#lpSkin)" />
        {/* Shuttle in hand + yarn trail */}
        <ellipse
          cx="346"
          cy="304"
          rx="14"
          ry="3.5"
          fill="#5A3618"
          transform="rotate(-15 346 304)"
        />
        <ellipse
          cx="346"
          cy="303"
          rx="12"
          ry="2.5"
          fill="#8C5A2E"
          transform="rotate(-15 346 303)"
        />
        <path
          d="M 358 300 Q 380 310 400 320"
          stroke="#E8A33D"
          strokeWidth="1.4"
          fill="none"
          opacity="0.85"
        />

        {/* Left arm — fingers visible on warps */}
        <path
          d="M 138 230 Q 116 252 100 286 Q 96 296 104 300 Q 116 296 130 270 Q 142 250 152 236 Z"
          fill="url(#lpThobe)"
        />
        <path
          d="M 96 286 Q 104 298 116 296 L 110 308 Q 96 304 92 294 Z"
          fill="#7A1F12"
          stroke="#E8A33D"
          strokeWidth="1"
        />
        <path
          d="M 100 300 Q 96 318 102 332 Q 110 336 116 332 Q 118 318 116 304 Z"
          fill="url(#lpSkin)"
        />
        <ellipse cx="108" cy="334" rx="10" ry="7" fill="url(#lpSkin)" />

        {/* Head + face — three-quarter view, downcast on weaving */}
        <path d="M 175 178 Q 175 198 178 208 L 202 208 Q 205 198 205 178 Z" fill="url(#lpSkinDark)" />
        <path
          d="M 142 130 Q 130 120 134 90 Q 142 60 180 50 Q 220 52 232 80 Q 240 120 232 140 Q 232 180 222 200 L 220 220 L 160 220 L 158 200 Q 150 180 142 160 Z"
          fill="url(#lpShayla)"
        />
        <path
          d="M 152 138 Q 144 110 162 90 Q 178 78 200 84 Q 218 92 222 118 Q 224 138 218 150 Q 200 158 184 158 Q 168 156 158 150 Z"
          fill="#1A100A"
        />
        {/* Shayla pattern dots */}
        <g opacity="0.7">
          <circle cx="170" cy="105" r="1.2" fill="#E8A33D" />
          <circle cx="186" cy="98" r="1.2" fill="#E8A33D" />
          <circle cx="202" cy="106" r="1.2" fill="#E8A33D" />
          <circle cx="216" cy="120" r="1.2" fill="#E8A33D" />
          <circle cx="148" cy="120" r="1.2" fill="#E8A33D" />
          <circle cx="178" cy="118" r="1.2" fill="#E8A33D" />
          <circle cx="208" cy="138" r="1.2" fill="#E8A33D" />
          <circle cx="158" cy="138" r="1.2" fill="#E8A33D" />
        </g>
        {/* Face */}
        <path
          d="M 162 142 Q 158 168 165 188 Q 172 200 184 200 Q 200 200 208 188 Q 216 168 212 142 Q 200 132 188 132 Q 174 132 162 142 Z"
          fill="url(#lpSkin)"
        />
        <path
          d="M 200 152 Q 212 168 208 188 Q 200 200 192 196 Q 196 178 200 152 Z"
          fill="url(#lpSkinDark)"
          opacity="0.5"
        />
        {/* Brows */}
        <path
          d="M 168 152 Q 174 148 182 152"
          stroke="#1A0E08"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 192 152 Q 200 148 206 152"
          stroke="#1A0E08"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Downcast eyes */}
        <path
          d="M 166 162 Q 174 165 184 163"
          stroke="#1A0E08"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 192 163 Q 200 165 208 162"
          stroke="#1A0E08"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Lashes */}
        <line x1="170" y1="164" x2="170" y2="167" stroke="#1A0E08" strokeWidth="0.7" />
        <line x1="174" y1="165" x2="174" y2="168" stroke="#1A0E08" strokeWidth="0.7" />
        <line x1="178" y1="165" x2="178" y2="168" stroke="#1A0E08" strokeWidth="0.7" />
        <line x1="194" y1="165" x2="194" y2="168" stroke="#1A0E08" strokeWidth="0.7" />
        <line x1="198" y1="165" x2="198" y2="168" stroke="#1A0E08" strokeWidth="0.7" />
        <line x1="202" y1="164" x2="202" y2="167" stroke="#1A0E08" strokeWidth="0.7" />
        {/* Nose */}
        <path
          d="M 186 168 Q 184 178 182 184 Q 184 188 188 188"
          stroke="url(#lpSkinDark)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.7"
        />
        {/* Lips */}
        <path
          d="M 178 192 Q 184 194 192 192"
          stroke="#7A1F12"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M 178 192 Q 184 188 192 192" fill="#9A3522" opacity="0.6" />
        {/* Lantern rim-light */}
        <path
          d="M 162 148 Q 160 168 166 188 Q 170 198 178 198"
          stroke="#FFEFD3"
          strokeWidth="1.4"
          fill="none"
          opacity="0.6"
        />
        {/* Earring */}
        <circle cx="160" cy="178" r="1.6" fill="#E8A33D" />
      </g>
    </svg>
  );
}
