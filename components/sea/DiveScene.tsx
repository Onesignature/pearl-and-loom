"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TopChrome } from "@/components/layout/TopChrome";
import { Oyster } from "@/components/portraits/Portraits";
import { GodRays, Caustics, Particulates, SaifSwimmer } from "@/components/sea/fx";
import { MotifChevron } from "@/components/motifs";
import { playCue } from "@/lib/audio/cues";
import { useSoukEffects } from "@/lib/souk/effects";
import type { DiveDef } from "@/app/sea/page";
import type { PearlGrade } from "@/lib/store/progress";

interface Problem {
  q: string;
  diagram: "pressure" | "biology";
  depth?: number;
  options: string[];
  answer: number;
}

const OYSTER_DEPTHS = [5, 10, 15] as const;

export function DiveScene({ dive }: { dive: DiveDef }) {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const completeDiveLesson = useProgress((s) => s.completeDiveLesson);
  const collectPearl = useProgress((s) => s.collectPearl);
  const effects = useSoukEffects();

  // Starting breath = 100 + fattam bonus; drain rate scaled by fattam.
  const startingBreath = 100 + effects.extraBreath;
  const [breath, setBreath] = useState(startingBreath);
  const [depth, setDepth] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState<{ idx: number; correct: boolean } | null>(null);
  const [pearls, setPearls] = useState(0);
  const lockedNav = useRef(false);

  // Breath drains while underwater and no problem is being answered.
  // Drain rate is multiplied by the fattam noseclip's effect (≈ 15% slower
  // when owned).
  useEffect(() => {
    if (depth > 0 && breath > 0 && !answered) {
      const tid = setTimeout(
        () =>
          setBreath((b) => Math.max(0, b - 0.5 * effects.breathDrainMultiplier)),
        200,
      );
      return () => clearTimeout(tid);
    }
  }, [breath, depth, answered, effects.breathDrainMultiplier]);

  // Move toward target — descent/ascent multiplier from the diveen stone.
  useEffect(() => {
    if (target == null || depth === target) return;
    const step = 0.3 * effects.descentMultiplier;
    const tid = setTimeout(() => {
      setDepth((d) =>
        d < target ? Math.min(target, d + step) : Math.max(target, d - step),
      );
    }, 30);
    return () => clearTimeout(tid);
  }, [depth, target, effects.descentMultiplier]);

  // Show problem on reaching oyster — synchronizes UI to arrival event.
  useEffect(() => {
    if (
      target != null &&
      target > 0 &&
      Math.abs(depth - target) < 0.3 &&
      !problem &&
      !answered
    ) {
      // `problem` must persist after the arrival window closes; can't be derived from props alone.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProblem(problemFor(target, lang));
    }
  }, [depth, target, problem, answered, lang]);

  function selectOyster(d: number) {
    if (target == null && depth === 0) {
      setTarget(d);
    }
  }

  function answer(i: number) {
    if (!problem) return;
    const correct = problem.answer === i;
    setAnswered({ idx: i, correct });
    if (correct) {
      const tier: PearlGrade =
        target === 15 ? "royal" : target === 10 ? "fine" : "common";
      playCue(tier === "royal" ? "pearl.royal" : "pearl.ping");
      const pearlId = `pearl-${dive.key}-${target}-${Date.now()}`;
      collectPearl({
        id: pearlId,
        grade: tier,
        size: tier === "royal" ? 4 : tier === "fine" ? 3 : 2,
        luster: tier === "royal" ? 5 : tier === "fine" ? 4 : 3,
        diveId: dive.key,
      });
      setPearls((p) => p + 1);
      // Heritage al-deyeen net — awards a free common pearl on top.
      for (let n = 0; n < effects.bonusCommonPearlsPerDive; n++) {
        collectPearl({
          id: `pearl-${dive.key}-bonus-${Date.now()}-${n}`,
          grade: "common",
          size: 2,
          luster: 3,
          diveId: dive.key,
        });
      }
      if (!lockedNav.current) {
        lockedNav.current = true;
        setTimeout(() => {
          completeDiveLesson(dive.key);
          router.push(`/sea/pearl?tier=${tier}`);
        }, 1400);
      }
    } else {
      setTimeout(() => {
        setAnswered(null);
      }, 1200);
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to bottom, #F4B860 0%, #E07856 8%, #0E5E7B 28%, #08374A 60%, #051E2C 100%)",
        overflow: "hidden",
      }}
    >
      {/* Surface waves with sun-backlit gradient */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          insetInlineStart: 0,
          width: "100%",
          height: "16%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 160"
      >
        <defs>
          <linearGradient id="surfaceG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE9B8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F4B860" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1366" height="160" fill="url(#surfaceG)" />
        <path
          d="M 0 80 Q 200 60 400 80 T 800 80 T 1366 80 L 1366 0 L 0 0 Z"
          fill="#FFE0A8"
          opacity="0.55"
        />
        <path
          d="M 0 110 Q 200 90 400 110 T 800 110 T 1366 110 L 1366 0 L 0 0 Z"
          fill="#F4B860"
          opacity="0.4"
        />
        <path
          d="M 0 140 Q 200 130 400 140 T 800 140 T 1366 140 L 1366 0 L 0 0 Z"
          fill="#0E5E7B"
          opacity="0.5"
        />
      </svg>
      {/* Saif's dhow at the surface — directly above his dive line, with anchor rope.
          This grounds the scene: he descended from THIS boat. */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: "9%",
          insetInlineStart: "50%",
          transform: "translateX(-50%)",
          width: 180,
          opacity: 0.7,
          pointerEvents: "none",
        }}
        viewBox="0 0 200 80"
      >
        <path d="M 20 30 Q 100 20 180 30 L 168 44 Q 100 50 32 44 Z" fill="#1A0E08" />
        <path
          d="M 20 30 Q 100 20 180 30 L 178 33 Q 100 24 22 33 Z"
          fill="#3D2A1E"
          opacity="0.7"
        />
        <line x1="100" y1="22" x2="100" y2="-10" stroke="#3D2A1E" strokeWidth="1.5" />
        <path d="M 100 -8 L 138 22 L 100 22 Z" fill="#5A3618" opacity="0.6" />
        <line x1="100" y1="44" x2="100" y2="80" stroke="#C9A876" strokeWidth="0.8" opacity="0.5" />
      </svg>
      {/* Wake / disturbance ring on the surface beneath the dhow */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: "16%",
          insetInlineStart: "50%",
          transform: "translateX(-50%)",
          width: 200,
          opacity: 0.45,
          pointerEvents: "none",
        }}
        viewBox="0 0 200 30"
      >
        <ellipse
          cx="100"
          cy="15"
          rx="60"
          ry="6"
          fill="none"
          stroke="#FFE9B8"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <ellipse
          cx="100"
          cy="15"
          rx="80"
          ry="8"
          fill="none"
          stroke="#FFE9B8"
          strokeWidth="0.5"
          opacity="0.4"
        />
      </svg>
      {/* Animated god rays from surface */}
      <GodRays topPct={10} intensity={0.55} />
      {/* Depth fog — thickens with depth */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, transparent 30%, rgba(8,55,74,0.25) 55%, rgba(5,30,44,0.55) 80%, rgba(2,16,26,0.75) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Drifting plankton / particulates */}
      <Particulates count={44} />
      {/* Animated caustics on seabed */}
      <Caustics bottom={0} height={240} opacity={0.4} />
      {/* Seabed silhouette + rocks + coral hints + swaying sea grass */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "18%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 200"
      >
        <path
          d="M 0 200 L 0 120 Q 100 100 200 110 Q 320 80 480 100 Q 640 70 800 95 Q 960 75 1120 100 Q 1240 90 1366 110 L 1366 200 Z"
          fill="#03101A"
          opacity="0.85"
        />
        <path
          d="M 0 200 L 0 150 Q 100 130 200 140 Q 320 110 480 130 Q 640 100 800 125 Q 960 105 1120 130 Q 1240 120 1366 140 L 1366 200 Z"
          fill="#021018"
          opacity="0.6"
        />
        {/* Rock formations */}
        <ellipse cx="220" cy="160" rx="70" ry="22" fill="#04141F" />
        <ellipse cx="540" cy="170" rx="55" ry="18" fill="#04141F" />
        <ellipse cx="920" cy="165" rx="80" ry="24" fill="#04141F" />
        <ellipse cx="1180" cy="172" rx="50" ry="16" fill="#04141F" />
        {/* Coral suggestions */}
        <path
          d="M 320 160 Q 318 140 322 130 Q 326 138 324 160 Z"
          fill="#5A2A1E"
          opacity="0.6"
        />
        <path
          d="M 700 158 Q 696 138 702 124 Q 708 138 706 158 Z"
          fill="#5A2A1E"
          opacity="0.6"
        />
        <path
          d="M 1040 162 Q 1038 142 1043 130 Q 1048 142 1046 162 Z"
          fill="#5A2A1E"
          opacity="0.6"
        />
        {/* Swaying sea grass */}
        {[150, 380, 620, 850, 1100, 1280].map((x, i) => (
          <g key={x} transform={`translate(${x} 160)`}>
            {[0, 6, 12].map((dx, j) => (
              <path
                key={j}
                d={`M ${dx} 0 Q ${dx + (i % 2 ? 3 : -3)} -10 ${dx + (i % 2 ? 1 : -1)} -22`}
                stroke="#1A4A40"
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
              >
                <animate
                  attributeName="d"
                  values={`M ${dx} 0 Q ${dx + 3} -10 ${dx + 1} -22; M ${dx} 0 Q ${dx - 2} -10 ${dx + 2} -22; M ${dx} 0 Q ${dx + 3} -10 ${dx + 1} -22`}
                  dur={`${4 + j}s`}
                  repeatCount="indefinite"
                />
              </path>
            ))}
          </g>
        ))}
      </svg>

      {/* Saif diving — depth filter darkens & cyan-shifts him past 6m & 12m */}
      <div
        style={{
          position: "absolute",
          insetInlineStart: "50%",
          top: `${24 + (depth / 18) * 54}%`,
          transform: "translateX(-50%)",
          transition: "top 0.3s linear",
          width: 124,
          filter:
            depth > 12
              ? "brightness(0.7) hue-rotate(8deg)"
              : depth > 6
                ? "brightness(0.85)"
                : "none",
        }}
      >
        <SaifSwimmer swimming={target != null && target > 0} />
      </div>

      {/* Oysters */}
      {OYSTER_DEPTHS.map((d, i) => {
        const x = ["30%", "55%", "75%"][i] ?? "50%";
        return (
          <button
            key={d}
            onClick={() => selectOyster(d)}
            disabled={target != null && target !== d}
            style={{
              position: "absolute",
              insetInlineStart: x,
              top: `${22 + (d / 18) * 60}%`,
              background: "transparent",
              border: "none",
              cursor: target == null ? "pointer" : "default",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Oyster targeted={target === d} />
            <div
              style={{
                position: "absolute",
                top: -20,
                insetInlineStart: "50%",
                transform: "translateX(-50%)",
                color: "var(--sunset-gold)",
                fontSize: 10,
                letterSpacing: "0.2em",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              {fmt(d)}M
            </div>
          </button>
        );
      })}

      <TopChrome
        onBack={() => router.push("/sea")}
        title={t(`sea.titles.${dive.key}` as never)}
        subtitle="DIVE"
        transparent
      />

      {/* "Select an oyster" instruction prompt — only visible before user picks a target */}
      {target == null && depth === 0 && (
        <div
          style={{
            position: "absolute",
            top: "19%",
            insetInlineStart: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            pointerEvents: "none",
            animation: "selectPulse 2.4s ease-in-out infinite",
            zIndex: 30,
          }}
        >
          <div
            style={{
              padding: "8px 22px",
              background: "rgba(8,30,44,0.78)",
              border: "1px solid rgba(244,184,96,0.55)",
              backdropFilter: "blur(10px)",
              color: "var(--sunset-gold)",
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              fontStyle: "italic",
            }}
          >
            {lang === "en"
              ? "Select an oyster to dive for"
              : "اختر محارة للغوص إليها"}
          </div>
          <div style={{ color: "var(--sunset-gold)", fontSize: 16, opacity: 0.7 }}>↓</div>
        </div>
      )}

      {/* HUD */}
      <div className="dive-hud dive-hud-tl">
        <BreathHUD breath={breath} />
      </div>
      <div className="dive-hud dive-hud-tr">
        <DepthHUD depth={depth} />
      </div>
      <div className="dive-hud dive-hud-bl">
        <button
          onClick={() => {
            setTarget(0);
            setProblem(null);
            setAnswered(null);
          }}
          className="surface-btn"
        >
          ↑ {t("dive.surface")}
        </button>
      </div>
      <div className="dive-hud dive-hud-br">
        <BankedHUD pearls={pearls} target={3} />
      </div>

      {problem && !answered && (
        <ProblemOverlay problem={problem} breath={breath} onAnswer={answer} />
      )}
      {answered?.correct && problem && (
        <ProblemOverlay
          problem={problem}
          breath={breath}
          onAnswer={() => {}}
          celebrating
        />
      )}

      <style>{`
        .surface-btn {
          padding: 12px 24px;
          background: rgba(8,55,74,0.7);
          border: 1px solid var(--sunset-gold);
          color: var(--sunset-gold);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          cursor: pointer;
          backdrop-filter: blur(8px);
        }
        .surface-btn:hover { background: rgba(244,184,96,0.2); }
        .dive-hud { position: absolute; }
        .dive-hud-tl { top: 90px; inset-inline-start: 28px; }
        .dive-hud-tr { top: 90px; inset-inline-end: 28px; }
        .dive-hud-bl { bottom: 30px; inset-inline-start: 28px; }
        .dive-hud-br { bottom: 30px; inset-inline-end: 28px; }
        @media (max-width: 640px) {
          .dive-hud-tl, .dive-hud-tr { top: 78px; }
          .dive-hud-tl { inset-inline-start: 12px; }
          .dive-hud-tr { inset-inline-end: 12px; }
          .dive-hud-bl { bottom: 18px; inset-inline-start: 12px; }
          .dive-hud-br { bottom: 18px; inset-inline-end: 12px; }
          .surface-btn { padding: 10px 14px !important; font-size: 10px !important; letter-spacing: 0.22em !important; }
        }
        @keyframes selectPulse {
          0%, 100% { opacity: 0.85; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

function BreathHUD({ breath }: { breath: number }) {
  const { t, fmt } = useI18n();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "var(--foam)",
        background: "rgba(8,30,44,0.6)",
        padding: "10px 14px",
        border: "1px solid rgba(240,244,242,0.18)",
        backdropFilter: "blur(8px)",
      }}
    >
      <svg width="20" height="22" viewBox="0 0 20 22">
        <path
          d="M 10 2 Q 4 4 4 12 Q 4 18 10 20 Q 16 18 16 12 Q 16 4 10 2 Z M 10 8 L 10 18"
          fill="none"
          stroke="var(--foam)"
          strokeWidth="1.5"
        />
      </svg>
      <div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {t("dive.breath")}
        </div>
        <div
          style={{
            width: 120,
            height: 6,
            background: "rgba(240,244,242,0.18)",
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: `${breath}%`,
              height: "100%",
              background: breath > 30 ? "var(--sunset-gold)" : "var(--coral)",
              transition: "width 0.2s linear",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 10,
            fontFamily: "var(--font-cormorant), serif",
            marginTop: 2,
            color: "var(--sunset-gold)",
          }}
        >
          {fmt(Math.round(breath))}%
        </div>
      </div>
    </div>
  );
}

function DepthHUD({ depth }: { depth: number }) {
  const { t, fmt } = useI18n();
  return (
    <div
      style={{
        width: 100,
        color: "var(--foam)",
        background: "rgba(8,30,44,0.6)",
        padding: "10px 14px",
        border: "1px solid rgba(240,244,242,0.18)",
        backdropFilter: "blur(8px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        {t("dive.depth")}
      </div>
      <div
        className="font-display"
        style={{
          fontSize: 26,
          color: "var(--sunset-gold)",
          lineHeight: 1,
          marginTop: 4,
        }}
      >
        {fmt(Math.round(depth))}
        <span style={{ fontSize: 12, opacity: 0.6 }}>m</span>
      </div>
    </div>
  );
}

function BankedHUD({ pearls, target }: { pearls: number; target: number }) {
  const { t, fmt } = useI18n();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "var(--foam)",
        background: "rgba(8,30,44,0.6)",
        padding: "10px 14px",
        border: "1px solid rgba(240,244,242,0.18)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {t("dive.banked")}
        </div>
        <div
          className="font-display"
          style={{ fontSize: 18, color: "var(--sunset-gold)", marginTop: 2 }}
        >
          {fmt(pearls)}
          <span style={{ opacity: 0.5 }}>/{fmt(target)}</span>{" "}
          <span style={{ fontSize: 11, opacity: 0.7 }}>{t("dive.pearls")}</span>
        </div>
      </div>
    </div>
  );
}

function problemFor(depth: number, lang: "en" | "ar"): Problem {
  if (depth === 5) {
    return {
      q:
        lang === "en"
          ? "At the surface, pressure is 1 atmosphere. What's the pressure at 5m depth?"
          : "عند السطح، الضغط ١ ضغط جوي. ما الضغط عند عمق ٥م؟",
      diagram: "pressure",
      depth: 5,
      options:
        lang === "en"
          ? ["0.5 atm", "1 atm", "1.5 atm", "5 atm"]
          : ["٠٫٥ ج.و", "١ ج.و", "١٫٥ ج.و", "٥ ج.و"],
      answer: 2,
    };
  }
  if (depth === 10) {
    return {
      q:
        lang === "en"
          ? "At 10m depth, what is total pressure?"
          : "عند عمق ١٠م، ما الضغط الكلي؟",
      diagram: "pressure",
      depth: 10,
      options:
        lang === "en"
          ? ["1 atm", "2 atm", "10 atm", "11 atm"]
          : ["١ ج.و", "٢ ج.و", "١٠ ج.و", "١١ ج.و"],
      answer: 1,
    };
  }
  return {
    q:
      lang === "en"
        ? "Why does this oyster cluster on rock?"
        : "لمَ يتجمع هذا المحار على الصخر؟",
    diagram: "biology",
    options:
      lang === "en"
        ? ["For warmth", "Filter feeding", "To hide", "Camouflage"]
        : ["للدفء", "للتغذية بالترشيح", "للاختباء", "للتمويه"],
    answer: 1,
  };
}

function ProblemOverlay({
  problem,
  breath,
  onAnswer,
  celebrating,
}: {
  problem: Problem;
  breath: number;
  onAnswer: (i: number) => void;
  celebrating?: boolean;
}) {
  const { t, fmt, lang } = useI18n();
  return (
    <div
      className="dive-problem-card"
      style={{
        position: "absolute",
        insetInlineStart: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(540px, calc(100vw - 32px))",
        maxHeight: "calc(100dvh - 160px)",
        overflowY: "auto",
        padding: "clamp(18px, 4vw, 32px) clamp(18px, 4vw, 32px) 0",
        background: "rgba(8,55,74,0.55)",
        border: "1px solid rgba(244,184,96,0.4)",
        backdropFilter: "blur(20px) saturate(140%)",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.5), inset 0 0 40px rgba(244,184,96,0.08)",
      }}
    >
      <div
        className="font-display"
        style={{
          fontSize: 11,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "var(--sunset-gold)",
        }}
      >
        {t("dive.pressureTrial")} · {fmt(Math.round(breath))}% {t("dive.breath")}
      </div>
      <div
        style={{
          fontFamily:
            lang === "ar"
              ? "var(--font-tajawal), sans-serif"
              : "var(--font-cormorant), serif",
          fontSize: 22,
          color: "var(--foam)",
          marginTop: 12,
          lineHeight: 1.4,
        }}
      >
        {problem.q}
      </div>

      {problem.diagram === "pressure" && problem.depth && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <svg
            viewBox="0 0 360 100"
            style={{ width: "100%", maxWidth: 360, height: "auto" }}
            className="ltr-internal"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect x="0" y="0" width="360" height="20" fill="#F4B860" opacity="0.4" />
            <text
              x="6"
              y="14"
              fill="#F4B860"
              fontSize="10"
              letterSpacing="2"
            >
              {lang === "en" ? "SURFACE · 1 atm" : "السطح · ١ ج.و"}
            </text>
            <rect x="0" y="20" width="360" height="80" fill="#0E5E7B" opacity="0.4" />
            <line
              x1="0"
              y1={20 + (problem.depth / 15) * 80}
              x2="360"
              y2={20 + (problem.depth / 15) * 80}
              stroke="var(--sunset-gold)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x="356"
              y={18 + (problem.depth / 15) * 80}
              fill="var(--sunset-gold)"
              fontSize="10"
              textAnchor="end"
              letterSpacing="2"
            >
              {fmt(problem.depth)}M
            </text>
            <g
              transform={`translate(180 ${20 + (problem.depth / 15) * 80})`}
            >
              <circle r="4" fill="var(--foam)" />
            </g>
          </svg>
        </div>
      )}

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {problem.options.map((opt, i) => (
          <button key={i} onClick={() => onAnswer(i)} className="answer-btn">
            <span
              className="font-display"
              style={{ marginInlineEnd: 12, color: "var(--sunset-gold)" }}
            >
              {["A", "B", "C", "D"][i]}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {celebrating && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(8,55,74,0.85)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="font-display"
              style={{
                fontSize: 32,
                color: "var(--sunset-gold)",
                letterSpacing: "0.2em",
              }}
            >
              {t("dive.pearlRising")}
            </div>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 30% 30%, #FFFFFF, #F4D77A)",
                margin: "20px auto",
                boxShadow: "0 0 40px var(--sunset-gold)",
                animation: "pearlRise 1.2s var(--ease-pearl)",
              }}
            />
          </div>
        </div>
      )}

      <div
        className="ltr-internal"
        style={{
          marginTop: 26,
          height: 18,
          marginInline: -32,
          marginBottom: 0,
          display: "flex",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ flex: 1 }}>
            <MotifChevron
              fg="var(--sunset-gold)"
              bg="rgba(244,184,96,0.15)"
              w="100%"
              h="100%"
            />
          </div>
        ))}
      </div>

      <style>{`
        .answer-btn {
          padding: 14px 18px;
          background: rgba(240,244,242,0.06);
          border: 1px solid rgba(240,244,242,0.18);
          color: var(--foam);
          cursor: pointer;
          text-align: start;
          font-family: var(--font-tajawal), sans-serif;
          font-size: 14px;
          transition: all 0.3s var(--ease-water);
        }
        .answer-btn:hover {
          background: rgba(244,184,96,0.18);
          border-color: var(--sunset-gold);
        }
      `}</style>
    </div>
  );
}
