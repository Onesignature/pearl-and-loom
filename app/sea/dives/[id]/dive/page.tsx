"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { DiveScene } from "@/components/sea/DiveScene";
import { DIVES, resolveDiveState } from "@/app/sea/page";
import { useProgress } from "@/lib/store/progress";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DiveScenePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const completed = useProgress((s) => s.diveLessonsCompleted);
  const dive = DIVES.find((d) => d.key === id);
  const state = dive ? resolveDiveState(dive, completed) : "locked";
  useEffect(() => {
    if (dive && state === "locked") router.replace("/sea");
  }, [dive, state, router]);
  if (!dive) return notFound();
  if (state === "locked") return null;
  return <DiveScene dive={{ ...dive, state }} />;
}
