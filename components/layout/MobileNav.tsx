"use client";

// Phone-only navbar control: hamburger button + slide-in drawer.
// Used by both HomeHeader (with walkthrough/tutorial dialog hooks) and
// TopChrome (no dialogs — those only live on home). Dismiss via backdrop
// click, Escape, or the close button. Body-scroll locked while open.

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useAudioToggle } from "@/components/ui/useAudioToggle";

interface MobileNavProps {
  /** Home page only — opens the 90s walkthrough video modal. */
  onOpenWalkthrough?: () => void;
  /** Home page only — opens the FAQ tutorial modal. */
  onOpenTutorial?: () => void;
}

interface NavItem {
  href: string;
  labelEn: string;
  labelAr: string;
  glyph: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", labelEn: "Family Tent", labelAr: "خيمة العائلة", glyph: "◇" },
  { href: "/loom", labelEn: "Layla's Loom", labelAr: "نَول ليلى", glyph: "▦" },
  { href: "/sea", labelEn: "Saif's Sea", labelAr: "بحر سيف", glyph: "≈" },
  { href: "/sea/chest", labelEn: "Pearl Chest", labelAr: "صندوق اللؤلؤ", glyph: "◉" },
  { href: "/souk", labelEn: "Souk al-Lulu", labelAr: "سوق اللؤلؤ", glyph: "✦" },
  { href: "/tapestry", labelEn: "Tapestry View", labelAr: "النسيج كاملًا", glyph: "▤" },
];

export function MobileNav({ onOpenWalkthrough, onOpenTutorial }: MobileNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, setLang, numeralMode, setNumeralMode } = useI18n();
  const { audioEnabled, toggle: toggleAudio } = useAudioToggle();
  const useArabicDigits =
    numeralMode === "arabic-indic" ||
    (numeralMode === "auto" && lang === "ar");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);
  const go = (href: string) => {
    close();
    router.push(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mnav-trigger"
        aria-label={lang === "en" ? "Open menu" : "افتح القائمة"}
        aria-expanded={open}
      >
        <span aria-hidden style={{ display: "block" }}>
          <span className="mnav-bar" />
          <span className="mnav-bar" />
          <span className="mnav-bar" />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === "en" ? "Navigation" : "التنقّل"}
          className="mnav-overlay"
          onClick={close}
        >
          <div className="mnav-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mnav-head">
              <div className="mnav-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicon.svg" alt="" width={28} height={28} aria-hidden />
                <span className="mnav-brand-text">
                  {lang === "en" ? "The Pearl & The Loom" : "اللؤلؤة والنول"}
                </span>
              </div>
              <button
                onClick={close}
                className="mnav-close"
                aria-label={lang === "en" ? "Close" : "إغلاق"}
              >
                ✕
              </button>
            </div>

            <div className="mnav-section-label">
              {lang === "en" ? "Navigate" : "التنقّل"}
            </div>
            <nav className="mnav-list">
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <button
                    key={item.href}
                    onClick={() => go(item.href)}
                    className={`mnav-item${active ? " active" : ""}`}
                  >
                    <span className="mnav-glyph" aria-hidden>
                      {item.glyph}
                    </span>
                    <span className="mnav-label">
                      {lang === "en" ? item.labelEn : item.labelAr}
                    </span>
                    <span className="mnav-chev" aria-hidden>
                      {lang === "ar" ? "‹" : "›"}
                    </span>
                  </button>
                );
              })}
            </nav>

            {(onOpenWalkthrough || onOpenTutorial) && (
              <>
                <div className="mnav-section-label">
                  {lang === "en" ? "Tools" : "أدوات"}
                </div>
                <div className="mnav-list">
                  {onOpenWalkthrough && (
                    <button
                      onClick={() => {
                        close();
                        onOpenWalkthrough();
                      }}
                      className="mnav-item mnav-item--accent"
                    >
                      <span className="mnav-glyph" aria-hidden>▶</span>
                      <span className="mnav-label">
                        {lang === "en" ? "Walkthrough video" : "العرض التوضيحي"}
                      </span>
                    </button>
                  )}
                  {onOpenTutorial && (
                    <button
                      onClick={() => {
                        close();
                        onOpenTutorial();
                      }}
                      className="mnav-item"
                    >
                      <span className="mnav-glyph" aria-hidden>?</span>
                      <span className="mnav-label">
                        {lang === "en" ? "How it works" : "كيف يعمل"}
                      </span>
                    </button>
                  )}
                  <a
                    href="/The Pearl and the Loom — ADEK Pitch.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="mnav-item"
                  >
                    <span className="mnav-glyph" aria-hidden>▤</span>
                    <span className="mnav-label">
                      {lang === "en" ? "Pitch deck (PDF)" : "العرض التقديمي"}
                    </span>
                  </a>
                </div>
              </>
            )}

            <div className="mnav-section-label">
              {lang === "en" ? "Settings" : "الإعدادات"}
            </div>
            <div className="mnav-list">
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="mnav-item"
              >
                <span className="mnav-glyph" aria-hidden>A</span>
                <span className="mnav-label">
                  {lang === "en" ? "العربية" : "English"}
                </span>
                <span className="mnav-aside">
                  {lang === "en" ? "Switch language" : "بدّل اللغة"}
                </span>
              </button>
              <button
                onClick={() =>
                  setNumeralMode(useArabicDigits ? "western" : "arabic-indic")
                }
                className="mnav-item"
              >
                <span className="mnav-glyph" aria-hidden>#</span>
                <span className="mnav-label">
                  {useArabicDigits ? "123" : "١٢٣"}
                </span>
                <span className="mnav-aside">
                  {lang === "en" ? "Numerals" : "الأرقام"}
                </span>
              </button>
              <button
                onClick={toggleAudio}
                className="mnav-item"
                aria-pressed={audioEnabled}
              >
                <span className="mnav-glyph" aria-hidden>
                  {audioEnabled ? "🔊" : "🔇"}
                </span>
                <span className="mnav-label">
                  {audioEnabled
                    ? lang === "en" ? "Audio on" : "الصوت مُفعَّل"
                    : lang === "en" ? "Audio off" : "الصوت معطَّل"}
                </span>
                <span className="mnav-aside">
                  {lang === "en" ? "Tap to toggle" : "اضغط للتبديل"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mnav-trigger {
          display: none;
          width: 44px;
          height: 44px;
          background:
            linear-gradient(180deg, rgba(48,30,18,0.78) 0%, rgba(20,12,8,0.78) 100%);
          border: 1px solid rgba(232,163,61,0.42);
          color: var(--wool);
          padding: 0;
          cursor: pointer;
          backdrop-filter: blur(10px);
          box-shadow:
            inset 0 1px 0 rgba(245,235,211,0.06),
            0 2px 8px rgba(0,0,0,0.22);
          align-items: center;
          justify-content: center;
          transition: background 0.2s var(--ease-loom), border-color 0.2s var(--ease-loom);
        }
        .mnav-trigger:active {
          background: linear-gradient(180deg, rgba(232,163,61,0.30) 0%, rgba(232,163,61,0.10) 100%);
          border-color: rgba(232,163,61,0.85);
        }
        .mnav-bar {
          display: block;
          width: 18px;
          height: 1.5px;
          background: var(--saffron);
          margin: 4px auto;
        }
        @media (max-width: 640px) {
          .mnav-trigger { display: inline-flex; }
        }
        .mnav-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background:
            radial-gradient(ellipse 100% 80% at 50% 70%, #2A1810 0%, #0F0A06 70%, #050302 100%);
          color: var(--wool);
          overflow-y: auto;
          padding: 18px 20px 32px;
          animation: mnavFade 0.24s var(--ease-loom);
        }
        .mnav-sheet {
          max-width: 480px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          min-height: 100%;
          animation: mnavRise 0.32s var(--ease-loom);
        }
        .mnav-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 18px;
          margin-bottom: 10px;
          border-bottom: 1px solid rgba(232,163,61,0.28);
        }
        .mnav-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .mnav-brand-text {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 17px;
          color: var(--wool);
          letter-spacing: 0.05em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mnav-close {
          width: 40px;
          height: 40px;
          background: transparent;
          border: 1px solid rgba(240,228,201,0.32);
          color: var(--wool);
          font-size: 16px;
          cursor: pointer;
          flex: 0 0 auto;
        }
        .mnav-close:active { background: rgba(245,235,211,0.12); }
        .mnav-section-label {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          color: var(--saffron);
          letter-spacing: 0.36em;
          text-transform: uppercase;
          opacity: 0.85;
          margin: 18px 4px 10px;
        }
        .mnav-list { display: flex; flex-direction: column; gap: 6px; }
        .mnav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 16px 14px;
          background: rgba(245,235,211,0.04);
          border: 1px solid rgba(232,163,61,0.2);
          color: var(--wool);
          font-family: var(--font-tajawal), sans-serif;
          font-size: 15px;
          letter-spacing: 0.04em;
          cursor: pointer;
          text-align: start;
          text-decoration: none;
          min-height: 56px;
          transition: background 0.18s, border-color 0.18s;
        }
        .mnav-item:active { background: rgba(232,163,61,0.16); }
        .mnav-item.active {
          background: rgba(232,163,61,0.14);
          border-color: rgba(232,163,61,0.55);
        }
        .mnav-item--accent {
          background: var(--saffron);
          color: var(--charcoal);
          border-color: var(--saffron);
          font-weight: 600;
        }
        .mnav-item--accent:active { background: var(--saffron-soft); }
        .mnav-glyph {
          width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--saffron);
          font-size: 14px;
          flex: 0 0 auto;
        }
        .mnav-item--accent .mnav-glyph { color: var(--charcoal); }
        .mnav-label { flex: 1; min-width: 0; }
        .mnav-chev { color: var(--saffron); opacity: 0.7; font-size: 18px; }
        .mnav-aside {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.55;
        }
        @keyframes mnavFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mnavRise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
