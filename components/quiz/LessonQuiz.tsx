"use client";

// Reusable end-of-path quiz. One question at a time, four options, instant
// feedback with a "why" explainer, then a final score card with retry +
// back-to-hub. Score writes through to the progress store and gates the
// "apprentice" achievements (4/5 or better).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { SeaScene } from "@/components/scenes/SeaScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { QUIZ_BANKS, QUIZ_LENGTH, type QuizPath } from "@/lib/quiz/banks";
import { playCue } from "@/lib/audio/cues";
import { Confetti } from "./Confetti";

interface Props {
  path: QuizPath;
}

export function LessonQuiz({ path }: Props) {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const recordQuizScore = useProgress((s) => s.recordQuizScore);
  const bestScore = useProgress((s) => s.quizScores[path].bestScore);

  const questions = QUIZ_BANKS[path];
  const [index, setIndex] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctSoFar, setCorrectSoFar] = useState(0);
  const [done, setDone] = useState(false);

  const isLayla = path === "layla";
  const Scene = isLayla ? TentScene : SeaScene;
  const titleKey = isLayla ? "quiz.laylaTitle" : "quiz.saifTitle";
  const subtitleKey = isLayla ? "quiz.laylaSubtitle" : "quiz.saifSubtitle";
  const hubHref = isLayla ? "/loom" : "/sea";
  const backLabelKey = isLayla ? "quiz.backToHub" : "quiz.backToSeaHub";

  const q = questions[index];
  const correctIdx = q?.correctIndex;

  function submit() {
    if (pick === null || revealed) return;
    setRevealed(true);
    if (pick === correctIdx) {
      setCorrectSoFar((c) => c + 1);
      playCue("achievement.unlock");
    } else {
      playCue("ui.tap");
    }
  }

  function next() {
    if (!revealed) return;
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setPick(null);
      setRevealed(false);
      playCue("ui.tap");
    } else {
      // Persist the final score. The watcher will fire achievements.
      recordQuizScore(path, correctSoFar);
      setDone(true);
      playCue("loom.shimmer");
    }
  }

  function retry() {
    setIndex(0);
    setPick(null);
    setRevealed(false);
    setCorrectSoFar(0);
    setDone(false);
  }

  if (done) {
    const perfect = correctSoFar === QUIZ_LENGTH;
    const passing = correctSoFar >= 4;
    const messageKey = perfect
      ? isLayla
        ? "quiz.perfectScore"
        : "quiz.perfectScoreSaif"
      : passing
        ? "quiz.passingScore"
        : isLayla
          ? "quiz.keepGoing"
          : "quiz.keepGoingSaif";

    return (
      <Scene>
        <TopChrome
          onBack={() => router.push(hubHref)}
          title={t(titleKey)}
          subtitle={`${t("quiz.eyebrow").toUpperCase()}`}
        />
        {/* Confetti only on a passing score — celebrate the win, not the
            attempt. Honors prefers-reduced-motion via its own internal
            media query. Re-keys per attempt count so retries get a fresh
            burst. */}
        {passing && <Confetti key={`celebrate-${path}-${correctSoFar}`} />}
        <div className="quiz-stage">
          <div className="quiz-result-card">
            <div className="quiz-eyebrow">{t("quiz.yourScore")}</div>
            <div className="quiz-score-big">
              {fmt(correctSoFar)}
              <span className="quiz-score-of"> / {fmt(QUIZ_LENGTH)}</span>
            </div>
            <div className="quiz-result-msg">{t(messageKey)}</div>
            {bestScore !== null && bestScore > correctSoFar && (
              <div className="quiz-result-best">
                {t("quiz.bestScoreLabel")}: {fmt(bestScore)} / {fmt(QUIZ_LENGTH)}
              </div>
            )}
            <div className="quiz-result-actions">
              <button onClick={retry} className="quiz-btn quiz-btn-secondary">
                {t("quiz.retry")}
              </button>
              <button
                onClick={() => router.push(hubHref)}
                className="quiz-btn quiz-btn-primary"
              >
                {t(backLabelKey)}
              </button>
            </div>
          </div>
        </div>
        <Style isLayla={isLayla} />
      </Scene>
    );
  }

  return (
    <Scene>
      <TopChrome
        onBack={() => router.push(hubHref)}
        title={t(titleKey)}
        subtitle={t(subtitleKey)}
      />
      <div className="quiz-stage">
        <div className="quiz-card">
          <div className="quiz-progress">
            <span className="quiz-eyebrow">
              {t("quiz.question")} {fmt(index + 1)} {t("quiz.of")}{" "}
              {fmt(questions.length)}
            </span>
            <div className="quiz-bar">
              <div
                className="quiz-bar-fill"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="quiz-prompt">
            {lang === "en" ? q.promptEn : q.promptAr}
          </div>
          <div className="quiz-options" role="radiogroup">
            {q.optionsEn.map((_, i) => {
              const isCorrect = i === correctIdx;
              const isPicked = i === pick;
              const stateClass = !revealed
                ? isPicked
                  ? " is-picked"
                  : ""
                : isCorrect
                  ? " is-correct"
                  : isPicked
                    ? " is-wrong"
                    : "";
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={revealed}
                  onClick={() => {
                    setPick(i);
                    playCue("ui.tap");
                  }}
                  className={`quiz-option${stateClass}`}
                >
                  <span className="quiz-option-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="quiz-option-label">
                    {lang === "en" ? q.optionsEn[i] : q.optionsAr[i]}
                  </span>
                </button>
              );
            })}
          </div>
          {revealed && (
            <div
              className={`quiz-feedback${pick === correctIdx ? " is-correct" : " is-wrong"}`}
            >
              <span className="quiz-feedback-verdict">
                {pick === correctIdx ? t("quiz.correct") : t("quiz.incorrect")}
              </span>
              <span className="quiz-feedback-why">
                <strong>{t("quiz.explanation")}:</strong>{" "}
                {lang === "en" ? q.explainEn : q.explainAr}
              </span>
            </div>
          )}
          <div className="quiz-actions">
            {!revealed ? (
              <button
                type="button"
                disabled={pick === null}
                onClick={submit}
                className="quiz-btn quiz-btn-primary"
              >
                {t("quiz.submit")}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="quiz-btn quiz-btn-primary"
              >
                {index < questions.length - 1 ? t("quiz.next") : t("quiz.finish")}
              </button>
            )}
          </div>
        </div>
      </div>
      <Style isLayla={isLayla} />
    </Scene>
  );
}

function Style({ isLayla }: { isLayla: boolean }) {
  const accent = isLayla ? "var(--saffron)" : "var(--sunset-gold)";
  const accentSoft = isLayla ? "var(--saffron-soft)" : "#F4C783";
  return (
    <style>{`
      .quiz-stage {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 96px 20px 40px;
        overflow-y: auto;
      }
      .quiz-card,
      .quiz-result-card {
        width: min(560px, 100%);
        padding: 28px clamp(20px, 3.5vw, 36px);
        background: linear-gradient(180deg, rgba(36,24,14,0.92) 0%, rgba(14,10,8,0.94) 100%);
        border: 1px solid rgba(232,163,61,0.45);
        border-radius: 24px;
        color: var(--wool);
        font-family: var(--font-tajawal), sans-serif;
        box-shadow:
          0 28px 80px rgba(0,0,0,0.55),
          inset 0 0 60px rgba(232,163,61,0.06);
        animation: qzRise 0.45s var(--ease-loom);
      }
      @keyframes qzRise {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .quiz-eyebrow {
        font-family: var(--font-cormorant), serif;
        font-size: 11px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: ${accent};
        opacity: 0.92;
      }
      .quiz-progress { display: flex; flex-direction: column; gap: 8px; }
      .quiz-bar {
        height: 4px;
        background: rgba(245,235,211,0.08);
        border-radius: 999px;
        overflow: hidden;
      }
      .quiz-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, ${accentSoft} 0%, ${accent} 100%);
        border-radius: 999px;
        transition: width 0.4s var(--ease-loom);
      }
      .quiz-prompt {
        margin-top: 20px;
        font-family: var(--font-cormorant), serif;
        font-style: italic;
        font-size: clamp(20px, 2.6vw, 24px);
        color: var(--wool);
        line-height: 1.4;
      }
      .quiz-options {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .quiz-option {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 18px;
        background: rgba(245,235,211,0.04);
        border: 1.5px solid rgba(232,163,61,0.3);
        border-radius: 18px;
        color: var(--wool);
        cursor: pointer;
        font-family: var(--font-tajawal), sans-serif;
        font-size: 15px;
        text-align: start;
        line-height: 1.4;
        transition: all 0.2s var(--ease-loom);
      }
      .quiz-option:not(:disabled):hover {
        background: rgba(232,163,61,0.12);
        border-color: rgba(232,163,61,0.7);
      }
      .quiz-option.is-picked {
        background: rgba(232,163,61,0.18);
        border-color: ${accent};
      }
      .quiz-option.is-correct {
        background: rgba(86,150,80,0.22);
        border-color: rgba(112,180,98,0.85);
        color: var(--wool);
      }
      .quiz-option.is-wrong {
        background: rgba(180,68,52,0.22);
        border-color: rgba(220,98,80,0.85);
      }
      .quiz-option:disabled { cursor: default; }
      .quiz-option-letter {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(232,163,61,0.18);
        border: 1px solid rgba(232,163,61,0.5);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-cormorant), serif;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0;
        color: ${accent};
      }
      .quiz-option.is-correct .quiz-option-letter {
        background: rgba(112,180,98,0.3);
        border-color: rgba(112,180,98,0.85);
        color: rgba(225,245,210,0.95);
      }
      .quiz-option.is-wrong .quiz-option-letter {
        background: rgba(220,98,80,0.3);
        border-color: rgba(220,98,80,0.85);
        color: rgba(255,220,210,0.95);
      }
      .quiz-feedback {
        margin-top: 16px;
        padding: 12px 14px;
        border-radius: 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .quiz-feedback.is-correct {
        background: rgba(86,150,80,0.18);
        border: 1px solid rgba(112,180,98,0.7);
      }
      .quiz-feedback.is-wrong {
        background: rgba(180,68,52,0.18);
        border: 1px solid rgba(220,98,80,0.7);
      }
      .quiz-feedback-verdict {
        font-family: var(--font-cormorant), serif;
        font-size: 14px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-weight: 600;
      }
      .quiz-feedback-why {
        font-size: 13px;
        line-height: 1.55;
        color: rgba(240,228,201,0.85);
      }
      .quiz-actions {
        margin-top: 22px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      .quiz-btn {
        padding: 13px 22px;
        border-radius: 999px;
        font-family: var(--font-cormorant), serif;
        font-size: 12px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.22s var(--ease-loom);
      }
      .quiz-btn-primary {
        background: linear-gradient(180deg, ${accentSoft} 0%, ${accent} 100%);
        border: 1.5px solid ${accent};
        color: var(--charcoal);
        box-shadow:
          inset 0 1px 0 rgba(255,238,210,0.6),
          0 6px 20px rgba(232,163,61,0.36);
      }
      .quiz-btn-primary:disabled {
        opacity: 0.42;
        cursor: not-allowed;
        box-shadow: none;
      }
      .quiz-btn-primary:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 26px rgba(232,163,61,0.45);
      }
      .quiz-btn-secondary {
        background: rgba(245,235,211,0.04);
        border: 1.5px solid rgba(232,163,61,0.4);
        color: var(--wool);
      }
      .quiz-btn-secondary:hover {
        background: rgba(232,163,61,0.18);
      }
      /* Result card */
      .quiz-result-card { text-align: center; }
      .quiz-score-big {
        margin-top: 10px;
        font-family: var(--font-cormorant), serif;
        font-size: clamp(64px, 9vw, 96px);
        font-weight: 700;
        color: ${accent};
        line-height: 1;
        text-shadow: 0 0 40px rgba(232,163,61,0.4);
      }
      .quiz-score-of {
        font-size: 0.5em;
        color: rgba(240,228,201,0.55);
        font-weight: 400;
      }
      .quiz-result-msg {
        margin-top: 12px;
        font-family: var(--font-cormorant), serif;
        font-style: italic;
        font-size: clamp(16px, 2vw, 19px);
        color: var(--wool);
        line-height: 1.5;
      }
      .quiz-result-best {
        margin-top: 8px;
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(232,163,61,0.7);
      }
      .quiz-result-actions {
        margin-top: 22px;
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      }
    `}</style>
  );
}
