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
} from "../ui/dialog";
import { useAuth } from "@/src/context/authContext";
import { Plus } from "lucide-react";

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
  const { user } = useAuth();
  const canCreateTask = user?.role === "ADMIN" || user?.role === "MANAGER";

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

    if (user?.role === "EMPLOYEE" && newStatus === "TODO") {
      return;
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await taskApi.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t)),
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
        userId: newTask.userId ? newTask.userId : undefined,
      });

      setTasks((prev) => [...prev, createdTask]);
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
      {canCreateTask && (
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#0f1629] border border-white/10 text-white shadow-2xl shadow-black/60">
              <DialogHeader>
                <DialogTitle className="text-white text-lg font-semibold">Create New Task</DialogTitle>
                <DialogDescription className="text-white/40 text-sm">
                  Add a new task to this project and optionally assign it to a member.
                </DialogDescription>
              </DialogHeader>

              {createError && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {createError}
                </div>
              )}

              <div className="grid gap-4 py-2">
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
                    className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-400/60 focus:border-pink-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" style={{ background: '#0f1629' }}>Unassigned</option>
                    {members?.map((member) => (
                      <option key={member.id} value={member.id} style={{ background: '#0f1629' }}>
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
                  className="disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Save Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

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
