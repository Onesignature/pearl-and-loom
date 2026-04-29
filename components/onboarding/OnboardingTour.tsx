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
  {
    pos: "top-center",
    arrow: "up",
    eyebrowEn: "Souk al-Lulu",
    eyebrowAr: "سوق اللؤلؤ",
    titleEn: "Spend pearls at the souk",
    titleAr: "أنفق اللؤلؤ في السوق",
    bodyEn:
      "Saif's collected pearls become real currency at Souk al-Lulu — trade them for Sadu skeins, diving gear, and tent heirlooms.",
    bodyAr:
      "لؤلؤ سيف عملةٌ حقيقية في سوق اللؤلؤ — بادله بخيوط السدو وعُدّة الغوص وإرث الخيمة.",
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
  const [step, setStep] = useState(0);

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
    // `finish` recreates every render — including it would rebind the
    // listener constantly. Closure over `finish` is fine since it only
    // calls stable setters and `onClose`.
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
        <div className="onb-title">
          {lang === "en" ? s.titleEn : s.titleAr}
        </div>
        <div className="onb-body">
          {lang === "en" ? s.bodyEn : s.bodyAr}
        </div>
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
          width: min(380px, calc(100vw - 32px));
          padding: 22px 22px 18px;
          background: linear-gradient(180deg, #1A1208 0%, #0A0807 100%);
          border: 1px solid var(--saffron);
          color: var(--wool);
          box-shadow:
            0 24px 60px rgba(0,0,0,0.6),
            inset 0 0 30px rgba(232,163,61,0.12);
          font-family: var(--font-tajawal), sans-serif;
          animation: onbRise 0.35s var(--ease-loom);
        }
        @keyframes onbRise {
          from { opacity: 0; transform: translateY(8px); }
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

        /* On phone, all cards bottom-stack so they don't overlap stacked content. */
        @media (max-width: 640px) {
          .onb-card,
          .onb-top-start, .onb-top-end, .onb-top-center, .onb-bottom-center {
            top: auto !important;
            bottom: clamp(20px, 4vh, 40px) !important;
            left: 50% !important;
            inset-inline-start: auto !important;
            inset-inline-end:   auto !important;
            transform: translateX(-50%);
            animation-name: onbRiseCenter;
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
          font-size: 11px;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.85;
        }
        .onb-step {
          font-size: 11px;
          letter-spacing: 0.18em;
          color: rgba(232,163,61,0.65);
        }
        .onb-title {
          margin-top: 6px;
          font-family: var(--font-cormorant), serif;
          font-size: clamp(20px, 2.4vw, 24px);
          color: var(--wool);
          letter-spacing: 0.04em;
          line-height: 1.2;
        }
        .onb-body {
          margin-top: 10px;
          font-size: 13px;
          color: rgba(240,228,201,0.78);
          line-height: 1.55;
        }
        .onb-controls {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px dashed rgba(232,163,61,0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .onb-controls-end {
          display: flex;
          gap: 8px;
        }
        .onb-skip {
          background: transparent;
          border: none;
          color: rgba(240,228,201,0.55);
          font-family: var(--font-tajawal), sans-serif;
          font-size: 12px;
          letter-spacing: 0.16em;
          cursor: pointer;
          padding: 6px 4px;
        }
        .onb-skip:hover { color: var(--wool); }
        .onb-back {
          padding: 8px 14px;
          background: transparent;
          border: 1px solid rgba(240,228,201,0.3);
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .onb-back:hover { background: rgba(245,235,211,0.08); }
        .onb-next {
          padding: 9px 18px;
          background: var(--saffron);
          border: 1px solid var(--saffron);
          color: var(--charcoal);
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 600;
        }
        .onb-next:hover { background: var(--saffron-soft); }
      `}</style>
    </div>
  );
}
