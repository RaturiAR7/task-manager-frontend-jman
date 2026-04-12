"use client";

import { useAuth } from "@/src/context/authContext";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import EmployeeTaskBoard from "@/src/components/dashboard/EmployeeTaskBoard";
import { useEffect, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyProjects() {
      try {
        const allProjects = await projectApi.getProjects();
        setProjects(allProjects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchMyProjects();
  }, [user]);

  const statusClass = (status?: string) => {
    if (status === "COMPLETED") return "status-completed";
    if (status === "ONGOING") return "status-ongoing";
    return "status-upcoming";
  };

  return (
    <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN", "MANAGER"]}>
      <div className="page-bg relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-700 rounded-full opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-700 rounded-full opacity-8 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-1">Profile</p>
            <h1 className="text-3xl font-bold text-white mb-1">My Account</h1>
            <div className="w-12 h-0.5 bg-pink-500 rounded-full" />
          </div>

          {/* Profile Card */}
          {user && (
            <div className="glass-card p-6 mb-8 flex items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#080d1a]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white truncate">{user.name}</h2>
                <p className="text-white/50 text-sm mt-0.5 truncate">{user.email}</p>
                <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/15 text-blue-200 border border-blue-500/25">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          {/* Assigned Tasks */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">My Assigned Tasks</h2>
            <div className="w-8 h-0.5 bg-pink-500 rounded-full mb-4" />
            <EmployeeTaskBoard />
          </div>

          {/* Assigned Projects */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-1">My Assigned Projects</h2>
            <div className="w-8 h-0.5 bg-pink-500 rounded-full mb-4" />

            {loading ? (
              <div className="text-white/40 animate-pulse py-8 text-center">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="glass-card p-6 text-white/40 text-center">
                You have no active project assignments.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="glass-card-hover p-5 cursor-pointer flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-white pr-2 truncate">
                        {project.name}
                      </h3>
                      {project.status && (
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap shrink-0 font-medium ${statusClass(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-sm line-clamp-3 flex-grow">
                      {project.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
