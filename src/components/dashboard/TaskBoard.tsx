"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import StatusColumn from "./StatusColumn";
import { taskApi } from "@/src/services/taskApi";
import { projectApi } from "@/src/services/projectApi";
import { Task, TaskStatus } from "@/src/types/task";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Member {
  id: string;
  name: string;
  email?: string;
}

interface DashboardBoardProps {
  projectId: string;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "Todo" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export default function DashboardBoard({ projectId }: DashboardBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    userId: "",
  });

  useEffect(() => {
    if (!projectId) return;

    async function fetchData() {
      try {
        const [projectTasks, projectMembers] = await Promise.all([
          taskApi.getTasksByProject(projectId),
          projectApi.getMembers(projectId),
        ]);

        setTasks(projectTasks);

        // FIX: Convert backend shape to Member[]
        const formattedMembers = projectMembers.map((m: any) => ({
          id: m.user.id,
          name: m.user.name,
          email: m.user.email,
        }));

        setMembers(formattedMembers);

      } catch (err) {
        console.error("Failed to load task board data:", err);
      }
    }

    fetchData();
  }, [projectId]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

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

  async function handleCreateTask() {
    if (!newTask.title.trim()) {
      setCreateError("Task title is required.");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const createdTask = await taskApi.createTask(projectId, {
        title: newTask.title.trim(),
        description: newTask.description.trim() || undefined,
        userId: newTask.userId || undefined,
      });

      setTasks(prev => [...prev, createdTask]);
      setIsDialogOpen(false);
      setNewTask({ title: "", description: "", userId: "" });
    } catch (err) {
      console.error("Failed to create task:", err);
      setCreateError("Failed to create task. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function handleDialogClose(open: boolean) {
    setIsDialogOpen(open);
    if (!open) {
      setNewTask({ title: "", description: "", userId: "" });
      setCreateError("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="bg-[#778873] hover:bg-[#A1BC98] text-white">
              + Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to this project and optionally assign it to a member.
              </DialogDescription>
            </DialogHeader>

            {createError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {createError}
              </div>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-title">Title *</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => {
                    setNewTask({ ...newTask, title: e.target.value });
                    setCreateError("");
                  }}
                  placeholder="Task title"
                  disabled={creating}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="task-description">Description (optional)</Label>
                <Input
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Task description"
                  disabled={creating}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Assign to (optional)</Label>
                <select
                  id="task-assignee"
                  value={newTask.userId}
                  onChange={(e) =>
                    setNewTask({ ...newTask, userId: e.target.value })
                  }
                  disabled={creating}
                  className="border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Unassigned</option>

                  {members?.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                      {member.email ? ` (${member.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateTask}
                disabled={creating}
                className="bg-[#778873] hover:bg-[#A1BC98] text-white disabled:opacity-50"
              >
                {creating ? "Creating..." : "Save Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <StatusColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
              users={members}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}