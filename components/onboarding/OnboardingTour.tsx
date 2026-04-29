"use client";

// First-visit guided tour — 4 saffron-bordered coach-marks that orient a
// new judge to the family-heirloom narrative in ~25 seconds. Mounted on
// the home page; opt-out persisted to the settings store. Re-triggerable
// from "How it works" → Replay tour.

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";
import { playCue } from "@/lib/audio/cues";

interface Step {
  /** Where the callout sits on screen. */
  pos: "top-start" | "top-end" | "bottom-center" | "top-center";
  /** Direction the saffron arrow points from the callout toward its referent. */
  arrow: "down" | "up" | "start" | "end";
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  /** Eyebrow caption ("Step 1 of 4" etc. is added automatically). */
  eyebrowEn: string;
  eyebrowAr: string;
}

const STEPS: Step[] = [
  {
    pos: "top-start",
    arrow: "end",
    eyebrowEn: "Layla",
    eyebrowAr: "ليلى",
    titleEn: "Solve math, weave a row",
    titleAr: "حلّ المسائل، انسج صفًّا",
    bodyEn:
      "Layla works the Sadu loom inside the family tent. Each Grade 4 math lesson she finishes weaves a real row of your tapestry.",
    bodyAr:
      "ليلى تعمل على نَول السدو. كل درس رياضيات للصف الرابع تُنهيه يضيف صفًّا حقيقيًا إلى نسيجك.",
  },
  {
    pos: "top-end",
    arrow: "start",
    eyebrowEn: "Saif",
    eyebrowAr: "سيف",
    titleEn: "Answer science, earn a pearl",
    titleAr: "أجب وعِش، اربح لؤلؤة",
    bodyEn:
      "Saif dives the pearling banks. Each Grade 8 science problem he solves earns a pearl — common, fine, or royal — graded by depth and accuracy.",
    bodyAr:
      "سيف يغوص في مغاصات اللؤلؤ. كل سؤال علوم للصف الثامن يحلّه يربح لؤلؤة — عاديّة أو نفيسة أو ملكية.",
  },
  {
    pos: "bottom-center",
    arrow: "down",
    eyebrowEn: "The heirloom",
    eyebrowAr: "الإرث",
    titleEn: "Pearls become beads in Layla's tapestry",
    titleAr: "اللؤلؤ يصير خرزًا في نسيج ليلى",
    bodyEn:
      "The strip at the bottom of the tent shows the heirloom growing — Layla's rows + Saif's pearls braided together as one cloth.",
    bodyAr:
      "الشريط في أسفل الخيمة يُظهر نموّ الإرث — صفوف ليلى ولؤلؤ سيف مضفورة كقماش واحد.",
  },
];

interface Props {
  /** When true, force the tour open even if the user has already onboarded. */
  forceOpen?: boolean;
  /** Called when the tour finishes or is skipped. */
  onClose?: () => void;
}

export function OnboardingTour({ forceOpen = false, onClose }: Props) {
  const { lang, fmt } = useI18n();
  const hasOnboarded = useSettings((s) => s.hasOnboarded);
  const acknowledgeOnboarding = useSettings((s) => s.acknowledgeOnboarding);
  const learnerName = useSettings((s) => s.learnerName);
  const learnerGrade = useSettings((s) => s.learnerGrade);
  const [step, setStep] = useState(0);
  const firstName = learnerName.trim().split(/\s+/)[0];

  const open = forceOpen || !hasOnboarded;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // `finish` rebinds every render; including it would re-attach Esc on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function finish() {
    acknowledgeOnboarding();
    setStep(0);
    onClose?.();
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      playCue("ui.tap");
    } else {
      playCue("loom.shimmer");
      finish();
    }
  }

  function back() {
    if (step > 0) {
      setStep((s) => s - 1);
      playCue("ui.tap");
    }
  }

  if (!open) return null;
  const s = STEPS[step];
  // Personalize step 1: greet by first name and reference the learner's
  // grade band so the tour reads as written for *this* kid, not generic.
  let title = lang === "en" ? s.titleEn : s.titleAr;
  let body = lang === "en" ? s.bodyEn : s.bodyAr;
  if (step === 0 && firstName) {
    title =
      lang === "en"
        ? `${firstName}, solve math — weave a row`
        : `${firstName}، حلّ المسائل — انسج صفًّا`;
    if (learnerGrade !== null && learnerGrade <= 5) {
      body =
        lang === "en"
          ? `Layla weaves with you. Each lesson she finishes adds a real row to your tapestry. Grade ${learnerGrade} math — perfect for you.`
          : `ليلى تنسج معك. كل درس تُنهيه يضيف صفًّا حقيقيًا إلى نسيجك. رياضيات الصف ${fmt(learnerGrade)} — مناسبة لك تمامًا.`;
    }
  }
  if (step === 1 && firstName && learnerGrade !== null && learnerGrade >= 7) {
    body =
      lang === "en"
        ? `Saif dives the pearling banks. Each Grade 8 science problem he solves earns a pearl. ${firstName}, this is your level.`
        : `سيف يغوص في مغاصات اللؤلؤ. كل سؤال علوم للصف الثامن يربح لؤلؤة. ${firstName}، هذه فئتك.`;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === "en" ? "Welcome tour" : "جولة تعريفية"}
      className="onb-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) finish();
      }}
    >
      <div className={`onb-card onb-${s.pos}`} onClick={(e) => e.stopPropagation()}>
        <div className="onb-arrow" data-dir={s.arrow} aria-hidden />
        <div className="onb-eyebrow">
          {lang === "en" ? s.eyebrowEn : s.eyebrowAr}
          <span className="onb-step">
            {fmt(step + 1)} / {fmt(STEPS.length)}
          </span>
        </div>
        <div className="onb-title">{title}</div>
        <div className="onb-body">{body}</div>
        <div className="onb-controls">
          <button onClick={finish} className="onb-skip">
            {lang === "en" ? "Skip tour" : "تخطّي الجولة"}
          </button>
          <div className="onb-controls-end">
            {step > 0 && (
              <button onClick={back} className="onb-back">
                {lang === "en" ? "Back" : "السابق"}
              </button>
            )}
            <button onClick={next} className="onb-next">
              {step < STEPS.length - 1
                ? lang === "en" ? "Next" : "التالي"
                : lang === "en" ? "Begin" : "ابدأ"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .onb-overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgba(8, 5, 3, 0.55);
          backdrop-filter: blur(2px);
          display: block;
          animation: onbFade 0.3s var(--ease-loom);
        }
        @keyframes onbFade { from { opacity: 0; } to { opacity: 1; } }

        .onb-card {
          position: absolute;
          width: min(420px, calc(100vw - 32px));
          padding: 28px 28px 24px;
          background: linear-gradient(145deg, rgba(30, 20, 10, 0.75) 0%, rgba(10, 6, 4, 0.9) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(232, 163, 61, 0.35);
          border-top: 1px solid rgba(232, 163, 61, 0.55);
          border-radius: 28px;
          color: var(--wool);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 0 40px rgba(232,163,61,0.1);
          font-family: var(--font-tajawal), sans-serif;
          animation: onbRise 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes onbRise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Position helpers — coarse quadrants. Saffron arrow gives the visual link. */
        .onb-top-start    { top: clamp(96px, 14vh, 160px); inset-inline-start: clamp(20px, 4vw, 60px); }
        .onb-top-end      { top: clamp(96px, 14vh, 160px); inset-inline-end:   clamp(20px, 4vw, 60px); }
        .onb-bottom-center{ bottom: clamp(160px, 22vh, 220px); left: 50%; transform: translateX(-50%); }
        .onb-top-center   { top: clamp(96px, 14vh, 160px); left: 50%; transform: translateX(-50%); }
        @keyframes onbRiseCenter {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        .onb-bottom-center, .onb-top-center { animation-name: onbRiseCenter; }

        /* On phone, switch the overlay itself to flex-center and let the
           card sit naturally in the middle. Drops all absolute positioning
           so the card never sits off-screen, never overflows, and never
           competes with the actual page chrome. Card grows up to viewport
           height; if content is taller it scrolls internally. */
        @media (max-width: 640px) {
          .onb-overlay {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
          }
          .onb-card,
          .onb-top-start, .onb-top-end, .onb-top-center, .onb-bottom-center {
            position: relative !important;
            top: auto !important;
            bottom: auto !important;
            left: auto !important;
            inset-inline-start: auto !important;
            inset-inline-end:   auto !important;
            transform: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 420px !important;
            max-height: calc(100dvh - 40px) !important;
            overflow-y: auto !important;
            animation-name: onbRise !important;
          }
        }

        .onb-arrow {
          position: absolute;
          width: 0;
          height: 0;
          border: 8px solid transparent;
        }
        .onb-arrow[data-dir="up"]    { top: -16px;    left: 50%; transform: translateX(-50%); border-bottom-color: var(--saffron); }
        .onb-arrow[data-dir="down"]  { bottom: -16px; left: 50%; transform: translateX(-50%); border-top-color:    var(--saffron); }
        .onb-arrow[data-dir="start"] { top: 50%; inset-inline-start: -16px; transform: translateY(-50%); border-inline-end-color: var(--saffron); }
        .onb-arrow[data-dir="end"]   { top: 50%; inset-inline-end:   -16px; transform: translateY(-50%); border-inline-start-color: var(--saffron); }
        @media (max-width: 640px) { .onb-arrow { display: none; } }

        .onb-eyebrow {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.95;
        }
        .onb-step {
          font-size: 11px;
          letter-spacing: 0.18em;
          color: rgba(232,163,61,0.65);
        }
        .onb-title {
          margin-top: 8px;
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(24px, 2.8vw, 28px);
          color: var(--wool);
          letter-spacing: 0.02em;
          line-height: 1.15;
        }
        .onb-body {
          margin-top: 12px;
          font-size: 14px;
          color: rgba(240,228,201,0.85);
          line-height: 1.6;
        }
        .onb-controls {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid rgba(232, 163, 61, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .onb-controls-end {
          display: flex;
          gap: 10px;
        }
        .onb-skip {
          background: transparent;
          border: none;
          color: rgba(240,228,201,0.6);
          font-family: var(--font-tajawal), sans-serif;
          font-size: 13px;
          letter-spacing: 0.16em;
          cursor: pointer;
          padding: 6px 4px;
          transition: color 0.2s;
        }
        .onb-skip:hover { color: var(--saffron); }
        .onb-back {
          padding: 10px 18px;
          background: rgba(245,235,211,0.04);
          border: 1px solid rgba(240,228,201,0.25);
          border-radius: 999px;
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .onb-back:hover { background: rgba(245,235,211,0.12); border-color: rgba(240,228,201,0.4); }
        .onb-next {
          padding: 10px 22px;
          background: linear-gradient(180deg, #F0BD6A 0%, #E8A33D 100%);
          border: 1px solid #F0BD6A;
          border-radius: 999px;
          color: #1A1208;
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(232,163,61,0.25);
          transition: all 0.2s;
        }
        .onb-next:hover {
          background: linear-gradient(180deg, #F4C783 0%, #F0BD6A 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(232,163,61,0.35);
        }
      `}</style>
    </div>
  );
}
