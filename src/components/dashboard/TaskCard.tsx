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

  const statusColors: Record<string, string> = {
    TODO: "bg-slate-100 text-slate-500",
    IN_PROGRESS: "bg-[#D2DCB6] text-[#778873]",
    DONE: "bg-[#A1BC98]/30 text-[#4A5D23]",
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
      className="bg-white p-4 rounded-xl shadow-sm border border-[#D2DCB6]/50 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow flex flex-col gap-2"
    >
      <div className="font-medium text-[#778873]">{task.title}</div>
      {task.description && (
        <div className="text-sm text-[#778873]/70 line-clamp-2">
          {task.description}
        </div>
      )}
      <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
        <span className="text-xs font-medium px-2 py-1 bg-[#F1F3E0] text-[#778873] rounded-full">
          {assignee ? assignee.name : "Unassigned"}
        </span>
        {task.priority && (
          <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-600">
            {task.priority}
          </span>
        )}
      </div>
    </div>
  );
}