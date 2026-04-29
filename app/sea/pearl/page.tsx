"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TopChrome } from "@/components/layout/TopChrome";
import type { PearlGrade } from "@/lib/store/progress";

const TIERS: PearlGrade[] = ["common", "fine", "royal"];

// Order of all five dives — the "Next dive" CTA after a successful
// pearl reveal walks through them in this order. Lung-of-Sea and
// Refraction Trial unlock once the first three are complete.
const DIVE_ORDER: { id: string; href: string }[] = [
  { id: "shallowBank", href: "/sea/dives/shallowBank" },
  { id: "deepReef", href: "/sea/dives/deepReef" },
  { id: "coralGarden", href: "/sea/dives/coralGarden" },
  { id: "lungOfSea", href: "/sea/dives/lungOfSea" },
  { id: "refractionTrial", href: "/sea/dives/refractionTrial" },
];

export default function PearlRevealPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-sea-abyss">
          <div className="h-8 w-8 animate-pulse rounded-full bg-sunset-gold/40" aria-hidden />
        </div>
      }
    >
      <PearlReveal />
    </Suspense>
  );
}

function PearlReveal() {
  const router = useRouter();
  const search = useSearchParams();
  const { t, lang } = useI18n();
  const tier = (search.get("tier") as PearlGrade) || "royal";

  const completedDives = useProgress((s) => s.diveLessonsCompleted);
  const quizBest = useProgress((s) => s.quizScores.saif.bestScore);

  // Smart next-step CTA — falls through:
  //   1. The next not-yet-completed dive, OR
  //   2. The Saif quiz once all three dives are done and unattempted, OR
  //   3. Back to the dive hub once everything's complete.
  const nextDive = DIVE_ORDER.find((d) => !completedDives.includes(d.id));
  const arrow = lang === "ar" ? "←" : "→";
  let primaryHref: string;
  let primaryLabel: string;
  if (nextDive) {
    primaryHref = nextDive.href;
    primaryLabel = `${t("pearl.nextDive")} ${arrow}`;
  } else if (quizBest === null) {
    primaryHref = "/sea/quiz";
    primaryLabel = `${t("pearl.takeQuiz")} ${arrow}`;
  } else {
    primaryHref = "/sea";
    primaryLabel = `${t("pearl.backToDives")} ${arrow}`;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 80% 80% at 50% 50%, #1B2D5C 0%, #051E2C 60%, #000 100%)",
        overflow: "hidden",
      }}
    >
      <TopChrome
        onBack={() => router.push("/sea")}
        title={t("pearl.revealTitle")}
        transparent
      />
      <div
        className="pearl-scroll"
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 100,
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
        <PearlHero tier={tier} />
        <div
          style={{
            marginTop: 12,
            color: "var(--foam)",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {t("pearl.centerpieceBead")}
        </div>

        <div className="pearl-tiers-block">
          <div className="pearl-tiers-label">{t("pearl.tiers")}</div>
          <div className="pearl-tiers-grid">
            {TIERS.map((v) => (
              <PearlTierCard key={v} tier={v} active={v === tier} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 26, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => router.push("/sea/chest")} className="reveal-btn">
            {t("pearl.toChest")} {arrow}
          </button>
          <button onClick={() => router.push(primaryHref)} className="reveal-btn primary">
            {primaryLabel}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pearl-scroll {
            justify-content: flex-start !important;
            padding-top: 124px !important;
          }
        }
        .pearl-tiers-block {
          margin-top: 36px;
          width: 100%;
          max-width: 800px;
        }
        .pearl-tiers-label {
          color: var(--foam);
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 14px;
          text-align: center;
        }
        .pearl-tiers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 18px;
        }
        @media (max-width: 640px) {
          .pearl-scroll {
            padding-top: 116px !important;
            padding-bottom: 20px !important;
          }
          .pearl-tiers-block { margin-top: 22px; }
          .pearl-tiers-label { font-size: 10px; margin-bottom: 8px; letter-spacing: 0.24em; }
          /* Three tiers in a single row, much smaller — keeps the
             whole page above the fold so action buttons are reachable
             without scrolling. */
          .pearl-tiers-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
          .pearl-tier-card {
            padding: 10px 6px !important;
          }
          .pearl-tier-orb {
            width: 38px !important;
            height: 38px !important;
          }
          .pearl-tier-name {
            font-size: 11px !important;
            margin-top: 8px !important;
            letter-spacing: 0.1em !important;
          }
          .pearl-tier-stats { display: none !important; }
        }
        .reveal-btn {
          padding: 12px 24px;
          background: rgba(245,235,211,0.08);
          border: 1px solid rgba(240,244,242,0.25);
          border-radius: 999px;
          color: var(--foam);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          cursor: pointer;
          transition: all 0.3s;
        }
        .reveal-btn:hover { background: rgba(245,235,211,0.16); transform: translateY(-1px); }
        .reveal-btn.primary {
          background: var(--sunset-gold);
          color: var(--sea-deep);
          border-color: var(--sunset-gold);
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(244,184,96,0.32);
        }
        .reveal-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(244,184,96,0.45);
        }
      `}</style>
    </div>
  );
}

// Cinematic pearl-reveal palette — intentionally NOT consolidated into
// lib/pearl/colors.ts. The reveal needs a richer set of stops (fill /
// inner-nacre / outer-rim) than other surfaces, and the inner tones
// (mauve / wine / amber) are tuned to read as oyster nacre, not as
// repeatable chest pearls. Keep local.
interface PearlPalette {
  fill: string;
  glow: string;
  inner: string;
  rim: string;
}

const PEARL_COLORS: Record<PearlGrade, PearlPalette> = {
  common: {
    fill: "#F4EBDC",
    glow: "rgba(244,235,220,0.7)",
    inner: "#8B6F8F",
    rim: "#D9C4A8",
  },
  fine: {
    fill: "#F2C7C3",
    glow: "rgba(242,199,195,0.7)",
    inner: "#7A4A6F",
    rim: "#E8A8A2",
  },
  royal: {
    fill: "#F4D77A",
    glow: "rgba(244,215,122,0.85)",
    inner: "#8B5A2E",
    rim: "#FFE0A8",
  },
};

function PearlHero({ tier }: { tier: PearlGrade }) {
  const { t, lang } = useI18n();
  const colors = PEARL_COLORS[tier];
  const stars = tier === "royal" ? 5 : tier === "fine" ? 4 : 3;
  const labelKey = `pearl.${tier}Name` as const;

  // Reveal phase — oyster opens after a short beat
  const [phase, setPhase] = useState<"closed" | "revealed">("closed");
  useEffect(() => {
    const id = setTimeout(() => setPhase("revealed"), 700);
    return () => clearTimeout(id);
  }, []);
  const open = phase === "revealed";

  return (
    <div
      className="pearl-hero"
      style={{
        position: "relative",
        marginTop: 22,
        width: "min(360px, calc(100vw - 32px))",
        aspectRatio: "1 / 0.82",
      }}
    >
      {/* Tier label */}
      <div className="pearl-hero-label">
        <div
          className="font-display pearl-hero-label-en"
          style={{
            color:
              tier === "royal"
                ? "var(--sunset-gold)"
                : tier === "fine"
                  ? "#F2C7C3"
                  : "#F4EBDC",
            textShadow: `0 0 18px ${colors.glow}`,
          }}
        >
          {t(labelKey).toUpperCase()}
        </div>
        {lang !== "ar" && (
          <div className="pearl-hero-label-ar">
            {tier === "royal" ? "لؤلؤة ملكية" : tier === "fine" ? "لؤلؤة نفيسة" : "لؤلؤة عادية"}
          </div>
        )}
      </div>

      {/* Single soft halo — replaces three layered glow sources */}
      <div
        aria-hidden
        className="pearl-hero-halo"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
          opacity: open ? 1 : 0.35,
        }}
      />

      {/* Oyster — clean two-half open animation, no inner seam noise */}
      <svg
        viewBox="0 0 360 300"
        style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}
      >
        <defs>
          <radialGradient id="innerNacre" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={colors.rim} />
            <stop offset="35%" stopColor="#F8E8D0" />
            <stop offset="100%" stopColor={colors.inner} />
          </radialGradient>
          <linearGradient id="shellOuter" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#5A4030" />
            <stop offset="60%" stopColor="#3D2A1E" />
            <stop offset="100%" stopColor="#1A130D" />
          </linearGradient>
          <linearGradient id="shellInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor={colors.inner} stopOpacity="0.4" />
          </linearGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Floor shadow */}
        <ellipse cx="180" cy="270" rx="120" ry="12" fill="rgba(0,0,0,0.55)" filter="url(#softShadow)" />

        {/* Inner nacre — single ellipse fade-in, no seam paths */}
        <g
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 1.1s ease",
          }}
        >
          <ellipse cx="180" cy="200" rx="125" ry="55" fill="url(#innerNacre)" />
        </g>

        {/* Lower (front) shell half */}
        <g>
          <path
            d="M 50 200 Q 50 250 100 268 Q 180 290 270 268 Q 320 250 320 200 Q 320 230 180 240 Q 50 230 50 200 Z"
            fill="url(#shellOuter)"
          />
          <path
            d="M 60 200 Q 60 220 110 234 Q 180 248 260 234 Q 310 220 310 200"
            fill="url(#shellInner)"
            opacity="0.45"
          />
        </g>

        {/* Upper (back) shell half — rotates open */}
        <g
          style={{
            transformOrigin: "180px 200px",
            transform: open ? "rotate(-58deg) translateY(-12px)" : "rotate(0deg)",
            transition: "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <path
            d="M 50 200 Q 50 150 100 132 Q 180 110 270 132 Q 320 150 320 200 Q 320 170 180 160 Q 50 170 50 200 Z"
            fill="url(#shellOuter)"
          />
          <path
            d="M 60 200 Q 60 180 110 168 Q 180 152 260 168 Q 310 180 310 200"
            fill="url(#shellInner)"
            opacity="0.5"
          />
          <ellipse cx="180" cy="200" rx="10" ry="2" fill="#1A0E08" opacity="0.7" />
        </g>
      </svg>

      {/* Pearl rises from inside — single clean orb with one highlight */}
      <div
        className="pearl-hero-orb-wrap"
        style={{
          top: open ? "30%" : "58%",
          opacity: open ? 1 : 0,
        }}
      >
        <div
          className="pearl-hero-orb"
          style={{
            background: `radial-gradient(circle at 30% 26%, #FFFFFF 0%, ${colors.fill} 32%, ${colors.rim} 65%, ${colors.inner} 100%)`,
            boxShadow: `0 0 60px ${colors.glow}, inset 0 -10px 18px rgba(0,0,0,0.22), inset 0 6px 14px rgba(255,255,255,0.45)`,
          }}
        />
        <div className="pearl-hero-orb-highlight" aria-hidden />
      </div>

      {/* Stars */}
      <div className="pearl-hero-stars">
        {"★".repeat(stars) + "☆".repeat(5 - stars)}
      </div>

      <style>{`
        .pearl-hero-label {
          position: absolute;
          top: -8px;
          inset-inline-start: 0;
          inset-inline-end: 0;
          text-align: center;
          z-index: 5;
        }
        .pearl-hero-label-en {
          font-size: 24px;
          letter-spacing: 0.3em;
          line-height: 1;
          animation: pearlLabelIn 0.6s var(--ease-pearl, cubic-bezier(0.22,1,0.36,1)) both;
          animation-delay: 0.3s;
        }
        .pearl-hero-label-ar {
          font-size: 12px;
          color: var(--foam);
          opacity: 0.6;
          margin-top: 4px;
          font-family: var(--font-tajawal), sans-serif;
          letter-spacing: 0.04em;
          animation: pearlLabelIn 0.6s ease both;
          animation-delay: 0.4s;
        }
        @keyframes pearlLabelIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Single ambient halo, slow breathe — replaces multiple layered
           glows + 12-ray flare burst. Less clutter, same warmth. */
        .pearl-hero-halo {
          position: absolute;
          inset: -90px;
          pointer-events: none;
          transition: opacity 1.2s ease;
          animation: pearlHalo 5s ease-in-out infinite;
        }
        @keyframes pearlHalo {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        .pearl-hero-orb-wrap {
          position: absolute;
          inset-inline-start: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          z-index: 3;
          transition: top 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s,
                      opacity 0.5s ease 0.35s;
        }
        .pearl-hero-orb {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: pearlFloat 4s ease-in-out infinite;
        }
        @keyframes pearlFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        /* One bright highlight on the upper-left, no extras */
        .pearl-hero-orb-highlight {
          position: absolute;
          top: 14%;
          left: 22%;
          width: 28%;
          height: 22%;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.85), rgba(255,255,255,0.25) 55%, transparent 80%);
          filter: blur(2px);
          pointer-events: none;
          animation: pearlFloat 4s ease-in-out infinite;
        }

        .pearl-hero-stars {
          position: absolute;
          bottom: -8px;
          inset-inline-start: 0;
          inset-inline-end: 0;
          text-align: center;
          color: var(--sunset-gold);
          font-size: 16px;
          letter-spacing: 0.24em;
          z-index: 4;
          animation: pearlLabelIn 0.6s ease both;
          animation-delay: 0.5s;
        }

        @media (max-width: 640px) {
          .pearl-hero-label-en { font-size: 20px; letter-spacing: 0.24em; }
          .pearl-hero-orb-wrap { width: 96px; height: 96px; }
          .pearl-hero-stars { font-size: 14px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pearl-hero-halo,
          .pearl-hero-orb,
          .pearl-hero-orb-highlight,
          .pearl-hero-label-en,
          .pearl-hero-label-ar,
          .pearl-hero-stars { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function PearlTierCard({ tier, active }: { tier: PearlGrade; active: boolean }) {
  const { t } = useI18n();
  const colors = PEARL_COLORS[tier];
  const stats = {
    common: { size: 2, luster: 3 },
    fine: { size: 3, luster: 4 },
    royal: { size: 4, luster: 5 },
  }[tier];
  const labelKey = `pearl.${tier}` as const;

  return (
    <div
      className="pearl-tier-card"
      style={{
        padding: 20,
        background: active ? "rgba(244,184,96,0.12)" : "rgba(240,244,242,0.05)",
        border: `1px solid ${active ? "var(--sunset-gold)" : "rgba(240,244,242,0.18)"}`,
        borderRadius: 14,
        textAlign: "center",
        color: "var(--foam)",
      }}
    >
      <div
        className="pearl-tier-orb"
        style={{
          width: 60,
          height: 60,
          margin: "0 auto",
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, #FFFFFF, ${colors.fill}, #4A2F18)`,
          boxShadow: `0 0 24px ${colors.glow}`,
        }}
      />
      <div
        className="font-display pearl-tier-name"
        style={{
          fontSize: 16,
          marginTop: 14,
          color: active ? "var(--sunset-gold)" : "var(--foam)",
          letterSpacing: "0.15em",
        }}
      >
        {t(labelKey).toUpperCase()}
      </div>
      <div
        className="pearl-tier-stats"
        style={{
          marginTop: 10,
          fontSize: 11,
          color: "rgba(240,244,242,0.7)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <StatBar label={t("pearl.size")} value={stats.size} max={5} />
        <StatBar label={t("pearl.luster")} value={stats.luster} max={5} />
      </div>
    </div>
  );
}

function StatBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const { fmt } = useI18n();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          width: 56,
          textAlign: "start",
          opacity: 0.7,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 4, background: "rgba(240,244,242,0.18)" }}>
        <div
          style={{
            width: `${(value / max) * 100}%`,
            height: "100%",
            background: "var(--sunset-gold)",
          }}
        />
      </div>
      <span className="font-display" style={{ width: 24, fontSize: 11 }}>
        {fmt(value)}/{fmt(max)}
      </span>
    </div>
  );
}
