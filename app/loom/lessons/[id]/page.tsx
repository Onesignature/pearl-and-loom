"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { SymmetryLesson } from "@/components/loom/lessons/SymmetryLesson";
import { FractionsLesson } from "@/components/loom/lessons/FractionsLesson";
import { TessellationLesson } from "@/components/loom/lessons/TessellationLesson";
import { ArraysLesson } from "@/components/loom/lessons/ArraysLesson";
import { AnglesLesson } from "@/components/loom/lessons/AnglesLesson";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LoomLessonPage({ params }: PageProps) {
  const { id } = use(params);
  switch (id) {
    case "symmetry":
      return <SymmetryLesson />;
    case "fractions":
      return <FractionsLesson />;
    case "tessellation":
      return <TessellationLesson />;
    case "arrays":
      return <ArraysLesson />;
    case "angles":
      return <AnglesLesson />;
    default:
      return notFound();
  }
}
