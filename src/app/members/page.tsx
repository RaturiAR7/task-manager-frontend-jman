"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import { useAuth } from "@/src/context/authContext";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  MANAGER: "bg-blue-100 text-blue-700",
  EMPLOYEE: "bg-green-100 text-green-700",
  admin: "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  employee: "bg-green-100 text-green-700",
};

export default function MembersPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await projectApi.getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load your projects.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "";

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A1BC98] rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#778873] rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Page Header */}
        <h1 className="text-3xl font-bold mb-6 text-[#778873]">My Profile</h1>

        {/* Profile Card */}
        {user ? (
          <div className="bg-white/90 backdrop-blur-sm border border-[#D2DCB6] rounded-xl shadow-sm p-6 mb-8 flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#778873] flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-[#4A5D23] truncate">{user.name}</h2>
              <p className="text-[#778873]/80 text-sm mt-0.5 truncate">{user.email}</p>
              <span
                className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                  roleColors[user.role] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {roleLabel}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 border border-[#D2DCB6] rounded-xl p-6 mb-8 text-[#778873]">
            <p>Please log in to view your profile.</p>
          </div>
        )}

        {/* Projects Section */}
        <h2 className="text-2xl font-bold mb-4 text-[#778873]">My Projects</h2>

        {loading && (
          <div className="text-[#778873] text-lg font-medium animate-pulse">
            Loading projects...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="bg-white/50 border border-[#D2DCB6] rounded-xl p-6 text-[#778873]">
            You have not been assigned to any projects yet.
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="bg-white/90 backdrop-blur-sm border border-[#D2DCB6] p-5 rounded-xl shadow-sm hover:shadow-md hover:border-[#A1BC98] cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[#778873] pr-2 truncate">
                    {project.name}
                  </h3>
                  {project.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${
                        project.status === "COMPLETED"
                          ? "bg-[#A1BC98]/30 text-[#4A5D23]"
                          : project.status === "ONGOING"
                          ? "bg-[#D2DCB6] text-[#778873]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1).toLowerCase()}
                    </span>
                  )}
                </div>

                <p className="text-[#778873]/70 text-sm line-clamp-3 flex-grow mb-4">
                  {project.description || "No description"}
                </p>

                <div className="text-xs text-[#778873]/50 pt-3 border-t border-[#D2DCB6]/40">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}