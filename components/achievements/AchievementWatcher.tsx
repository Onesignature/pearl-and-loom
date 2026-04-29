"use client";

// Mounted once at the app root. Subscribes directly to the progress + settings
// stores (imperative listeners, not effect cascades) and dispatches
// unlockAchievement for any newly-met milestone, then surfaces a toast.

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { ACHIEVEMENTS, type AchievementDef } from "@/lib/achievements/registry";
import { playCue } from "@/lib/audio/cues";
import { UnlockToast } from "./UnlockToast";

export function AchievementWatcher() {
  const [toast, setToast] = useState<AchievementDef | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const check = () => {
      const p = useProgress.getState();
      const s = useSettings.getState();
      const input = {
        loomLessonsCompleted: p.loomLessonsCompleted,
        diveLessonsCompleted: p.diveLessonsCompleted,
        pearls: p.pearls.map((x) => ({ grade: x.grade, diveId: x.diveId })),
        ops: p.ops.map((x) => ({ kind: x.kind })),
        streak: p.streak,
        hasToggledLang: s.hasToggledLang,
        hasToggledNumerals: s.hasToggledNumerals,
        quizBestScores: {
          layla: p.quizScores.layla.bestScore ?? 0,
          saif: p.quizScores.saif.bestScore ?? 0,
        },
      };
      let newest: AchievementDef | null = null;
      for (const a of ACHIEVEMENTS) {
        if (!p.achievements.includes(a.id) && a.check(input)) {
          p.unlockAchievement(a.id);
          newest = a;
          // Heirloom-complete is the journey's terminal milestone — stamp
          // the completion timestamp the first time it fires so the
          // leaderboard "time taken" column has both ends of the journey.
          if (a.id === "heirloom_complete") p.markCompleted();
        }
      }
      // Suppress toast on the very first mount so revisiting the app
      // doesn't replay every previously-earned banner.
      if (newest && mountedRef.current) {
        setToast(newest);
        playCue("achievement.unlock");
      }
    };
    const unsubProgress = useProgress.subscribe(check);
    const unsubSettings = useSettings.subscribe(check);
    // Run once after mount to backfill any predicates that were already true
    // (e.g. badges earned before the watcher was added). No toast on this pass.
    check();
    mountedRef.current = true;
    return () => {
      unsubProgress();
      unsubSettings();
    };
  }, []);

  if (!toast) return null;
  return <UnlockToast achievement={toast} onDismiss={() => setToast(null)} />;
}
