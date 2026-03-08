"use client";

import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface Props {
  id: string;
  title: string;
  tasks: Task[];
}

export default function StatusColumn({ id, title, tasks }: Props) {

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded min-h-[350px] transition ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <h2 className="font-semibold mb-4">{title}</h2>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

    </div>
  );
}