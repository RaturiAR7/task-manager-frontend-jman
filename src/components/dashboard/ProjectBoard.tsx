"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import ProjectStatusColumn from "./ProjectStatusColumn";
import { projectApi } from "@/src/services/projectApi";
import { taskApi } from "@/src/services/taskApi";
import { Project } from "@/src/types/project";
import { Dispatch, SetStateAction } from "react";

interface ProjectBoardProps {
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
}

const STATUS_ORDER = ["UPCOMING", "ONGOING", "COMPLETED"];

export default function ProjectBoard({ projects, setProjects }: ProjectBoardProps) {

  const columns = [
    { id: "UPCOMING", title: "Upcoming" },
    { id: "ONGOING", title: "Ongoing" },
    { id: "COMPLETED", title: "Completed" },
  ];

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const projectId = active.id as string;
    const newStatus = over.id as string;

    const project = projects.find(p => p.id === projectId);
    if (!project || project.status === newStatus) return;

    // Fix 1: Prevent dragging from ONGOING or COMPLETED back to UPCOMING
    const currentStatus = (project.status || "UPCOMING").toUpperCase();
    if (newStatus === "UPCOMING" && (currentStatus === "ONGOING" || currentStatus === "COMPLETED")) {
      return;
    }

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, status: newStatus }
          : p
      )
    );

    try {
      console.log(`Updating project ${projectId} to status ${newStatus}`);
      await projectApi.updateProject(projectId, { status: newStatus });
      console.log(`Successfully updated project ${projectId}`);

      // Fix 2: Auto-mark all tasks as DONE when project is moved to COMPLETED
      if (newStatus === "COMPLETED") {
        try {
          const tasks = await taskApi.getTasksByProject(projectId);
          const pendingTasks = tasks.filter(t => t.status !== "DONE");
          await Promise.allSettled(
            pendingTasks.map(t => taskApi.updateTask(t.id, { status: "DONE" }))
          );
        } catch (taskErr) {
          console.error("Failed to auto-complete tasks:", taskErr);
        }
      }
    } catch (error) {
      console.error("Failed to update project status", error);
      // Revert if API call fails
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, status: project.status }
            : p
        )
      );
    }
  }

  // Fix 3: Sort projects by createdAt ascending; completed projects go to bottom within their column
  const getProjectsForColumn = (columnId: string) => {
    return projects
      .filter(project => {
        const status = project.status || "UPCOMING";
        return status.toUpperCase() === columnId.toUpperCase();
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
  };

  return (
    <div className="space-y-5">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-30 mt-20">
          {columns.map((column) => (
            <ProjectStatusColumn
              key={column.id}
              id={column.id}
              title={column.title}
              projects={getProjectsForColumn(column.id)}
              disableDrop={column.id === "UPCOMING"}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
