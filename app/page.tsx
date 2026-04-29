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
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "32px 24px",
          textAlign: "center",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <div
            className="font-display"
            style={{
              fontSize: 14,
              color: "var(--saffron)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
            }}
          >
            Abu Dhabi · 1948
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 400,
              color: "var(--wool)",
              letterSpacing: "0.02em",
              fontStyle: "italic",
              lineHeight: 1.05,
              textAlign: "center",
            }}
          >
            The Pearl and the Loom
          </h1>
          <p
            style={{
              fontFamily: "var(--font-tajawal), sans-serif",
              fontSize: 28,
              color: "var(--wool)",
              opacity: 0.85,
              margin: 0,
            }}
            lang="ar"
            dir="rtl"
          >
            اللؤلؤة والنَّول
          </p>
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "rgba(240,228,201,0.55)",
              fontStyle: "italic",
              letterSpacing: "0.08em",
            }}
          >
            A family story, woven row by row · حكاية عائلة، تُنسَج صفًّا بعد صف
          </div>
        </div>

        <div style={{ width: 96, height: 1, background: "rgba(240,228,201,0.25)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--wool)",
              opacity: 0.65,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Choose your language · اختَر لغتك
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <button onClick={() => setLang("en")} className="splash-btn">
              <span className="font-display" style={{ fontSize: 18, letterSpacing: "0.12em" }}>
                English
              </span>
            </button>
            <button
              onClick={() => setLang("ar")}
              className="splash-btn"
              style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
            >
              <span style={{ fontSize: 22, letterSpacing: 0 }}>العربية</span>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .splash-btn {
          background: rgba(245,235,211,0.06);
          color: var(--wool);
          border: 1px solid rgba(244,184,96,0.4);
          padding: 16px 36px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s var(--ease-loom);
        }
        .splash-btn:hover {
          background: rgba(244,184,96,0.18);
          border-color: var(--saffron);
          transform: translateY(-2px);
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
