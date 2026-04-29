"use client";

// SpeakButton — Web Speech API "🔊 read aloud" button.
//
// Reads the supplied text in the active i18n language (en-US / ar-AE)
// using the browser's built-in SpeechSynthesis voices. No backend, no
// audio files, no third-party SDK. Works offline.
//
// Designed for younger learners (Grade 4 + Grade 8) who can't read
// every word fluently — the lesson and dive question copy uses adult
// vocabulary in places.
//
// Graceful degradation:
//   - If `speechSynthesis` is unavailable (older browsers / SSR), the
//     button doesn't render.
//   - If no voice is installed for the active language, the button
//     stays mounted but renders disabled with a tooltip explaining the
//     fallback.
//   - The button is a real `<button>` with aria-pressed + aria-label,
//     so screen readers announce both state and purpose.

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

interface Props {
  /** Text to speak. */
  text: string;
  /** Optional override for spoken language. Defaults to the active i18n
   *  lang. */
  lang?: "en" | "ar";
  /** Visual variant — "chip" for inline, "icon" for compact. */
  variant?: "chip" | "icon";
  className?: string;
}

const LANG_TAGS: Record<"en" | "ar", string[]> = {
  // Multiple BCP-47 tags per language so we'll find a voice on most
  // browsers; speechSynthesis voices vary widely across OS combos.
  en: ["en-US", "en-GB", "en"],
  ar: ["ar-AE", "ar-SA", "ar-EG", "ar"],
};

/** Pick the best-matching SpeechSynthesisVoice for a language. */
function pickVoice(lang: "en" | "ar"): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  for (const tag of LANG_TAGS[lang]) {
    const exact = voices.find((v) => v.lang.toLowerCase() === tag.toLowerCase());
    if (exact) return exact;
    const prefix = voices.find((v) =>
      v.lang.toLowerCase().startsWith(tag.toLowerCase()),
    );
    if (prefix) return prefix;
  }
  return null;
}

export function SpeakButton({
  text,
  lang: langOverride,
  variant = "icon",
  className,
}: Props) {
  const { lang: i18nLang } = useI18n();
  const lang = langOverride ?? i18nLang;
  // Derive support synchronously during render — speechSynthesis is a
  // host capability, not state. Avoiding setState in an effect (React
  // 19 strict-mode lint).
  const supported =
    typeof window !== "undefined" && !!window.speechSynthesis;
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(() =>
    typeof window !== "undefined" && window.speechSynthesis
      ? pickVoice(lang)
      : null,
  );
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice list loads asynchronously on most browsers — refresh when
  // the engine reports new voices, and re-pick when language changes.
  useEffect(() => {
    if (!supported) return;
    const refresh = () => setVoice(pickVoice(lang));
    refresh();
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", refresh);
    };
  }, [lang, supported]);

  // Cancel any in-flight speech on unmount so navigating away doesn't
  // leave a voice talking over the next page.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const hasVoice = voice !== null;

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    // Cancel anything currently speaking — clean restart on rapid taps.
    window.speechSynthesis.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = voice?.lang ?? LANG_TAGS[lang][0]!;
    if (voice) utt.voice = voice;
    utt.rate = 0.92;
    utt.pitch = 1.05;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    utteranceRef.current = utt;
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  }

  const titleEn = hasVoice
    ? speaking
      ? "Stop reading"
      : "Read aloud"
    : "No voice installed for this language";
  const titleAr = hasVoice
    ? speaking
      ? "إيقاف القراءة"
      : "اقرأ بصوتٍ مرتفع"
    : "لا يوجد صوت مثبَّت لهذه اللغة";
  const title = lang === "ar" ? titleAr : titleEn;

  return (
    <button
      type="button"
      onClick={speak}
      disabled={!hasVoice}
      aria-pressed={speaking}
      aria-label={title}
      title={title}
      className={`speak-btn speak-btn--${variant}${speaking ? " is-speaking" : ""}${className ? " " + className : ""}`}
    >
      <span aria-hidden style={{ display: "inline-block", lineHeight: 1 }}>
        {speaking ? "■" : "🔊"}
      </span>
      {variant === "chip" && (
        <span className="speak-btn-label">
          {hasVoice
            ? lang === "ar"
              ? speaking
                ? "أوقف"
                : "اسمع"
              : speaking
                ? "Stop"
                : "Listen"
            : lang === "ar"
              ? "غير متوفِّر"
              : "Unavailable"}
        </span>
      )}
      <style>{`
        .speak-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: rgba(232, 163, 61, 0.12);
          border: 1px solid rgba(232, 163, 61, 0.42);
          color: var(--saffron, #E8A33D);
          border-radius: 999px;
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.16em;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.18s ease;
          line-height: 1;
        }
        .speak-btn--icon {
          padding: 6px 9px;
          font-size: 12px;
        }
        .speak-btn:hover:not(:disabled) {
          background: rgba(232, 163, 61, 0.22);
          border-color: var(--saffron, #E8A33D);
          transform: translateY(-1px);
        }
        .speak-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .speak-btn.is-speaking {
          background: var(--saffron, #E8A33D);
          color: var(--charcoal, #2A2522);
          border-color: var(--saffron, #E8A33D);
          /* Subtle pulse so the button reads as "active" while voice
             plays. */
          animation: speakPulse 1.6s ease-in-out infinite;
        }
        @keyframes speakPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232, 163, 61, 0.5); }
          50% { box-shadow: 0 0 0 6px rgba(232, 163, 61, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .speak-btn.is-speaking { animation: none; }
        }
        .speak-btn-label {
          font-style: italic;
          text-transform: uppercase;
        }
      `}</style>
    </button>
  );
}
