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
        padding: "18px 28px",
        gap: 14,
        zIndex: 50,
        background: transparent
          ? "transparent"
          : "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 75%, transparent 100%)",
        borderBottom: transparent ? "none" : "1px solid rgba(232,163,61,0.18)",
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center", pointerEvents: "auto", minWidth: 0 }}>
        {/* Brand mark — small favicon ties inner pages back to the home identity */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon.svg"
          alt=""
          width={30}
          height={30}
          className="chrome-brand-mark"
          aria-hidden
        />
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
                fontSize: 20,
                lineHeight: 1.15,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                className="chrome-subtitle"
                style={{
                  fontSize: 11,
                  opacity: 0.7,
                  marginTop: 6,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
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
          background: rgba(245,235,211,0.08);
          color: var(--wool);
          border: 1px solid rgba(240,228,201,0.18);
          padding: 8px 14px;
          font-family: var(--font-tajawal), sans-serif;
          font-size: 13px;
          letter-spacing: 0.08em;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s var(--ease-loom);
          border-radius: 2px;
          min-width: 38px;
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .chrome-btn:hover {
          background: rgba(245,235,211,0.16);
          border-color: rgba(240,228,201,0.32);
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
