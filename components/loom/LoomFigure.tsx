// Wooden hand-loom in 3/4 perspective with in-progress tapestry.
// Three perspective row helpers below mimic the warp/weft compression.

interface LoomFigureProps {
  progress?: number;
  total?: number;
}

export function LoomFigure({ progress = 3, total = 30 }: LoomFigureProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 700 540"
        style={{ width: "100%", maxWidth: 760, height: "auto" }}
        className="ltr-internal"
      >
        <defs>
          <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C5A2E" />
            <stop offset="50%" stopColor="#6B4423" />
            <stop offset="100%" stopColor="#4A2F18" />
          </linearGradient>
          <linearGradient id="woodGradLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A87648" />
            <stop offset="100%" stopColor="#6B4423" />
          </linearGradient>
          <radialGradient id="loomGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F4B860" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F4B860" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nextRowGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0" />
            <stop offset="50%" stopColor="#E8A33D" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="350" cy="280" rx="320" ry="180" fill="url(#loomGlow)" />

        <path d="M 80 100 L 620 80 L 640 96 L 100 116 Z" fill="url(#woodGradLight)" />
        <path d="M 30 460 L 670 470 L 685 490 L 35 480 Z" fill="url(#woodGrad)" />
        <path d="M 80 100 L 30 460 L 50 470 L 100 116 Z" fill="#5A3618" />
        <path d="M 620 80 L 670 470 L 650 470 L 600 96 Z" fill="#5A3618" />
        {[120, 200, 280, 360, 440, 520, 600].map((x) => (
          <circle key={x} cx={x} cy={92 + (x - 360) * 0.04} r="6" fill="#3D2A1E" />
        ))}

        {Array.from({ length: 60 }).map((_, i) => {
          const x1 = 100 + i * 8.66;
          const x2 = 50 + i * 9.7;
          return (
            <line
              key={i}
              x1={x1}
              y1="116"
              x2={x2}
              y2="475"
              stroke="#C9A876"
              strokeWidth="0.7"
              opacity="0.85"
            />
          );
        })}

        <ChevronRowPerspective y1={420} y2={460} />
        <ShajarahRowPerspective y1={380} y2={420} />
        <EyounRowPerspective y1={340} y2={380} />

        <rect x="86" y="296" width="528" height="38" fill="url(#nextRowGlow)" opacity="0.6" />

        <g transform="translate(640 310)">
          <ellipse cx="0" cy="0" rx="40" ry="9" fill="#4A2F18" />
          <ellipse cx="0" cy="-2" rx="36" ry="7" fill="#6B4423" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#E8A33D" strokeWidth="2" />
        </g>

        <text
          x="350"
          y="50"
          textAnchor="middle"
          fill="#F0E4C9"
          fontFamily="Cormorant Garamond, serif"
          fontSize="22"
          letterSpacing="3"
          opacity="0.7"
        >
          {progress} / {total} ROWS WOVEN
        </text>
      </svg>
    </div>
  );
}

function ChevronRowPerspective({ y1, y2 }: { y1: number; y2: number }) {
  const topL = 86 + (y1 - 100) * 0.135;
  const topR = 614 - (y1 - 100) * 0.135;
  const botL = 86 + (y2 - 100) * 0.135;
  const botR = 614 - (y2 - 100) * 0.135;
  return (
    <g>
      <path
        d={`M ${topL} ${y1} L ${topR} ${y1} L ${botR} ${y2} L ${botL} ${y2} Z`}
        fill="#B5341E"
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const tx1 = topL + (topR - topL) * (i / 12);
        const tx2 = topL + (topR - topL) * ((i + 0.5) / 12);
        const tx3 = topL + (topR - topL) * ((i + 1) / 12);
        return (
          <path key={i} d={`M ${tx1} ${y1} L ${tx2} ${y2} L ${tx3} ${y1} Z`} fill="#E8A33D" />
        );
      })}
    </g>
  );
}

function ShajarahRowPerspective({ y1, y2 }: { y1: number; y2: number }) {
  const topL = 86 + (y1 - 100) * 0.135;
  const topR = 614 - (y1 - 100) * 0.135;
  const botL = 86 + (y2 - 100) * 0.135;
  const botR = 614 - (y2 - 100) * 0.135;
  return (
    <g>
      <path
        d={`M ${topL} ${y1} L ${topR} ${y1} L ${botR} ${y2} L ${botL} ${y2} Z`}
        fill="#F0E4C9"
      />
      {Array.from({ length: 9 }).map((_, i) => {
        const cx = topL + (topR - topL) * ((i + 0.5) / 9);
        const w = (topR - topL) / 9;
        return (
          <g key={i}>
            <rect x={cx - 1.5} y={y1 + 4} width="3" height={y2 - y1 - 8} fill="#1B2D5C" />
            <rect x={cx - w * 0.25} y={y1 + 8} width={w * 0.5} height="2.5" fill="#1B2D5C" />
            <rect x={cx - w * 0.18} y={y1 + 16} width={w * 0.36} height="2.5" fill="#1B2D5C" />
          </g>
        );
      })}
    </g>
  );
}

function EyounRowPerspective({ y1, y2 }: { y1: number; y2: number }) {
  const topL = 86 + (y1 - 100) * 0.135;
  const topR = 614 - (y1 - 100) * 0.135;
  const botL = 86 + (y2 - 100) * 0.135;
  const botR = 614 - (y2 - 100) * 0.135;
  const cy = (y1 + y2) / 2;
  return (
    <g>
      <path
        d={`M ${topL} ${y1} L ${topR} ${y1} L ${botR} ${y2} L ${botL} ${y2} Z`}
        fill="#1B2D5C"
      />
      {Array.from({ length: 11 }).map((_, i) => {
        const cx = topL + (topR - topL) * ((i + 0.5) / 11);
        const w = ((topR - topL) / 11) * 0.7;
        return (
          <g key={i}>
            <path
              d={`M ${cx - w / 2} ${cy} L ${cx} ${y1 + 4} L ${cx + w / 2} ${cy} L ${cx} ${y2 - 4} Z`}
              fill="#E8A33D"
            />
            <circle cx={cx} cy={cy} r="2" fill="#1B2D5C" />
          </g>
        );
      })}
    </g>
  );
}
