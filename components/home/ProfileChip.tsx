"use client";

// ProfileChip — small avatar + first-name + grade pill for the HomeHeader.
// Tapping opens a popover with Edit / Reset profile actions. The popover
// is the only place the learner can clear their identity; the rest of the
// app reads from the persisted store without prompts.

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";
import { AvatarToken } from "@/components/onboarding/AvatarToken";
import { playCue } from "@/lib/audio/cues";

export function ProfileChip() {
  const { t, fmt, lang } = useI18n();
  const learnerName = useSettings((s) => s.learnerName);
  const learnerGrade = useSettings((s) => s.learnerGrade);
  const learnerAvatar = useSettings((s) => s.learnerAvatar);
  const resetProfile = useSettings((s) => s.resetProfile);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

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

  if (!learnerName || !learnerAvatar) return null;
  const firstName = learnerName.trim().split(/\s+/)[0];

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
        className="profile-chip"
        title={learnerName}
      >
        <AvatarToken avatar={learnerAvatar} size={28} />
        <span className="profile-chip-name">{firstName}</span>
        {learnerGrade !== null && (
          <span className="profile-chip-grade">
            {t("profile.gradeOption")} {fmt(learnerGrade)}
          </span>
        )}
      </button>
      {open && (
        <div role="menu" className="profile-pop">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              resetProfile();
              setOpen(false);
            }}
            className="profile-pop-item profile-pop-item--danger"
          >
            {t("profile.edit")}
          </button>
          <p className="profile-pop-help">
            {lang === "en"
              ? "You'll be asked your name and grade again. Pearls and rows stay safe."
              : "سنسألك اسمك وصفّك مرّة أخرى. اللؤلؤ والصفوف محفوظة."}
          </p>
        </div>
      )}

      <style>{`
        .profile-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 6px;
          background: linear-gradient(180deg, rgba(48,30,18,0.78) 0%, rgba(20,12,8,0.78) 100%);
          border: 1px solid rgba(232,163,61,0.42);
          border-radius: 999px;
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.18em;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.22s var(--ease-loom);
          line-height: 1;
          min-height: 40px;
        }
        [dir="rtl"] .profile-chip {
          padding: 6px 6px 6px 14px;
        }
        .profile-chip:hover {
          background: linear-gradient(180deg, rgba(232,163,61,0.30) 0%, rgba(232,163,61,0.10) 100%);
          border-color: rgba(232,163,61,0.85);
          transform: translateY(-1px);
        }
        .profile-chip-name {
          font-weight: 500;
          letter-spacing: 0.06em;
          font-style: italic;
        }
        .profile-chip-grade {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(232,163,61,0.85);
          padding-inline-start: 8px;
          border-inline-start: 1px solid rgba(232,163,61,0.3);
        }
        .profile-pop {
          position: absolute;
          top: calc(100% + 8px);
          inset-inline-end: 0;
          width: min(280px, 80vw);
          padding: 14px;
          background: linear-gradient(180deg, #1A1208 0%, #0A0807 100%);
          border: 1px solid var(--saffron);
          border-radius: 18px;
          color: var(--wool);
          z-index: 90;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
          font-family: var(--font-tajawal), sans-serif;
          animation: ppRise 0.22s var(--ease-loom);
        }
        @keyframes ppRise {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-pop-item {
          width: 100%;
          padding: 10px 14px;
          background: rgba(245,235,211,0.04);
          border: 1px solid rgba(232,163,61,0.32);
          border-radius: 999px;
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          text-align: start;
        }
        .profile-pop-item:hover {
          background: rgba(232,163,61,0.18);
          border-color: var(--saffron);
        }
        .profile-pop-help {
          margin: 10px 0 0;
          font-size: 11px;
          color: rgba(240,228,201,0.55);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
