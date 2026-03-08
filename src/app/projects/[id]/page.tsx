"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";

export default function ProjectDetailsPage() {

  const params = useParams<{ projectId: string }>();

  const projectId = params.projectId;
  console.log("Project ID from params:", projectId);

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {

    async function fetchProject() {

      const data = await projectApi.getProject(projectId);

      if (data) {
        setProject(data);
      }

    }

    if (projectId) {
      fetchProject();
    }

  }, [projectId]);

  if (!project) {
    return <div className="p-6">Loading project...</div>;
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        {project.name}
      </h1>

      <p className="text-gray-600 mb-4">
        {project.description}
      </p>

      <p><strong>Deadline:</strong> {project.deadline || "Not set"}</p>

      <p><strong>Completed Tasks:</strong> 0</p>
      <p><strong>Pending Tasks:</strong> 0</p>

      <p><strong>Assigned Members:</strong> None</p>

    </div>
  );
}