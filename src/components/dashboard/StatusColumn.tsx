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

const columnStyles: Record<string, { header: string; count: string; glow: string }> = {
  TODO: {
    header: "text-slate-300",
    count: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
    glow: "ring-2 ring-slate-400/30 bg-slate-400/5",
  },
  IN_PROGRESS: {
    header: "text-blue-300",
    count: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
    glow: "ring-2 ring-blue-500/40 bg-blue-500/5",
  },
  DONE: {
    header: "text-pink-300",
    count: "bg-pink-500/12 text-pink-400 border border-pink-500/20",
    glow: "ring-2 ring-pink-500/30 bg-pink-500/5",
  },
};

export default function StatusColumn({ id, title, tasks, users }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = columnStyles[id] ?? columnStyles["TODO"];

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-2xl min-h-[350px] transition-all duration-200 border border-white/6 backdrop-blur-md ${
        isOver
          ? `${style.glow} bg-white/8`
          : "bg-white/4"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-semibold text-sm uppercase tracking-wider ${style.header}`}>{title}</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.count}`}>
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 && (
        <div className="text-sm text-white/20 text-center pt-10 select-none">
          Drop tasks here
        </div>
      )}

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} users={users} />
      ))}
    </div>
  );
}