"use client";

// Branded header used only on the Home / Family Tent screen. Heavier and more
// ceremonial than TopChrome: ornament rule + brand mark + locale chips +
// "Walkthrough" video dialog + "How it works" tutorial dialog.

import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { TutorialDialog } from "@/components/home/TutorialDialog";
import { WalkthroughDialog } from "@/components/home/WalkthroughDialog";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAudioToggle } from "@/components/ui/useAudioToggle";

export function HomeHeader() {
  const { lang, setLang, numeralMode, setNumeralMode } = useI18n();
  const { audioEnabled, toggle: toggleAudio } = useAudioToggle();
  const useArabicDigits =
    numeralMode === "arabic-indic" ||
    (numeralMode === "auto" && lang === "ar");
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  return (
    <div
      className="home-header"
      style={{
        position: "absolute",
        top: 0,
        insetInlineStart: 0,
        insetInlineEnd: 0,
        zIndex: 50,
        padding: "26px clamp(28px, 4vw, 56px) 20px",
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.22) 70%, transparent 100%)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "auto",
        }}
      >
        {/* Brand mark — favicon + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* SVG favicon — Next/Image adds no value for a 44px static SVG */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.svg"
            alt=""
            width={44}
            height={44}
            style={{ flex: "0 0 auto", display: "block" }}
          />
          <div
            className="home-wordmark"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 20,
              color: "var(--wool)",
              letterSpacing: "0.06em",
              fontStyle: "italic",
              lineHeight: 1,
            }}
          >
            {lang === "en" ? "The Pearl & The Loom" : "اللؤلؤة والنول"}
          </div>
        </div>

        {/* Era caption — center, between brand mark and locale chips.
            Hidden on tablet/mobile portrait so the chip row stays on one line. */}
        <div
          className="home-era"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 13,
            color: "var(--saffron)",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            opacity: 0.78,
            whiteSpace: "nowrap",
          }}
        >
          {lang === "en" ? "Abu Dhabi · 1948" : "أبو ظبي · ١٩٤٨"}
        </div>

        {/* Mobile-only hamburger — CSS shows only at ≤640px */}
        <div className="home-mobile-only" style={{ pointerEvents: "auto" }}>
          <MobileNav
            onOpenWalkthrough={() => setWalkthroughOpen(true)}
            onOpenTutorial={() => setTutorialOpen(true)}
          />
        </div>

        {/* Locale chips on the right — hidden at ≤640px in favour of hamburger */}
        <div className="home-chip-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            onClick={() => setWalkthroughOpen(true)}
            className="home-chip home-chip--accent"
            title="Watch the walkthrough"
          >
            <span style={{ marginInlineEnd: 8 }}>▶</span>
            <span>{lang === "en" ? "Walkthrough" : "العرض التوضيحي"}</span>
          </button>
          <button
            onClick={() => setTutorialOpen(true)}
            className="home-chip"
            title="How it works"
          >
            <span>{lang === "en" ? "How it works" : "كيف يعمل"}</span>
          </button>
          <a
            href="/souk"
            className="home-chip home-chip--accent"
            title="Souk al-Lulu"
            style={{ textDecoration: "none" }}
          >
            <span>{lang === "en" ? "Souk" : "السوق"}</span>
          </a>
          <button
            onClick={toggleAudio}
            className="home-chip"
            title={audioEnabled ? "Mute audio" : "Enable audio"}
            aria-pressed={audioEnabled}
          >
            <span aria-hidden>{audioEnabled ? "🔊" : "🔇"}</span>
          </button>
          <button
            onClick={() =>
              setNumeralMode(useArabicDigits ? "western" : "arabic-indic")
            }
            className="home-chip"
            title="Numeral system"
          >
            <span
              style={{
                fontFamily: useArabicDigits
                  ? "var(--font-tajawal), sans-serif"
                  : undefined,
              }}
            >
              {useArabicDigits ? "١٢٣" : "123"}
            </span>
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="home-chip"
            title="Language"
          >
            <span
              style={{
                fontFamily:
                  lang === "en"
                    ? "var(--font-cormorant), serif"
                    : "var(--font-tajawal), sans-serif",
              }}
            >
              {lang === "en" ? "العربية" : "English"}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .home-era { display: none !important; }
          .home-wordmark { font-size: 17px !important; }
        }
        .home-mobile-only { display: none; }
        @media (max-width: 640px) {
          .home-chip-row { display: none !important; }
          .home-mobile-only { display: inline-flex; }
          .home-wordmark { font-size: 14px !important; }
        }
        .home-chip {
          padding: 10px 18px;
          background: rgba(28,18,12,0.6);
          border: 1px solid rgba(232,163,61,0.4);
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          letter-spacing: 0.22em;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          min-height: 38px;
        }
        .home-chip:hover {
          background: rgba(232,163,61,0.2);
          border-color: rgba(232,163,61,0.75);
          transform: translateY(-1px);
        }
        .home-chip--accent {
          background: var(--saffron);
          color: var(--charcoal);
          border-color: var(--saffron);
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(232,163,61,0.3);
        }
        .home-chip--accent:hover {
          background: var(--saffron-soft);
          border-color: var(--saffron-soft);
        }
      `}</style>

      <TutorialDialog
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        onOpenWalkthrough={() => {
          setTutorialOpen(false);
          setWalkthroughOpen(true);
        }}
      />
      {walkthroughOpen && (
        <WalkthroughDialog onClose={() => setWalkthroughOpen(false)} />
      )}
    </div>
  );
}
