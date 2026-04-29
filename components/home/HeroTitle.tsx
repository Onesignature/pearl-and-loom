"use client";

// Hero title block on the home / family-tent screen.
// Personalized greeting + title + thesis line. Uses clamp() everywhere
// so it scales gracefully from phone-narrow to wide-desktop without
// overflow.

import { useI18n } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";

function timeOfDayKey(): "profile.greetingMorning" | "profile.greetingAfternoon" | "profile.greetingEvening" {
  const h = new Date().getHours();
  if (h < 12) return "profile.greetingMorning";
  if (h < 18) return "profile.greetingAfternoon";
  return "profile.greetingEvening";
}

export function HeroTitle() {
  const { t, lang } = useI18n();
  const learnerName = useSettings((s) => s.learnerName);
  const firstName = learnerName.trim().split(/\s+/)[0];

  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "min(760px, 92vw)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(10px, 1.4vw, 18px)",
      }}
    >
      {firstName && (
        <div
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(14px, 1.5vw, 18px)",
            color: "var(--saffron)",
            letterSpacing: "0.16em",
            fontStyle: "italic",
            opacity: 0.92,
          }}
        >
          {t(timeOfDayKey())}, {firstName}.
        </div>
      )}
      <h1
        style={{
          margin: 0,
          fontFamily:
            lang === "ar"
              ? "var(--font-tajawal), sans-serif"
              : "var(--font-cormorant), serif",
          fontSize:
            lang === "ar"
              ? "clamp(30px, 4.6vw, 56px)"
              : "clamp(36px, 5.6vw, 72px)",
          fontWeight: 400,
          color: "var(--wool)",
          letterSpacing: lang === "ar" ? "0" : "0.02em",
          lineHeight: 1.05,
          fontStyle: lang === "en" ? "italic" : "normal",
        }}
      >
        {t("meta.title")}
      </h1>

      {/* Thesis line — flanked by horizontal rules */}
      <div className="hero-thesis">
        <span className="hero-thesis-rule" aria-hidden />
        <span>{lang === "en" ? "Two crafts" : "حرفتان"}</span>
        <span className="hero-thesis-dot" aria-hidden>·</span>
        <span>{lang === "en" ? "One family" : "عائلة واحدة"}</span>
        <span className="hero-thesis-dot" aria-hidden>·</span>
        <span>{lang === "en" ? "One heirloom" : "إرث واحد"}</span>
        <span className="hero-thesis-rule" aria-hidden />
      </div>
      <style>{`
        .hero-thesis {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(10px, 1.4vw, 18px);
          color: var(--saffron);
          font-size: clamp(11px, 1vw, 13px);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-family: ${lang === "ar" ? "var(--font-tajawal), sans-serif" : "var(--font-cormorant), serif"};
          opacity: 0.92;
          margin-top: clamp(4px, 0.8vw, 10px);
          white-space: nowrap;
        }
        .hero-thesis-rule {
          width: 28px;
          height: 1px;
          background: var(--saffron);
          opacity: 0.4;
        }
        .hero-thesis-dot {
          opacity: 0.4;
        }
        @media (max-width: 640px) {
          .hero-thesis {
            font-size: 9px;
            letter-spacing: 0.22em;
            gap: 6px;
          }
          .hero-thesis-rule {
            width: 16px;
          }
        }
        @media (max-width: 400px) {
          .hero-thesis-rule {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
