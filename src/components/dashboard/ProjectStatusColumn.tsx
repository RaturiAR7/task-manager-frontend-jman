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

export default function ProjectStatusColumn({ id, title, projects, disableDrop }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    disabled: disableDrop,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded min-h-[350px] transition ${
        disableDrop
          ? "bg-white/50 backdrop-blur-sm border border-[#D2DCB6] opacity-80"
          : isOver
          ? "bg-[#D2DCB6]/50"
          : "bg-white/50 backdrop-blur-sm border border-[#D2DCB6]"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-[#778873]">{title}</h2>
        <span className="text-sm bg-white/60 text-[#778873] px-2 py-1 rounded-full">{projects.length}</span>
      </div>

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
