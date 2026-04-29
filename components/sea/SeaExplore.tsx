"use client";

// SeaExplore — free-swim exploration mode.
//
// Saif drifts in a 2400×1600 underwater world. The kid steers with
// arrow keys / WASD on web or a virtual joystick on touch. Eight
// scattered marine creatures of the Arabian Gulf — dugong, hawksbill
// turtle, pearl oyster, stingray, whale shark, lionfish, octopus, sea
// grass meadow — surface a bilingual fact card the moment Saif's
// hitbox overlaps them. Discovered count tracked top-right.
//
// No backend, no persistence — exploration state is session-local.
// Honors prefers-reduced-motion via static fallback rendering.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { TopChrome } from "@/components/layout/TopChrome";
import { VirtualJoystick } from "@/components/sea/VirtualJoystick";
import { playCue } from "@/lib/audio/cues";

const WORLD = { w: 2400, h: 1600 };
const SAIF = { w: 60, h: 88 };
/** Steady-state max speed in px/sec. */
const SPEED = 240;
/** Acceleration smoothing — higher = snappier response. */
const LERP = 0.18;
/** Hit radius for discovery overlap. */
const HIT_RADIUS = 90;

interface Creature {
  id: string;
  x: number;
  y: number;
  /** Render scale of the SVG sprite. Default 1. */
  scale?: number;
  nameEn: string;
  nameAr: string;
  factEn: string;
  factAr: string;
  /** Which mini-SVG renders for this creature. */
  art: CreatureArt;
}

type CreatureArt =
  | "dugong"
  | "turtle"
  | "oyster"
  | "stingray"
  | "whaleShark"
  | "lionfish"
  | "octopus"
  | "seagrass";

const CREATURES: Creature[] = [
  {
    id: "dugong",
    x: 480,
    y: 1280,
    nameEn: "Dugong",
    nameAr: "أبقار البحر",
    factEn:
      "A gentle sea cow that grazes on sea grass. UAE waters host one of the largest dugong populations in the world — second only to Australia.",
    factAr:
      "بقرة بحر هادئة ترعى الأعشاب البحرية. مياه الإمارات تأوي ثاني أكبر تجمّع للأبقار البحرية في العالم بعد أستراليا.",
    art: "dugong",
    scale: 1.1,
  },
  {
    id: "turtle",
    x: 1640,
    y: 360,
    nameEn: "Hawksbill turtle",
    nameAr: "السلحفاة منقار الصقر",
    factEn:
      "Hawksbill turtles return to UAE beaches every year to bury their eggs in the warm sand at night.",
    factAr:
      "تعود السلاحف صقريّة المنقار إلى شواطئ الإمارات سنويًا لتدفن بيضها في الرمل الدافئ ليلًا.",
    art: "turtle",
  },
  {
    id: "oyster",
    x: 1180,
    y: 1380,
    nameEn: "Pearl oyster",
    nameAr: "محار اللؤلؤ",
    factEn:
      "A grain of sand becomes a pearl over years of nacre layers — the same material that lines the inside of the shell.",
    factAr:
      "تصير ذرّة الرمل لؤلؤةً عبر سنين من طبقات النّكر — المادة نفسها التي تبطّن الصدفة من الداخل.",
    art: "oyster",
  },
  {
    id: "stingray",
    x: 360,
    y: 540,
    nameEn: "Stingray",
    nameAr: "الراي اللاسع",
    factEn:
      "Stingrays are flat for camouflage. They hide buried in sand with only their eyes and breathing holes peeking out.",
    factAr:
      "الراي مفلطح ليتمموّه. يختبئ مدفونًا في الرمل ولا يبرز سوى عينيه وفتحات تنفسه.",
    art: "stingray",
    scale: 1.15,
  },
  {
    id: "whaleShark",
    x: 1880,
    y: 1080,
    nameEn: "Whale shark",
    nameAr: "قرش الحوت",
    factEn:
      "The biggest fish in the sea — totally gentle. Whale sharks visit the Arabian Gulf each spring to feed on plankton.",
    factAr:
      "أكبر سمكة في البحر — وهي وديعة تمامًا. تزور أقراش الحوت الخليج العربي كل ربيع لتقتات على العوالق.",
    art: "whaleShark",
    scale: 1.4,
  },
  {
    id: "lionfish",
    x: 760,
    y: 240,
    nameEn: "Lionfish",
    nameAr: "سمك الأسد",
    factEn:
      "Beautiful but venomous. The long fins hide poison spines — admire from a distance.",
    factAr:
      "جميلة لكن سامّة. تخفي الزعانف الطويلة أشواكًا مسمومة — انظر من بعيد.",
    art: "lionfish",
  },
  {
    id: "octopus",
    x: 2080,
    y: 460,
    nameEn: "Octopus",
    nameAr: "الأخطبوط",
    factEn:
      "Octopuses change color in less than a second and squeeze through gaps the size of a one-dirham coin.",
    factAr:
      "يغيّر الأخطبوط لونه في أقل من ثانية، ويعبر فجوات بحجم درهم واحد.",
    art: "octopus",
  },
  {
    id: "seagrass",
    x: 1280,
    y: 800,
    nameEn: "Sea grass meadow",
    nameAr: "مرج بحري",
    factEn:
      "Sea grass is a nursery for baby fish, oysters, and turtles. Without it the dugong wouldn't survive.",
    factAr:
      "الأعشاب البحرية حضانة لصغار السمك والمحار والسلاحف. بدونها لا تحيا الأبقار البحرية.",
    art: "seagrass",
    scale: 1.4,
  },
];

interface Vec2 {
  x: number;
  y: number;
}

export function SeaExplore() {
  const router = useRouter();
  const { fmt, lang } = useI18n();

  const posRef = useRef<Vec2>({ x: WORLD.w / 2, y: WORLD.h / 2 });
  const velRef = useRef<Vec2>({ x: 0, y: 0 });
  const targetVelRef = useRef<Vec2>({ x: 0, y: 0 });
  const camRef = useRef<Vec2>({ x: 0, y: 0 });

  // Snapshot of values that drive rendering — refreshed once per RAF
  // tick. Refs hold the live game state; React only sees the snapshot,
  // so we never read refs during render.
  interface Frame {
    saif: Vec2;
    cam: Vec2;
    moving: boolean;
    depth: number;
  }
  const [frame, setFrame] = useState<Frame>(() => ({
    saif: { x: WORLD.w / 2, y: WORLD.h / 2 },
    cam: { x: 0, y: 0 },
    moving: false,
    depth: 0.5,
  }));
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [activeCard, setActiveCard] = useState<Creature | null>(null);
  const cardTimerRef = useRef<number | null>(null);
  const [facing, setFacing] = useState<"left" | "right">("right");

  useEffect(() => {
    const held = new Set<string>();
    function recompute() {
      let dx = 0;
      let dy = 0;
      if (held.has("ArrowRight") || held.has("d") || held.has("D")) dx += 1;
      if (held.has("ArrowLeft") || held.has("a") || held.has("A")) dx -= 1;
      if (held.has("ArrowDown") || held.has("s") || held.has("S")) dy += 1;
      if (held.has("ArrowUp") || held.has("w") || held.has("W")) dy -= 1;
      const mag = Math.hypot(dx, dy) || 1;
      targetVelRef.current = { x: (dx / mag) * SPEED, y: (dy / mag) * SPEED };
      if (dx > 0) setFacing("right");
      if (dx < 0) setFacing("left");
    }
    function onDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      held.add(e.key);
      recompute();
    }
    function onUp(e: KeyboardEvent) {
      held.delete(e.key);
      recompute();
    }
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  const handleJoystick = useCallback((v: Vec2) => {
    const mag = Math.hypot(v.x, v.y);
    if (mag === 0) {
      targetVelRef.current = { x: 0, y: 0 };
      return;
    }
    targetVelRef.current = { x: v.x * SPEED, y: v.y * SPEED };
    if (v.x > 0.05) setFacing("right");
    else if (v.x < -0.05) setFacing("left");
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const tv = targetVelRef.current;
      velRef.current = {
        x: velRef.current.x + (tv.x - velRef.current.x) * LERP,
        y: velRef.current.y + (tv.y - velRef.current.y) * LERP,
      };
      const nx = clamp(
        posRef.current.x + velRef.current.x * dt,
        SAIF.w / 2,
        WORLD.w - SAIF.w / 2,
      );
      const ny = clamp(
        posRef.current.y + velRef.current.y * dt,
        SAIF.h / 2,
        WORLD.h - SAIF.h / 2,
      );
      posRef.current = { x: nx, y: ny };
      const viewW =
        typeof window !== "undefined" ? window.innerWidth : WORLD.w;
      const viewH =
        typeof window !== "undefined" ? window.innerHeight : WORLD.h;
      camRef.current = {
        x: clamp(nx - viewW / 2, 0, Math.max(0, WORLD.w - viewW)),
        y: clamp(ny - viewH / 2, 0, Math.max(0, WORLD.h - viewH)),
      };
      for (const c of CREATURES) {
        if (discovered.has(c.id)) continue;
        const dx = nx - c.x;
        const dy = ny - c.y;
        if (Math.hypot(dx, dy) < HIT_RADIUS) {
          setDiscovered((prev) => {
            if (prev.has(c.id)) return prev;
            const next = new Set(prev);
            next.add(c.id);
            return next;
          });
          setActiveCard(c);
          playCue("achievement.unlock");
          if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
          cardTimerRef.current = window.setTimeout(() => {
            setActiveCard(null);
          }, 6000);
          break;
        }
      }
      // Push a snapshot so React renders this frame's positions.
      const moving = Math.hypot(velRef.current.x, velRef.current.y) > 8;
      const depth = clamp(ny / WORLD.h, 0, 1);
      setFrame({
        saif: { x: nx, y: ny },
        cam: { x: camRef.current.x, y: camRef.current.y },
        moving,
        depth,
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [discovered]);

  const allDoneRef = useRef(false);
  useEffect(() => {
    if (!allDoneRef.current && discovered.size === CREATURES.length) {
      allDoneRef.current = true;
      playCue("loom.shimmer");
    }
  }, [discovered.size]);

  const sx = frame.saif.x - frame.cam.x;
  const sy = frame.saif.y - frame.cam.y;
  const isMoving = frame.moving;
  const depth = frame.depth;

  const stage = (
    <div
      className="explore-world"
      style={{
        transform: `translate3d(${-frame.cam.x}px, ${-frame.cam.y}px, 0)`,
      }}
    >
      <Decor />
      {CREATURES.map((c) => (
        <CreatureSprite
          key={c.id}
          creature={c}
          found={discovered.has(c.id)}
          focused={activeCard?.id === c.id}
        />
      ))}
    </div>
  );

  return (
    <div className="explore-root">
      <TopChrome
        onBack={() => router.push("/sea")}
        title={lang === "en" ? "Free Dive" : "غوصة حرّة"}
        subtitle={lang === "en" ? "EXPLORE THE GULF" : "استكشف الخليج"}
        transparent
      />

      <Backdrop />
      <Bubbles />

      {stage}

      {/* Depth fog — darkens with depth. Sits between world & UI. */}
      <div
        className="explore-depth-fog"
        style={{ opacity: 0.18 + depth * 0.42 }}
        aria-hidden
      />

      <div
        className="explore-saif"
        style={{
          transform: `translate3d(${sx - SAIF.w / 2}px, ${sy - SAIF.h / 2}px, 0)`,
        }}
      >
        <SaifSwimmer facing={facing} moving={isMoving} />
      </div>

      <div className="explore-counter" aria-live="polite">
        <span className="explore-counter-glyph" aria-hidden>≈</span>
        <span className="explore-counter-text">
          {lang === "en" ? "Discoveries" : "اكتشافات"}
        </span>
        <span className="explore-counter-num">
          {fmt(discovered.size)} / {fmt(CREATURES.length)}
        </span>
      </div>

      {discovered.size === 0 && (
        <div className="explore-hint">
          <span aria-hidden style={{ marginInlineEnd: 6 }}>↕↔</span>
          {lang === "en"
            ? "Swim with arrows / WASD or the joystick — find creatures to learn about them."
            : "اسبح بمفاتيح الأسهم / WASD أو بالعصا — اقترب من المخلوقات لتعرفها."}
        </div>
      )}

      {activeCard && (
        <DiscoveryCard
          creature={activeCard}
          lang={lang}
          onDismiss={() => setActiveCard(null)}
        />
      )}

      {discovered.size === CREATURES.length && (
        <div className="explore-allfound">
          <span className="explore-allfound-glyph" aria-hidden>✦</span>
          {lang === "en"
            ? "You found everyone! Marine biologist in training."
            : "وجدتَ الجميع! عالم أحياء بحرية في التدريب."}
        </div>
      )}

      <div className="explore-joystick">
        <VirtualJoystick onChange={handleJoystick} />
      </div>

      <Style />
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

/* ─────────────────────────────────────────────────────────────────── */
/* SAIF SWIMMER                                                          */

function SaifSwimmer({ facing, moving }: { facing: "left" | "right"; moving: boolean }) {
  return (
    <svg
      viewBox="0 0 60 88"
      width="100%"
      height="100%"
      style={{
        transform: facing === "left" ? "scaleX(-1)" : "none",
        filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.6))",
        transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      className={moving ? "saif-swim moving" : "saif-swim"}
    >
      <defs>
        <linearGradient id="esSaifSkin" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#E5B28C" />
          <stop offset="50%" stopColor="#C98B5C" />
          <stop offset="100%" stopColor="#7A4A2E" />
        </linearGradient>
        <linearGradient id="esSaifKandura" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#E6DCC5" />
          <stop offset="100%" stopColor="#A89475" />
        </linearGradient>
        <radialGradient id="esGoggleLens" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="20%" stopColor="#A5E2F3" />
          <stop offset="100%" stopColor="#1E6582" />
        </radialGradient>
        <linearGradient id="esFin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5CE1E6" />
          <stop offset="100%" stopColor="#0B7A94" />
        </linearGradient>
        <filter id="esGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="kanduraShadow" cx="50%" cy="50%" r="60%">
          <stop offset="30%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>
      </defs>

      {/* Trailing wake (Kandura tail) */}
      <path
        d="M 22 64 Q 10 74 6 86 Q 16 80 24 70 Z"
        fill="rgba(255,255,255,0.45)"
        className="saif-tail"
      />
      <path
        d="M 28 68 Q 38 78 44 88 Q 34 82 28 72 Z"
        fill="rgba(255,255,255,0.3)"
        className="saif-tail saif-tail-2"
      />

      {/* Swim fins */}
      <g className="saif-fin saif-fin-l">
        <path d="M 18 70 Q 8 78 4 86 Q 14 80 22 74 Z" fill="url(#esFin)" />
        <path d="M 16 74 L 8 82" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
        <path d="M 20 73 L 12 81" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
      </g>
      <g className="saif-fin saif-fin-r">
        <path d="M 38 70 Q 48 78 52 86 Q 42 80 34 74 Z" fill="url(#esFin)" />
        <path d="M 40 74 L 48 82" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
        <path d="M 36 73 L 44 81" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Body — Kandura */}
      <path
        d="M 26 32 Q 14 40 12 56 Q 16 68 24 72 Q 30 74 36 72 Q 44 68 48 56 Q 46 40 34 32 Z"
        fill="url(#esSaifKandura)"
      />
      {/* 3D shading on Kandura */}
      <path
        d="M 26 32 Q 14 40 12 56 Q 16 68 24 72 Q 30 74 36 72 Q 44 68 48 56 Q 46 40 34 32 Z"
        fill="url(#kanduraShadow)"
      />
      {/* Kandura folds */}
      <path d="M 24 40 Q 22 55 26 68" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
      <path d="M 36 38 Q 38 55 34 68" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
      <path d="M 30 42 L 30 65" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" />

      {/* Neck & Head */}
      <path d="M 24 26 L 24 34 L 36 34 L 36 26 Z" fill="url(#esSaifSkin)" />
      {/* Chin shadow */}
      <path d="M 24 28 Q 30 32 36 28 L 36 34 L 24 34 Z" fill="rgba(60,30,15,0.2)" />
      
      <circle cx="30" cy="21" r="12" fill="url(#esSaifSkin)" />
      {/* Blush */}
      <ellipse cx="23" cy="24" rx="2.5" ry="3" fill="rgba(180,60,30,0.18)" />
      <ellipse cx="37" cy="24" rx="2.5" ry="3" fill="rgba(180,60,30,0.18)" />

      {/* Goggles */}
      <g filter="url(#esGlow)">
        <path
          d="M 16 18 Q 30 12 44 18"
          stroke="#1A2530"
          strokeWidth="2.5"
          fill="none"
          opacity="0.8"
        />
        <path d="M 18 19 Q 30 15 42 19 Q 44 24 38 25 Q 30 22 22 25 Q 16 24 18 19 Z" fill="#223344" />
        <ellipse cx="24" cy="20" rx="4.5" ry="3.5" fill="url(#esGoggleLens)" />
        <ellipse cx="36" cy="20" rx="4.5" ry="3.5" fill="url(#esGoggleLens)" />
        <circle cx="23" cy="19.5" r="1.2" fill="#FFFFFF" />
        <circle cx="35" cy="19.5" r="1.2" fill="#FFFFFF" />
      </g>

      {/* Snorkel */}
      <path
        d="M 41 21 Q 46 16 46 10 L 46 6"
        stroke="#E86A44"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="43.5" y="4" width="5" height="4" rx="1.5" fill="#C23B22" />
      <path d="M 45 4 L 47 4" stroke="#FFE9C2" strokeWidth="1" strokeLinecap="round" />

      {/* Mouth gripping snorkel */}
      <path
        d="M 28 27 Q 30 29 32 27"
        stroke="#6E3522"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="35" cy="26.5" r="1.5" fill="#223344" />

      {/* Arms */}
      <g className="saif-arm-l">
        <path
          d="M 18 38 Q 4 44 2 56"
          stroke="url(#esSaifSkin)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 17 39 Q 5 44 3 55"
          stroke="rgba(60,30,15,0.15)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="2.5" cy="56" r="3.5" fill="url(#esSaifSkin)" />
      </g>

      <g className="saif-arm-r">
        <path
          d="M 42 38 Q 56 44 58 56"
          stroke="url(#esSaifSkin)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 43 39 Q 55 44 57 55"
          stroke="rgba(60,30,15,0.15)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="57.5" cy="56" r="3.5" fill="url(#esSaifSkin)" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* CREATURE SPRITES                                                      */

function CreatureSprite({
  creature,
  found,
  focused,
}: {
  creature: Creature;
  found: boolean;
  focused: boolean;
}) {
  const scale = creature.scale ?? 1;
  return (
    <div
      className={`creature${found ? " found" : ""}${focused ? " focused" : ""}`}
      style={{
        position: "absolute",
        left: creature.x,
        top: creature.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <CreatureArt art={creature.art} />
      {!found && <span className="creature-pulse" aria-hidden />}
    </div>
  );
}

function CreatureArt({ art }: { art: CreatureArt }) {
  switch (art) {
    case "dugong":
      // Sea cow — chubby grey body, paddle tail, pectoral flippers,
      // pink belly, soft barnacles for texture.
      return (
        <svg viewBox="0 0 200 110" width="200" height="110" className="art art-dugong">
          <defs>
            <radialGradient id="dugongFill" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#B6C2CD" />
              <stop offset="60%" stopColor="#7E8B98" />
              <stop offset="100%" stopColor="#3F4D5C" />
            </radialGradient>
            <radialGradient id="dugongBelly" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#E5BFB0" />
              <stop offset="100%" stopColor="#9E7E72" />
            </radialGradient>
          </defs>
          {/* Soft shadow under body */}
          <ellipse cx="100" cy="92" rx="74" ry="6" fill="rgba(0,0,0,0.22)" />
          {/* Main body */}
          <path
            d="M 28 56 Q 38 28 88 26 Q 142 24 168 38 Q 178 52 168 72 Q 144 90 88 88 Q 38 86 28 60 Z"
            fill="url(#dugongFill)"
          />
          {/* Belly */}
          <path
            d="M 56 70 Q 100 86 154 72 Q 130 80 100 80 Q 70 80 56 70 Z"
            fill="url(#dugongBelly)"
            opacity="0.85"
          />
          {/* Head bulge */}
          <ellipse cx="160" cy="48" rx="20" ry="16" fill="url(#dugongFill)" />
          {/* Snout whiskers */}
          <path d="M 174 48 Q 182 48 188 46" stroke="#2C3540" strokeWidth="0.8" fill="none" />
          <path d="M 174 52 Q 184 54 192 56" stroke="#2C3540" strokeWidth="0.8" fill="none" />
          {/* Eye */}
          <circle cx="166" cy="44" r="2.2" fill="#1A2330" />
          <circle cx="166.6" cy="43.4" r="0.7" fill="#FFFFFF" />
          {/* Pectoral flipper */}
          <path
            d="M 76 70 Q 64 90 56 96 Q 70 88 86 80 Z"
            fill="#5A6878"
            className="dugong-flipper"
          />
          {/* Paddle tail (fluke) */}
          <path
            d="M 28 60 Q 14 36 4 24 Q 18 42 24 56 Q 18 70 4 92 Q 14 80 28 64 Z"
            fill="#3F4D5C"
            className="dugong-tail"
          />
          {/* Subtle barnacles */}
          <circle cx="84" cy="44" r="2" fill="#D8C39A" opacity="0.6" />
          <circle cx="116" cy="40" r="1.6" fill="#D8C39A" opacity="0.6" />
          <circle cx="120" cy="62" r="1.4" fill="#E2D2AB" opacity="0.5" />
          {/* Top-light highlight */}
          <path
            d="M 50 38 Q 100 28 158 38"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );

    case "turtle":
      // Hawksbill — patterned shell with hex scutes, gold rim, four
      // flippers, beaked head.
      return (
        <svg viewBox="0 0 170 120" width="170" height="120" className="art art-turtle">
          <defs>
            <radialGradient id="turtleShell" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#D8A352" />
              <stop offset="55%" stopColor="#8C5A2A" />
              <stop offset="100%" stopColor="#3D2A18" />
            </radialGradient>
            <linearGradient id="turtleSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9C7A3E" />
              <stop offset="100%" stopColor="#4D3B1F" />
            </linearGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="85" cy="104" rx="58" ry="5" fill="rgba(0,0,0,0.22)" />
          {/* Flippers (back two) */}
          <path
            d="M 50 88 Q 28 96 16 108 Q 36 100 56 90 Z"
            fill="url(#turtleSkin)"
            className="turtle-flipper turtle-flipper-bl"
          />
          <path
            d="M 110 88 Q 132 96 144 108 Q 124 100 104 90 Z"
            fill="url(#turtleSkin)"
            className="turtle-flipper turtle-flipper-br"
          />
          {/* Front flippers */}
          <path
            d="M 38 56 Q 18 46 6 38 Q 22 56 36 64 Z"
            fill="url(#turtleSkin)"
            className="turtle-flipper turtle-flipper-fl"
          />
          <path
            d="M 122 56 Q 142 46 154 38 Q 138 56 124 64 Z"
            fill="url(#turtleSkin)"
            className="turtle-flipper turtle-flipper-fr"
          />
          {/* Shell (carapace) */}
          <ellipse cx="80" cy="62" rx="48" ry="34" fill="url(#turtleShell)" />
          {/* Carapace gold rim */}
          <ellipse
            cx="80"
            cy="62"
            rx="48"
            ry="34"
            fill="none"
            stroke="rgba(244,215,122,0.5)"
            strokeWidth="1.4"
          />
          {/* Hex scutes */}
          {[
            { cx: 60, cy: 46, r: 6 },
            { cx: 80, cy: 42, r: 7 },
            { cx: 100, cy: 46, r: 6 },
            { cx: 56, cy: 64, r: 7 },
            { cx: 80, cy: 62, r: 9 },
            { cx: 104, cy: 64, r: 7 },
            { cx: 64, cy: 80, r: 6 },
            { cx: 80, cy: 84, r: 7 },
            { cx: 96, cy: 80, r: 6 },
          ].map((h, i) => (
            <polygon
              key={i}
              points={`${h.cx - h.r},${h.cy} ${h.cx - h.r / 2},${h.cy - h.r * 0.85} ${h.cx + h.r / 2},${h.cy - h.r * 0.85} ${h.cx + h.r},${h.cy} ${h.cx + h.r / 2},${h.cy + h.r * 0.85} ${h.cx - h.r / 2},${h.cy + h.r * 0.85}`}
              fill="rgba(255,232,180,0.18)"
              stroke="#1F1108"
              strokeWidth="0.7"
            />
          ))}
          {/* Top sheen */}
          <path
            d="M 56 38 Q 80 32 104 38"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Head + beak */}
          <ellipse cx="138" cy="56" rx="14" ry="10" fill="url(#turtleSkin)" />
          <path d="M 148 58 L 156 60 L 148 62 Z" fill="#3D2A18" />
          {/* Eye */}
          <circle cx="144" cy="52" r="1.8" fill="#1A1208" />
          <circle cx="144.4" cy="51.6" r="0.6" fill="#FFE9B8" />
          {/* Skin pattern dots */}
          <circle cx="136" cy="60" r="1" fill="#3D2A18" opacity="0.5" />
          <circle cx="132" cy="56" r="0.8" fill="#3D2A18" opacity="0.5" />
        </svg>
      );

    case "oyster":
      // Pearl oyster — fluted shells with ridges, lustrous nacre
      // interior, pearl with halo.
      return (
        <svg viewBox="0 0 110 90" width="110" height="90" className="art art-oyster">
          <defs>
            <radialGradient id="oysterPearl" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFF3CC" />
              <stop offset="80%" stopColor="#F4D77A" />
              <stop offset="100%" stopColor="#A87A2A" />
            </radialGradient>
            <radialGradient id="oysterNacre" cx="50%" cy="60%" r="70%">
              <stop offset="0%" stopColor="#FFF6E0" />
              <stop offset="60%" stopColor="#E8D9B4" />
              <stop offset="100%" stopColor="#9C8A66" />
            </radialGradient>
            <linearGradient id="oysterShell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7A6440" />
              <stop offset="100%" stopColor="#2F1F12" />
            </linearGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="55" cy="82" rx="44" ry="4" fill="rgba(0,0,0,0.25)" />
          {/* Bottom shell */}
          <path
            d="M 8 46 Q 8 70 36 80 Q 70 82 102 70 Q 102 46 96 46 Q 70 56 36 56 Q 14 50 8 46 Z"
            fill="url(#oysterShell)"
          />
          {/* Top shell flipped open */}
          <path
            d="M 8 46 Q 8 22 36 12 Q 70 8 102 18 Q 102 46 96 46 Q 70 36 36 36 Q 14 42 8 46 Z"
            fill="url(#oysterShell)"
          />
          {/* Top shell ridges */}
          {[16, 24, 32, 40, 48, 56, 64, 72, 80, 88].map((x, i) => (
            <path
              key={i}
              d={`M ${x} 14 Q ${x} 30 ${x} 44`}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="1.2"
              fill="none"
            />
          ))}
          {/* Inner nacre rim */}
          <ellipse cx="55" cy="46" rx="40" ry="9" fill="url(#oysterNacre)" />
          {/* Nacre highlight */}
          <ellipse cx="48" cy="44" rx="20" ry="3" fill="rgba(255,255,255,0.55)" />
          {/* Pearl halo glow */}
          <circle cx="55" cy="46" r="14" fill="rgba(255,232,180,0.22)" className="oyster-halo" />
          {/* Pearl */}
          <circle cx="55" cy="46" r="8" fill="url(#oysterPearl)" />
          {/* Pearl highlight */}
          <circle cx="52" cy="43" r="2.4" fill="rgba(255,255,255,0.85)" />
        </svg>
      );

    case "stingray":
      // Stingray — diamond pattée body with leopard spots, long whip
      // tail with barbs, eye + breathing-hole detail.
      return (
        <svg viewBox="0 0 180 120" width="180" height="120" className="art art-stingray">
          <defs>
            <radialGradient id="rayFill" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#7E8E9E" />
              <stop offset="60%" stopColor="#3D4A58" />
              <stop offset="100%" stopColor="#1B2530" />
            </radialGradient>
            <radialGradient id="rayBelly" cx="50%" cy="65%" r="60%">
              <stop offset="0%" stopColor="#D4D8DD" />
              <stop offset="100%" stopColor="#7E8995" />
            </radialGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="90" cy="98" rx="72" ry="5" fill="rgba(0,0,0,0.22)" />
          {/* Body */}
          <path
            d="M 90 18 Q 36 28 14 56 Q 28 70 64 76 Q 90 80 116 76 Q 152 70 166 56 Q 144 28 90 18 Z"
            fill="url(#rayFill)"
          />
          {/* Belly hint */}
          <path
            d="M 40 64 Q 90 78 140 64 Q 90 86 40 64 Z"
            fill="url(#rayBelly)"
            opacity="0.4"
          />
          {/* Spots on top */}
          {[
            { x: 60, y: 38, r: 2.4 },
            { x: 78, y: 32, r: 2 },
            { x: 96, y: 30, r: 2.6 },
            { x: 114, y: 34, r: 2.2 },
            { x: 70, y: 50, r: 2.6 },
            { x: 98, y: 48, r: 3 },
            { x: 122, y: 52, r: 2.4 },
            { x: 86, y: 60, r: 2 },
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#0D1620" opacity="0.7" />
          ))}
          {/* Whip tail */}
          <path
            d="M 90 76 Q 100 90 124 110 Q 130 114 132 116"
            stroke="#1B2530"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            className="ray-tail"
          />
          {/* Tail barb */}
          <path
            d="M 130 112 L 134 116 L 130 118 Z"
            fill="#FFE9B8"
            opacity="0.85"
          />
          {/* Eyes */}
          <circle cx="80" cy="40" r="1.6" fill="#FFE9B8" />
          <circle cx="100" cy="40" r="1.6" fill="#FFE9B8" />
          <circle cx="80" cy="40" r="0.6" fill="#1A1208" />
          <circle cx="100" cy="40" r="0.6" fill="#1A1208" />
          {/* Top-light sheen */}
          <path
            d="M 56 28 Q 90 22 124 28"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );

    case "whaleShark":
      // Whale shark — slate-blue body with classic checkerboard white
      // spots, gill slits, dorsal & pectoral fins, vertical tail flukes.
      return (
        <svg viewBox="0 0 280 130" width="280" height="130" className="art art-whale">
          <defs>
            <linearGradient id="wsharkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A7588" />
              <stop offset="55%" stopColor="#1F4250" />
              <stop offset="100%" stopColor="#0A1E2A" />
            </linearGradient>
            <linearGradient id="wsharkBelly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A8B6BF" />
              <stop offset="100%" stopColor="#5A6E78" />
            </linearGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="140" cy="118" rx="110" ry="6" fill="rgba(0,0,0,0.25)" />
          {/* Belly */}
          <path
            d="M 36 78 Q 80 102 168 100 Q 230 92 254 70 Q 230 86 168 86 Q 80 86 36 78 Z"
            fill="url(#wsharkBelly)"
          />
          {/* Body */}
          <path
            d="M 254 64 Q 232 32 168 28 Q 80 26 36 56 Q 22 64 36 76 Q 80 96 168 92 Q 232 90 254 70 Z"
            fill="url(#wsharkFill)"
          />
          {/* Tail flukes — vertical, large */}
          <path
            d="M 36 56 L 18 28 L 14 50 Q 8 64 14 78 L 18 102 L 36 76 Z"
            fill="#1F4250"
            className="whale-tail"
          />
          {/* Dorsal fin */}
          <path
            d="M 130 28 L 142 12 L 156 28 Z"
            fill="#1F4250"
          />
          {/* Pectoral fin */}
          <path
            d="M 110 86 L 96 102 L 124 92 Z"
            fill="#1F4250"
          />
          {/* Gill slits */}
          {[
            { x: 198, y1: 48, y2: 78 },
            { x: 206, y1: 50, y2: 78 },
            { x: 214, y1: 50, y2: 78 },
            { x: 222, y1: 48, y2: 76 },
            { x: 230, y1: 48, y2: 74 },
          ].map((g, i) => (
            <line
              key={i}
              x1={g.x}
              y1={g.y1}
              x2={g.x + 1}
              y2={g.y2}
              stroke="#0A1E2A"
              strokeWidth="1.4"
              opacity="0.6"
            />
          ))}
          {/* Mouth */}
          <path
            d="M 244 70 Q 252 70 254 68"
            stroke="#0A1E2A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* White spots — checker pattern */}
          {Array.from({ length: 30 }).map((_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            const x = 60 + col * 28 + (row % 2 === 0 ? 0 : 14);
            const y = 38 + row * 12;
            // skip if out of body shape (approx)
            if (x > 240 || y > 90) return null;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={1.6 + ((i * 7) % 3) * 0.4}
                fill="#D6E4EA"
                opacity="0.85"
              />
            );
          })}
          {/* Faint vertical stripes (typical whale shark pattern) */}
          {[110, 140, 170, 200].map((x, i) => (
            <path
              key={i}
              d={`M ${x} 36 L ${x} 86`}
              stroke="rgba(214,228,234,0.18)"
              strokeWidth="1"
              fill="none"
            />
          ))}
          {/* Top sheen */}
          <path
            d="M 70 38 Q 140 30 230 40"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Eye */}
          <circle cx="234" cy="56" r="2.2" fill="#FFE9B8" />
          <circle cx="234.4" cy="55.6" r="0.9" fill="#1A1208" />
        </svg>
      );

    case "lionfish":
      // Lionfish — striped red-cream body, fanned-out pectoral fins
      // with delicate spines, dorsal venomous spines, fluttering tail.
      return (
        <svg viewBox="0 0 140 110" width="140" height="110" className="art art-lionfish">
          <defs>
            <linearGradient id="lionBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2C36A" />
              <stop offset="50%" stopColor="#C8531C" />
              <stop offset="100%" stopColor="#5C1408" />
            </linearGradient>
            <linearGradient id="lionFin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(247,221,160,0.78)" />
              <stop offset="100%" stopColor="rgba(184,82,32,0.5)" />
            </linearGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="70" cy="100" rx="50" ry="4" fill="rgba(0,0,0,0.2)" />
          {/* Pectoral fan — fans out below */}
          <g className="lion-fin lion-fin-bot">
            {Array.from({ length: 9 }).map((_, i) => {
              const a = Math.PI / 2 + (i - 4) * 0.18;
              const x2 = 70 + Math.cos(a) * 46;
              const y2 = 60 + Math.sin(a) * 40;
              return (
                <g key={`b${i}`}>
                  <line
                    x1="70"
                    y1="60"
                    x2={x2}
                    y2={y2}
                    stroke="url(#lionFin)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                  <line
                    x1="70"
                    y1="60"
                    x2={x2}
                    y2={y2}
                    stroke="#3D1808"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.95"
                  />
                </g>
              );
            })}
          </g>
          {/* Dorsal venomous spines fan up */}
          <g className="lion-fin lion-fin-top">
            {Array.from({ length: 11 }).map((_, i) => {
              const a = -Math.PI / 2 + (i - 5) * 0.18;
              const x2 = 70 + Math.cos(a) * 50;
              const y2 = 56 + Math.sin(a) * 50;
              return (
                <g key={`t${i}`}>
                  <line
                    x1="70"
                    y1="56"
                    x2={x2}
                    y2={y2}
                    stroke="url(#lionFin)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                  <line
                    x1="70"
                    y1="56"
                    x2={x2}
                    y2={y2}
                    stroke="#F4D77A"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx={x2} cy={y2} r="1.4" fill="#F4D77A" opacity="0.9" />
                </g>
              );
            })}
          </g>
          {/* Tail fan */}
          <path
            d="M 50 56 Q 30 50 14 50 Q 26 56 14 64 Q 30 60 50 60 Z"
            fill="url(#lionFin)"
            stroke="#3D1808"
            strokeWidth="0.8"
          />
          {/* Body */}
          <ellipse cx="70" cy="58" rx="26" ry="14" fill="url(#lionBody)" />
          {/* Body stripes */}
          {[58, 66, 74, 82].map((x, i) => (
            <path
              key={i}
              d={`M ${x} 46 Q ${x - 2} 58 ${x} 70`}
              stroke="#3D1808"
              strokeWidth="2"
              fill="none"
              opacity="0.85"
            />
          ))}
          {/* Highlight */}
          <ellipse cx="62" cy="52" rx="10" ry="3" fill="rgba(255,255,255,0.32)" />
          {/* Eye */}
          <circle cx="90" cy="54" r="2.4" fill="#FFFFFF" />
          <circle cx="90" cy="54" r="1.2" fill="#1A0E08" />
          <circle cx="90.6" cy="53.5" r="0.5" fill="#FFFFFF" />
          {/* Mouth */}
          <path d="M 95 60 Q 99 62 101 60" stroke="#3D1808" strokeWidth="1.2" fill="none" />
        </svg>
      );

    case "octopus":
      // Octopus — bulbous mantle with iridescent gradient, eight
      // tentacles with sucker dots, expressive eyes with slit pupils.
      return (
        <svg viewBox="0 0 150 130" width="150" height="130" className="art art-octopus">
          <defs>
            <radialGradient id="octBody" cx="40%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFB8A5" />
              <stop offset="50%" stopColor="#D8543A" />
              <stop offset="100%" stopColor="#5C1808" />
            </radialGradient>
            <linearGradient id="octTent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D8543A" />
              <stop offset="100%" stopColor="#5C1808" />
            </linearGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="75" cy="120" rx="62" ry="5" fill="rgba(0,0,0,0.22)" />
          {/* Tentacles — 8, layered curls */}
          {[
            { d: "M 50 78 Q 30 100 18 122", delay: 0 },
            { d: "M 60 84 Q 56 110 66 126", delay: 0.5 },
            { d: "M 75 86 Q 75 112 80 128", delay: 1 },
            { d: "M 90 84 Q 96 110 96 126", delay: 1.5 },
            { d: "M 100 78 Q 122 100 134 122", delay: 2 },
            { d: "M 42 64 Q 18 70 6 82", delay: 0.7 },
            { d: "M 108 64 Q 132 70 144 82", delay: 1.2 },
            { d: "M 76 90 Q 50 124 42 130", delay: 1.6 },
          ].map((tt, i) => (
            <g key={i}>
              <path
                d={tt.d}
                stroke="url(#octTent)"
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
                className={`oct-tent oct-tent-${i % 4}`}
                style={{ animationDelay: `${tt.delay}s` }}
              />
              {/* Sucker dots along the tentacle (sample 4 evenly) */}
              {[0.25, 0.5, 0.75].map((t, j) => {
                // Approximate position from path control points
                const m = tt.d.match(/M\s+(\d+)\s+(\d+)\s+Q\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
                if (!m) return null;
                const [x0, y0, cx, cy, x1, y1] = m
                  .slice(1)
                  .map((v) => parseFloat(v));
                const bx =
                  (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
                const by =
                  (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
                return (
                  <circle
                    key={j}
                    cx={bx}
                    cy={by}
                    r="1.4"
                    fill="#FFE0CE"
                    opacity="0.7"
                  />
                );
              })}
            </g>
          ))}
          {/* Mantle */}
          <ellipse cx="75" cy="58" rx="38" ry="34" fill="url(#octBody)" />
          {/* Mantle highlight */}
          <ellipse cx="64" cy="42" rx="14" ry="8" fill="rgba(255,255,255,0.32)" />
          {/* Mantle texture spots */}
          {[
            { x: 80, y: 60, r: 2 },
            { x: 70, y: 70, r: 1.6 },
            { x: 88, y: 50, r: 1.8 },
            { x: 60, y: 56, r: 1.6 },
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#3F0C04" opacity="0.55" />
          ))}
          {/* Eyes */}
          <ellipse cx="60" cy="50" rx="6" ry="5" fill="#FFFFFF" />
          <ellipse cx="90" cy="50" rx="6" ry="5" fill="#FFFFFF" />
          {/* Slit pupils */}
          <ellipse cx="60" cy="50" rx="3" ry="1.4" fill="#1A0E08" />
          <ellipse cx="90" cy="50" rx="3" ry="1.4" fill="#1A0E08" />
          {/* Eye shine */}
          <circle cx="58" cy="48" r="1" fill="rgba(255,255,255,0.95)" />
          <circle cx="88" cy="48" r="1" fill="rgba(255,255,255,0.95)" />
        </svg>
      );

    case "seagrass":
      // Seagrass meadow — multiple blade clusters, shading, a couple
      // of small fish darting through.
      return (
        <svg viewBox="0 0 240 140" width="240" height="140" className="art art-seagrass">
          <defs>
            <linearGradient id="grassBlade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5FA248" />
              <stop offset="100%" stopColor="#1F4A1A" />
            </linearGradient>
          </defs>
          {/* Soft sandy mound base */}
          <ellipse cx="120" cy="138" rx="116" ry="6" fill="rgba(0,0,0,0.18)" />
          <path
            d="M 0 138 Q 60 124 120 128 Q 180 124 240 138 L 240 142 L 0 142 Z"
            fill="#C7A977"
            opacity="0.5"
          />
          {/* Background blades — thinner */}
          {Array.from({ length: 18 }).map((_, i) => {
            const x = 8 + i * 13;
            const sway = ((i * 7) % 5) - 2;
            const h = 60 + ((i * 3) % 35);
            return (
              <path
                key={`bg-${i}`}
                d={`M ${x} 134 Q ${x + sway * 3} ${134 - h / 2} ${x + sway * 5} ${134 - h}`}
                stroke="url(#grassBlade)"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
                className={`grass grass-${i % 4}`}
              />
            );
          })}
          {/* Foreground blades — thicker */}
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 14 + i * 16;
            const sway = ((i * 5) % 4) - 1;
            const h = 80 + ((i * 11) % 30);
            return (
              <path
                key={`fg-${i}`}
                d={`M ${x} 134 Q ${x + sway * 5} ${134 - h / 2} ${x + sway * 7} ${134 - h}`}
                stroke="url(#grassBlade)"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
                className={`grass grass-${i % 4}`}
              />
            );
          })}
          {/* Tiny fish darting */}
          <g className="grass-fish">
            <ellipse cx="70" cy="60" rx="6" ry="2.4" fill="#F4D77A" />
            <path d="M 64 60 L 60 58 L 60 62 Z" fill="#F4D77A" />
            <circle cx="74" cy="59" r="0.6" fill="#1A1208" />
          </g>
          <g className="grass-fish grass-fish-2">
            <ellipse cx="170" cy="74" rx="6" ry="2.4" fill="#F4B860" />
            <path d="M 164 74 L 160 72 L 160 76 Z" fill="#F4B860" />
            <circle cx="174" cy="73" r="0.6" fill="#1A1208" />
          </g>
        </svg>
      );
  }
}

/* ─────────────────────────────────────────────────────────────────── */
/* DECOR (non-interactive)                                                */

function Decor() {
  // Sand seabed runs along the bottom 200 px of the world. Gives the
  // kid a clear "floor" to dive toward and parks rocks/anemones with
  // a believable home. Built from a wavy SVG path + decorative props.
  return (
    <>
      {/* Seabed — wavy sand silhouette with gradient. */}
      <svg
        className="seabed"
        width={WORLD.w}
        height="260"
        viewBox={`0 0 ${WORLD.w} 260`}
        style={{ position: "absolute", left: 0, top: WORLD.h - 200 }}
        aria-hidden
      >
        <defs>
          <linearGradient id="sandFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D8B98A" />
            <stop offset="40%" stopColor="#A88550" />
            <stop offset="100%" stopColor="#6A4D2A" />
          </linearGradient>
          <linearGradient id="sandShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
          </linearGradient>
        </defs>
        {/* Far hills (parallax-ish) */}
        <path
          d={`M 0 80 Q 120 50 280 70 Q 460 90 640 60 Q 820 40 1020 70 Q 1220 100 1440 60 Q 1660 30 1880 60 Q 2100 90 2400 60 L 2400 260 L 0 260 Z`}
          fill="url(#sandFill)"
          opacity="0.55"
        />
        {/* Near sand mounds */}
        <path
          d={`M 0 130 Q 200 100 420 124 Q 640 148 880 116 Q 1120 84 1360 120 Q 1600 156 1840 122 Q 2080 88 2400 120 L 2400 260 L 0 260 Z`}
          fill="url(#sandFill)"
        />
        {/* Sand shade overlay */}
        <path
          d={`M 0 130 Q 200 100 420 124 Q 640 148 880 116 Q 1120 84 1360 120 Q 1600 156 1840 122 Q 2080 88 2400 120 L 2400 260 L 0 260 Z`}
          fill="url(#sandShade)"
        />
        {/* Sand texture dots — random scatter */}
        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i * 173) % WORLD.w;
          const y = 140 + (i * 31) % 120;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1 + (i % 3) * 0.4}
              fill="#3F2A14"
              opacity="0.3"
            />
          );
        })}
      </svg>

      {/* Distant rocks — simple silhouette, parked on seabed. */}
      {[
        { x: 180, y: WORLD.h - 110, w: 110, h: 60 },
        { x: 980, y: WORLD.h - 100, w: 80, h: 48 },
        { x: 1780, y: WORLD.h - 120, w: 130, h: 70 },
        { x: 2280, y: WORLD.h - 90, w: 90, h: 52 },
      ].map((r, i) => (
        <svg
          key={`rock-${i}`}
          width={r.w}
          height={r.h}
          viewBox={`0 0 ${r.w} ${r.h}`}
          style={{
            position: "absolute",
            left: r.x - r.w / 2,
            top: r.y - r.h / 2,
          }}
        >
          <defs>
            <linearGradient id={`rg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5A4D40" />
              <stop offset="100%" stopColor="#1F1610" />
            </linearGradient>
          </defs>
          <path
            d={`M 4 ${r.h - 4} Q ${r.w * 0.2} ${r.h * 0.4} ${r.w * 0.4} ${r.h * 0.5} Q ${r.w * 0.6} ${r.h * 0.2} ${r.w * 0.8} ${r.h * 0.5} Q ${r.w - 6} ${r.h * 0.6} ${r.w - 4} ${r.h - 4} Z`}
            fill={`url(#rg${i})`}
          />
          {/* Lighter top ridge */}
          <path
            d={`M ${r.w * 0.18} ${r.h * 0.45} Q ${r.w * 0.4} ${r.h * 0.32} ${r.w * 0.62} ${r.h * 0.45}`}
            stroke="rgba(255,232,180,0.18)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ))}

      {/* Anemones — fluffy tentacle clusters on seabed. */}
      {[
        { x: 360, y: WORLD.h - 130, color: "#C84A78" },
        { x: 1300, y: WORLD.h - 130, color: "#E8A33D" },
        { x: 2120, y: WORLD.h - 130, color: "#5FA248" },
      ].map((a, i) => (
        <svg
          key={`anem-${i}`}
          width="80"
          height="90"
          viewBox="0 0 80 90"
          style={{
            position: "absolute",
            left: a.x - 40,
            top: a.y - 60,
          }}
        >
          {Array.from({ length: 14 }).map((_, j) => {
            const ang = -Math.PI / 2 + (j - 6.5) * 0.16;
            const x2 = 40 + Math.cos(ang) * 30;
            const y2 = 70 + Math.sin(ang) * 38;
            return (
              <line
                key={j}
                x1="40"
                y1="70"
                x2={x2}
                y2={y2}
                stroke={a.color}
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.85"
                className={`anem-arm anem-arm-${j % 3}`}
              />
            );
          })}
          {/* Stalk */}
          <ellipse cx="40" cy="78" rx="14" ry="10" fill={a.color} opacity="0.6" />
          <ellipse cx="40" cy="76" rx="6" ry="4" fill="#1F1610" opacity="0.45" />
        </svg>
      ))}

      {/* Coral clusters — colorful branching corals scattered. */}
      {[
        { x: 200, y: WORLD.h - 180, hue: "#E25844", scale: 1 },
        { x: 750, y: WORLD.h - 170, hue: "#F4B860", scale: 0.9 },
        { x: 1500, y: WORLD.h - 220, hue: "#A8467A", scale: 1.1 },
        { x: 2200, y: WORLD.h - 160, hue: "#5FA2B8", scale: 0.95 },
        { x: 1080, y: WORLD.h - 190, hue: "#E25844", scale: 0.8 },
      ].map((c, i) => (
        <svg
          key={`cor-${i}`}
          width="160"
          height="120"
          viewBox="0 0 160 120"
          style={{
            position: "absolute",
            left: c.x - 80,
            top: c.y - 60,
            transform: `scale(${c.scale})`,
          }}
        >
          <defs>
            <linearGradient id={`cor${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.hue} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#3D1A12" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          {/* Branching coral */}
          <path
            d="M 30 110 Q 38 80 36 60 Q 34 44 44 36 Q 50 44 50 58 Q 58 44 70 42 Q 76 52 70 66 Q 80 56 92 60 Q 96 72 86 80 Q 100 76 110 88 Q 108 100 96 108 Z"
            fill={`url(#cor${i})`}
          />
          {/* Polyp dots */}
          {Array.from({ length: 12 }).map((_, j) => {
            const px = 30 + ((j * 13) % 80);
            const py = 50 + ((j * 9) % 50);
            return (
              <circle
                key={j}
                cx={px}
                cy={py}
                r="1.6"
                fill="#FFE9B8"
                opacity="0.6"
              />
            );
          })}
          {/* Side coral fan */}
          <path
            d="M 100 110 Q 120 90 130 70 Q 138 84 134 102 Z"
            fill={c.hue}
            opacity="0.75"
          />
          {/* Tube coral */}
          <path
            d="M 16 110 Q 20 90 24 78 Q 28 90 26 110 Z"
            fill="#5FA2B8"
            opacity="0.8"
          />
          <path
            d="M 6 110 Q 10 100 14 92 Q 16 102 14 110 Z"
            fill="#5FA2B8"
            opacity="0.7"
          />
        </svg>
      ))}

      {/* Fan corals — wavy lace fans. */}
      {[
        { x: 600, y: WORLD.h - 230, color: "#C84A78", scale: 1 },
        { x: 1750, y: WORLD.h - 210, color: "#E25844", scale: 0.9 },
      ].map((f, i) => (
        <svg
          key={`fan-${i}`}
          width="140"
          height="160"
          viewBox="0 0 140 160"
          style={{
            position: "absolute",
            left: f.x - 70,
            top: f.y - 80,
            transform: `scale(${f.scale})`,
          }}
        >
          <path
            d="M 70 150 Q 30 100 20 40 Q 50 60 70 30 Q 90 60 120 40 Q 110 100 70 150 Z"
            fill={f.color}
            opacity="0.85"
          />
          {/* Lattice */}
          {[40, 60, 80, 100].map((y, j) => (
            <path
              key={j}
              d={`M 30 ${y} Q 70 ${y - 14} 110 ${y}`}
              stroke="#3D1A12"
              strokeWidth="0.7"
              fill="none"
              opacity="0.65"
            />
          ))}
          {[40, 60, 80, 100].map((x, j) => (
            <path
              key={`v-${j}`}
              d={`M ${x} 30 L ${x} 140`}
              stroke="#3D1A12"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
          ))}
        </svg>
      ))}

      {/* Starfish lying on sand. */}
      {[
        { x: 540, y: WORLD.h - 60, color: "#E25844" },
        { x: 1460, y: WORLD.h - 50, color: "#F4B860" },
        { x: 2020, y: WORLD.h - 70, color: "#E25844" },
      ].map((s, i) => (
        <svg
          key={`star-${i}`}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          style={{
            position: "absolute",
            left: s.x - 18,
            top: s.y - 18,
          }}
        >
          <path
            d="M 18 2 L 22 14 L 34 14 L 24 22 L 28 34 L 18 26 L 8 34 L 12 22 L 2 14 L 14 14 Z"
            fill={s.color}
            stroke="#3D1A12"
            strokeWidth="0.6"
            opacity="0.9"
          />
          <circle cx="18" cy="18" r="2" fill="#3D1A12" opacity="0.5" />
        </svg>
      ))}

      {/* Drifting jellyfish — moves in lazy bobs. */}
      {[
        { x: 900, y: 220, scale: 1 },
        { x: 1700, y: 600, scale: 1.2 },
      ].map((j, i) => (
        <svg
          key={`jelly-${i}`}
          width="80"
          height="120"
          viewBox="0 0 80 120"
          style={{
            position: "absolute",
            left: j.x - 40,
            top: j.y - 60,
          }}
          className={`jelly jelly-${i}`}
        >
          <defs>
            <radialGradient id={`jellyBell-${i}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="60%" stopColor="rgba(231,178,222,0.6)" />
              <stop offset="100%" stopColor="rgba(178,108,160,0.3)" />
            </radialGradient>
          </defs>
          {/* Bell */}
          <path
            d="M 8 36 Q 8 8 40 8 Q 72 8 72 36 Q 72 50 64 54 Q 56 48 48 54 Q 40 48 32 54 Q 24 48 16 54 Q 8 50 8 36 Z"
            fill={`url(#jellyBell-${i})`}
          />
          {/* Tentacles */}
          {[16, 24, 32, 40, 48, 56, 64].map((tx, k) => (
            <path
              key={k}
              d={`M ${tx} ${52 + ((k * 3) % 5)} Q ${tx + ((k * 7) % 5) - 2} ${80 + (k % 3) * 4} ${tx + ((k * 5) % 7) - 3} ${100 + (k % 4) * 4}`}
              stroke="rgba(231,178,222,0.6)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              className={`jelly-tent jelly-tent-${k % 3}`}
            />
          ))}
        </svg>
      ))}

      {/* Schools of small fish — drift across the world */}
      {[
        { x: 600, y: 500 },
        { x: 1400, y: 1100 },
        { x: 2000, y: 700 },
      ].map((sc, i) => (
        <div
          key={`school-${i}`}
          className={`fish-school school-${i}`}
          style={{ position: "absolute", left: sc.x, top: sc.y }}
        >
          {Array.from({ length: 6 }).map((_, k) => (
            <svg
              key={k}
              width="22"
              height="14"
              viewBox="0 0 22 14"
              style={{
                position: "absolute",
                left: (k % 3) * 22,
                top: Math.floor(k / 3) * 14,
              }}
            >
              <ellipse cx="11" cy="7" rx="8" ry="3" fill="#F4D77A" />
              <path d="M 3 7 L 0 4 L 0 10 Z" fill="#E2A53D" />
              <circle cx="14" cy="6" r="0.8" fill="#1A1208" />
            </svg>
          ))}
        </div>
      ))}

      {/* Bubble columns from seabed cracks. */}
      {[
        { x: 600, y: WORLD.h - 60 },
        { x: 1900, y: WORLD.h - 60 },
        { x: 1300, y: WORLD.h - 60 },
      ].map((b, i) => (
        <div
          key={`bc-${i}`}
          className={`bubble-column bc-${i}`}
          style={{ position: "absolute", left: b.x, top: b.y - 200 }}
        >
          {Array.from({ length: 7 }).map((_, j) => (
            <span
              key={j}
              className="bubble-rise"
              style={{ animationDelay: `${j * 0.55}s` }}
            />
          ))}
        </div>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* BACKDROP                                                              */

function Backdrop() {
  // Layered atmosphere — main gradient, distant haze, god rays from
  // the surface (animated), caustic dapples, and an edge vignette.
  return (
    <>
      <div className="explore-bg" />
      <div className="explore-haze" aria-hidden />

      {/* Volumetric Light Shafts (God Rays) */}
      <svg
        className="explore-godrays"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="godRayA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,240,210,0.5)" />
            <stop offset="60%" stopColor="rgba(125,192,212,0.15)" />
            <stop offset="100%" stopColor="rgba(8,55,74,0)" />
          </linearGradient>
          <linearGradient id="godRayB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(165,226,243,0.3)" />
            <stop offset="100%" stopColor="rgba(8,55,74,0)" />
          </linearGradient>
        </defs>
        {/* Layer 1: Wide, slow ambient rays */}
        {[
          { x: -10, w: 30, skew: 15, h: 90, c: "A" },
          { x: 30, w: 40, skew: -10, h: 100, c: "B" },
          { x: 60, w: 25, skew: 20, h: 85, c: "A" },
          { x: 80, w: 35, skew: -15, h: 95, c: "B" },
        ].map((r, i) => (
          <polygon
            key={`l1-${i}`}
            points={`${r.x},0 ${r.x + r.w},0 ${r.x + r.w + r.skew},${r.h} ${r.x + r.skew},${r.h}`}
            fill={`url(#godRay${r.c})`}
            className={`godray godray-slow-${i}`}
            opacity="0.6"
          />
        ))}
        {/* Layer 2: Sharp, faster piercing rays */}
        {[
          { x: 5, w: 6, skew: 5, h: 70 },
          { x: 25, w: 4, skew: -5, h: 60 },
          { x: 45, w: 8, skew: 12, h: 80 },
          { x: 65, w: 5, skew: -8, h: 75 },
          { x: 85, w: 7, skew: 10, h: 65 },
        ].map((r, i) => (
          <polygon
            key={`l2-${i}`}
            points={`${r.x},0 ${r.x + r.w},0 ${r.x + r.w + r.skew},${r.h} ${r.x + r.skew},${r.h}`}
            fill="url(#godRayA)"
            className={`godray godray-fast-${i}`}
            opacity="0.8"
          />
        ))}
      </svg>

      {/* Surface Caustics using SVG Turbulence */}
      <svg
        className="explore-caustics"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id="causticRipples">
            {/* Creates an animated, organic flowing noise map */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.05"
              numOctaves="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.015 0.05;0.02 0.06;0.015 0.05"
                dur="12s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1.2"
              in="noise"
              result="coloredNoise"
            />
            {/* Blend it softly to create light ripples */}
            <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" />
          </filter>
        </defs>
        <rect width="100" height="60" fill="rgba(255,232,200,0.5)" filter="url(#causticRipples)" />
      </svg>

      {/* Plankton specks — tiny dust-like particles drifting. */}
      <div className="plankton" aria-hidden>
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className={`plankton-bit plankton-bit-${i % 5}`}
            style={{
              left: `${(i * 17 + 3) % 100}%`,
              top: `${(i * 31 + 11) % 100}%`,
              animationDelay: `${(i * 0.7) % 8}s`,
              animationDuration: `${8 + (i % 5) * 4}s`,
              transform: `scale(${0.5 + (i % 3) * 0.4})`,
              opacity: 0.2 + (i % 4) * 0.15,
            }}
          />
        ))}
      </div>
      <div className="explore-vignette" aria-hidden />
    </>
  );
}

function Bubbles() {
  return (
    <div className="explore-bubbles" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => {
        const size = 6 + (i % 4) * 5;
        const left = (i * 13 + 5) % 100;
        return (
          <span
            key={i}
            className={`amb-bubble amb-bubble-${i % 3}`}
            style={{
              left: `${left}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${12 + (i % 5) * 3}s`,
              width: size,
              height: size,
            }}
          >
            {/* Trailing micro-bubble */}
            {(i % 2 === 0) && (
              <span
                style={{
                  position: "absolute",
                  bottom: -size * 1.2,
                  left: size * 0.3,
                  width: size * 0.4,
                  height: size * 0.4,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.6)",
                  boxShadow: "0 0 2px rgba(255,255,255,0.2)",
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* DISCOVERY CARD                                                        */

function DiscoveryCard({
  creature,
  lang,
  onDismiss,
}: {
  creature: Creature;
  lang: "en" | "ar";
  onDismiss: () => void;
}) {
  return (
    <div className="discovery" role="dialog" aria-modal="false">
      <button
        type="button"
        className="discovery-close"
        onClick={onDismiss}
        aria-label="Close"
      >
        ✕
      </button>
      <div className="discovery-icon" aria-hidden>
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="26" fill="rgba(244,184,96,0.18)" stroke="rgba(244,184,96,0.55)" strokeWidth="1.5" />
          <foreignObject x="6" y="6" width="44" height="44">
            <div style={{ width: 44, height: 44, transform: "scale(0.42)", transformOrigin: "0 0" }}>
              <CreatureArt art={creature.art} />
            </div>
          </foreignObject>
        </svg>
      </div>
      <div className="discovery-eyebrow">
        {lang === "en" ? "✦ Discovered" : "✦ اكتُشف"}
      </div>
      <div className="discovery-name">
        {lang === "en" ? creature.nameEn : creature.nameAr}
      </div>
      <div className="discovery-fact">
        {lang === "en" ? creature.factEn : creature.factAr}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* STYLES                                                                */

function Style() {
  return (
    <style>{`
      .explore-root {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background:
          radial-gradient(ellipse 120% 60% at 50% -8%, #2A8AA0 0%, #176278 28%, #0A3A4A 55%, #051E2C 85%, #02101A 100%);
        color: var(--foam);
        font-family: var(--font-tajawal), sans-serif;
        cursor: crosshair;
      }
      .explore-bg {
        position: absolute;
        inset: 0;
        background:
          /* Top sunlit shimmer */
          radial-gradient(ellipse 70% 30% at 50% -5%, rgba(255,232,200,0.45) 0%, rgba(255,232,200,0) 70%),
          /* Deep tropical teal mid-water tint */
          linear-gradient(180deg, rgba(30,160,180,0.15) 0%, rgba(8,55,74,0) 65%),
          /* Floor shading */
          radial-gradient(ellipse 110% 50% at 50% 110%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%);
        pointer-events: none;
      }
      .explore-haze {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 90% 70% at 50% 50%, rgba(8,55,74,0) 0%, rgba(8,55,74,0.45) 75%, rgba(5,30,44,0.7) 100%);
        pointer-events: none;
      }
      .explore-vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 130% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%);
        pointer-events: none;
        z-index: 5;
      }
      .explore-depth-fog {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(8,55,74,0) 0%, rgba(5,22,34,0.55) 65%, rgba(2,14,22,0.85) 100%);
        pointer-events: none;
        transition: opacity 0.6s linear;
        z-index: 4;
      }

      /* God rays from the surface — animated translation + opacity. */
      .explore-godrays {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0.85;
        mix-blend-mode: screen;
        pointer-events: none;
      }
      .godray { transform-origin: 50% 0%; }
      .godray-slow-0 { animation: godraySlow 18s ease-in-out infinite 0s; }
      .godray-slow-1 { animation: godraySlow 22s ease-in-out infinite -4s; }
      .godray-slow-2 { animation: godraySlow 16s ease-in-out infinite -8s; }
      .godray-slow-3 { animation: godraySlow 20s ease-in-out infinite -2s; }
      .godray-fast-0 { animation: godrayFast 10s ease-in-out infinite 0s; }
      .godray-fast-1 { animation: godrayFast 14s ease-in-out infinite -3s; }
      .godray-fast-2 { animation: godrayFast 11s ease-in-out infinite -5s; }
      .godray-fast-3 { animation: godrayFast 15s ease-in-out infinite -7s; }
      .godray-fast-4 { animation: godrayFast 12s ease-in-out infinite -1s; }

      @keyframes godraySlow {
        0%, 100% { transform: skewX(0deg) scaleX(1); opacity: 0.6; }
        50% { transform: skewX(-4deg) scaleX(1.1); opacity: 0.9; }
      }
      @keyframes godrayFast {
        0%, 100% { transform: skewX(0deg) scaleX(1) translateX(0); opacity: 0.8; }
        50% { transform: skewX(6deg) scaleX(1.2) translateX(-2%); opacity: 0.3; }
      }

      .explore-caustics {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 60%;
        opacity: 0.7;
        mix-blend-mode: screen;
        pointer-events: none;
      }
      .caustic { animation: causticPulse 6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
      .caustic-0 { animation-delay: 0s; }
      .caustic-1 { animation-delay: 1.2s; }
      .caustic-2 { animation-delay: 2.4s; }
      .caustic-3 { animation-delay: 3.6s; }
      .caustic-4 { animation-delay: 4.8s; }
      @keyframes causticPulse {
        0%, 100% { opacity: 0.4; transform: translateY(0) scale(1); }
        50% { opacity: 0.95; transform: translateY(-3px) scale(1.1); }
      }

      /* Plankton specks drift slowly across the screen. */
      .plankton { position: absolute; inset: 0; pointer-events: none; }
      .plankton-bit {
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: rgba(214,228,234,0.55);
        box-shadow: 0 0 4px rgba(214,228,234,0.7);
        animation-name: planktonDrift;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
      .plankton-bit-1 { background: rgba(244,215,122,0.5); }
      .plankton-bit-2 { width: 3px; height: 3px; }
      .plankton-bit-3 { width: 1.5px; height: 1.5px; }
      .plankton-bit-4 { background: rgba(244,184,96,0.4); }
      @keyframes planktonDrift {
        0% { transform: translate(0, 0); opacity: 0; }
        15% { opacity: 0.8; }
        85% { opacity: 0.8; }
        100% { transform: translate(40px, -30px); opacity: 0; }
      }

      .explore-world {
        position: absolute;
        inset: 0;
        will-change: transform;
        pointer-events: none;
      }
      .explore-saif {
        position: absolute;
        top: 0;
        left: 0;
        width: 60px;
        height: 88px;
        will-change: transform;
        pointer-events: none;
        z-index: 6;
      }
      .saif-swim .saif-arm-l { transform-origin: 18px 38px; transform-box: view-box; }
      .saif-swim .saif-arm-r { transform-origin: 42px 38px; transform-box: view-box; }
      .saif-swim.moving .saif-arm-l { animation: armStrokeL 0.8s ease-in-out infinite; }
      .saif-swim.moving .saif-arm-r { animation: armStrokeR 0.8s ease-in-out infinite; }
      @keyframes armStrokeL {
        0%, 100% { transform: rotate(-14deg); }
        50% { transform: rotate(10deg); }
      }
      @keyframes armStrokeR {
        0%, 100% { transform: rotate(14deg); }
        50% { transform: rotate(-10deg); }
      }
      .saif-swim .saif-tail { animation: tailWave 2.4s ease-in-out infinite; transform-origin: 22px 64px; transform-box: view-box; }
      .saif-swim .saif-tail-2 { animation-duration: 3.2s; animation-delay: 0.4s; transform-origin: 28px 68px; transform-box: view-box; }
      @keyframes tailWave {
        0%, 100% { transform: skewX(0deg); }
        50% { transform: skewX(10deg); }
      }
      .saif-swim .saif-fin { animation: finFlap 1.4s ease-in-out infinite; transform-origin: 18px 70px; transform-box: view-box; }
      .saif-swim .saif-fin-r { transform-origin: 38px 70px; animation-delay: 0.4s; }
      @keyframes finFlap {
        0%, 100% { transform: skewX(0deg); }
        50% { transform: skewX(-12deg); }
      }

      .creature {
        will-change: transform;
        filter: brightness(0.78) saturate(0.78);
        transition: filter 0.6s ease;
      }
      .creature.found { filter: brightness(1) saturate(1.05) drop-shadow(0 0 18px rgba(244,215,122,0.35)); }
      .creature.focused { filter: brightness(1.05) saturate(1.1) drop-shadow(0 0 28px rgba(244,215,122,0.6)); }
      .creature-pulse {
        position: absolute;
        inset: -22px;
        border-radius: 50%;
        border: 1.6px dashed rgba(244,215,122,0.5);
        animation: creaturePulse 2.4s ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes creaturePulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 0.9; }
      }

      .art { display: block; }
      .art-dugong { animation: gentleSway 6s ease-in-out infinite; }
      .art-turtle { animation: gentleSway 5s ease-in-out infinite; }
      .art-stingray { animation: gentleSway 7s ease-in-out infinite; }
      .art-whale { animation: gentleSway 9s ease-in-out infinite; }
      .art-lionfish { animation: gentleSway 4.5s ease-in-out infinite; }
      .art-octopus { animation: gentleSway 5.5s ease-in-out infinite; }
      @keyframes gentleSway {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-5px) rotate(-1.6deg); }
      }
      .grass { animation: grassWave 5s ease-in-out infinite; transform-origin: bottom; transform-box: fill-box; }
      .grass-1 { animation-delay: 0.4s; }
      .grass-2 { animation-delay: 0.8s; }
      .grass-3 { animation-delay: 1.2s; }
      @keyframes grassWave {
        0%, 100% { transform: skewX(0deg); }
        50% { transform: skewX(8deg); }
      }
      .grass-fish { animation: fishDart 8s linear infinite; }
      .grass-fish-2 { animation-duration: 11s; animation-delay: 2s; }
      @keyframes fishDart {
        0% { transform: translateX(-30px); opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateX(160px); opacity: 0; }
      }
      .oct-tent { animation: tentCurl 3s ease-in-out infinite; transform-origin: 75px 60px; transform-box: fill-box; }
      .oct-tent-1 { animation-delay: 0.5s; }
      .oct-tent-2 { animation-delay: 1s; }
      .oct-tent-3 { animation-delay: 1.5s; }
      @keyframes tentCurl {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(5deg); }
      }
      .ray-tail { animation: rayTailFlick 4s ease-in-out infinite; transform-origin: 90px 76px; transform-box: fill-box; }
      @keyframes rayTailFlick {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-6deg); }
      }
      .whale-tail { animation: whaleTailWave 4s ease-in-out infinite; transform-origin: 36px 66px; transform-box: fill-box; }
      @keyframes whaleTailWave {
        0%, 100% { transform: rotate(-6deg); }
        50% { transform: rotate(6deg); }
      }
      .dugong-flipper { animation: flipperWave 4s ease-in-out infinite; transform-origin: 76px 70px; transform-box: fill-box; }
      .dugong-tail { animation: dugongTail 5s ease-in-out infinite; transform-origin: 28px 60px; transform-box: fill-box; }
      @keyframes flipperWave {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(8deg); }
      }
      @keyframes dugongTail {
        0%, 100% { transform: rotate(-4deg); }
        50% { transform: rotate(4deg); }
      }
      .turtle-flipper { animation: turtleFlipper 3.4s ease-in-out infinite; transform-box: fill-box; }
      .turtle-flipper-fl { transform-origin: 36px 56px; }
      .turtle-flipper-fr { transform-origin: 124px 56px; animation-delay: 0.2s; }
      .turtle-flipper-bl { transform-origin: 50px 88px; animation-delay: 0.4s; }
      .turtle-flipper-br { transform-origin: 110px 88px; animation-delay: 0.6s; }
      @keyframes turtleFlipper {
        0%, 100% { transform: rotate(-8deg); }
        50% { transform: rotate(10deg); }
      }
      .lion-fin { animation: lionFinFlutter 3s ease-in-out infinite; transform-box: fill-box; }
      .lion-fin-bot { transform-origin: 70px 60px; }
      .lion-fin-top { transform-origin: 70px 56px; animation-delay: 0.4s; }
      @keyframes lionFinFlutter {
        0%, 100% { transform: scaleY(1) skewX(0deg); }
        50% { transform: scaleY(1.06) skewX(2deg); }
      }
      .anem-arm { animation: anemSway 4s ease-in-out infinite; transform-origin: 40px 70px; transform-box: fill-box; }
      .anem-arm-1 { animation-delay: 0.3s; }
      .anem-arm-2 { animation-delay: 0.6s; }
      @keyframes anemSway {
        0%, 100% { transform: rotate(0deg) scaleY(1); }
        50% { transform: rotate(3deg) scaleY(0.95); }
      }
      .jelly { animation: jellyDrift 14s ease-in-out infinite; }
      .jelly-1 { animation-delay: 4s; animation-duration: 18s; }
      @keyframes jellyDrift {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-30px, -16px); }
        50% { transform: translate(20px, -32px); }
        75% { transform: translate(36px, -8px); }
      }
      .jelly-tent { animation: jellyTent 3s ease-in-out infinite; transform-box: fill-box; }
      .jelly-tent-1 { animation-delay: 0.4s; }
      .jelly-tent-2 { animation-delay: 0.8s; }
      @keyframes jellyTent {
        0%, 100% { transform: skewX(0deg); }
        50% { transform: skewX(8deg); }
      }
      .oyster-halo { animation: oysterPulse 3s ease-in-out infinite; transform-origin: 55px 46px; transform-box: fill-box; }
      @keyframes oysterPulse {
        0%, 100% { opacity: 0.18; transform: scale(0.9); }
        50% { opacity: 0.4; transform: scale(1.15); }
      }

      .fish-school { animation: schoolDrift 22s ease-in-out infinite; width: 80px; height: 32px; }
      .school-0 { animation-delay: 0s; }
      .school-1 { animation-delay: 5s; animation-duration: 26s; }
      .school-2 { animation-delay: 10s; animation-duration: 30s; }
      @keyframes schoolDrift {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(80px, -20px); }
      }

      .bubble-column { width: 24px; }
      .bubble-rise {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.2) 70%, transparent 100%);
        margin: 0 auto;
        animation: bubbleRise 4.2s linear infinite;
        opacity: 0;
        box-shadow: 0 0 4px rgba(255,255,255,0.4);
      }
      @keyframes bubbleRise {
        0% { transform: translate(-2px, 0); opacity: 0; }
        15% { opacity: 0.85; }
        100% { transform: translate(8px, -210px); opacity: 0; }
      }

      .explore-bubbles {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 3;
      }
      .amb-bubble {
        position: absolute;
        bottom: -20px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.2) 70%, transparent 100%);
        box-shadow: 0 0 6px rgba(255,255,255,0.3);
        animation-name: ambBubble;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
      @keyframes ambBubble {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        15% { opacity: 0.9; }
        85% { opacity: 0.9; }
        100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
      }

      .explore-counter {
        position: absolute;
        top: 18px;
        inset-inline-end: 24px;
        z-index: 50;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px 8px 8px;
        background: linear-gradient(180deg, rgba(8,55,74,0.82), rgba(5,30,44,0.82));
        border: 1px solid rgba(244,184,96,0.5);
        border-radius: 999px;
        backdrop-filter: blur(12px);
        font-family: var(--font-cormorant), serif;
        color: var(--foam);
        box-shadow: 0 6px 18px rgba(0,0,0,0.45);
      }
      .explore-counter-glyph {
        width: 26px;
        height: 26px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(244,184,96,0.22);
        border: 1px solid rgba(244,184,96,0.55);
        border-radius: 50%;
        color: var(--sunset-gold);
        font-size: 14px;
      }
      .explore-counter-text {
        font-size: 12px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        opacity: 0.85;
      }
      .explore-counter-num {
        font-size: 16px;
        color: var(--sunset-gold);
        font-weight: 600;
        margin-inline-start: 4px;
      }

      .explore-hint {
        position: absolute;
        top: 86px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        padding: 10px 18px;
        background: rgba(8,55,74,0.78);
        border: 1px solid rgba(244,184,96,0.45);
        border-radius: 999px;
        font-family: var(--font-cormorant), serif;
        font-size: 13px;
        letter-spacing: 0.06em;
        color: var(--foam);
        backdrop-filter: blur(10px);
        animation: hintFade 0.6s ease both 0.4s, hintBob 4s ease-in-out infinite 1s;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      }
      @keyframes hintFade {
        from { opacity: 0; transform: translate(-50%, -6px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes hintBob {
        0%, 100% { transform: translate(-50%, 0); }
        50% { transform: translate(-50%, -3px); }
      }

      .discovery {
        position: absolute;
        bottom: 36px;
        left: 50%;
        transform: translateX(-50%);
        width: min(460px, calc(100vw - 48px));
        z-index: 60;
        padding: 20px 22px 20px 88px;
        background: linear-gradient(180deg, rgba(8,55,74,0.94), rgba(5,30,44,0.96));
        border: 1px solid rgba(244,184,96,0.6);
        border-radius: 22px;
        color: var(--foam);
        box-shadow:
          0 26px 70px rgba(0,0,0,0.6),
          0 0 32px rgba(244,184,96,0.22),
          inset 0 1px 0 rgba(255,255,255,0.08);
        backdrop-filter: blur(16px);
        animation: discoverPop 0.45s cubic-bezier(0.22, 1, 0.36, 1);
      }
      [dir="rtl"] .discovery { padding: 20px 88px 20px 22px; }
      @keyframes discoverPop {
        0% { opacity: 0; transform: translate(-50%, 16px) scale(0.95); }
        70% { transform: translate(-50%, -2px) scale(1.01); }
        100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
      }
      .discovery-icon {
        position: absolute;
        top: 16px;
        inset-inline-start: 16px;
        width: 56px;
        height: 56px;
      }
      .discovery-close {
        position: absolute;
        top: 8px;
        inset-inline-end: 8px;
        width: 28px;
        height: 28px;
        background: transparent;
        border: 1px solid rgba(240,244,242,0.3);
        border-radius: 50%;
        color: var(--foam);
        cursor: pointer;
        font-size: 12px;
      }
      .discovery-close:hover { background: rgba(240,244,242,0.1); }
      .discovery-eyebrow {
        font-family: var(--font-cormorant), serif;
        font-size: 11px;
        letter-spacing: 0.34em;
        text-transform: uppercase;
        color: var(--sunset-gold);
        opacity: 0.95;
      }
      .discovery-name {
        margin-top: 4px;
        font-family: var(--font-cormorant), serif;
        font-style: italic;
        font-size: 22px;
        color: var(--foam);
        line-height: 1.2;
      }
      .discovery-fact {
        margin-top: 8px;
        font-size: 14px;
        line-height: 1.55;
        color: rgba(240,244,242,0.92);
      }

      .explore-allfound {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        padding: 12px 22px;
        background: linear-gradient(180deg, var(--saffron-soft), var(--sunset-gold));
        color: var(--sea-deep);
        border: 1.5px solid var(--sunset-gold);
        border-radius: 999px;
        font-family: var(--font-cormorant), serif;
        font-style: italic;
        font-size: 14px;
        letter-spacing: 0.12em;
        font-weight: 700;
        box-shadow: 0 14px 36px rgba(244,184,96,0.55);
        animation: allFoundIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .explore-allfound-glyph {
        margin-inline-end: 10px;
        font-size: 16px;
      }
      @keyframes allFoundIn {
        0% { opacity: 0; transform: translate(-50%, -16px); }
        100% { opacity: 1; transform: translate(-50%, 0); }
      }

      .explore-joystick {
        position: absolute;
        bottom: 28px;
        inset-inline-start: 28px;
        z-index: 55;
        opacity: 0.92;
      }

      @media (prefers-reduced-motion: reduce) {
        .saif-swim .saif-arm-l,
        .saif-swim .saif-arm-r,
        .saif-swim .saif-tail,
        .saif-swim .saif-fin,
        .art-dugong, .art-turtle, .art-stingray, .art-whale, .art-lionfish, .art-octopus,
        .grass, .oct-tent, .ray-tail, .whale-tail, .dugong-flipper, .dugong-tail,
        .turtle-flipper, .lion-fin, .anem-arm, .jelly, .jelly-tent, .oyster-halo,
        .fish-school, .grass-fish, .creature-pulse, .bubble-rise, .amb-bubble,
        .caustic, .godray, .plankton-bit, .explore-hint { animation: none !important; }
      }
    `}</style>
  );
}
