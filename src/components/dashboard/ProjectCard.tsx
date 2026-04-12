"use client";

import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "@/src/types/project";
import { useAuth } from "@/src/context/authContext";
import { CalendarDays } from "lucide-react";

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const canDrag = user?.role === "ADMIN" || user?.role === "MANAGER";

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: project.id,
    disabled: !canDrag,
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
      className={`bg-white/5 border border-white/8 p-4 rounded-xl mb-3 flex flex-col gap-2 transition-all duration-200 group
        hover:bg-white/8 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10
        ${canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
    >
      <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors duration-200">
        {project.name}
      </div>
      {project.description && (
        <div className="text-xs text-white/40 line-clamp-2 leading-relaxed">
          {project.description}
        </div>
      )}
      {project.deadline && (
        <div className="flex items-center gap-1.5 mt-1 text-xs text-white/30">
          <CalendarDays size={11} />
          <span>{project.deadline}</span>
        </div>
      )}
    </div>
  );
} 
