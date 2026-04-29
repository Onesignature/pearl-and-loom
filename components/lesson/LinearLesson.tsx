"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { TopChrome } from "@/components/layout/TopChrome";
import { playCue } from "@/lib/audio/cues";

export interface QuestionSpec {
  prompt: { en: string; ar: string };
  options: { en: string; ar: string }[];
  correctIndex: number;
  /** Cultural detail surfaced after a correct answer (one short sentence). */
  context: { en: string; ar: string };
}

interface Props {
  /** Background scene wrapper. */
  scene: React.ReactNode;
  /** Title shown in the navbar. */
  title: { en: string; ar: string };
  /** "loom" plays loom thump + reward weave; "sea" plays glass bell + pearl rise. */
  theme: "loom" | "sea";
  /** Questions to step through. Length should be 5. */
  questions: QuestionSpec[];
  /** What renders inside the small reward strip after each correct answer. */
  rewardFor: (index: number) => React.ReactNode;
  /** What renders on the completion screen (full payoff visual). */
  completion: React.ReactNode;
  /** Path to switch to the sibling's journey from the completion screen. */
  switchTo: { href: string; en: string; ar: string };
  /** Eyebrow caption for completion. */
  completionEyebrow: { en: string; ar: string };
  /** Big celebration headline. */
  completionTitle: { en: string; ar: string };
  /** Footnote under headline. */
  completionTagline: { en: string; ar: string };
}

type Phase = "asking" | "wrong" | "correct" | "done";

export function LinearLesson({
  scene,
  title,
  theme,
  questions,
  rewardFor,
  completion,
  switchTo,
  completionEyebrow,
  completionTitle,
  completionTagline,
}: Props) {
  const router = useRouter();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("asking");
  const [picked, setPicked] = useState<number | null>(null);

  const total = questions.length;
  const q = questions[step];
  const correctCue = theme === "loom" ? "loom.thump" : "pearl.ping";
  const wrongCue = "ui.tap";

  function pick(i: number) {
    if (phase === "correct" || phase === "done") return;
    setPicked(i);
    setPhase("asking");
  }

  function submit() {
    if (picked == null) return;
    if (picked === q.correctIndex) {
      playCue(correctCue);
      setPhase("correct");
    } else {
      playCue(wrongCue);
      setPhase("wrong");
    }
  }

  function next() {
    if (step + 1 >= total) {
      setPhase("done");
      return;
    }
    setStep(step + 1);
    setPhase("asking");
    setPicked(null);
  }

  if (phase === "done") {
    return (
      <>
        {scene}
        <TopChrome onHome={() => router.push("/")} title={isAr ? title.ar : title.en} />
        <div className="ll-done">
          <div className="ll-done-eyebrow">
            {isAr ? completionEyebrow.ar : completionEyebrow.en}
          </div>
          <h1 className="ll-done-title">
            {isAr ? completionTitle.ar : completionTitle.en}
          </h1>
          <div className="ll-done-payoff">{completion}</div>
          <div className="ll-done-tag">
            {isAr ? completionTagline.ar : completionTagline.en}
          </div>
          <div className="ll-done-cta-row">
            <button onClick={() => router.push("/")} className="ll-cta ll-cta--ghost">
              {isAr ? "إلى الخيمة" : "Home"}
            </button>
            <button
              onClick={() => router.push(switchTo.href)}
              className="ll-cta ll-cta--primary"
            >
              {isAr ? switchTo.ar : switchTo.en} →
            </button>
          </div>
        </div>
        {sharedStyles}
      </>
    );
  }

  return (
    <>
      {scene}
      <TopChrome onHome={() => router.push("/")} title={isAr ? title.ar : title.en} />
      <div className="ll-stage">
        <ProgressBar step={step} total={total} />

        <div className="ll-card">
          <div className="ll-eyebrow">
            {isAr ? "سؤال" : "Question"} {step + 1} / {total}
          </div>
          <div className="ll-prompt">{isAr ? q.prompt.ar : q.prompt.en}</div>

          <div className="ll-options">
            {q.options.map((o, i) => {
              const isPicked = picked === i;
              const isCorrect = phase === "correct" && i === q.correctIndex;
              const isMistake = phase === "wrong" && isPicked;
              const cls = [
                "ll-opt",
                isPicked ? "is-picked" : "",
                isCorrect ? "is-correct" : "",
                isMistake ? "is-wrong" : "",
                phase === "correct" ? "is-locked" : "",
              ].join(" ");
              return (
                <button key={i} onClick={() => pick(i)} className={cls} disabled={phase === "correct"}>
                  <span className="ll-opt-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="ll-opt-text">{isAr ? o.ar : o.en}</span>
                </button>
              );
            })}
          </div>

          {phase === "correct" && (
            <div className="ll-context">
              <span className="ll-context-tick" aria-hidden>✓</span>
              {isAr ? q.context.ar : q.context.en}
            </div>
          )}

          {phase === "wrong" && (
            <div className="ll-wrong">
              {isAr ? "ليس هذا. حاول مرة أخرى." : "Not quite. Try another."}
            </div>
          )}

          <div className="ll-cta-row">
            {phase === "correct" ? (
              <button onClick={next} className="ll-cta ll-cta--primary ll-cta--big">
                {step + 1 >= total
                  ? isAr ? "أنهِ →" : "Finish →"
                  : isAr ? "التالي →" : "Next →"}
              </button>
            ) : (
              <button
                onClick={submit}
                className="ll-cta ll-cta--primary ll-cta--big"
                disabled={picked == null}
              >
                {isAr ? "تأكيد" : "Submit"}
              </button>
            )}
          </div>
        </div>

        {phase === "correct" && (
          <div className="ll-reward">{rewardFor(step)}</div>
        )}
      </div>
      {sharedStyles}
    </>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="ll-progress" aria-label={`Question ${step + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`ll-progress-pip${i < step ? " done" : i === step ? " active" : ""}`}
        />
      ))}
    </div>
  );
}

const sharedStyles = (
  <style>{`
    .ll-stage {
      position: absolute;
      inset: 0;
      padding: 90px 16px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .ll-progress {
      display: flex;
      gap: 8px;
      width: min(560px, 100%);
      padding: 4px;
    }
    .ll-progress-pip {
      flex: 1;
      height: 6px;
      border-radius: 999px;
      background: rgba(245,235,211,0.16);
      transition: background 0.4s var(--ease-loom);
    }
    .ll-progress-pip.done {
      background: var(--saffron);
      box-shadow: 0 0 12px rgba(232,163,61,0.45);
    }
    .ll-progress-pip.active {
      background: linear-gradient(90deg, var(--saffron) 0%, rgba(232,163,61,0.18) 100%);
    }
    .ll-card {
      width: min(640px, 100%);
      background:
        linear-gradient(180deg, rgba(48,30,18,0.65) 0%, rgba(20,12,8,0.78) 100%);
      border: 1px solid rgba(232,163,61,0.32);
      border-radius: 12px;
      padding: clamp(20px, 3vw, 32px);
      color: var(--wool);
      box-shadow:
        inset 0 1px 0 rgba(245,235,211,0.05),
        0 14px 40px rgba(0,0,0,0.45);
      animation: ll-card-in 0.34s var(--ease-loom);
    }
    @keyframes ll-card-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ll-eyebrow {
      font-family: var(--font-cormorant), serif;
      font-style: italic;
      font-size: 12px;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: var(--saffron);
      opacity: 0.85;
    }
    .ll-prompt {
      margin-top: 10px;
      font-family: var(--font-cormorant), serif;
      font-size: clamp(20px, 2.6vw, 28px);
      line-height: 1.3;
      color: var(--wool);
      letter-spacing: 0.01em;
    }
    .ll-options {
      margin-top: 22px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .ll-opt {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 14px;
      background: rgba(245,235,211,0.04);
      border: 1px solid rgba(232,163,61,0.22);
      border-radius: 8px;
      color: var(--wool);
      font-family: var(--font-tajawal), sans-serif;
      font-size: 15px;
      letter-spacing: 0.01em;
      text-align: start;
      cursor: pointer;
      transition:
        background 0.2s var(--ease-loom),
        border-color 0.2s var(--ease-loom),
        transform 0.2s var(--ease-loom);
    }
    .ll-opt:hover:not(:disabled):not(.is-locked) {
      background: rgba(232,163,61,0.08);
      border-color: rgba(232,163,61,0.5);
    }
    .ll-opt.is-picked {
      background: rgba(232,163,61,0.14);
      border-color: rgba(232,163,61,0.85);
    }
    .ll-opt.is-correct {
      background: linear-gradient(180deg, rgba(40,140,70,0.32), rgba(40,140,70,0.18));
      border-color: rgba(120,210,140,0.85);
    }
    .ll-opt.is-wrong {
      background: rgba(181,52,30,0.18);
      border-color: rgba(181,52,30,0.7);
      animation: ll-shake 0.32s ease-in-out;
    }
    @keyframes ll-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    .ll-opt:disabled { cursor: default; }
    .ll-opt-letter {
      flex: 0 0 auto;
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(232,163,61,0.18);
      border: 1px solid rgba(232,163,61,0.5);
      color: var(--saffron);
      font-family: var(--font-cormorant), serif;
      font-size: 13px;
      font-style: italic;
    }
    .is-correct .ll-opt-letter {
      background: rgba(120,210,140,0.28);
      border-color: rgba(180,240,200,0.85);
      color: #C8F4D8;
    }
    .ll-opt-text { flex: 1; }
    .ll-context {
      margin-top: 18px;
      padding: 12px 14px;
      background: rgba(232,163,61,0.10);
      border-inline-start: 3px solid var(--saffron);
      border-radius: 0 6px 6px 0;
      font-family: var(--font-tajawal), sans-serif;
      font-size: 13px;
      color: var(--wool);
      line-height: 1.5;
      animation: ll-card-in 0.4s var(--ease-loom);
    }
    .ll-context-tick {
      color: var(--saffron);
      font-weight: 700;
      margin-inline-end: 8px;
    }
    .ll-wrong {
      margin-top: 14px;
      font-size: 12px;
      color: rgba(255,180,160,0.85);
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
    .ll-cta-row {
      margin-top: 22px;
      display: flex;
      justify-content: flex-end;
    }
    .ll-cta {
      padding: 12px 22px;
      border-radius: 8px;
      font-family: var(--font-cormorant), serif;
      font-size: 13px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      cursor: pointer;
      transition:
        background 0.2s var(--ease-loom),
        box-shadow 0.2s var(--ease-loom),
        transform 0.2s var(--ease-loom);
    }
    .ll-cta--big {
      padding: 14px 28px;
      font-size: 13px;
      font-weight: 600;
    }
    .ll-cta--primary {
      background: linear-gradient(180deg, var(--saffron-soft) 0%, var(--saffron) 100%);
      color: var(--charcoal);
      border: 1px solid var(--saffron);
      box-shadow:
        inset 0 1px 0 rgba(255,238,210,0.55),
        0 4px 14px rgba(232,163,61,0.32);
    }
    .ll-cta--primary:hover:not(:disabled) {
      background: linear-gradient(180deg, #F4C783 0%, var(--saffron-soft) 100%);
      transform: translateY(-1px);
      box-shadow:
        inset 0 1px 0 rgba(255,238,210,0.7),
        0 8px 22px rgba(232,163,61,0.45);
    }
    .ll-cta--primary:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      box-shadow: none;
    }
    .ll-cta--ghost {
      background: transparent;
      color: var(--wool);
      border: 1px solid rgba(232,163,61,0.4);
    }
    .ll-cta--ghost:hover {
      background: rgba(232,163,61,0.12);
    }
    .ll-reward {
      width: min(560px, 100%);
      animation: ll-card-in 0.5s var(--ease-loom);
    }
    /* Completion screen */
    .ll-done {
      position: absolute;
      inset: 0;
      padding: 90px 20px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      overflow-y: auto;
      overflow-x: hidden;
      text-align: center;
      animation: ll-card-in 0.5s var(--ease-loom);
    }
    .ll-done-eyebrow {
      font-family: var(--font-cormorant), serif;
      font-size: 12px;
      letter-spacing: 0.42em;
      text-transform: uppercase;
      color: var(--saffron);
    }
    .ll-done-title {
      margin: 0;
      font-family: var(--font-cormorant), serif;
      font-style: italic;
      font-size: clamp(28px, 4vw, 44px);
      color: var(--wool);
      font-weight: 400;
      line-height: 1.1;
      max-width: 720px;
    }
    .ll-done-payoff {
      width: min(560px, 100%);
      margin-top: 8px;
    }
    .ll-done-tag {
      font-size: 12px;
      color: rgba(240,228,201,0.65);
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-style: italic;
      max-width: 540px;
    }
    .ll-done-cta-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 6px;
    }
    @media (max-width: 640px) {
      .ll-options { grid-template-columns: 1fr; }
      .ll-stage { padding-top: 100px; padding-bottom: 40px; }
      .ll-done { padding-top: 100px; }
    }
  `}</style>
);
