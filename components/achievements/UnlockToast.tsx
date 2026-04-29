"use client";

// Brass-banner toast that slides down from the top of the viewport when an
// achievement unlocks, plays its motif, and self-dismisses after 3.5 s.
// Framer-motion drives the enter/exit transition so the toast eases out
// gracefully on tap (or auto-dismiss) rather than disappearing instantly.

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { MOTIF_COMPONENTS } from "@/components/motifs";
import type { AchievementDef } from "@/lib/achievements/registry";

interface Props {
  achievement: AchievementDef;
  onDismiss: () => void;
}

export function UnlockToast({ achievement, onDismiss }: Props) {
  const { lang } = useI18n();
  const Motif = MOTIF_COMPONENTS[achievement.motif];

  useEffect(() => {
    const id = window.setTimeout(onDismiss, 3500);
    return () => window.clearTimeout(id);
  }, [onDismiss]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="ach-toast"
      onClick={onDismiss}
      initial={{ opacity: 0, y: -64 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -64, transition: { duration: 0.32 } }}
      transition={{ type: "spring", damping: 18, stiffness: 220 }}
    >
      <div className="ach-toast-motif" aria-hidden>
        {Motif ? (
          <Motif w="100%" h="100%" fg="var(--saffron)" bg="transparent" />
        ) : null}
      </div>
      <div className="ach-toast-body">
        <div className="ach-toast-eyebrow">
          {lang === "en" ? "Wasm earned" : "وَسْم جديد"}
        </div>
        <div className="ach-toast-title">
          {lang === "en" ? achievement.titleEn : achievement.titleAr}
        </div>
        <div className="ach-toast-tagline">
          {lang === "en" ? achievement.taglineEn : achievement.taglineAr}
        </div>
      </div>
      <style>{`
        .ach-toast {
          position: fixed;
          top: 24px;
          left: 0;
          right: 0;
          margin-inline: auto;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 22px 14px 14px;
          width: min(420px, calc(100vw - 32px));
          background:
            linear-gradient(135deg, rgba(28,18,12,0.94) 0%, rgba(48,30,16,0.94) 100%);
          border: 1px solid var(--saffron);
          color: var(--wool);
          box-shadow:
            0 18px 48px rgba(0,0,0,0.55),
            inset 0 0 30px rgba(232,163,61,0.12);
          cursor: pointer;
          font-family: var(--font-tajawal), sans-serif;
        }
        .ach-toast-motif {
          flex: 0 0 auto;
          width: 56px;
          height: 38px;
          border: 1px solid rgba(232,163,61,0.35);
          background: rgba(232,163,61,0.08);
        }
        .ach-toast-body { flex: 1; min-width: 0; }
        .ach-toast-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.85;
        }
        .ach-toast-title {
          font-family: var(--font-cormorant), serif;
          font-size: 18px;
          letter-spacing: 0.06em;
          color: var(--wool);
          margin-top: 2px;
        }
        .ach-toast-tagline {
          font-size: 12px;
          color: rgba(240,228,201,0.7);
          letter-spacing: 0.04em;
          margin-top: 2px;
        }
      `}</style>
    </motion.div>
  );
}
