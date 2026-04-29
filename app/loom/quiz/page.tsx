"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/store/progress";
import { LessonQuiz } from "@/components/quiz/LessonQuiz";

const REQUIRED = ["symmetry", "fractions", "tessellation", "arrays", "angles"];

export default function LoomQuizPage() {
  const router = useRouter();
  const completed = useProgress((s) => s.loomLessonsCompleted);
  const allDone = REQUIRED.every((id) => completed.includes(id));

  // Gate: redirect back to /loom when the path isn't fully complete. The
  // hub renders the quiz card in its locked state so the kid sees what's
  // missing instead of getting a 404.
  useEffect(() => {
    if (!allDone) router.replace("/loom");
  }, [allDone, router]);

  if (!allDone) return null;
  return <LessonQuiz path="layla" />;
}
