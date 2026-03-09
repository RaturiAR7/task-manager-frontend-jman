"use client";

import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "@/src/types/project";

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: project.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  function openProject() {
    router.push(`/projects/${project.id}`);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={openProject}
      className="bg-white p-4 rounded-xl shadow-sm border border-[#D2DCB6]/50 mb-3 cursor-pointer hover:shadow-md transition-shadow group flex flex-col gap-2"
    >
      <div className="font-medium text-[#778873]">{project.name}</div>
      {project.description && (
        <div className="text-sm text-[#778873]/70 line-clamp-2">
          {project.description}
        </div>
      )}
      {project.deadline && (
        <div className="mt-2 text-xs font-medium px-2 py-1 bg-[#F1F3E0] text-[#778873] rounded-full self-start">
          Deadline: {project.deadline}
        </div>
      )}
    </div>
  );
}