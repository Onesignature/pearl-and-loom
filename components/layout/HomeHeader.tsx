"use client";

// Branded header used only on the Home / Family Tent screen. Heavier and more
// ceremonial than TopChrome: ornament rule + brand mark + a quiet chip row.
//
// The chip row was decluttered from 7 standalone surfaces (Walkthrough,
// How-it-works, Souk, Audio, Numerals, Language, hamburger) down to 4
// (Profile, Hikma, Souk, Help, Settings). Audio + Numerals + Language
// fold into one Settings popover; Walkthrough + How-it-works fold into
// one Help popover. Net: one cohesive identity strip, less visual
// competition with the Family Tent scene.

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { TutorialDialog } from "@/components/home/TutorialDialog";
import { WalkthroughDialog } from "@/components/home/WalkthroughDialog";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProfileChip } from "@/components/home/ProfileChip";
import { HikmaCounter } from "@/components/home/HikmaCounter";
import { SettingsPopover } from "@/components/home/SettingsPopover";
import { HelpPopover } from "@/components/home/HelpPopover";

export function HomeHeader() {
  const { lang } = useI18n();
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
        padding: "24px clamp(28px, 4vw, 56px) 18px",
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 72%, transparent 100%)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          pointerEvents: "auto",
        }}
      >
        {/* Brand mark — favicon + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: "0 0 auto" }}>
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

        {/* Mobile-only hamburger — CSS shows only at ≤640px */}
        <div className="home-mobile-only" style={{ pointerEvents: "auto" }}>
          <MobileNav
            onOpenWalkthrough={() => setWalkthroughOpen(true)}
            onOpenTutorial={() => setTutorialOpen(true)}
          />
        </div>

        {/* Desktop chip row — 4 surfaces: Profile · Hikma · Souk · Help · Settings */}
        <div className="home-chip-row" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <ProfileChip />
          <HikmaCounter />
          <Link
            href="/leaderboard"
            className="hp-chip"
            title={lang === "en" ? "Leaderboard" : "لوحة الصدارة"}
          >
            <span aria-hidden style={{ marginInlineEnd: 6 }}>🏆</span>
            <span>{lang === "en" ? "Leaderboard" : "الصدارة"}</span>
          </Link>
          <Link
            href="/forge"
            className="hp-chip hp-chip--forge"
            title={lang === "en" ? "The Forge — pattern engine playground" : "المسبك — محرّك الزخارف الحيّ"}
          >
            <span aria-hidden style={{ marginInlineEnd: 6 }}>✦</span>
            <span>{lang === "en" ? "Forge" : "المسبك"}</span>
          </Link>
          <HelpPopover
            onOpenWalkthrough={() => setWalkthroughOpen(true)}
            onOpenTutorial={() => setTutorialOpen(true)}
          />
          <SettingsPopover />
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .home-wordmark { font-size: 17px !important; }
        }
        .home-mobile-only { display: none; }
        @media (max-width: 640px) {
          .home-chip-row { display: none !important; }
          .home-mobile-only { display: inline-flex; }
          .home-wordmark { font-size: 14px !important; }
        }

        /* Shared chip + popover styles for the home header. ProfileChip
           uses its own classes; everything else (Souk link, Help, Settings)
           uses .hp-chip + .hp-pop here. */
        .hp-chip {
          padding: 10px 18px;
          background:
            linear-gradient(180deg, rgba(48,30,18,0.78) 0%, rgba(20,12,8,0.78) 100%);
          border: 1px solid rgba(232,163,61,0.42);
          border-radius: 999px;
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          letter-spacing: 0.22em;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: background 0.22s var(--ease-loom), border-color 0.22s var(--ease-loom), box-shadow 0.22s var(--ease-loom), transform 0.22s var(--ease-loom);
          box-shadow:
            inset 0 1px 0 rgba(245,235,211,0.06),
            0 2px 8px rgba(0,0,0,0.18);
          line-height: 1;
          display: inline-flex;
          align-items: center;
          min-height: 40px;
          text-decoration: none;
        }
        .hp-chip--icon {
          padding: 10px 14px;
          min-width: 44px;
          justify-content: center;
          border-radius: 999px;
        }
        .hp-chip:hover {
          background:
            linear-gradient(180deg, rgba(232,163,61,0.30) 0%, rgba(232,163,61,0.10) 100%);
          border-color: rgba(232,163,61,0.85);
          box-shadow:
            inset 0 1px 0 rgba(245,235,211,0.10),
            0 6px 18px rgba(232,163,61,0.22);
          transform: translateY(-1px);
        }
        .hp-chip--accent {
          background:
            linear-gradient(180deg, var(--saffron-soft) 0%, var(--saffron) 100%);
          color: var(--charcoal);
          border-color: var(--saffron);
          font-weight: 600;
          box-shadow:
            inset 0 1px 0 rgba(255,238,210,0.55),
            0 4px 14px rgba(232,163,61,0.36);
        }
        .hp-chip--accent:hover {
          background:
            linear-gradient(180deg, #F4C783 0%, var(--saffron-soft) 100%);
          border-color: var(--saffron-soft);
          box-shadow:
            inset 0 1px 0 rgba(255,238,210,0.65),
            0 8px 24px rgba(232,163,61,0.45);
        }
        /* The Forge chip is the home header's "look at this thing" — it
           points at the live pattern engine, the technical centerpiece
           of the project. Saffron-tinted background + a slow ambient
           pulse so judges scanning the chip row notice it without it
           reading as a primary CTA. Pulse stops on hover and respects
           prefers-reduced-motion. */
        .hp-chip--forge {
          background:
            linear-gradient(180deg, rgba(232,163,61,0.32) 0%, rgba(181,120,40,0.22) 100%);
          border-color: rgba(244,200,90,0.85);
          color: var(--saffron-soft);
          box-shadow:
            inset 0 1px 0 rgba(255,238,210,0.18),
            0 4px 14px rgba(232,163,61,0.22),
            0 0 0 0 rgba(244,200,90,0.55);
          animation: forgeChipPulse 3.4s ease-in-out infinite;
        }
        .hp-chip--forge:hover {
          background:
            linear-gradient(180deg, rgba(244,200,90,0.45) 0%, rgba(232,163,61,0.32) 100%);
          border-color: var(--saffron);
          box-shadow:
            inset 0 1px 0 rgba(255,238,210,0.28),
            0 8px 22px rgba(232,163,61,0.4);
          animation: none;
        }
        @keyframes forgeChipPulse {
          0%, 100% {
            box-shadow:
              inset 0 1px 0 rgba(255,238,210,0.18),
              0 4px 14px rgba(232,163,61,0.22),
              0 0 0 0 rgba(244,200,90,0);
          }
          50% {
            box-shadow:
              inset 0 1px 0 rgba(255,238,210,0.22),
              0 6px 18px rgba(232,163,61,0.32),
              0 0 0 6px rgba(244,200,90,0.18);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hp-chip--forge { animation: none; }
        }

        .hp-pop {
          position: absolute;
          top: calc(100% + 8px);
          inset-inline-end: 0;
          width: min(280px, 80vw);
          padding: 14px;
          background: linear-gradient(180deg, #1A1208 0%, #0A0807 100%);
          border: 1px solid var(--saffron);
          border-radius: 18px;
          color: var(--wool);
          z-index: 90;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
          font-family: var(--font-tajawal), sans-serif;
          animation: hpRise 0.22s var(--ease-loom);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        @keyframes hpRise {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hp-pop-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.85;
          margin-bottom: 4px;
        }
        .hp-pop-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 6px 0;
        }
        .hp-pop-label {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,228,201,0.68);
        }
        .hp-pop-toggle {
          padding: 8px 14px;
          background: rgba(245,235,211,0.06);
          border: 1px solid rgba(232,163,61,0.4);
          border-radius: 999px;
          color: var(--wool);
          font-size: 14px;
          line-height: 1;
          cursor: pointer;
          transition: all 0.22s var(--ease-loom);
        }
        .hp-pop-toggle:hover {
          background: rgba(232,163,61,0.18);
          border-color: var(--saffron);
        }
        .hp-pop-toggle.is-on {
          background: rgba(232,163,61,0.22);
          border-color: var(--saffron);
        }
        .hp-pop-item {
          width: 100%;
          padding: 10px 14px;
          background: rgba(245,235,211,0.04);
          border: 1px solid rgba(232,163,61,0.32);
          border-radius: 999px;
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          text-align: start;
          display: inline-flex;
          align-items: center;
        }
        .hp-pop-item:hover {
          background: rgba(232,163,61,0.18);
          border-color: var(--saffron);
        }
        .hp-pop-item--accent {
          background: linear-gradient(180deg, var(--saffron-soft) 0%, var(--saffron) 100%);
          border-color: var(--saffron);
          color: var(--charcoal);
          font-weight: 600;
        }
        .hp-pop-item--accent:hover {
          background: linear-gradient(180deg, #F4C783 0%, var(--saffron-soft) 100%);
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
