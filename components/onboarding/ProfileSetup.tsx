"use client";

// Profile setup — first-run greeting card. Three quick questions: name,
// grade, avatar. Designed to feel like a friendly kids' app, not a form:
// generous spacing, large rounded inputs, big tappable choice tiles, one
// soft saffron CTA. Bilingual EN/AR.

import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import {
  useSettings,
  LEARNER_AVATARS,
  type LearnerAvatar,
  type LearnerGrade,
} from "@/lib/store/settings";
import { TentScene } from "@/components/scenes/TentScene";
import { AvatarToken } from "./AvatarToken";
import { playCue } from "@/lib/audio/cues";

const GRADES: LearnerGrade[] = [4, 5, 6, 7, 8];

const AVATAR_LABEL_KEY: Record<LearnerAvatar, string> = {
  falcon: "profile.avatarFalcon",
  dhow: "profile.avatarDhow",
  pearl: "profile.avatarPearl",
  palm: "profile.avatarPalm",
};

export function ProfileSetup() {
  const { t, lang, fmt } = useI18n();
  const completeProfileSetup = useSettings((s) => s.completeProfileSetup);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<LearnerGrade | null>(null);
  const [avatar, setAvatar] = useState<LearnerAvatar | null>(null);

  const ready = name.trim().length >= 2 && grade !== null && avatar !== null;
  const firstName = name.trim().split(/\s+/)[0];

  function submit() {
    if (!ready) return;
    playCue("loom.shimmer");
    completeProfileSetup({
      name: name.trim(),
      grade: grade as LearnerGrade,
      avatar: avatar as LearnerAvatar,
    });
  }

  return (
    <TentScene>
      <div className="ps-overlay">
        <div className="ps-card" role="dialog" aria-modal="true">
          <div className="ps-header">
            <div className="ps-wave" aria-hidden>👋</div>
            <h2 className="ps-title">{t("profile.setupTitle")}</h2>
            <p className="ps-subtitle">{t("profile.setupSubtitle")}</p>
          </div>

          <div className="ps-field">
            <span className="ps-label">
              <span className="ps-step">1</span>
              {t("profile.nameLabel")}
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("profile.namePlaceholder")}
              maxLength={30}
              autoFocus
              spellCheck={false}
              className="ps-input"
              dir={lang === "ar" ? "rtl" : "ltr"}
            />
          </div>

          <div className="ps-field">
            <span className="ps-label">
              <span className="ps-step">2</span>
              {t("profile.gradeLabel")}
            </span>
            <div className="ps-grades" role="radiogroup">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={grade === g}
                  onClick={() => {
                    setGrade(g);
                    playCue("ui.tap");
                  }}
                  className={`ps-grade${grade === g ? " is-active" : ""}`}
                >
                  {fmt(g)}
                </button>
              ))}
            </div>
          </div>

          <div className="ps-field">
            <span className="ps-label">
              <span className="ps-step">3</span>
              {t("profile.avatarLabel")}
            </span>
            <div className="ps-avatars" role="radiogroup">
              {LEARNER_AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={avatar === a}
                  onClick={() => {
                    setAvatar(a);
                    playCue("ui.tap");
                  }}
                  className={`ps-avatar${avatar === a ? " is-active" : ""}`}
                  title={t(AVATAR_LABEL_KEY[a] as never)}
                >
                  <AvatarToken avatar={a} size={64} />
                  <span className="ps-avatar-name">
                    {t(AVATAR_LABEL_KEY[a] as never)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!ready}
            onClick={submit}
            className="ps-begin"
          >
            {ready && firstName
              ? lang === "en"
                ? `Let's go, ${firstName} →`
                : `هيّا بنا، ${firstName} ←`
              : t("profile.begin")}
          </button>
        </div>
      </div>

      <style>{`
        .ps-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 18px;
          overflow-y: auto;
        }
        .ps-card {
          width: min(540px, 100%);
          padding: 28px clamp(22px, 4vw, 38px) 26px;
          background: linear-gradient(180deg, rgba(36,24,14,0.92) 0%, rgba(14,10,8,0.94) 100%);
          border: 1px solid rgba(232,163,61,0.45);
          border-radius: 28px;
          color: var(--wool);
          font-family: var(--font-tajawal), sans-serif;
          box-shadow:
            0 28px 80px rgba(0,0,0,0.55),
            inset 0 0 60px rgba(232,163,61,0.06);
          backdrop-filter: blur(12px);
          animation: psRise 0.5s var(--ease-loom);
        }
        @keyframes psRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ps-header {
          text-align: center;
          margin-bottom: 22px;
        }
        .ps-wave {
          font-size: 36px;
          line-height: 1;
          margin-bottom: 8px;
        }
        .ps-title {
          margin: 0;
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(24px, 4vw, 30px);
          color: var(--wool);
          line-height: 1.2;
          letter-spacing: 0.01em;
        }
        .ps-subtitle {
          margin: 8px 0 0;
          font-size: 13px;
          color: rgba(240,228,201,0.7);
          letter-spacing: 0.04em;
        }
        .ps-field {
          margin-top: 20px;
        }
        .ps-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          color: var(--wool);
          opacity: 0.92;
          margin-bottom: 10px;
          letter-spacing: 0.04em;
        }
        .ps-step {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--saffron);
          color: var(--charcoal);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
        }
        .ps-input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(245,235,211,0.06);
          border: 1.5px solid rgba(232,163,61,0.4);
          border-radius: 999px;
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 22px;
          font-style: italic;
          letter-spacing: 0.02em;
          outline: none;
          transition: border-color 0.2s var(--ease-loom), background 0.2s var(--ease-loom);
        }
        .ps-input:focus,
        .ps-input:focus-visible {
          outline: none;
          border-color: var(--saffron);
          background: rgba(245,235,211,0.10);
        }
        .ps-input::placeholder {
          color: rgba(240,228,201,0.4);
          font-style: italic;
        }
        .ps-grades {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }
        .ps-grade {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(245,235,211,0.04);
          border: 1.5px solid rgba(232,163,61,0.32);
          border-radius: 50%;
          color: var(--wool);
          cursor: pointer;
          font-family: var(--font-cormorant), serif;
          font-size: 26px;
          font-weight: 600;
          line-height: 1;
          transition: all 0.2s var(--ease-loom);
        }
        .ps-grade:hover {
          background: rgba(232,163,61,0.14);
          border-color: rgba(232,163,61,0.7);
          transform: translateY(-2px);
        }
        .ps-grade.is-active {
          background: var(--saffron);
          border-color: var(--saffron);
          color: var(--charcoal);
          box-shadow: 0 6px 18px rgba(232,163,61,0.4);
          transform: translateY(-2px);
        }
        .ps-avatars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .ps-avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 14px 6px 12px;
          background: rgba(245,235,211,0.04);
          border: 1.5px solid rgba(232,163,61,0.3);
          border-radius: 22px;
          color: var(--wool);
          cursor: pointer;
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.06em;
          transition: all 0.2s var(--ease-loom);
        }
        .ps-avatar:hover {
          background: rgba(232,163,61,0.14);
          border-color: rgba(232,163,61,0.7);
          transform: translateY(-2px);
        }
        .ps-avatar.is-active {
          background: rgba(232,163,61,0.22);
          border-color: var(--saffron);
          box-shadow:
            0 6px 18px rgba(232,163,61,0.32),
            inset 0 0 22px rgba(232,163,61,0.18);
          transform: translateY(-2px);
        }
        .ps-avatar-name {
          opacity: 0.85;
        }
        .ps-begin {
          margin-top: 28px;
          width: 100%;
          padding: 18px 24px;
          background: linear-gradient(180deg, var(--saffron-soft) 0%, var(--saffron) 100%);
          border: 1.5px solid var(--saffron);
          border-radius: 999px;
          color: var(--charcoal);
          font-family: var(--font-cormorant), serif;
          font-size: 16px;
          letter-spacing: 0.18em;
          font-weight: 600;
          font-style: italic;
          cursor: pointer;
          transition: all 0.22s var(--ease-loom);
          box-shadow:
            inset 0 1px 0 rgba(255,238,210,0.6),
            0 8px 24px rgba(232,163,61,0.4);
        }
        .ps-begin:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow:
            inset 0 1px 0 rgba(255,238,210,0.7),
            0 12px 30px rgba(232,163,61,0.5);
        }
        .ps-begin:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
          font-style: normal;
        }

        @media (max-width: 480px) {
          .ps-card {
            padding: 22px 18px 22px;
            border-radius: 22px;
          }
          .ps-grades {
            gap: 8px;
          }
          .ps-grade {
            font-size: 22px;
          }
          .ps-avatars {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </TentScene>
  );
}
