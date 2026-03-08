"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import StatusColumn from "./StatusColumn";

interface DashboardBoardProps {
  projectId?: string;
}

type Task = {
  id: string;
  title: string;
  status: string;
};

const initialTasks: Task[] = [
  { id: "1", title: "Design UI", status: "todo" },
  { id: "2", title: "Create API", status: "in-progress" },
  { id: "3", title: "Deploy App", status: "done" },
];

export default function DashboardBoard({ projectId }: DashboardBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const columns = [
    { id: "todo", title: "Todo" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over) return;

  const taskId = active.id;
  const newStatus = over.id;

  setTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus as string }
        : task
    )
  );
}

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => (
          <StatusColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasks.filter((task) => task.status === column.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}