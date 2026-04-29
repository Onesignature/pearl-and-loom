"use client";

// "Final quiz" card surfaced at the bottom of the loom + sea hub lesson
// lists. Three states:
//   - locked      → all path lessons not yet finished. Shows hint copy.
//   - available   → lessons all done, quiz not yet taken. Big saffron CTA.
//   - completed   → quiz taken at least once. Shows best score + retry.

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { QUIZ_LENGTH, type QuizPath } from "@/lib/quiz/banks";

interface Props {
  path: QuizPath;
  /** True once every lesson on this path is completed. */
  unlocked: boolean;
}

export function QuizHubCard({ path, unlocked }: Props) {
  const router = useRouter();
  const { t, fmt, lang, dir } = useI18n();
  const best = useProgress((s) => s.quizScores[path].bestScore);
  const isLayla = path === "layla";
  const titleKey = isLayla ? "quiz.laylaTitle" : "quiz.saifTitle";
  const subtitleKey = isLayla ? "quiz.laylaSubtitle" : "quiz.saifSubtitle";
  const unlockHintKey = isLayla ? "quiz.unlockHint" : "quiz.unlockHintSaif";
  const href = isLayla ? "/loom/quiz" : "/sea/quiz";
  const taken = best !== null;

  function go() {
    if (!unlocked) return;
    router.push(href);
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={!unlocked}
      className={`quiz-hub-card${unlocked ? "" : " is-locked"}${taken ? " is-taken" : ""}`}
    >
      <div className="quiz-hub-row">
        <div className="quiz-hub-glyph" aria-hidden>
          {!unlocked ? "🔒" : taken ? "✓" : "★"}
        </div>
        <div className="quiz-hub-text">
          <div className="quiz-hub-eyebrow">{t("quiz.eyebrow")}</div>
          <div className="quiz-hub-title">{t(titleKey)}</div>
          <div className="quiz-hub-sub">
            {!unlocked
              ? t(unlockHintKey)
              : taken
                ? `${t("quiz.bestScoreLabel")}: ${fmt(best as number)} / ${fmt(QUIZ_LENGTH)}`
                : t(subtitleKey)}
          </div>
        </div>
        {unlocked && (
          <div
            className="quiz-hub-arrow"
            aria-hidden
            style={{ transform: dir === "rtl" ? "scaleX(-1)" : "none" }}
          >
            →
          </div>
        )}
      </div>
      <style>{`
        .quiz-hub-card {
          width: 100%;
          padding: 16px 20px;
          background: linear-gradient(180deg, rgba(232,163,61,0.18) 0%, rgba(232,163,61,0.06) 100%);
          border: 1.5px solid rgba(232,163,61,0.55);
          border-radius: 16px;
          color: var(--wool);
          font-family: var(--font-tajawal), sans-serif;
          cursor: pointer;
          text-align: start;
          transition: transform 0.3s var(--ease-loom), box-shadow 0.3s;
        }
        .quiz-hub-card.is-locked {
          background: rgba(245,235,211,0.04);
          border-color: rgba(232,163,61,0.22);
          opacity: 0.65;
          cursor: not-allowed;
        }
        .quiz-hub-card.is-taken {
          background: linear-gradient(180deg, rgba(86,150,80,0.18) 0%, rgba(86,150,80,0.06) 100%);
          border-color: rgba(112,180,98,0.6);
        }
        .quiz-hub-card:hover:not(:disabled) {
          transform: translateX(4px);
          box-shadow: 0 6px 20px rgba(232,163,61,0.28);
        }
        .quiz-hub-row { display: flex; align-items: center; gap: 16px; }
        .quiz-hub-glyph {
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(232,163,61,0.18);
          border: 1px solid rgba(232,163,61,0.5);
          border-radius: 50%;
          color: var(--saffron);
          font-family: var(--font-cormorant), serif;
          font-size: 18px;
        }
        .quiz-hub-card.is-taken .quiz-hub-glyph {
          background: rgba(112,180,98,0.18);
          border-color: rgba(112,180,98,0.6);
          color: rgba(180,230,160,0.95);
        }
        .quiz-hub-card.is-locked .quiz-hub-glyph {
          background: rgba(245,235,211,0.04);
          border-color: rgba(240,228,201,0.2);
          color: rgba(240,228,201,0.4);
        }
        .quiz-hub-text { flex: 1; min-width: 0; }
        .quiz-hub-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.85;
        }
        .quiz-hub-title {
          margin-top: 2px;
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 17px;
          color: var(--wool);
          line-height: 1.2;
        }
        .quiz-hub-sub {
          margin-top: 4px;
          font-size: 11px;
          color: rgba(240,228,201,0.65);
          letter-spacing: 0.06em;
        }
        .quiz-hub-arrow {
          flex: 0 0 auto;
          color: var(--saffron);
          font-size: 22px;
          line-height: 1;
        }
        ${lang === "ar" ? `.quiz-hub-card { font-family: var(--font-tajawal), sans-serif; } .quiz-hub-title { font-family: var(--font-tajawal), sans-serif; font-style: normal; }` : ""}
      `}</style>
    </button>
  );
}
