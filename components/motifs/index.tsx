// Sadu motif library — authentic Bedouin weaving primitives recreated
// as scalable SVG. Each motif is a 60×40 cell that tiles horizontally
// to form a row band of a tapestry.
//
//   al-mthalath (المثلث)   — triangles, often paired tip-to-tip
//   al-shajarah (الشجرة)   — tree of life, central pictograph
//   al-eyoun (العيون)      — eyes / diamonds, protection
//   al-mushat (المشط)       — comb, daily-life reference
//   hubub (حبوب)            — grain seeds, dotted bands
//   dhurs al-khail (ضرس)   — horse-teeth, alternating squares
//   uwairjan (عويرجان)     — facing-triangle border (chevron)
//   khat (خط)               — warp band separator (stripe)
//
// Sources: Sheikh Zayed Festival Sadu workshop documentation, Sharjah
// Heritage Institute, UNESCO Intangible Heritage register (Al Sadu, 2011).

import type { MotifId } from "@/lib/pattern-engine/types";

interface MotifProps {
  fg?: string;
  bg?: string;
  outline?: string;
  w?: number | string;
  h?: number | string;
}

const SVG_BASE = {
  viewBox: "0 0 60 40",
  preserveAspectRatio: "none" as const,
};

export function MotifMthalath({
  fg = "var(--madder)",
  bg = "transparent",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      <path d="M 0 0 L 15 20 L 30 0 Z M 30 0 L 45 20 L 60 0 Z" fill={fg} />
      <path d="M 0 40 L 15 20 L 30 40 Z M 30 40 L 45 20 L 60 40 Z" fill={fg} opacity="0.85" />
    </svg>
  );
}

export function MotifShajarah({
  fg = "var(--indigo)",
  bg = "transparent",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      <rect x="28" y="6" width="4" height="28" fill={fg} />
      <rect x="20" y="10" width="8" height="3" fill={fg} />
      <rect x="32" y="10" width="8" height="3" fill={fg} />
      <rect x="14" y="16" width="6" height="3" fill={fg} />
      <rect x="40" y="16" width="6" height="3" fill={fg} />
      <rect x="22" y="22" width="6" height="3" fill={fg} />
      <rect x="32" y="22" width="6" height="3" fill={fg} />
      <rect x="22" y="34" width="16" height="3" fill={fg} />
      <rect x="26" y="3" width="8" height="3" fill={fg} />
    </svg>
  );
}

export function MotifEyoun({
  fg = "var(--saffron)",
  bg = "transparent",
  outline = "var(--indigo)",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      <path d="M 15 20 L 30 4 L 45 20 L 30 36 Z" fill={fg} stroke={outline} strokeWidth="1.5" />
      <path d="M 22 20 L 30 12 L 38 20 L 30 28 Z" fill={outline} />
      <circle cx="30" cy="20" r="2.5" fill={fg} />
      <path d="M 4 20 L 8 16 L 12 20 L 8 24 Z" fill={outline} opacity="0.7" />
      <path d="M 48 20 L 52 16 L 56 20 L 52 24 Z" fill={outline} opacity="0.7" />
    </svg>
  );
}

export function MotifMushat({
  fg = "var(--charcoal)",
  bg = "transparent",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      <rect x="2" y="28" width="56" height="4" fill={fg} />
      {[2, 9, 16, 23, 30, 37, 44, 51].map((x) => (
        <rect key={x} x={x} y="8" width="3" height="20" fill={fg} />
      ))}
      <rect x="2" y="32" width="56" height="2" fill={fg} opacity="0.5" />
    </svg>
  );
}

export function MotifHubub({
  fg = "var(--wool)",
  bg = "var(--indigo)",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      {[10, 20, 30, 40, 50].map((x) => (
        <ellipse key={`a${x}`} cx={x} cy="13" rx="2.5" ry="3.5" fill={fg} />
      ))}
      {[5, 15, 25, 35, 45, 55].map((x) => (
        <ellipse key={`b${x}`} cx={x} cy="27" rx="2.5" ry="3.5" fill={fg} />
      ))}
      <line x1="0" y1="20" x2="60" y2="20" stroke={fg} strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

export function MotifDhurs({
  fg = "var(--wool)",
  bg = "var(--charcoal)",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      {[0, 12, 24, 36, 48].map((x) => (
        <g key={x}>
          <rect x={x} y="2" width="6" height="16" fill={fg} />
          <rect x={x + 6} y="22" width="6" height="16" fill={fg} />
        </g>
      ))}
    </svg>
  );
}

export function MotifChevron({
  fg = "var(--saffron)",
  bg = "var(--madder)",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      <path d="M 0 30 L 15 14 L 30 30 L 45 14 L 60 30 L 60 40 L 0 40 Z" fill={fg} />
      <path
        d="M 0 18 L 15 2 L 30 18 L 45 2 L 60 18"
        stroke={fg}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

export function MotifStripe({
  fg = "var(--wool)",
  bg = "var(--madder-deep)",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      <rect x="0" y="18" width="60" height="4" fill={fg} />
      <rect x="0" y="6" width="60" height="1" fill={fg} opacity="0.4" />
      <rect x="0" y="33" width="60" height="1" fill={fg} opacity="0.4" />
    </svg>
  );
}

export function MotifDiamond({
  fg = "var(--saffron)",
  bg = "transparent",
  w = 60,
  h = 40,
}: MotifProps) {
  return (
    <svg {...SVG_BASE} width={w} height={h}>
      <rect width="60" height="40" fill={bg} />
      <path d="M 30 4 L 50 20 L 30 36 L 10 20 Z" fill={fg} />
    </svg>
  );
}

export type MotifComponent = (props: MotifProps) => React.JSX.Element;

export const MOTIF_COMPONENTS: Record<MotifId, MotifComponent | null> = {
  mthalath: MotifMthalath,
  shajarah: MotifShajarah,
  eyoun: MotifEyoun,
  mushat: MotifMushat,
  hubub: MotifHubub,
  dhurs: MotifDhurs,
  chevron: MotifChevron,
  stripe: MotifStripe,
  diamond: MotifDiamond,
  blank: null,
};

export interface MotifMeta {
  id: MotifId;
  en: string;
  ar: string;
  noteEn: string;
  noteAr: string;
}

export const MOTIF_REGISTRY: MotifMeta[] = [
  {
    id: "mthalath",
    en: "Al-Mthalath",
    ar: "المثلث",
    noteEn: "Triangles — desert dunes",
    noteAr: "المثلثات — كثبان الصحراء",
  },
  {
    id: "shajarah",
    en: "Al-Shajarah",
    ar: "الشجرة",
    noteEn: "Tree of life — central pictograph",
    noteAr: "شجرة الحياة — الرمز المركزي",
  },
  {
    id: "eyoun",
    en: "Al-Eyoun",
    ar: "العيون",
    noteEn: "Eyes / diamonds — protection",
    noteAr: "العيون — الحماية",
  },
  {
    id: "mushat",
    en: "Al-Mushat",
    ar: "المشط",
    noteEn: "The comb — daily life",
    noteAr: "المشط — الحياة اليومية",
  },
  {
    id: "hubub",
    en: "Hubub",
    ar: "حبوب",
    noteEn: "Grains — sustenance",
    noteAr: "حبوب — الرزق",
  },
  {
    id: "dhurs",
    en: "Dhurs al-Khail",
    ar: "ضرس الخيل",
    noteEn: "Horse-teeth border",
    noteAr: "حدود ضرس الخيل",
  },
  {
    id: "chevron",
    en: "Uwairjan",
    ar: "عويرجان",
    noteEn: "Facing-triangle border",
    noteAr: "حدود المثلثات المتقابلة",
  },
  {
    id: "stripe",
    en: "Khat",
    ar: "خط",
    noteEn: "Warp band separator",
    noteAr: "فاصل",
  },
];

interface MotifRowProps extends MotifProps {
  Motif: MotifComponent;
  count?: number;
  height?: number;
}

export function MotifRow({ Motif, count = 12, height = 28, ...props }: MotifRowProps) {
  return (
    <div
      className="ltr-internal"
      style={{ display: "flex", height, width: "100%" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: "100%" }}>
          <Motif {...props} w="100%" h="100%" />
        </div>
      ))}
    </div>
  );
}
