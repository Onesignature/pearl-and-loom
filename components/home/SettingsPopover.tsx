"use client";

// Consolidated settings popover — collapses three previously-standalone
// header chips (audio, numerals, language) into a single ⚙ control. The
// underlying actions and persisted flags are unchanged; only the chrome
// got quieter.

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useAudioToggle } from "@/components/ui/useAudioToggle";
import { playCue } from "@/lib/audio/cues";

export function SettingsPopover() {
  const { lang, setLang, numeralMode, setNumeralMode, t } = useI18n();
  const { audioEnabled, toggle: toggleAudio } = useAudioToggle();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const useArabicDigits =
    numeralMode === "arabic-indic" ||
    (numeralMode === "auto" && lang === "ar");

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          playCue("ui.tap");
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="hp-chip hp-chip--icon"
        title={t("settings.title")}
      >
        <span aria-hidden>⚙</span>
      </button>
      {open && (
        <div role="menu" className="hp-pop">
          <div className="hp-pop-eyebrow">{t("settings.title")}</div>

          <div className="hp-pop-row">
            <span className="hp-pop-label">{t("settings.audio")}</span>
            <button
              type="button"
              onClick={toggleAudio}
              aria-pressed={audioEnabled}
              className={`hp-pop-toggle${audioEnabled ? " is-on" : ""}`}
            >
              {audioEnabled ? "🔊" : "🔇"}
            </button>
          </div>

          <div className="hp-pop-row">
            <span className="hp-pop-label">{t("settings.numerals")}</span>
            <button
              type="button"
              onClick={() =>
                setNumeralMode(useArabicDigits ? "western" : "arabic-indic")
              }
              className="hp-pop-toggle"
              style={{
                fontFamily: useArabicDigits
                  ? "var(--font-tajawal), sans-serif"
                  : undefined,
              }}
            >
              {useArabicDigits ? "١٢٣" : "123"}
            </button>
          </div>

          <div className="hp-pop-row">
            <span className="hp-pop-label">{t("settings.language")}</span>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="hp-pop-toggle"
              style={{
                fontFamily:
                  lang === "en"
                    ? "var(--font-cormorant), serif"
                    : "var(--font-tajawal), sans-serif",
              }}
            >
              {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
