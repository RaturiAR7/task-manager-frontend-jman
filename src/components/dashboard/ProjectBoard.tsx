"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import ProjectStatusColumn from "./ProjectStatusColumn";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import { Dispatch, SetStateAction } from "react";

interface ProjectBoardProps {
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
}

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

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, status: newStatus }
          : p
      )
    );

    // Call API to update project status
    try {
      console.log(`Updating project ${projectId} to status ${newStatus}`);
      await projectApi.updateProject(projectId, { status: newStatus });
      console.log(`Successfully updated project ${projectId}`);
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

  // Map projects to their respective columns. If status is missing, map it to the first column.
  const getTasksForColumn = (columnId: string) => {
    return projects.filter(project => {
      const status = project.status || "UPCOMING";
      return status.toUpperCase() === columnId.toUpperCase();
    });
  };

  return (
    <div className="space-y-4">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <ProjectStatusColumn
              key={column.id}
              id={column.id}
              title={column.title}
              projects={getTasksForColumn(column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
