"use client";

import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { Task } from "@/src/types/task";

interface User {
  id: string | number;
  name: string;
}

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  users: User[];
}

export default function StatusColumn({ id, title, tasks, users }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl min-h-[350px] transition ${
        isOver
          ? "bg-[#D2DCB6]/50 ring-2 ring-[#778873]/30"
          : "bg-white/50 backdrop-blur-sm border border-[#D2DCB6]"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-[#778873]">{title}</h2>
        <span className="text-sm bg-white/60 text-[#778873] px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 && (
        <div className="text-sm text-[#778873]/40 text-center pt-8">
          No tasks yet
        </div>
      )}

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} users={users} />
      ))}
    </div>
  );
}