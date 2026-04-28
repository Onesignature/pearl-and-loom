"use client";

import { useI18n } from "@/lib/i18n/provider";

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
  const useArabicDigits =
    numeralMode === "arabic-indic" ||
    (numeralMode === "auto" && lang === "ar");

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        insetInlineStart: 0,
        insetInlineEnd: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 28px",
        zIndex: 50,
        background: transparent
          ? "transparent"
          : "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)",
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", pointerEvents: "auto" }}>
        {(onBack || onHome) && (
          <button onClick={onBack || onHome} className="chrome-btn">
            <span style={{ display: "inline-block", transform: dir === "rtl" ? "scaleX(-1)" : "none" }}>
              ←
            </span>
            <span style={{ marginInlineStart: 6 }}>
              {onHome ? t("home.welcome") : t("nav.back")}
            </span>
          </button>
        )}
        {title && (
          <div style={{ color: "var(--wool)", minWidth: 0 }}>
            <div
              className="font-display"
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
      <div style={{ display: "flex", gap: 10, pointerEvents: "auto" }}>
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
      `}</style>
    </div>
  );
}
