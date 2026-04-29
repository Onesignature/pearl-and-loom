"use client";

import { useI18n } from "@/lib/i18n/provider";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { SpeakButton } from "@/components/ui/SpeakButton";
import type { DictPath } from "@/lib/i18n/provider";
import { useRouter } from "next/navigation";

interface LessonShellProps {
  titleKey: DictPath;
  index: number;
  children: React.ReactNode;
}

export function LessonShell({ titleKey, index, children }: LessonShellProps) {
  const router = useRouter();
  const { t, fmt } = useI18n();
  return (
    <TentScene time="day">
      <TopChrome
        onBack={() => router.push("/loom")}
        title={t(titleKey)}
        subtitle={`${t("loom.lessonLabel").toUpperCase()} ${fmt(index)} · ${t("loom.laylaSubtitle")}`}
      />
      <div
        className="lesson-stage"
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 86,
          paddingBottom: 28,
          paddingInline: "clamp(16px, 3vw, 60px)",
          display: "flex",
          gap: "clamp(20px, 3vw, 40px)",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </div>
      <style>{`
        /* Belt-and-suspenders — never let a wide child blow out the
           viewport on phone. Every flex child is allowed to shrink. */
        .lesson-stage > * { min-width: 0; max-width: 100%; }
        /* Bottom-row preview — full width under the problem + puzzle
           pair on web, flowing inline on phone (where everything is
           already a single column). */
        .lesson-preview-row {
          flex-basis: 100%;
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding-top: 6px;
          border-top: 1px solid rgba(232, 163, 61, 0.18);
        }
        @media (max-width: 640px) {
          .lesson-stage {
            align-items: flex-start !important;
            align-content: flex-start !important;
            padding-top: 96px !important;
            padding-bottom: 40px !important;
            padding-inline: 14px !important;
            gap: 18px !important;
            overflow-x: hidden !important;
          }
          .lesson-stage > * {
            flex-basis: 100% !important;
          }
          .lesson-preview-row {
            border-top: none;
            padding-top: 0;
          }
        }
      `}</style>
    </TentScene>
  );
}

interface ProblemCardProps {
  problemNumber?: { current: number; total: number };
  question: string;
  hint?: string;
  /** Optional Bedouin / Sadu cultural note. Omit on lessons whose card
   *  would otherwise push past the viewport on desktop (e.g. the Arrays
   *  lesson, which already has 3 stacked dimension controls). */
  saduNote?: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onCta?: () => void;
  children?: React.ReactNode;
}

export function ProblemCard({
  problemNumber,
  question,
  hint,
  saduNote,
  ctaLabel,
  ctaDisabled = false,
  onCta,
  children,
}: ProblemCardProps) {
  const { t, fmt, lang } = useI18n();
  return (
    <div
      className="paper-bg lesson-problem-card"
      style={{
        flex: "1 1 460px",
        minWidth: "min(100%, 280px)",
        maxWidth: 560,
        padding: "clamp(20px, 2.5vw, 32px)",
      }}
    >
      <div
        className="font-display"
        style={{
          fontSize: 12,
          letterSpacing: "0.3em",
          color: "var(--madder)",
          textTransform: "uppercase",
        }}
      >
        {t("loom.problem")}
        {problemNumber && (
          <>
            {" · "}
            {fmt(problemNumber.current)} / {fmt(problemNumber.total)}
          </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginTop: 14,
        }}
      >
        <div
          style={{
            flex: 1,
            fontFamily:
              lang === "ar"
                ? "var(--font-tajawal), sans-serif"
                : "var(--font-cormorant), serif",
            fontSize: lang === "ar" ? 22 : 26,
            color: "var(--ink)",
            lineHeight: 1.4,
            letterSpacing: lang === "ar" ? "0" : "0.02em",
          }}
        >
          {question}
        </div>
        <SpeakButton text={question} variant="icon" />
      </div>
      {hint && (
        <div className="lesson-howto" role="note">
          <span className="lesson-howto-eyebrow">
            {lang === "en" ? "How to play" : "كيف تلعب"}
          </span>
          <span className="lesson-howto-body">{hint}</span>
        </div>
      )}
      {children}
      {saduNote && (
        <div
          style={{
            marginTop: 20,
            padding: "10px 14px",
            background: "rgba(27,45,92,0.08)",
            borderInlineStart: "3px solid var(--indigo)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--indigo)",
              marginBottom: 4,
            }}
          >
            {t("loom.saduNote")}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>{saduNote}</div>
        </div>
      )}
      <button
        onClick={onCta}
        disabled={ctaDisabled}
        className="weave-cta"
      >
        {ctaLabel}
      </button>
      <style>{`
        .lesson-howto {
          margin-top: 16px;
          padding: 12px 14px;
          background: linear-gradient(180deg, rgba(232,163,61,0.16) 0%, rgba(232,163,61,0.06) 100%);
          border: 1px solid rgba(232,163,61,0.4);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lesson-howto-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 11.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--madder);
          opacity: 0.9;
        }
        .lesson-howto-body {
          font-size: 15.5px;
          color: var(--ink);
          line-height: 1.55;
        }
        .weave-cta {
          margin-top: 24px;
          width: 100%;
          padding: 16px 0;
          background: var(--saffron);
          color: var(--charcoal);
          border: 1.5px solid var(--saffron);
          border-radius: 999px;
          font-family: var(--font-cormorant), serif;
          font-size: 14px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s var(--ease-loom);
          box-shadow: 0 4px 14px rgba(232,163,61,0.32);
        }
        .weave-cta:disabled {
          background: rgba(232,163,61,0.3);
          border-color: rgba(232,163,61,0.3);
          color: var(--ink-soft);
          cursor: not-allowed;
          box-shadow: none;
        }
        .weave-cta:hover:not(:disabled) {
          background: var(--saffron-soft);
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(232,163,61,0.45);
        }
      `}</style>
    </div>
  );
}
