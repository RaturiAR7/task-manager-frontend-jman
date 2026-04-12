"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/src/types/task";
import { useAuth } from "@/src/context/authContext";

interface User {
  id: string | number;
  name: string;
}

export default function TaskCard({ task, users }: { task: Task; users: User[] }) {
  const { user } = useAuth();
  const canDrag = user?.role === "ADMIN" || user?.role === "MANAGER" || String(task.assignedTo) === String(user?.id);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const assignee = users.find((u) => String(u.id) === String(task.assignedTo));

  const statusChip: Record<string, string> = {
    TODO: "status-todo",
    IN_PROGRESS: "status-inprogress",
    DONE: "status-done",
  };

  const statusLabels: Record<string, string> = {
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white/5 border border-white/8 p-4 rounded-xl mb-3 flex flex-col gap-2.5 transition-all duration-200 select-none
        hover:bg-white/8 hover:border-white/15 hover:shadow-lg hover:shadow-black/20
        ${canDrag ? "cursor-grab active:cursor-grabbing active:scale-102 active:shadow-xl active:shadow-black/30" : "cursor-default"}`}
    >
      <div className="font-medium text-white text-sm leading-snug">{task.title}</div>
      {task.description && (
        <div className="text-xs text-white/40 line-clamp-2 leading-relaxed">
          {task.description}
        </div>
      )}
      <div className="flex items-center justify-between mt-0.5 flex-wrap gap-1.5">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
          {assignee ? assignee.name : "Unassigned"}
        </span>
        {task.priority && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {task.priority}
          </span>
        )}
      </div>
    </div>
  );
}