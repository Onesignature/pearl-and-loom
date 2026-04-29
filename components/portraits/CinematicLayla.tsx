"use client";

// Cinematic Layla — seated weaver figure used as an overlay on top of the
// Loom Hub's loom illustration. Standalone SVG (no backdrop) so it composites
// cleanly over whatever scene she's placed on.
// Includes: thobe with tatreez embroidery, patterned shayla, hands threading
// the weft (right arm animates), drifting dust motes catching lantern light,
// gentle breathing motion.

interface CinematicLaylaProps {
  scale?: number;
  mirrored?: boolean;
}

const MOTES = Array.from({ length: 14 }, (_, i) => ({
  x: 8 + ((i * 17 + (i % 3) * 11) % 84),
  y: 10 + ((i * 13 + (i % 5) * 7) % 80),
  size: 1.2 + (i % 3) * 0.6,
  duration: 8 + (i % 6),
  delay: -((i * 0.7) % 12),
  drift: 4 + (i % 4) * 3,
}));

export function CinematicLayla({ scale = 1, mirrored = false }: CinematicLaylaProps) {
  return (
    <div
      style={{
        width: 360 * scale,
        height: 480 * scale,
        position: "relative",
        transform: mirrored ? "scaleX(-1)" : "none",
      }}
    >
      {/* Dust motes drifting in the lantern beam */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 5,
        }}
      >
        {MOTES.map((m, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              insetInlineStart: `${m.x}%`,
              top: `${m.y}%`,
              width: m.size,
              height: m.size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,239,211,0.95), rgba(244,184,96,0.4) 60%, transparent)",
              boxShadow: "0 0 4px rgba(244,184,96,0.6)",
              animation: `cinLayMote${i} ${m.duration}s ease-in-out infinite`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
        <style>{MOTES.map(
          (m, i) => `
            @keyframes cinLayMote${i} {
              0%, 100% { transform: translate(0, 0); opacity: 0.4; }
              25% { transform: translate(${m.drift}px, -${m.drift * 0.6}px); opacity: 0.85; }
              50% { transform: translate(${m.drift * 1.4}px, -${m.drift * 1.2}px); opacity: 0.6; }
              75% { transform: translate(${m.drift * 0.6}px, -${m.drift * 1.6}px); opacity: 0.3; }
            }
          `,
        ).join("\n")}</style>
      </div>

      <svg
        viewBox="0 0 360 480"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="cinLaySkin" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#E8C29A" />
            <stop offset="100%" stopColor="#A87648" />
          </linearGradient>
          <linearGradient id="cinLaySkinDark" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#C9956A" />
            <stop offset="100%" stopColor="#7A4A2E" />
          </linearGradient>
          <linearGradient id="cinLayThobe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9A2B1A" />
            <stop offset="60%" stopColor="#7A1F12" />
            <stop offset="100%" stopColor="#4A140A" />
          </linearGradient>
          <linearGradient id="cinLayShayla" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3D2F2A" />
            <stop offset="50%" stopColor="#2A1810" />
            <stop offset="100%" stopColor="#1A100A" />
          </linearGradient>
          <radialGradient id="cinLayLanternGlow" cx="0%" cy="30%" r="120%">
            <stop offset="0%" stopColor="#FFEFD3" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#F4B860" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F4B860" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cinLayFaceShade" cx="65%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </radialGradient>
          <pattern
            id="cinLayTatreez"
            x="0"
            y="0"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <rect width="14" height="14" fill="transparent" />
            <path d="M 7 2 L 12 7 L 7 12 L 2 7 Z" fill="#E8A33D" opacity="0.9" />
            <circle cx="7" cy="7" r="1.5" fill="#7A1F12" />
          </pattern>
        </defs>

        {/* Lantern rim-light wash on the figure (warm side) */}
        <ellipse cx="80" cy="220" rx="180" ry="240" fill="url(#cinLayLanternGlow)" />

        {/* Body group — slow breathing animation */}
        <g
          style={{
            animation: "cinLaylaBreathe 4.2s ease-in-out infinite",
            transformOrigin: "180px 300px",
          }}
        >
          {/* Lap / seated lower body — fabric pooled */}
          <path
            d="M 110 360 Q 90 410 100 470 L 280 470 Q 290 420 270 360 Q 260 340 220 340 L 160 340 Q 130 342 110 360 Z"
            fill="url(#cinLayThobe)"
          />
          <path
            d="M 130 380 Q 140 420 145 470"
            stroke="#3D0E08"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 200 350 Q 205 410 215 470"
            stroke="#3D0E08"
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 250 380 Q 245 420 240 470"
            stroke="#3D0E08"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />

          {/* Torso — thobe upper */}
          <path
            d="M 130 230 Q 120 290 130 360 L 250 360 Q 260 290 250 230 Q 240 210 220 200 Q 200 195 190 195 Q 180 195 160 200 Q 140 210 130 230 Z"
            fill="url(#cinLayThobe)"
          />
          <path
            d="M 130 230 Q 120 290 130 360 L 250 360 Q 260 290 250 230 Q 240 210 220 200 Q 200 195 190 195 Q 180 195 160 200 Q 140 210 130 230 Z"
            fill="url(#cinLayFaceShade)"
          />

          {/* Tatreez embroidery panel — neckline */}
          <rect x="172" y="208" width="36" height="80" fill="url(#cinLayTatreez)" />
          <rect
            x="172"
            y="208"
            width="36"
            height="80"
            fill="none"
            stroke="#3D0E08"
            strokeWidth="1"
          />
          <rect x="120" y="346" width="140" height="6" fill="url(#cinLayTatreez)" />

          {/* Right arm (figure's right) — extended forward to loom, threading weft */}
          <g
            style={{
              animation: "cinLaylaArmWeft 3.2s ease-in-out infinite",
              transformOrigin: "240px 240px",
            }}
          >
            <path
              d="M 240 220 Q 280 240 310 270 Q 318 280 310 286 Q 296 280 264 256 Q 244 244 234 232 Z"
              fill="url(#cinLayThobe)"
            />
            <path
              d="M 304 268 Q 314 274 314 284 L 296 290 Q 290 282 296 272 Z"
              fill="#7A1F12"
              stroke="#E8A33D"
              strokeWidth="1"
            />
            <path
              d="M 308 282 Q 326 294 340 308 Q 344 312 340 316 Q 332 318 322 310 Q 312 300 302 292 Z"
              fill="url(#cinLaySkin)"
            />
            <g transform="translate(338 308)">
              <ellipse cx="0" cy="0" rx="11" ry="8" fill="url(#cinLaySkin)" />
              <path
                d="M 8 -4 Q 14 -2 16 4 L 12 6 Q 10 2 6 0 Z"
                fill="url(#cinLaySkin)"
              />
              <path
                d="M 6 -6 Q 12 -8 14 -2 L 10 0 Q 8 -4 4 -4 Z"
                fill="url(#cinLaySkinDark)"
                opacity="0.6"
              />
              {/* Wooden shuttle */}
              <ellipse
                cx="14"
                cy="2"
                rx="14"
                ry="3.5"
                fill="#5A3618"
                transform="rotate(-15 14 2)"
              />
              <ellipse
                cx="14"
                cy="1.5"
                rx="12"
                ry="2.5"
                fill="#8C5A2E"
                transform="rotate(-15 14 1.5)"
              />
              {/* Yarn trail from shuttle */}
              <path
                d="M 26 -2 Q 50 4 70 12"
                stroke="#E8A33D"
                strokeWidth="1.4"
                fill="none"
                opacity="0.85"
              />
            </g>
          </g>

          {/* Left arm — bent at elbow, hand resting on warp threads */}
          <g>
            <path
              d="M 138 230 Q 116 252 100 286 Q 96 296 104 300 Q 116 296 130 270 Q 142 250 152 236 Z"
              fill="url(#cinLayThobe)"
            />
            <path
              d="M 96 286 Q 104 298 116 296 L 110 308 Q 96 304 92 294 Z"
              fill="#7A1F12"
              stroke="#E8A33D"
              strokeWidth="1"
            />
            <path
              d="M 100 300 Q 96 318 102 332 Q 110 336 116 332 Q 118 318 116 304 Z"
              fill="url(#cinLaySkin)"
            />
            <g transform="translate(108 332)">
              <ellipse cx="0" cy="2" rx="10" ry="7" fill="url(#cinLaySkin)" />
              {/* Individual fingers touching warps */}
              <path
                d="M -6 6 L -7 14 M -2 7 L -2 16 M 2 7 L 3 16 M 6 6 L 8 14"
                stroke="url(#cinLaySkinDark)"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M -6 6 L -7 14 M -2 7 L -2 16 M 2 7 L 3 16 M 6 6 L 8 14"
                stroke="url(#cinLaySkin)"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>

          {/* Head + face */}
          <g>
            <path
              d="M 175 178 Q 175 198 178 208 L 202 208 Q 205 198 205 178 Z"
              fill="url(#cinLaySkinDark)"
            />
            <path
              d="M 142 130 Q 130 120 134 90 Q 142 60 180 50 Q 220 52 232 80 Q 240 120 232 140 Q 232 180 222 200 L 220 220 L 160 220 L 158 200 Q 150 180 142 160 Z"
              fill="url(#cinLayShayla)"
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
            {/* Shayla drape over shoulders */}
            <path
              d="M 142 156 Q 134 200 130 240 L 152 240 Q 156 210 158 180 Z"
              fill="url(#cinLayShayla)"
              opacity="0.85"
            />
            <path
              d="M 232 152 Q 240 196 244 240 L 224 240 Q 220 210 218 178 Z"
              fill="url(#cinLayShayla)"
              opacity="0.85"
            />
            {/* Shayla edge embroidery */}
            <path
              d="M 152 156 Q 158 178 162 200"
              stroke="#E8A33D"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 222 156 Q 218 178 216 200"
              stroke="#E8A33D"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />

            {/* Face — three-quarter view, downcast on weaving */}
            <path
              d="M 162 142 Q 158 168 165 188 Q 172 200 184 200 Q 200 200 208 188 Q 216 168 212 142 Q 200 132 188 132 Q 174 132 162 142 Z"
              fill="url(#cinLaySkin)"
            />
            <path
              d="M 200 152 Q 212 168 208 188 Q 200 200 192 196 Q 196 178 200 152 Z"
              fill="url(#cinLaySkinDark)"
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
            {/* Eyelashes */}
            <line x1="170" y1="164" x2="170" y2="167" stroke="#1A0E08" strokeWidth="0.7" />
            <line x1="174" y1="165" x2="174" y2="168" stroke="#1A0E08" strokeWidth="0.7" />
            <line x1="178" y1="165" x2="178" y2="168" stroke="#1A0E08" strokeWidth="0.7" />
            <line x1="194" y1="165" x2="194" y2="168" stroke="#1A0E08" strokeWidth="0.7" />
            <line x1="198" y1="165" x2="198" y2="168" stroke="#1A0E08" strokeWidth="0.7" />
            <line x1="202" y1="164" x2="202" y2="167" stroke="#1A0E08" strokeWidth="0.7" />
            {/* Nose — soft shadow */}
            <path
              d="M 186 168 Q 184 178 182 184 Q 184 188 188 188"
              stroke="url(#cinLaySkinDark)"
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
            {/* Chin shadow */}
            <path
              d="M 180 198 Q 186 202 192 198"
              stroke="url(#cinLaySkinDark)"
              strokeWidth="0.8"
              fill="none"
              opacity="0.5"
            />
            {/* Lantern rim-light catch */}
            <path
              d="M 162 148 Q 160 168 166 188 Q 170 198 178 198"
              stroke="#FFEFD3"
              strokeWidth="1.4"
              fill="none"
              opacity="0.6"
            />
            {/* Earring glint */}
            <circle cx="160" cy="178" r="1.6" fill="#E8A33D" />
          </g>
        </g>

        <style>{`
          @keyframes cinLaylaBreathe {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-1.5px) scale(1.005); }
          }
          @keyframes cinLaylaArmWeft {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            40% { transform: translate(-8px, -2px) rotate(-3deg); }
            55% { transform: translate(-12px, 0) rotate(-5deg); }
            75% { transform: translate(-4px, 2px) rotate(-1deg); }
          }
        `}</style>
      </svg>
    </div>
  );
}
