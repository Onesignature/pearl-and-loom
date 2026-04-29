"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TopChrome } from "@/components/layout/TopChrome";
import { Oyster } from "@/components/portraits/Portraits";
import { GodRays, Caustics, Particulates, SaifSwimmer } from "@/components/sea/fx";
import { DiveConceptVisual } from "@/components/sea/DiveConceptVisual";
import { MotifChevron } from "@/components/motifs";
import { playCue } from "@/lib/audio/cues";
import type { DiveDef } from "@/app/sea/page";
import type { PearlGrade } from "@/lib/store/progress";

interface Problem {
  q: string;
  diagram: "pressure" | "biology";
  depth?: number;
  options: string[];
  answer: number;
  /** Themed eyebrow shown above the question — varies per dive so the
   *  three trials read as distinct (Buoyancy / Pressure / Marine Life). */
  trialLabel: string;
  /** One-line "why" surfaced after the learner answers — explains the
   *  correct answer in plain language. */
  explain: string;
}

const OYSTER_DEPTHS = [5, 10, 15] as const;

export function DiveScene({ dive }: { dive: DiveDef }) {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const completeDiveLesson = useProgress((s) => s.completeDiveLesson);
  const collectPearl = useProgress((s) => s.collectPearl);

  // Starting breath — every dive begins at full lung capacity.
  const startingBreath = 100;
  const [breath, setBreath] = useState(startingBreath);
  const [depth, setDepth] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState<{ idx: number; correct: boolean } | null>(null);
  const [pearls, setPearls] = useState(0);
  const lockedNav = useRef(false);

  // Breath drains while underwater and no problem is being answered.
  useEffect(() => {
    if (depth > 0 && breath > 0 && !answered) {
      const tid = setTimeout(
        () => setBreath((b) => Math.max(0, b - 0.5)),
        200,
      );
      return () => clearTimeout(tid);
    }
  }, [breath, depth, answered]);

  // Move toward target depth — constant descent rate.
  useEffect(() => {
    if (target == null || depth === target) return;
    const step = 0.3;
    const tid = setTimeout(() => {
      setDepth((d) =>
        d < target ? Math.min(target, d + step) : Math.max(target, d - step),
      );
    }, 30);
    return () => clearTimeout(tid);
  }, [depth, target]);

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
      setProblem(problemFor(dive.key, target, lang));
    }
  }, [depth, target, problem, answered, lang, dive.key]);

  function selectOyster(d: number) {
    if (target == null && depth === 0) {
      setTarget(d);
    }
  }

  const [celebrating, setCelebrating] = useState(false);

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
      if (!lockedNav.current) {
        lockedNav.current = true;
        // Two-stage timing — first hold the explainer in view (2.6s),
        // then the cinematic pearl-rising for ~1.1s, then navigate.
        setTimeout(() => setCelebrating(true), 2600);
        setTimeout(() => {
          completeDiveLesson(dive.key);
          router.push(`/sea/pearl?tier=${tier}`);
        }, 3700);
      }
    } else {
      // Wrong answer — give them ~3.5s to read the why before retrying.
      setTimeout(() => {
        setAnswered(null);
      }, 3500);
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

      {problem && (
        <ProblemOverlay
          problem={problem}
          breath={breath}
          onAnswer={answer}
          answered={answered}
          celebrating={celebrating}
          diveKey={dive.key}
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

type DiveKey = DiveDef["key"];

/**
 * Per-dive question banks. Each of the three available dives gets its
 * own theme so the kid feels three distinct trials rather than the
 * same scene repeated thrice:
 *
 *   shallowBank   → Buoyancy   (force / displacement / density)
 *   deepReef      → Pressure   (pressure scaling with depth)
 *   coralGarden   → Marine Biology (reef ecology + oyster behaviour)
 *
 * Each theme has three depth-specific questions (5m / 10m / 15m) so
 * the same dive replayed at different oysters still feels fresh.
 */
function problemFor(diveKey: DiveKey, depth: number, lang: "en" | "ar"): Problem {
  if (diveKey === "shallowBank") return shallowBuoyancy(depth, lang);
  if (diveKey === "deepReef") return deepPressure(depth, lang);
  if (diveKey === "coralGarden") return coralBiology(depth, lang);
  if (diveKey === "lungOfSea") return lungOfSea(depth, lang);
  if (diveKey === "refractionTrial") return refractionTrial(depth, lang);
  return deepPressure(depth, lang);
}

function shallowBuoyancy(depth: number, lang: "en" | "ar"): Problem {
  const trialLabel = lang === "en" ? "Buoyancy trial" : "اختبار الطفو";
  if (depth === 5) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "Saif's stone helps him sink. Why doesn't his body sink without it?"
          : "حجر سيف يساعده على الهبوط. لماذا لا يهبط جسمه بدونه؟",
      diagram: "biology",
      options:
        lang === "en"
          ? ["He's too tall", "His body is less dense than water", "His lungs are empty", "Sea is too salty"]
          : ["لأنه طويل", "جسمه أقل كثافةً من الماء", "رئتاه فارغتان", "البحر شديد الملوحة"],
      answer: 1,
      explain:
        lang === "en"
          ? "Anything less dense than water floats on it. Saif's lungs make him just a touch lighter than water — the stone gives him the extra weight he needs to descend."
          : "كل ما هو أقل كثافة من الماء يطفو فوقه. رئتا سيف تجعلانه أخف بقليل من الماء، والحجر يمنحه الوزن الإضافي للنزول.",
    };
  }
  if (depth === 10) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "Two stones, same shape. The heavier one sinks faster because it has more…"
          : "حجران بالشكل نفسه. الأثقل يهبط أسرع لأن فيه…",
      diagram: "biology",
      options:
        lang === "en"
          ? ["Volume", "Mass", "Surface area", "Color"]
          : ["حجم", "كتلة", "مساحة سطح", "لون"],
      answer: 1,
      explain:
        lang === "en"
          ? "Same shape means same volume — so they both push aside the same amount of water. Mass is the only thing left to differ, and more mass means a stronger downward pull."
          : "الشكل نفسه يعني الحجم نفسه، فكلاهما يزيح القدر نفسه من الماء. الفرق الوحيد هو الكتلة، وكلّما زادت زاد سحب الجاذبية.",
    };
  }
  return {
    trialLabel,
    q:
      lang === "en"
        ? "Why is buoyancy stronger in seawater than in fresh water?"
        : "لمَ الطفو في ماء البحر أقوى من الماء العذب؟",
    diagram: "biology",
    options:
      lang === "en"
        ? ["Seawater is colder", "Seawater is denser", "Salt is heavier than water", "Waves push divers up"]
        : ["ماء البحر أبرد", "ماء البحر أكثف", "الملح أثقل من الماء", "الأمواج ترفع الغوّاص"],
    answer: 1,
    explain:
      lang === "en"
        ? "Salt dissolved in seawater makes it denser than fresh water. Denser water pushes back harder against anything you submerge — that's why pearling worked here."
        : "الملح الذائب يجعل ماء البحر أكثف من الماء العذب، فيدفع الأجسام المغمورة دفعًا أقوى — لهذا ازدهر الغوص هنا.",
  };
}

function deepPressure(depth: number, lang: "en" | "ar"): Problem {
  const trialLabel = lang === "en" ? "Pressure trial" : "اختبار الضغط";
  if (depth === 5) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "At the surface pressure is 1 atmosphere. What is it at 5m depth?"
          : "عند السطح الضغط ١ ضغط جوي. كم يكون عند عمق ٥م؟",
      diagram: "pressure",
      depth: 5,
      options:
        lang === "en"
          ? ["0.5 atm", "1 atm", "1.5 atm", "5 atm"]
          : ["٠٫٥ ج.و", "١ ج.و", "١٫٥ ج.و", "٥ ج.و"],
      answer: 2,
      explain:
        lang === "en"
          ? "Every 10m of water adds 1 atmosphere on top of the surface air. At 5m you're halfway there: 1 + 0.5 = 1.5 atm."
          : "كل ١٠ أمتار من الماء تضيف جوًا واحدًا فوق ضغط الهواء عند السطح. عند ٥م أنت في المنتصف: ١ + ٠٫٥ = ١٫٥ ج.و.",
    };
  }
  if (depth === 10) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "At 10m depth, what is the total pressure on the diver?"
          : "عند عمق ١٠م، ما الضغط الكلي على الغوّاص؟",
      diagram: "pressure",
      depth: 10,
      options:
        lang === "en"
          ? ["1 atm", "2 atm", "10 atm", "11 atm"]
          : ["١ ج.و", "٢ ج.و", "١٠ ج.و", "١١ ج.و"],
      answer: 1,
      explain:
        lang === "en"
          ? "10m of water adds exactly 1 atmosphere of pressure to the 1 atm of surface air. Total: 2 atm — twice as much push as you feel on land."
          : "عشرة أمتار من الماء تضيف جوًا واحدًا فوق ضغط الهواء (١ ج.و) عند السطح. المجموع ٢ ج.و — ضعف ما تشعر به على اليابسة.",
    };
  }
  return {
    trialLabel,
    q:
      lang === "en"
        ? "Saif descends to 15m. Compared to the surface, his lungs feel…"
        : "ينزل سيف إلى ١٥م. مقارنةً بالسطح، رئتاه تشعران بأنّهما…",
    diagram: "pressure",
    depth: 15,
    options:
      lang === "en"
        ? ["Lighter", "Squeezed", "Hotter", "The same"]
        : ["أخف", "مضغوطتان", "أسخن", "كما هما"],
    answer: 1,
    explain:
      lang === "en"
        ? "Pressure squeezes air. At 15m total pressure is 2.5 atm, so the air in Saif's lungs is compressed to about 40% of its surface volume."
        : "الضغط يضغط الهواء. عند ١٥م يكون الضغط الكلي ٢٫٥ ج.و، فيُضغط هواء رئتي سيف إلى نحو ٤٠٪ من حجمه عند السطح.",
  };
}

function coralBiology(depth: number, lang: "en" | "ar"): Problem {
  const trialLabel = lang === "en" ? "Reef biology" : "علم الشعاب";
  if (depth === 5) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "Why do oysters cluster on coral and rock instead of sandy seafloor?"
          : "لمَ يتجمّع المحار على المرجان والصخر دون قاع الرمل؟",
      diagram: "biology",
      options:
        lang === "en"
          ? ["For warmth", "Anchored against currents", "For camouflage", "To hide from divers"]
          : ["للدفء", "ليثبت ضد التيار", "للتمويه", "ليختبئ من الغوّاصين"],
      answer: 1,
      explain:
        lang === "en"
          ? "Oysters glue themselves to a hard surface so the tide can't roll them away. Sand shifts; rock doesn't. That's why pearling banks form on reef edges."
          : "يلصق المحار نفسه بسطح صلب كي لا يجرفه المدّ. الرمل يتحرّك، لكنّ الصخر ثابت — ولذا تنشأ مغاصات اللؤلؤ عند حواف الشعاب.",
    };
  }
  if (depth === 10) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "How does an oyster eat?"
          : "كيف يتغذّى المحار؟",
      diagram: "biology",
      options:
        lang === "en"
          ? ["Hunts small fish", "Filters plankton from water", "Eats coral", "Absorbs sunlight"]
          : ["يصطاد الأسماك الصغيرة", "يرشّح العوالق من الماء", "يأكل المرجان", "يمتص الشمس"],
      answer: 1,
      explain:
        lang === "en"
          ? "An oyster pumps water through its gills, trapping plankton with mucus. One oyster can filter ~190 litres a day — they're tiny water-purifiers."
          : "يضخّ المحار الماء عبر خياشيمه ليلتقط العوالق بالمخاط. يستطيع المحار الواحد ترشيح ١٩٠ لترًا يوميًا — مُنقّيات صغيرة للبحر.",
    };
  }
  return {
    trialLabel,
    q:
      lang === "en"
        ? "A pearl forms when a grain of sand enters the oyster. What does the oyster coat it with?"
        : "تتكوّن اللؤلؤة حين تدخل ذرّة رمل المحار. بماذا يغلّفها؟",
    diagram: "biology",
    options:
      lang === "en"
        ? ["Salt crystals", "Layers of nacre", "Coral dust", "Air bubbles"]
        : ["بلورات ملح", "طبقات من نُكر", "غبار مرجان", "فقاعات هواء"],
    answer: 1,
    explain:
      lang === "en"
        ? "The oyster lays down thin layers of nacre — the same shimmering material that coats the inside of its shell — to smooth over the irritant. Year by year, those layers become a pearl."
        : "يضع المحار طبقات رقيقة من النُّكر — المادة اللامعة نفسها التي تبطّن صدفته — ليكسو ذرّة الإزعاج. سنةً بعد سنة، تصير هذه الطبقات لؤلؤة.",
  };
}

/**
 * Lung of the Sea (15m) — depth, breath physiology, dive reflex.
 * Three questions covering oxygen / lung capacity / mammalian dive
 * response. Trained pearl divers stayed under 90 seconds at 12-15m on
 * a single breath; this dive surfaces *why* their bodies cooperated.
 */
function lungOfSea(depth: number, lang: "en" | "ar"): Problem {
  const trialLabel = lang === "en" ? "Lung of the sea" : "رئة البحر";
  if (depth === 5) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "Why does holding your breath get harder the longer you hold it?"
          : "لماذا يصبح حبس النفس أصعب كلّما طالت المدّة؟",
      diagram: "biology",
      options:
        lang === "en"
          ? [
              "Lungs run out of oxygen",
              "Carbon dioxide builds up in the blood",
              "Heart stops working",
              "The lungs shrink",
            ]
          : [
              "تنفد الرئتان من الأكسجين",
              "يتراكم ثاني أكسيد الكربون في الدم",
              "يتوقّف القلب",
              "تنكمش الرئتان",
            ],
      answer: 1,
      explain:
        lang === "en"
          ? "It's not oxygen running out — it's CO₂ piling up. Your body senses rising CO₂ and screams 'breathe!' long before oxygen actually gets low. Trained divers learn to ignore that early signal."
          : "ليس الأكسجين هو الذي ينفد، بل ثاني أكسيد الكربون يتراكم. جسمك يستشعر ارتفاعه فيصرخ 'تنفّس!' قبل أن ينخفض الأكسجين فعلًا. الغوّاص المدرّب يتعلّم تجاوز هذا الإنذار المبكر.",
    };
  }
  if (depth === 10) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "Saif's heart beats slower the moment his face hits the water. Why?"
          : "يبطّئ قلب سيف فور غمر وجهه في الماء. لماذا؟",
      diagram: "biology",
      options:
        lang === "en"
          ? [
              "Cold shock",
              "The mammalian dive reflex",
              "He's afraid",
              "His blood freezes",
            ]
          : [
              "صدمة البرد",
              "ردّ الفعل الغوصي عند الثدييات",
              "خوفه",
              "تجمّد دمه",
            ],
      answer: 1,
      explain:
        lang === "en"
          ? "All mammals — humans included — slow their heart and shunt blood to the core when their face is submerged. It saves oxygen for the brain and heart. Trained pearl divers used this reflex without ever knowing the name."
          : "كل الثدييات — والإنسان منها — تبطّئ قلبها وتوجّه الدم إلى المركز عند غمر الوجه. هذا يوفّر الأكسجين للدماغ والقلب. الغوّاصون كانوا يستخدمون هذا الانعكاس قبل أن يكون له اسم.",
    };
  }
  return {
    trialLabel,
    q:
      lang === "en"
        ? "A trained pearl diver's lungs hold ~6 litres. What single change lets him hold that breath the longest?"
        : "تتسع رئتا الغوّاص المدرَّب لنحو ٦ لترات. ما الشيء الذي يطيل حبسه للنّفس أكثر؟",
    diagram: "biology",
    options:
      lang === "en"
        ? [
            "Filling lungs as full as possible",
            "Staying calm and slowing the heart",
            "Eating before diving",
            "Holding the chest tight",
          ]
        : [
            "ملء الرئتين قدر الإمكان",
            "الهدوء وتبطئة القلب",
            "الأكل قبل الغوص",
            "شدّ الصدر",
          ],
    answer: 1,
    explain:
      lang === "en"
        ? "Calm beats capacity. A racing heart burns oxygen four times faster than a still one. The nahham's chant on deck wasn't decoration — it was a heart-rate metronome that taught divers to slow down before they descended."
        : "الهدوء يهزم السعة. القلب المتسارع يستهلك الأكسجين أربعة أضعاف القلب الهادئ. أهازيج النّهام على ظهر السفينة لم تكن للزينة — كانت إيقاع قلب يعلّم الغوّاصين كيف يهدأون قبل النزول.",
  };
}

/**
 * Refraction Trial (20m) — light, refraction, optics underwater.
 * Three questions covering why things look bent, how colour drops out
 * with depth, and why the pearling masters surfaced before noon.
 */
function refractionTrial(depth: number, lang: "en" | "ar"): Problem {
  const trialLabel = lang === "en" ? "Refraction trial" : "اختبار الانكسار";
  if (depth === 5) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "A wooden spear in the water looks bent at the surface. Why?"
          : "يبدو الرمح الخشبي منكسرًا عند سطح الماء. لماذا؟",
      diagram: "biology",
      options:
        lang === "en"
          ? [
              "Wood softens in water",
              "Light bends crossing into water",
              "Water magnifies wood",
              "Your eyes get tired",
            ]
          : [
              "يلين الخشب في الماء",
              "ينكسر الضوء عند انتقاله إلى الماء",
              "يكبّر الماء الخشب",
              "تتعب عيناك",
            ],
      answer: 1,
      explain:
        lang === "en"
          ? "Light slows down when it enters water and bends toward the denser medium. The spear is straight — the light reaching your eye is what's bent. Spear-fishers learn to aim *below* the fish they see."
          : "يبطّئ الضوء عند دخوله الماء وينحرف نحو الوسط الأكثف. الرمح مستقيم — الضوء الذي يصلك هو الذي انكسر. لذلك يصوّب الصيّاد *أسفل* السمكة التي يراها.",
    };
  }
  if (depth === 10) {
    return {
      trialLabel,
      q:
        lang === "en"
          ? "Saif descends past 10m and the colours around him fade. Which colour disappears first?"
          : "ينزل سيف تحت ١٠م فتبهت الألوان. أيُّ لون يختفي أوّلًا؟",
      diagram: "biology",
      options:
        lang === "en"
          ? ["Blue", "Green", "Red", "Yellow"]
          : ["الأزرق", "الأخضر", "الأحمر", "الأصفر"],
      answer: 2,
      explain:
        lang === "en"
          ? "Red light has the longest wavelength and the lowest energy, so water absorbs it first — it's gone by ~5m. Blue travels furthest, which is why everything underwater drifts toward blue-green the deeper you go."
          : "الضوء الأحمر أطول الأطوال الموجية وأقلّها طاقة، فيمتصّه الماء أوّلًا — يختفي عند نحو ٥م. الأزرق ينفذ أعمق، لذا يميل كل ما تحت الماء إلى الأزرق-الأخضر كلّما نزلت.",
    };
  }
  return {
    trialLabel,
    q:
      lang === "en"
        ? "Pearling boats finished diving by midday. Why was light around noon best for spotting an oyster bed?"
        : "كان الغوّاصون يفرغون من الغوص ظهرًا. لماذا يكون ضوء الظهيرة الأفضل لاكتشاف مغاص؟",
    diagram: "biology",
    options:
      lang === "en"
        ? [
            "Sun sits straight overhead, light travels deepest",
            "The sea is warmest at noon",
            "Tides are highest",
            "Fish are sleeping",
          ]
        : [
            "تتوسّط الشمس فيصل ضوؤها أعمق",
            "البحر أدفأ ظهرًا",
            "المدّ أعلى",
            "الأسماك نائمة",
          ],
    answer: 0,
    explain:
      lang === "en"
        ? "When the sun is overhead, light hits the water at the steepest angle and refracts the least. More photons reach the seabed and you can actually see oysters at depth. After 2pm the angle steepens and the sea turns to ink."
        : "حين تتوسّط الشمس يصل ضوؤها بزاوية شديدة الانحدار فينكسر أقل، فتصل الفوتونات إلى القاع. بعد الثانية يميل القرص فيصبح البحر حبرًا.",
  };
}

function ProblemOverlay({
  problem,
  breath,
  onAnswer,
  celebrating,
  answered,
  diveKey,
}: {
  problem: Problem;
  breath: number;
  onAnswer: (i: number) => void;
  celebrating?: boolean;
  answered?: { idx: number; correct: boolean } | null;
  diveKey: DiveKey;
}) {
  const { t, fmt, lang } = useI18n();
  const locked = !!answered;
  return (
    <div className="dive-problem-card">
      <div
        className="font-display"
        style={{
          fontSize: 11,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "var(--sunset-gold)",
        }}
      >
        {problem.trialLabel} · {fmt(Math.round(breath))}% {t("dive.breath")}
      </div>
      <div
        className="dive-question-text"
        style={{
          fontFamily:
            lang === "ar"
              ? "var(--font-tajawal), sans-serif"
              : "var(--font-cormorant), serif",
          color: "var(--foam)",
          marginTop: 14,
          lineHeight: 1.4,
        }}
      >
        {problem.q}
      </div>

      {/* Theme-matched concept diagram — replaces the previous pressure-
          only column. Each dive type now renders its own animated SVG
          (buoyancy column / pressure compression / oyster filter feed /
          breath rhythm / refracting light) so the kid has a concrete
          picture to anchor the question to. */}
      <div className="dive-concept-row">
        <DiveConceptVisual
          diveKey={diveKey}
          depth={problem.depth}
          size="compact"
        />
      </div>

      <div className="dive-options">
        {problem.options.map((opt, i) => {
          const isCorrect = i === problem.answer;
          const isPicked = answered?.idx === i;
          let stateClass = "";
          if (locked) {
            if (isCorrect) stateClass = " is-correct";
            else if (isPicked) stateClass = " is-wrong";
            else stateClass = " is-dim";
          }
          return (
            <button
              key={i}
              onClick={() => !locked && onAnswer(i)}
              disabled={locked}
              className={`answer-btn${stateClass}`}
            >
              <span
                className="font-display answer-btn-letter"
                style={{ marginInlineEnd: 12 }}
              >
                {["A", "B", "C", "D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`dive-feedback${answered.correct ? " is-correct" : " is-wrong"}`}>
          <span className="dive-feedback-glyph" aria-hidden>
            {answered.correct ? "✓" : "✗"}
          </span>
          <div className="dive-feedback-text">
            <div className="dive-feedback-verdict">
              {answered.correct
                ? lang === "en" ? "Correct!" : "صحيح!"
                : lang === "en" ? "Not quite — here's why:" : "ليس تمامًا — والسبب:"}
            </div>
            <div className="dive-feedback-why">{problem.explain}</div>
          </div>
        </div>
      )}

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

      <div className="dive-card-chevron-strip ltr-internal">
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
        .dive-problem-card {
          position: absolute;
          inset-inline-start: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(540px, calc(100vw - 24px));
          max-height: calc(100dvh - 140px);
          overflow-y: auto;
          /* Symmetric padding all around so the chevron strip can use a
             matching negative inline margin without overflowing the card.
             Kept lean on phone (14px), generous on desktop (32px). */
          padding: clamp(14px, 4vw, 32px);
          padding-bottom: 0;
          background: rgba(8,55,74,0.55);
          border: 1px solid rgba(244,184,96,0.4);
          backdrop-filter: blur(20px) saturate(140%);
          box-shadow:
            0 30px 80px rgba(0,0,0,0.5),
            inset 0 0 40px rgba(244,184,96,0.08);
        }
        .dive-question-text {
          /* Scales with viewport so long questions don't blow out small
             phones, but reads cleanly at 24px on desktop. */
          font-size: clamp(17px, 4.4vw, 24px);
        }
        .dive-concept-row {
          margin-top: 16px;
          display: flex;
          justify-content: center;
        }
        .dive-options {
          margin-top: 20px;
          display: grid;
          /* auto-fit + minmax so options collapse to one column whenever
             the card is too narrow for two side-by-side. Avoids the
             "answer text wraps to 4 lines per option" problem on phones. */
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
          gap: 10px;
        }
        .dive-card-chevron-strip {
          margin-top: 26px;
          height: 18px;
          margin-inline: calc(-1 * clamp(14px, 4vw, 32px));
          margin-bottom: 0;
          display: flex;
        }
        .answer-btn {
          padding: 14px 18px;
          background: rgba(240,244,242,0.06);
          border: 1.5px solid rgba(240,244,242,0.18);
          border-radius: 14px;
          color: var(--foam);
          cursor: pointer;
          text-align: start;
          font-family: var(--font-tajawal), sans-serif;
          font-size: 16px;
          transition: all 0.3s var(--ease-water);
          display: inline-flex;
          align-items: center;
          line-height: 1.35;
          /* Block iOS Safari's grey tap-flash so the locked is-correct /
             is-wrong colours stay readable when tapped. */
          -webkit-tap-highlight-color: transparent;
        }
        /* Only apply the gold "live" hover state on devices that can
           actually hover (mouse / trackpad). Touch devices emulate :hover
           after a tap and leave the button visually highlighted until the
           next tap elsewhere — which made the dive question read as if a
           random answer was selected. */
        @media (hover: hover) and (pointer: fine) {
          .answer-btn:not(:disabled):hover {
            background: rgba(244,184,96,0.18);
            border-color: var(--sunset-gold);
          }
        }
        .answer-btn-letter {
          width: 30px;
          height: 30px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(244,184,96,0.18);
          border: 1px solid rgba(244,184,96,0.4);
          border-radius: 50%;
          color: var(--sunset-gold);
          font-size: 14px;
          font-weight: 700;
        }
        .answer-btn:disabled { cursor: default; }
        .answer-btn.is-correct {
          background: rgba(86,150,80,0.22);
          border-color: rgba(112,180,98,0.85);
          color: rgba(225,245,210,0.95);
        }
        .answer-btn.is-correct .answer-btn-letter {
          background: rgba(112,180,98,0.32);
          border-color: rgba(112,180,98,0.85);
          color: rgba(225,245,210,0.95);
        }
        .answer-btn.is-wrong {
          background: rgba(180,68,52,0.22);
          border-color: rgba(220,98,80,0.85);
          color: rgba(255,220,210,0.95);
        }
        .answer-btn.is-wrong .answer-btn-letter {
          background: rgba(220,98,80,0.32);
          border-color: rgba(220,98,80,0.85);
          color: rgba(255,220,210,0.95);
        }
        .answer-btn.is-dim { opacity: 0.45; }

        .dive-feedback {
          margin-top: 14px;
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 14px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          animation: fbRise 0.35s var(--ease-water);
        }
        @keyframes fbRise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dive-feedback.is-correct {
          background: rgba(86,150,80,0.18);
          border: 1px solid rgba(112,180,98,0.7);
          color: rgba(225,245,210,0.95);
        }
        .dive-feedback.is-wrong {
          background: rgba(180,68,52,0.18);
          border: 1px solid rgba(220,98,80,0.7);
          color: rgba(255,220,210,0.95);
        }
        .dive-feedback-glyph {
          flex: 0 0 auto;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }
        .dive-feedback.is-correct .dive-feedback-glyph {
          background: rgba(112,180,98,0.32);
          border: 1px solid rgba(112,180,98,0.85);
        }
        .dive-feedback.is-wrong .dive-feedback-glyph {
          background: rgba(220,98,80,0.32);
          border: 1px solid rgba(220,98,80,0.85);
        }
        .dive-feedback-text { flex: 1; min-width: 0; }
        .dive-feedback-verdict {
          font-family: var(--font-cormorant), serif;
          font-size: 15px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .dive-feedback-why {
          margin-top: 5px;
          font-size: 14.5px;
          line-height: 1.55;
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
}
