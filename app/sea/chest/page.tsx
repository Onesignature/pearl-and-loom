"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress, type PearlGrade } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { TAPESTRY_25 } from "@/lib/tapestry/composition";
import { MOTIF_COMPONENTS } from "@/components/motifs";
import { BadgeGrid } from "@/components/achievements/BadgeGrid";
import { PEARL_TIERS } from "@/lib/pearl/colors";

const TOTAL_SLOTS = 12;

export default function PearlChestPage() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const pearls = useProgress((s) => s.pearls);
  const counts: Record<PearlGrade, number> = {
    common: pearls.filter((p) => p.grade === "common").length,
    fine: pearls.filter((p) => p.grade === "fine").length,
    royal: pearls.filter((p) => p.grade === "royal").length,
  };

  const slots: ({ grade: PearlGrade } | null)[] = [
    ...pearls.slice(0, TOTAL_SLOTS).map((p) => ({ grade: p.grade })),
    ...Array.from({ length: Math.max(0, TOTAL_SLOTS - pearls.length) }, () => null),
  ];

  return (
    <TentScene>
      <TopChrome
        onHome={() => router.push("/")}
        title={`${t("heirloom.title")} · ${t("heirloom.pearls")}`}
        subtitle={`${t("heirloom.saifContribution").toUpperCase()} · ${fmt(pearls.length)}/${fmt(TOTAL_SLOTS)}`}
      />

      {/* Layla's weave · awaits — full-height portrait textile with warp-thread fringes,
          showing all 25 rows of the heirloom tapestry the pearls will be braided into.
          Hidden on tablet/mobile portrait (≤1100w) where it would overlap the centered chest. */}
      <div
        className="chest-weave-preview"
        style={{
          position: "absolute",
          top: 86,
          insetInlineEnd: 40,
          width: 200,
          bottom: 28,
          opacity: 0.4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: "var(--saffron)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.85,
            textAlign: "center",
            marginBottom: 8,
            flex: "0 0 auto",
            fontFamily: "var(--font-cormorant), serif",
          }}
        >
          {lang === "en" ? "Layla's weave · awaits" : "نسيج ليلى · ينتظر"}
        </div>
        {/* Top fringe — warp threads sticking out the top */}
        <div
          aria-hidden
          style={{
            width: "100%",
            height: 12,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-end",
            flex: "0 0 auto",
          }}
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 1,
                height: 6 + (i % 3) * 2,
                background: "rgba(240,228,201,0.5)",
              }}
            />
          ))}
        </div>
        {/* The full 25-row tapestry — fills the available vertical space */}
        <div
          className="ltr-internal"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column-reverse",
            border: "1px solid rgba(240,228,201,0.2)",
            flex: "1 1 auto",
            minHeight: 0,
          }}
        >
          {TAPESTRY_25.map((row, i) => {
            const Motif = MOTIF_COMPONENTS[row.motif];
            return Motif ? (
              <div key={i} style={{ flex: 1, minHeight: 0 }}>
                <Motif {...row.palette} w="100%" h="100%" />
              </div>
            ) : null;
          })}
        </div>
        {/* Bottom fringe — warp threads sticking out the bottom */}
        <div
          aria-hidden
          style={{
            width: "100%",
            height: 14,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
            flex: "0 0 auto",
          }}
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 1,
                height: 8 + (i % 4) * 2,
                background: "rgba(240,228,201,0.5)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 9,
            color: "var(--saffron)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.8,
            textAlign: "center",
            flex: "0 0 auto",
          }}
        >
          {lang === "en" ? "Drag pearls to braid them in" : "اسحب اللؤلؤ لضمّه"}
        </div>
      </div>

      <div
        className="chest-scroll"
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 110,
          paddingBottom: 28,
          paddingInline: "clamp(16px, 3vw, 60px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          className="chest-stage"
          style={{ width: "min(600px, 100%)", position: "relative" }}
        >
          <ChestSVG />
          {/* Pearl grid sits inside the velvet-lined interior of the chest.
              Interior viewBox: x 110-490 (380w), y 175-388 (213h).
              In CSS percentages of 600×440 container: left/right 18.3%, top 39.8%, bottom 11.8%. */}
          <div
            style={{
              position: "absolute",
              left: "18.3%",
              right: "18.3%",
              top: "39.8%",
              bottom: "11.8%",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(3, 1fr)",
              gap: 0,
              padding: "6px 8px",
            }}
          >
            {slots.map((p, i) => (
              <PearlSlot key={i} pearl={p} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, display: "flex", gap: 28, color: "var(--wool)", flexWrap: "wrap", justifyContent: "center" }}>
          <PearlCount tier="common" count={counts.common} label={t("pearl.common")} />
          <PearlCount tier="fine" count={counts.fine} label={t("pearl.fine")} />
          <PearlCount tier="royal" count={counts.royal} label={t("pearl.royal")} />
          <div
            style={{
              borderInlineStart: "1px solid rgba(240,228,201,0.3)",
              paddingInlineStart: 28,
            }}
          >
            <div
              className="font-display"
              style={{ fontSize: 28, color: "var(--saffron)", lineHeight: 1 }}
            >
              {fmt(pearls.length)}
              <span style={{ opacity: 0.5 }}>/</span>
              {fmt(TOTAL_SLOTS)}
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                opacity: 0.7,
                marginTop: 4,
              }}
            >
              {lang === "en" ? "Pearls Collected" : "لؤلؤات مجموعة"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => router.push("/loom/braiding")}
            className="braid-btn"
            disabled={pearls.length === 0}
            style={{ marginTop: 0 }}
          >
            {lang === "en" ? "BRAID INTO TAPESTRY →" : "ضمّ إلى النسيج →"}
          </button>
          <button
            onClick={() => router.push("/souk")}
            className="souk-btn"
          >
            {lang === "en" ? "SPEND AT THE SOUK →" : "أنفق في السوق →"}
          </button>
        </div>

        <BadgeGrid />
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .chest-weave-preview { display: none !important; }
        }
        @media (max-width: 900px) {
          .chest-scroll {
            justify-content: flex-start !important;
            padding-top: 124px !important;
            row-gap: 6px;
          }
        }
        @media (max-width: 640px) {
          .chest-scroll {
            padding-top: 132px !important;
            padding-bottom: 60px !important;
          }
        }
        .braid-btn {
          margin-top: 24px;
          padding: 14px 36px;
          background: var(--saffron);
          color: var(--charcoal);
          border: none;
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          letter-spacing: 0.3em;
          cursor: pointer;
          transition: all 0.3s var(--ease-loom);
        }
        .braid-btn:hover:not(:disabled) {
          background: var(--saffron-soft);
          transform: translateY(-2px);
        }
        .braid-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .souk-btn {
          padding: 14px 28px;
          background: transparent;
          color: var(--saffron);
          border: 1px solid var(--saffron);
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          letter-spacing: 0.3em;
          cursor: pointer;
          transition: all 0.3s var(--ease-loom);
        }
        .souk-btn:hover {
          background: rgba(232,163,61,0.18);
          transform: translateY(-2px);
        }
      `}</style>
    </TentScene>
  );
}

function ChestSVG() {
  // Bedouin pearl-merchant's box — sandalwood with brass fittings, mother-of-pearl
  // Sadu inlay on the open lid (tilted back ~30°), and an indigo velvet-lined
  // interior with hand-stitched 4×3 compartment grid for the pearls.
  // viewBox: 600 × 440. Pearl wells live in the interior region.
  return (
    <svg
      viewBox="0 0 600 440"
      style={{ width: "100%", display: "block" }}
      className="ltr-internal"
    >
      <defs>
        <linearGradient id="cSandalwoodTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8633A" />
          <stop offset="60%" stopColor="#7C4321" />
          <stop offset="100%" stopColor="#4D2812" />
        </linearGradient>
        <linearGradient id="cSandalwoodFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E5028" />
          <stop offset="100%" stopColor="#3D1F0F" />
        </linearGradient>
        <linearGradient id="cSandalwoodSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5A3018" />
          <stop offset="100%" stopColor="#2A150A" />
        </linearGradient>
        <linearGradient id="cBrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8C36A" />
          <stop offset="50%" stopColor="#A07832" />
          <stop offset="100%" stopColor="#5A4218" />
        </linearGradient>
        <linearGradient id="cBrassDim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A07832" />
          <stop offset="100%" stopColor="#3D2C10" />
        </linearGradient>
        <radialGradient id="cVelvet" cx="50%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#3A4480" />
          <stop offset="60%" stopColor="#1B2554" />
          <stop offset="100%" stopColor="#0A1030" />
        </radialGradient>
        <radialGradient id="cMOP" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E8E0F0" />
          <stop offset="80%" stopColor="#B8B0CC" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8888A8" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="cWoodGrain"
          x="0"
          y="0"
          width="80"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 12 Q 40 8 80 14 M 0 30 Q 40 26 80 32 M 0 52 Q 40 48 80 54 M 0 76 Q 40 72 80 78 M 0 96 Q 40 92 80 98"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.6"
            fill="none"
          />
          <path
            d="M 0 20 Q 40 24 80 18 M 0 64 Q 40 68 80 62"
            stroke="rgba(255,220,180,0.08)"
            strokeWidth="0.4"
            fill="none"
          />
        </pattern>
        <radialGradient id="cFloorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Floor shadow under the chest */}
      <ellipse cx="300" cy="420" rx="270" ry="14" fill="url(#cFloorShadow)" />

      {/* === OPEN LID — tilted back ~30°, mother-of-pearl Sadu inlay === */}
      <path d="M 90 140 L 510 140 L 480 30 L 120 30 Z" fill="url(#cSandalwoodTop)" />
      <path d="M 90 140 L 510 140 L 480 30 L 120 30 Z" fill="url(#cWoodGrain)" opacity="0.5" />
      <path
        d="M 130 132 L 470 132 L 450 42 L 150 42 Z"
        fill="#3D1F0F"
        stroke="#1A0E08"
        strokeWidth="1"
      />

      {/* Mother-of-pearl Sadu inlay on lid */}
      <g opacity="0.92">
        <path
          d="M 300 50 L 340 87 L 300 124 L 260 87 Z"
          fill="url(#cMOP)"
          stroke="#5A4218"
          strokeWidth="0.6"
        />
        <path
          d="M 300 64 L 326 87 L 300 110 L 274 87 Z"
          fill="none"
          stroke="#5A4218"
          strokeWidth="0.6"
        />
        <circle cx="300" cy="87" r="4" fill="url(#cMOP)" />
        <path
          d="M 220 60 L 244 87 L 220 114 L 196 87 Z"
          fill="url(#cMOP)"
          opacity="0.85"
          stroke="#5A4218"
          strokeWidth="0.5"
        />
        <path
          d="M 380 60 L 404 87 L 380 114 L 356 87 Z"
          fill="url(#cMOP)"
          opacity="0.85"
          stroke="#5A4218"
          strokeWidth="0.5"
        />
        <path
          d="M 165 70 L 180 87 L 165 104 L 150 87 Z"
          fill="url(#cMOP)"
          opacity="0.7"
          stroke="#5A4218"
          strokeWidth="0.4"
        />
        <path
          d="M 435 70 L 450 87 L 435 104 L 420 87 Z"
          fill="url(#cMOP)"
          opacity="0.7"
          stroke="#5A4218"
          strokeWidth="0.4"
        />
      </g>
      <line x1="155" y1="50" x2="445" y2="50" stroke="url(#cBrass)" strokeWidth="1" opacity="0.7" />
      <line
        x1="140"
        y1="124"
        x2="460"
        y2="124"
        stroke="url(#cBrass)"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Lid front edge thickness */}
      <path d="M 90 140 L 510 140 L 510 132 L 90 132 Z" fill="url(#cSandalwoodFront)" />
      <rect x="90" y="138" width="420" height="2" fill="url(#cBrass)" />

      {/* Hinges (two of them) */}
      <g>
        <rect
          x="180"
          y="138"
          width="36"
          height="14"
          rx="2"
          fill="url(#cBrassDim)"
          stroke="#3D2C10"
          strokeWidth="0.6"
        />
        <circle cx="186" cy="145" r="1.4" fill="#1A1308" />
        <circle cx="210" cy="145" r="1.4" fill="#1A1308" />
        <rect
          x="384"
          y="138"
          width="36"
          height="14"
          rx="2"
          fill="url(#cBrassDim)"
          stroke="#3D2C10"
          strokeWidth="0.6"
        />
        <circle cx="390" cy="145" r="1.4" fill="#1A1308" />
        <circle cx="414" cy="145" r="1.4" fill="#1A1308" />
      </g>

      {/* === CHEST BODY === */}
      <path d="M 510 152 L 540 170 L 540 400 L 510 400 Z" fill="url(#cSandalwoodSide)" />
      <rect x="90" y="152" width="420" height="248" fill="url(#cSandalwoodFront)" />
      <rect x="90" y="152" width="420" height="248" fill="url(#cWoodGrain)" opacity="0.4" />

      {/* Velvet-lined interior visible through opening */}
      <path d="M 110 152 L 490 152 L 470 175 L 130 175 Z" fill="#0A1030" />
      <rect x="110" y="170" width="380" height="220" fill="url(#cVelvet)" />
      <rect x="106" y="148" width="388" height="6" fill="url(#cBrass)" />
      <rect x="108" y="153" width="384" height="2" fill="rgba(0,0,0,0.4)" />

      {/* Hand-stitched velvet quilting — 4×3 compartment seams */}
      <g
        stroke="rgba(255,220,180,0.18)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        fill="none"
      >
        <line x1="205" y1="178" x2="205" y2="384" />
        <line x1="300" y1="178" x2="300" y2="384" />
        <line x1="395" y1="178" x2="395" y2="384" />
        <line x1="118" y1="240" x2="482" y2="240" />
        <line x1="118" y1="312" x2="482" y2="312" />
      </g>

      {/* Brass corner brackets */}
      <path
        d="M 86 148 L 130 148 L 130 156 L 94 156 L 94 192 L 86 192 Z"
        fill="url(#cBrass)"
        stroke="#3D2C10"
        strokeWidth="0.6"
      />
      <circle cx="92" cy="154" r="1.4" fill="#3D2C10" />
      <circle cx="124" cy="154" r="1.4" fill="#3D2C10" />
      <circle cx="92" cy="186" r="1.4" fill="#3D2C10" />
      <path
        d="M 514 148 L 470 148 L 470 156 L 506 156 L 506 192 L 514 192 Z"
        fill="url(#cBrass)"
        stroke="#3D2C10"
        strokeWidth="0.6"
      />
      <circle cx="508" cy="154" r="1.4" fill="#3D2C10" />
      <circle cx="476" cy="154" r="1.4" fill="#3D2C10" />
      <circle cx="508" cy="186" r="1.4" fill="#3D2C10" />
      <path
        d="M 86 404 L 130 404 L 130 396 L 94 396 L 94 360 L 86 360 Z"
        fill="url(#cBrass)"
        stroke="#3D2C10"
        strokeWidth="0.6"
      />
      <circle cx="92" cy="400" r="1.4" fill="#3D2C10" />
      <circle cx="124" cy="400" r="1.4" fill="#3D2C10" />
      <circle cx="92" cy="368" r="1.4" fill="#3D2C10" />
      <path
        d="M 514 404 L 470 404 L 470 396 L 506 396 L 506 360 L 514 360 Z"
        fill="url(#cBrass)"
        stroke="#3D2C10"
        strokeWidth="0.6"
      />
      <circle cx="508" cy="400" r="1.4" fill="#3D2C10" />
      <circle cx="476" cy="400" r="1.4" fill="#3D2C10" />
      <circle cx="508" cy="368" r="1.4" fill="#3D2C10" />

      {/* Brass strapping bands with rivets */}
      <rect x="194" y="152" width="6" height="248" fill="url(#cBrassDim)" />
      <rect x="394" y="152" width="6" height="248" fill="url(#cBrassDim)" />
      {[170, 200, 230, 260, 290, 320, 350, 380].map((y, i) => (
        <g key={i}>
          <circle cx="197" cy={y} r="1.6" fill="#5A4218" />
          <circle cx="197" cy={y - 0.4} r="0.8" fill="#E8C36A" />
          <circle cx="397" cy={y} r="1.6" fill="#5A4218" />
          <circle cx="397" cy={y - 0.4} r="0.8" fill="#E8C36A" />
        </g>
      ))}

      {/* Brass keyhole / lock plate */}
      <g>
        <rect
          x="280"
          y="350"
          width="40"
          height="40"
          rx="2"
          fill="url(#cBrass)"
          stroke="#3D2C10"
          strokeWidth="0.6"
        />
        <rect
          x="284"
          y="354"
          width="32"
          height="32"
          rx="1"
          fill="none"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="0.6"
        />
        <circle cx="300" cy="368" r="3" fill="#1A1308" />
        <rect x="298.5" y="368" width="3" height="10" fill="#1A1308" />
        <circle cx="285" cy="355" r="1" fill="#3D2C10" />
        <circle cx="315" cy="355" r="1" fill="#3D2C10" />
        <circle cx="285" cy="385" r="1" fill="#3D2C10" />
        <circle cx="315" cy="385" r="1" fill="#3D2C10" />
      </g>

      {/* Brass key resting on the corner */}
      <g transform="translate(420 392) rotate(-8)">
        <rect x="0" y="0" width="56" height="3" fill="url(#cBrass)" stroke="#3D2C10" strokeWidth="0.4" />
        <circle cx="58" cy="1.5" r="6" fill="url(#cBrass)" stroke="#3D2C10" strokeWidth="0.5" />
        <circle cx="58" cy="1.5" r="3" fill="none" stroke="#3D2C10" strokeWidth="0.5" />
        <rect x="-2" y="3" width="3" height="4" fill="url(#cBrass)" stroke="#3D2C10" strokeWidth="0.4" />
        <rect x="-5" y="3" width="3" height="6" fill="url(#cBrass)" stroke="#3D2C10" strokeWidth="0.4" />
        <ellipse cx="28" cy="9" rx="32" ry="2" fill="rgba(0,0,0,0.3)" />
      </g>

      {/* Highlight along top edge of front face */}
      <rect x="92" y="158" width="416" height="1.5" fill="rgba(255,220,180,0.15)" />
    </svg>
  );
}

// Pearl tier visuals consolidated in lib/pearl/colors.ts.
// COMMON: warm-cream lustre · FINE: pinkish-cream warmer glow · ROYAL: golden
// Gulf "lulu" with iridescent halo + brass ring on its velvet well.

function PearlSlot({ pearl }: { pearl: { grade: PearlGrade } | null }) {
  // Empty wells render as a soft round velvet depression (no harsh dashed lines).
  if (!pearl) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: "min(72%, 56px)",
            aspectRatio: "1",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.55), rgba(0,0,0,0.15))",
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,220,180,0.06)",
            border: "1px solid rgba(0,0,0,0.4)",
          }}
        />
      </div>
    );
  }
  const s = PEARL_TIERS[pearl.grade];
  return (
    <button
      aria-label={`pearl-${pearl.grade}`}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        background: "transparent",
        border: "none",
        minHeight: 0,
        minWidth: 0,
        cursor: "grab",
        transition: "transform 0.2s var(--ease-loom), opacity 0.2s",
      }}
    >
      <div style={{ position: "relative", width: "min(80%, 60px)", aspectRatio: "1" }}>
        {/* Velvet well depression behind the pearl */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.7), rgba(0,0,0,0.25))",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.7)",
            border: s.ring
              ? "1px solid rgba(232,195,106,0.6)"
              : "1px solid rgba(0,0,0,0.45)",
          }}
        />
        {/* Outer glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: "50%",
            boxShadow: `0 0 ${s.glowSize}px ${s.glow}`,
            pointerEvents: "none",
          }}
        />
        {/* Pearl body */}
        <div
          style={{
            position: "absolute",
            inset: "8%",
            borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, ${s.core} 22%, ${s.mid} 60%, ${s.shadow} 100%)`,
            boxShadow:
              "inset -3px -4px 8px rgba(0,0,0,0.35), inset 2px 2px 4px rgba(255,255,255,0.4)",
          }}
        />
        {/* Specular highlight */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "26%",
            top: "22%",
            width: "16%",
            height: "12%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0))",
            pointerEvents: "none",
          }}
        />
      </div>
    </button>
  );
}

function PearlCount({
  tier,
  count,
  label,
}: {
  tier: PearlGrade;
  count: number;
  label: string;
}) {
  const { fmt } = useI18n();
  const c = PEARL_TIERS[tier];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, #FFFFFF, ${c.core} 22%, ${c.mid} 70%)`,
          boxShadow: `0 0 10px ${c.glow}, inset -2px -2px 4px rgba(0,0,0,0.25)`,
        }}
      />
      <div>
        <div className="font-display" style={{ fontSize: 18, lineHeight: 1 }}>
          {fmt(count)}
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
