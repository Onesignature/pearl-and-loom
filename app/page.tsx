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
import { StreakChain } from "@/components/home/StreakChain";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";

const subscribeHydration = (cb: () => void) =>
  useSettings.persist.onFinishHydration(cb);
const getHydrated = () => useSettings.persist.hasHydrated();
const getHydratedServer = () => false;

export default function HomePage() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrated,
    getHydratedServer,
  );
  const hasChosenLanguage = useSettings((s) => s.hasChosenLanguage);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-saffron/40" aria-hidden />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {hasChosenLanguage ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FamilyTent />
        </motion.div>
      ) : (
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
  // Layout: header pinned to top, footer pinned to bottom; the middle is a
  // CSS grid with three rows (top spacer, content, bottom spacer) that scale
  // proportionally — cards always sit roughly 40% from the top regardless of
  // viewport height or zoom level. Desktop + iPad keep the original
  // viewport-pinned absolute layout. Mobile (≤640px) drops out of absolute
  // into normal flow so the page can grow past the viewport and scroll.
  return (
    <TentScene>
      <HomeHeader />
      <div
        className="streak-slot"
        style={{
          position: "absolute",
          top: "clamp(118px, 14vh, 158px)",
          insetInlineStart: 0,
          insetInlineEnd: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 30,
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <StreakChain />
        </div>
      </div>
      <div
        className="family-tent-stage"
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: "clamp(132px, 16vh, 178px)",
          paddingBottom: "clamp(180px, 22vh, 240px)",
          paddingInline: "clamp(16px, 3vw, 28px)",
          display: "grid",
          gridTemplateRows: "minmax(0, 0.5fr) auto auto minmax(60px, 1fr)",
          rowGap: "clamp(16px, 2.4vw, 28px)",
          justifyItems: "center",
        }}
      >
        {/* Row 1 — flexible top spacer */}
        <div />
        {/* Row 2 — title block */}
        <HeroTitle />
        {/* Row 3 — character choice */}
        <CharacterChoice />
        {/* Row 4 — flexible bottom spacer (twice as tall as top, so content sits ~40% from top) */}
        <div />
      </div>
      <HeirloomFooter />
      <OnboardingTour />
      <style>{`
        @media (max-width: 640px) {
          .family-tent-stage {
            position: relative !important;
            inset: auto !important;
            min-height: 100dvh;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            padding-top: 96px !important;
            padding-bottom: 220px !important;
          }
          .streak-slot { display: none !important; }
        }
      `}</style>
    </TentScene>
  );
}
