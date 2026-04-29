"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/store/progress";
import { LessonQuiz } from "@/components/quiz/LessonQuiz";

const REQUIRED = ["shallowBank", "deepReef", "coralGarden"];

export default function SeaQuizPage() {
  const router = useRouter();
  const completed = useProgress((s) => s.diveLessonsCompleted);
  const allDone = REQUIRED.every((id) => completed.includes(id));

  // Gate: redirect back to /sea when the path isn't fully complete. The
  // two locked dives (lungOfSea, refractionTrial) are out of scope for
  // the take-home, so the quiz unlocks at three.
  useEffect(() => {
    if (!allDone) router.replace("/sea");
  }, [allDone, router]);

  if (!allDone) return null;
  return <LessonQuiz path="saif" />;
}
