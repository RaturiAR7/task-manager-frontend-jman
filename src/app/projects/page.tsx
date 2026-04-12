"use client";

import { useEffect, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

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

  const statusClass = (status?: string) => {
    if (status === "COMPLETED") return "status-completed";
    if (status === "ONGOING") return "status-ongoing";
    return "status-upcoming";
  };

  if (loading) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-white/50 text-sm">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
    <div className="page-bg relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-700 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-700 rounded-full opacity-8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-1">All Projects</p>
          <h1 className="text-3xl font-bold text-white mb-1">Projects</h1>
          <div className="w-12 h-0.5 bg-pink-500 rounded-full" />
        </div>

        {projects.length === 0 && (
          <div className="glass-card p-8 text-center text-white/40">
            No projects available. Create one from the dashboard.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {[...projects]
            .sort((a, b) => {
              const aCompleted = (a.status || "").toUpperCase() === "COMPLETED" ? 1 : 0;
              const bCompleted = (b.status || "").toUpperCase() === "COMPLETED" ? 1 : 0;
              if (aCompleted !== bCompleted) return aCompleted - bCompleted;
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            })
            .map((project) => (

            <div
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="glass-card-hover p-6 flex flex-col h-full cursor-pointer"
            >

              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-white pr-2">
                  {project.name}
                </h2>
                {project.status && (
                  <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${statusClass(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase()}
                  </span>
                )}
              </div>

              <p className="text-white/40 text-sm line-clamp-3 mb-4 flex-grow">
                {project.description || "No description"}
              </p>
              
              <div className="text-xs text-white/25 pt-4 border-t border-white/8">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
    </ProtectedRoute>
  );
}