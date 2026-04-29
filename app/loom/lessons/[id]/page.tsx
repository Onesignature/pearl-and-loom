import { notFound } from "next/navigation";
import { SymmetryLesson } from "@/components/loom/lessons/SymmetryLesson";
import { FractionsLesson } from "@/components/loom/lessons/FractionsLesson";
import { TessellationLesson } from "@/components/loom/lessons/TessellationLesson";
import { ArraysLesson } from "@/components/loom/lessons/ArraysLesson";
import { AnglesLesson } from "@/components/loom/lessons/AnglesLesson";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [
    { id: "symmetry" },
    { id: "fractions" },
    { id: "tessellation" },
    { id: "arrays" },
    { id: "angles" },
  ];
}

export default async function LoomLessonPage({ params }: PageProps) {
  const { id } = await params;
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
      notFound();
  }
}
