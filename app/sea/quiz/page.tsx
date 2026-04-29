"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/store/progress";
import { LessonQuiz } from "@/components/quiz/LessonQuiz";

const REQUIRED = [
  "shallowBank",
  "deepReef",
  "coralGarden",
  "lungOfSea",
  "refractionTrial",
];

export default function SeaQuizPage() {
  const router = useRouter();
  const completed = useProgress((s) => s.diveLessonsCompleted);
  const allDone = REQUIRED.every((id) => completed.includes(id));

  // Gate: the final quiz only opens after every one of the five dives
  // has been completed. Until then, redirect to the hub so the kid sees
  // the locked card with the count.
  useEffect(() => {
    if (!allDone) router.replace("/sea");
  }, [allDone, router]);

  if (!allDone) return null;
  return <LessonQuiz path="saif" />;
}
