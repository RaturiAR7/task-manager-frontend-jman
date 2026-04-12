"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import StatusColumn from "./StatusColumn";
import { taskApi } from "@/src/services/taskApi";
import { Task, TaskStatus } from "@/src/types/task";
import { useAuth } from "@/src/context/authContext";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "Todo" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export default function EmployeeTaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const myTasks = await taskApi.getMyTasks();
        // Since we only want assigned tasks for this user
        setTasks(myTasks);
      } catch (err) {
        console.error("Failed to load my tasks:", err);
      }
    }
    fetchData();
  }, []);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    if (user?.role === "EMPLOYEE" && newStatus === "TODO") {
      return; // Employees cannot move tasks to TODO.
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskApi.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status: task.status } : t))
      );
    }
  }

  // The users array for the TaskCard just needs to know about the current user
  const members = user ? [{ id: user.id, name: user.name }] : [];

  return (
    <div className="space-y-4 mt-6">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = tasks
              .filter((task) => task.status === column.id)
              .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateA - dateB;
              });
            return (
              <StatusColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={columnTasks}
                users={members}
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
