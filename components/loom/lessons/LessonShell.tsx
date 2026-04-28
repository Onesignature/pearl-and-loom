"use client";

import { useI18n } from "@/lib/i18n/provider";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
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
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 86,
          paddingBottom: 28,
          paddingInline: 60,
          display: "flex",
          gap: 40,
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </TentScene>
  );
}

interface ProblemCardProps {
  problemNumber?: { current: number; total: number };
  question: string;
  hint?: string;
  saduNote: string;
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
    <div className="paper-bg" style={{ width: 360, padding: "32px 32px", flexShrink: 0 }}>
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
          fontFamily:
            lang === "ar"
              ? "var(--font-tajawal), sans-serif"
              : "var(--font-cormorant), serif",
          fontSize: lang === "ar" ? 22 : 26,
          color: "var(--ink)",
          lineHeight: 1.4,
          marginTop: 14,
          letterSpacing: lang === "ar" ? "0" : "0.02em",
        }}
      >
        {question}
      </div>
      {hint && (
        <div style={{ marginTop: 18, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>
          {hint}
        </div>
      )}
      {children}
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
      <button
        onClick={onCta}
        disabled={ctaDisabled}
        className="weave-cta"
      >
        {ctaLabel}
      </button>
      <style>{`
        .weave-cta {
          margin-top: 24px;
          width: 100%;
          padding: 14px 0;
          background: var(--saffron);
          color: var(--charcoal);
          border: none;
          font-family: var(--font-cormorant), serif;
          font-size: 14px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s var(--ease-loom);
        }
        .weave-cta:disabled {
          background: rgba(232,163,61,0.3);
          color: var(--ink-soft);
          cursor: not-allowed;
        }
        .weave-cta:hover:not(:disabled) {
          background: var(--saffron-soft);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
