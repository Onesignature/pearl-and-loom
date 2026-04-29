"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress, type PearlGrade } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { TAPESTRY_25 } from "@/lib/tapestry/composition";
import { MOTIF_COMPONENTS } from "@/components/motifs";
import { BadgeGrid } from "@/components/achievements/BadgeGrid";
import { PEARL_TIERS } from "@/lib/pearl/colors";

// R3F scene is loaded only on the client; three.js + drei + postprocessing
// would otherwise add ~250KB to the SSR pass for a route that mounts once.
const PearlChest3D = dynamic(
  () => import("@/components/sea/PearlChest3D"),
  { ssr: false, loading: () => <PearlChest3DSkeleton /> },
);

const TOTAL_SLOTS = 12;
const STAGE_HEIGHT = 460;

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return prefers;
}

function PearlChest3DSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        height: STAGE_HEIGHT,
        borderRadius: 16,
        background:
          "radial-gradient(ellipse at 50% 30%, #2A1A0E 0%, #100805 70%, #050302 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(244, 184, 96, 0.6)",
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        letterSpacing: "0.2em",
        fontSize: 12,
        textTransform: "uppercase",
      }}
    >
      Polishing the brass…
    </div>
  );
}

export default function PearlChestPage() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const pearls = useProgress((s) => s.pearls);
  const reducedMotion = usePrefersReducedMotion();
  const counts: Record<PearlGrade, number> = {
    common: pearls.filter((p) => p.grade === "common").length,
    fine: pearls.filter((p) => p.grade === "fine").length,
    royal: pearls.filter((p) => p.grade === "royal").length,
  };

  const visiblePearls = pearls
    .slice(0, TOTAL_SLOTS)
    .map((p) => ({ id: p.id, grade: p.grade }));

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
          justifyContent: "flex-start",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div style={{ margin: "auto 0", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Purpose strip — explains what pearls are FOR. Kids land here
            with no idea why they collected pearls; this card closes the
            loop: pearls → beads → tapestry → heirloom complete. */}
        <div className="chest-purpose">
          <span className="chest-purpose-glyph" aria-hidden>◐</span>
          <div className="chest-purpose-text">
            <div className="chest-purpose-eyebrow">
              {lang === "en" ? "Why pearls matter" : "لمَ اللؤلؤ مهم"}
            </div>
            <div className="chest-purpose-body">
              {lang === "en" ? (
                <>
                  Every pearl Saif earns becomes a <strong>bead inside Layla&apos;s tapestry</strong>. Finish all{" "}
                  <strong>five Sadu lessons</strong> and bring home a <strong>handful of pearls</strong> to seal your family heirloom certificate.
                </>
              ) : (
                <>
                  كل لؤلؤة يكسبها سيف تصير <strong>خرزةً في نسيج ليلى</strong>. أتمَّ <strong>دروس السدو الخمسة</strong> وعُد بـ<strong>حفنةٍ من اللؤلؤ</strong> لختم شهادة إرث العائلة.
                </>
              )}
            </div>
          </div>
        </div>

        {/* The chest — Bedouin sandalwood pearl-merchant's box with brass
            strapping, mother-of-pearl Sadu inlay on the lid, and the
            player's pearls coloured by tier inside. Real-time R3F scene
            with bloom + ACESFilmic tone mapping. Hover to spin, drag to
            look around, scroll to zoom. Lazy-loaded; falls back to a
            "polishing the brass" stage while three.js boots. */}
        <div
          className="chest-stage-3d"
          style={{ width: "min(640px, 100%)", position: "relative" }}
        >
          <PearlChest3D
            pearls={visiblePearls}
            reducedMotion={reducedMotion}
            height={STAGE_HEIGHT}
          />
          <div className="chest-3d-hint" aria-hidden>
            {lang === "en"
              ? pearls.length === 0
                ? "Earn your first pearl on a dive — it'll surface inside the chest."
                : "Hover to spin · drag to look around · scroll to zoom"
              : pearls.length === 0
                ? "اكسب لؤلؤتك الأولى من الغوص — ستظهر داخل الصندوق."
                : "حرّك المؤشر للدوران · اسحب للنظر · حرّك العجلة للتقريب"}
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
        </div>

        <BadgeGrid />
        </div>
      </div>

      <style>{`
        .chest-purpose {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 18px;
          margin-bottom: 24px;
          width: min(640px, 100%);
          background: linear-gradient(180deg, rgba(232,163,61,0.16) 0%, rgba(232,163,61,0.04) 100%);
          border: 1px solid rgba(232,163,61,0.42);
          border-radius: 16px;
          color: var(--wool);
          backdrop-filter: blur(6px);
        }
        .chest-purpose-glyph {
          flex: 0 0 auto;
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(232,163,61,0.18);
          border: 1px solid rgba(232,163,61,0.5);
          border-radius: 50%;
          color: var(--saffron);
          font-size: 16px;
          line-height: 1;
        }
        .chest-purpose-text {
          flex: 1;
          min-width: 0;
        }
        .chest-purpose-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.92;
          margin-bottom: 4px;
        }
        .chest-purpose-body {
          font-size: 14px;
          color: rgba(240,228,201,0.92);
          line-height: 1.55;
        }
        .chest-purpose-body strong {
          color: var(--saffron);
          font-weight: 600;
        }

        @media (max-width: 1100px) {
          .chest-weave-preview { display: none !important; }
        }
        /* Switch to flex-start on short or narrow screens so centered content doesn't clip top bounds */
        @media (max-width: 900px) {
          .chest-scroll {
            padding-top: 124px !important;
          }
          .chest-scroll > div {
            row-gap: 6px;
            margin: 0 !important;
          }
        }
        @media (max-width: 640px) {
          .chest-scroll {
            padding-top: 132px !important;
            padding-bottom: 60px !important;
          }
        }
        .chest-3d-hint {
          margin-top: 10px;
          text-align: center;
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: rgba(240, 228, 201, 0.55);
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
      `}</style>
    </TentScene>
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
