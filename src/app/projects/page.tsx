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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] flex items-center justify-center p-6">
        <div className="text-[#778873] text-xl font-semibold animate-pulse">Loading projects...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] p-6 relative overflow-hidden">
      
      {/* Decorative Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A1BC98] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#778873] rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-[#778873]">
          Projects
        </h1>

        {projects.length === 0 && (
          <p className="text-[#778873] text-lg bg-white/50 p-6 rounded-xl border border-[#D2DCB6]">
            No projects available. Create one from the dashboard.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {[...projects]
            .sort((a, b) => {
              // COMPLETED projects appear last
              const aCompleted = (a.status || "").toUpperCase() === "COMPLETED" ? 1 : 0;
              const bCompleted = (b.status || "").toUpperCase() === "COMPLETED" ? 1 : 0;
              if (aCompleted !== bCompleted) return aCompleted - bCompleted;
              // Within the same group, sort oldest first
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            })
            .map((project) => (

            <div
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="bg-white/90 backdrop-blur-sm border border-[#D2DCB6] p-6 rounded-xl shadow-sm hover:shadow-md hover:border-[#A1BC98] cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >

              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-[#778873] pr-2">
                  {project.name}
                </h2>
                {project.status && (
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    project.status === 'COMPLETED' ? 'bg-[#A1BC98]/30 text-[#4A5D23]' : 
                    project.status === 'ONGOING' ? 'bg-[#D2DCB6] text-[#778873]' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase()}
                  </span>
                )}
              </div>

              <p className="text-[#778873]/80 text-sm line-clamp-3 mb-4 flex-grow">
                {project.description || "No description"}
              </p>
              
              <div className="text-xs text-[#778873]/60 pt-4 border-t border-[#D2DCB6]/30">
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