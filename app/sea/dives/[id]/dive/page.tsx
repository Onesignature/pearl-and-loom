"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { DiveScene } from "@/components/sea/DiveScene";
import { DIVES } from "@/app/sea/page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DiveScenePage({ params }: PageProps) {
  const { id } = use(params);
  const dive = DIVES.find((d) => d.key === id);
  if (!dive || dive.state !== "available") return notFound();
  return <DiveScene dive={dive} />;
}
