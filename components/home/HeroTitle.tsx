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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(10px, 1.4vw, 18px)",
          color: "var(--saffron)",
          fontSize: "clamp(11px, 1vw, 13px)",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontFamily:
            lang === "ar"
              ? "var(--font-tajawal), sans-serif"
              : "var(--font-cormorant), serif",
          opacity: 0.92,
          flexWrap: "wrap",
          marginTop: "clamp(4px, 0.8vw, 10px)",
        }}
      >
        <span
          aria-hidden
          style={{ width: 28, height: 1, background: "var(--saffron)", opacity: 0.4 }}
        />
        <span>{lang === "en" ? "Two crafts" : "حرفتان"}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{lang === "en" ? "One family" : "عائلة واحدة"}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{lang === "en" ? "One heirloom" : "إرث واحد"}</span>
        <span
          aria-hidden
          style={{ width: 28, height: 1, background: "var(--saffron)", opacity: 0.4 }}
        />
      </div>
    </div>
  );
}
