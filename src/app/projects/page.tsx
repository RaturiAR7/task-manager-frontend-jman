"use client";

import { useEffect, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {

    async function fetchProjects() {
      try {
        const data = await projectApi.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
    console.log("Fetched projects:", projects);

  }, []);

  if (loading) {
    return <div className="p-6">Loading projects...</div>;
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Projects
      </h1>

      {projects.length === 0 && (
        <p className="text-gray-500">
          No projects available. Create one from the dashboard.
        </p>
      )}

      <div className="grid grid-cols-3 gap-4">

        {projects.map((project) => (

          <div
            key={project.id}
            onClick={() => router.push(`/projects/${project.id}`)}
            className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer transition"
          >

            <h2 className="text-lg font-semibold mb-1">
              {project.name}
            </h2>

            <p className="text-gray-500 text-sm">
              {project.description || "No description"}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}