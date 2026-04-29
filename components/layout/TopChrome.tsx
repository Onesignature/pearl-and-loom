"use client";

import { useI18n } from "@/lib/i18n/provider";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAudioToggle } from "@/components/ui/useAudioToggle";

interface TopChromeProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onHome?: () => void;
  transparent?: boolean;
}

export function TopChrome({
  title,
  subtitle,
  onBack,
  onHome,
  transparent = false,
}: TopChromeProps) {
  const { lang, dir, setLang, numeralMode, setNumeralMode, t } = useI18n();
  const { audioEnabled, toggle: toggleAudio } = useAudioToggle();
  const useArabicDigits =
    numeralMode === "arabic-indic" ||
    (numeralMode === "auto" && lang === "ar");

  return (
    <div
      className="chrome-bar"
      style={{
        position: "absolute",
        top: 0,
        insetInlineStart: 0,
        insetInlineEnd: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 28px 18px",
        gap: 16,
        zIndex: 50,
        background: transparent
          ? "transparent"
          : "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.22) 70%, transparent 100%)",
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center", pointerEvents: "auto", minWidth: 0 }}>
        {(onBack || onHome) && (
          <button onClick={onBack || onHome} className="chrome-btn chrome-back">
            <span style={{ display: "inline-block", transform: dir === "rtl" ? "scaleX(-1)" : "none" }}>
              ←
            </span>
            <span className="chrome-back-label" style={{ marginInlineStart: 6 }}>
              {onHome ? t("home.welcome") : t("nav.back")}
            </span>
          </button>
        )}
        {title && (
          <div className="chrome-title-block" style={{ color: "var(--wool)", minWidth: 0 }}>
            <div
              className="font-display chrome-title"
              style={{
                fontSize: 24,
                lineHeight: 1.15,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                textShadow: "0 0 14px rgba(232,163,61,0.18), 0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                className="chrome-subtitle"
                style={{
                  fontSize: 12,
                  opacity: 0.78,
                  marginTop: 6,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  color: "var(--saffron)",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="chrome-mobile-only" style={{ pointerEvents: "auto" }}>
        <MobileNav />
      </div>
      <div className="chrome-chip-row" style={{ display: "flex", gap: 10, pointerEvents: "auto" }}>
        <button
          onClick={toggleAudio}
          className="chrome-btn"
          title={audioEnabled ? "Mute audio" : "Enable audio"}
          aria-pressed={audioEnabled}
        >
          <span aria-hidden>{audioEnabled ? "🔊" : "🔇"}</span>
        </button>
        <button
          onClick={() =>
            setNumeralMode(useArabicDigits ? "western" : "arabic-indic")
          }
          className="chrome-btn"
          title="Numeral system"
        >
          <span className={useArabicDigits ? "font-arabic" : ""}>
            {useArabicDigits ? "١٢٣" : "123"}
          </span>
        </button>
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="chrome-btn"
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
            {lang === "en" ? "ع" : "EN"}
          </span>
        </button>
      </div>
      <style>{`
        .chrome-btn {
          background: linear-gradient(180deg, rgba(245,235,211,0.10) 0%, rgba(245,235,211,0.04) 100%);
          color: var(--wool);
          border: 1px solid rgba(240,228,201,0.22);
          border-radius: 999px;
          padding: 9px 14px;
          font-family: var(--font-tajawal), sans-serif;
          font-size: 13px;
          letter-spacing: 0.08em;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: background 0.2s var(--ease-loom), border-color 0.2s var(--ease-loom), box-shadow 0.2s var(--ease-loom), transform 0.2s var(--ease-loom);
          box-shadow: inset 0 1px 0 rgba(245,235,211,0.06);
          min-width: 40px;
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .chrome-btn:hover {
          background: linear-gradient(180deg, rgba(232,163,61,0.18) 0%, rgba(232,163,61,0.06) 100%);
          border-color: rgba(232,163,61,0.55);
          box-shadow: inset 0 1px 0 rgba(245,235,211,0.10), 0 4px 14px rgba(232,163,61,0.18);
          transform: translateY(-1px);
        }
        .chrome-back .chrome-back-label {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          letter-spacing: 0.12em;
          font-size: 15px;
        }

        .chrome-mobile-only { display: none; }
        @media (max-width: 640px) {
          .chrome-chip-row { display: none !important; }
          .chrome-mobile-only { display: inline-flex; }
          .chrome-title { font-size: 16px !important; white-space: normal !important; }
          .chrome-subtitle { font-size: 10px !important; white-space: normal !important; margin-top: 3px !important; }
        }
        @media (max-width: 480px) {
          .chrome-back-label { display: none; }
          .chrome-back { padding: 8px 10px !important; min-width: 36px; }
          .chrome-bar { padding: 14px 14px !important; }
        }
      `}</style>
    </div>
  );
}
