"use client";

import { useDroppable } from "@dnd-kit/core";
import ProjectCard from "./ProjectCard";
import { Project } from "@/src/types/project";

interface Props {
  id: string;
  title: string;
  projects: Project[];
  disableDrop?: boolean;
}

const columnStyles: Record<string, { header: string; count: string; glow: string }> = {
  UPCOMING: {
    header: "text-slate-300",
    count: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
    glow: "ring-2 ring-slate-400/20",
  },
  ONGOING: {
    header: "text-blue-300",
    count: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
    glow: "ring-2 ring-blue-500/35 bg-blue-500/5",
  },
  COMPLETED: {
    header: "text-pink-300",
    count: "bg-pink-500/12 text-pink-400 border border-pink-500/20",
    glow: "ring-2 ring-pink-500/25",
  },
};

export default function ProjectStatusColumn({ id, title, projects, disableDrop }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    disabled: disableDrop,
  });

  const style = columnStyles[id] ?? columnStyles["UPCOMING"];

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-2xl min-h-[350px] transition-all duration-200 border border-white/6 backdrop-blur-md ${
        disableDrop
          ? "bg-white/3 opacity-80"
          : isOver
          ? `bg-white/8 ${style.glow}`
          : "bg-white/4"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-semibold text-sm uppercase tracking-wider ${style.header}`}>{title}</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.count}`}>
          {projects.length}
        </span>
      </div>

      {projects.length === 0 && !disableDrop && (
        <div className="text-sm text-white/20 text-center pt-10 select-none">
          Drop projects here
        </div>
      )}

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
