"use client";

import { useI18n } from "@/lib/i18n/provider";

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-surface-elevated p-1 text-sm"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={[
          "px-3 py-1 rounded-full transition-colors",
          lang === "en"
            ? "bg-sadu-charcoal text-sadu-wool"
            : "text-sadu-charcoal/70 hover:text-sadu-charcoal",
        ].join(" ")}
      >
        {compact ? "EN" : "English"}
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        className={[
          "px-3 py-1 rounded-full transition-colors",
          lang === "ar"
            ? "bg-sadu-charcoal text-sadu-wool"
            : "text-sadu-charcoal/70 hover:text-sadu-charcoal",
        ].join(" ")}
        style={{ fontFamily: "var(--font-tajawal)" }}
      >
        العربية
      </button>
    </div>
  );
}
