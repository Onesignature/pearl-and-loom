"use client";

import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";
import { TentScene } from "@/components/scenes/TentScene";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { HeroTitle } from "@/components/home/HeroTitle";
import { CharacterChoice } from "@/components/home/CharacterChoice";
import { HeirloomFooter } from "@/components/home/HeirloomFooter";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { ProfileSetup } from "@/components/onboarding/ProfileSetup";

const subscribeHydration = (cb: () => void) =>
  useSettings.persist.onFinishHydration(cb);
const getHydrated = () => useSettings.persist.hasHydrated();
const getHydratedServer = () => false;

type Stage = "splash" | "profile" | "home";

export default function HomePage() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrated,
    getHydratedServer,
  );
  const hasChosenLanguage = useSettings((s) => s.hasChosenLanguage);
  const hasProfile = useSettings((s) => s.hasProfile);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-saffron/40" aria-hidden />
      </div>
    );
  }

  const stage: Stage = !hasChosenLanguage
    ? "splash"
    : !hasProfile
      ? "profile"
      : "home";

  return (
    <AnimatePresence mode="wait">
      {stage === "splash" && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LanguageSplash />
        </motion.div>
      )}
      {stage === "profile" && (
        <motion.div
          key="profile"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileSetup />
        </motion.div>
      )}
      {stage === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FamilyTent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LanguageSplash() {
  const { setLang } = useI18n();
  return (
    <TentScene>
      <div className="splash-stage">
        {/* Soft saffron glow blooming behind the favicon — runs forever
            on a slow cycle so the page feels alive even before the
            learner picks a language. */}
        <div className="splash-aura" aria-hidden />

        <div className="splash-brand">
          <div className="splash-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="" width={88} height={88} />
          </div>
          <div className="splash-eyebrow">Abu Dhabi · 1948</div>
          <h1 className="splash-title">The Pearl and the Loom</h1>
          <p className="splash-title-ar" lang="ar" dir="rtl">
            اللؤلؤة والنَّول
          </p>
          <div className="splash-thesis">
            A family story, woven row by row · حكاية عائلة، تُنسَج صفًّا بعد صف
          </div>
        </div>

        <div className="splash-divider" aria-hidden />

        <div className="splash-choose">
          <div className="splash-prompt">Choose your language · اختَر لغتك</div>
          <div className="splash-buttons">
            <button onClick={() => setLang("en")} className="splash-btn splash-btn-1">
              <span className="font-display" style={{ fontSize: 18, letterSpacing: "0.12em" }}>
                English
              </span>
            </button>
            <button
              onClick={() => setLang("ar")}
              className="splash-btn splash-btn-2"
              style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
            >
              <span style={{ fontSize: 22, letterSpacing: 0 }}>العربية</span>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .splash-stage {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(28px, 4vw, 44px);
          padding: 32px 24px;
          text-align: center;
          overflow-y: auto;
        }
        /* Animated aura behind the brand mark — slow saffron pulse. */
        .splash-aura {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(720px, 80vw);
          height: min(720px, 80vw);
          transform: translate(-50%, -65%);
          background: radial-gradient(
            circle,
            rgba(232,163,61,0.30) 0%,
            rgba(181,52,30,0.12) 35%,
            transparent 70%
          );
          filter: blur(70px);
          mix-blend-mode: screen;
          pointer-events: none;
          animation: splashAura 8s ease-in-out infinite;
        }
        @keyframes splashAura {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -65%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -65%) scale(1.08); }
        }

        .splash-brand {
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        /* Brand mark — favicon SVG with a slow rotating brass ring
           around it. The ring is a separate decorative element so the
           favicon stays still and the ring carries the motion. */
        .splash-mark {
          position: relative;
          width: 88px;
          height: 88px;
          margin-bottom: 6px;
          animation: markIn 0.9s var(--ease-loom) both;
        }
        .splash-mark img {
          width: 88px;
          height: 88px;
          display: block;
          filter: drop-shadow(0 4px 14px rgba(0,0,0,0.45)) drop-shadow(0 0 18px rgba(232,163,61,0.45));
          animation: markFloat 4s ease-in-out infinite;
        }
        @keyframes markIn {
          0% { opacity: 0; transform: scale(0.6) rotate(-12deg); }
          60% { transform: scale(1.06) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes markFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        /* Staggered entrance — eyebrow, then title, Arabic title,
           thesis line, divider, prompt, buttons. Each element opacity
           0 → 1 with a small upward slide. */
        .splash-eyebrow,
        .splash-title,
        .splash-title-ar,
        .splash-thesis,
        .splash-divider,
        .splash-choose {
          opacity: 0;
          animation: splashRise 0.7s var(--ease-loom) forwards;
        }
        @keyframes splashRise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .splash-eyebrow { animation-delay: 0.35s; }
        .splash-title { animation-delay: 0.55s; }
        .splash-title-ar { animation-delay: 0.75s; }
        .splash-thesis { animation-delay: 0.95s; }
        .splash-divider { animation-delay: 1.15s; }
        .splash-choose { animation-delay: 1.35s; }

        .splash-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 14px;
          color: var(--saffron);
          letter-spacing: 0.4em;
          text-transform: uppercase;
          opacity: 0.92;
        }
        .splash-title {
          margin: 0;
          font-family: var(--font-cormorant), serif;
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 400;
          color: var(--wool);
          letter-spacing: 0.02em;
          font-style: italic;
          line-height: 1.05;
          text-shadow: 0 2px 24px rgba(232,163,61,0.18);
        }
        .splash-title-ar {
          font-family: var(--font-tajawal), sans-serif;
          font-size: clamp(22px, 3vw, 30px);
          color: var(--wool);
          opacity: 0.88;
          margin: 0;
          letter-spacing: 0.02em;
        }
        .splash-thesis {
          margin-top: 6px;
          font-size: 13px;
          color: rgba(240,228,201,0.6);
          font-style: italic;
          letter-spacing: 0.08em;
          max-width: 90vw;
        }
        .splash-divider {
          width: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(232,163,61,0.65),
            transparent
          );
          animation:
            splashRise 0.7s var(--ease-loom) forwards,
            dividerGrow 0.9s var(--ease-loom) 1.15s forwards;
        }
        @keyframes dividerGrow {
          to { width: 96px; }
        }

        .splash-choose {
          display: flex;
          flex-direction: column;
          gap: 18px;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .splash-prompt {
          font-size: 11px;
          color: var(--wool);
          opacity: 0.65;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        .splash-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .splash-btn {
          background: rgba(245,235,211,0.06);
          color: var(--wool);
          border: 1px solid rgba(244,184,96,0.4);
          border-radius: 999px;
          padding: 14px 36px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s var(--ease-loom);
          position: relative;
          overflow: hidden;
        }
        .splash-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(255,238,210,0.18) 50%,
            transparent 70%
          );
          transition: left 0.7s var(--ease-loom);
          pointer-events: none;
        }
        .splash-btn:hover {
          background: rgba(244,184,96,0.18);
          border-color: var(--saffron);
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(232,163,61,0.3);
        }
        .splash-btn:hover::before { left: 120%; }

        @media (prefers-reduced-motion: reduce) {
          .splash-aura,
          .splash-mark img { animation: none !important; }
          .splash-eyebrow,
          .splash-title,
          .splash-title-ar,
          .splash-thesis,
          .splash-divider,
          .splash-choose { opacity: 1 !important; animation: none !important; }
          .splash-divider { width: 96px; }
        }
      `}</style>
    </TentScene>
  );
}

function FamilyTent() {
  // Layout — header pinned to top, footer pinned to bottom. On tall, wide
  // screens (desktop) the middle uses absolute positioning + a 4-row grid
  // so cards always sit ~40% from the top regardless of zoom. On any
  // smaller surface (phone portrait, phone landscape, tablet, small
  // laptop ≤900px tall) we drop into a flow-based flex column that grows
  // with the page so cards never get stuck behind the heirloom strip.
  // The bottom padding is sized to clear the footer + its tapestry strip.
  return (
    <TentScene>
      <HomeHeader />
      <div
        className="family-tent-stage"
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: "clamp(132px, 16vh, 178px)",
          paddingBottom: "clamp(200px, 24vh, 260px)",
          paddingInline: "clamp(16px, 3vw, 28px)",
          display: "grid",
          gridTemplateRows: "minmax(0, 0.5fr) auto auto minmax(60px, 1fr)",
          rowGap: "clamp(16px, 2.4vw, 28px)",
          justifyItems: "center",
        }}
      >
        <div />
        <HeroTitle />
        <CharacterChoice />
        <div />
      </div>
      <HeirloomFooter />
      <OnboardingTour />
      <style>{`
        /* Switch to flow layout whenever the viewport is too narrow OR
           too short to safely fit the absolute hero. Catches phone
           portrait (≤640w), phone landscape (≤900w short), iPad
           landscape (height ≤900), and any laptop ≤900h. */
        @media (max-width: 640px), (max-height: 900px) {
          .family-tent-stage {
            position: relative !important;
            inset: auto !important;
            min-height: 100dvh;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: clamp(20px, 3vw, 32px);
            padding-top: clamp(96px, 14vh, 140px) !important;
            padding-bottom: clamp(220px, 28vh, 280px) !important;
          }
        }
        /* Phone-only tweak — tighter top padding so the title sits up near
           the header instead of floating in the middle of the screen. */
        @media (max-width: 640px) {
          .family-tent-stage {
            padding-top: 96px !important;
            padding-bottom: 240px !important;
          }
        }
      `}</style>
    </TentScene>
  );
}
