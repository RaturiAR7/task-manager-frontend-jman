"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
}

export function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-3 rounded-lg shadow-sm mb-2 border border-[#D2DCB6] hover:shadow-md transition-all duration-200 group cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <GripVertical size={16} className="text-[#A1BC98] opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-[#778873]">{task.title}</span>
      </div>
    </div>
  );
}