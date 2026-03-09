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

  // We fetch all projects and filter by assignments on the frontend, 
  // or rely on a backend getMyProjects if it explicitly curates them. 
  // The prompt says "Projects assigned to them". Let's fetch all projects 
  // and see if the backend returns only assigned ones. If not, filter manually.
  useEffect(() => {
    async function fetchMyProjects() {
      try {
        const allProjects = await projectApi.getProjects();
        // Backend `getProjects` already returns only projects where the user is a member/creator
        setProjects(allProjects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchMyProjects();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN", "MANAGER"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] p-6 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A1BC98] rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#778873] rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Page Header */}
          <h1 className="text-3xl font-bold mb-6 text-[#778873]">My Account</h1>

          {/* Profile Card */}
          {user && (
            <div className="bg-white/90 backdrop-blur-sm border border-[#D2DCB6] rounded-xl shadow-sm p-6 mb-8 flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#778873] flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-[#4A5D23] truncate">{user.name}</h2>
                <p className="text-[#778873]/80 text-sm mt-0.5 truncate">{user.email}</p>
                <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          {/* Assigned Tasks */}
          <h2 className="text-2xl font-bold mb-4 text-[#778873]">My Assigned Tasks</h2>
          <EmployeeTaskBoard />

          {/* Assigned Projects */}
          <h2 className="text-2xl font-bold mb-4 mt-12 text-[#778873]">My Assigned Projects</h2>
          
          {loading ? (
            <div className="text-[#778873] animate-pulse">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="bg-white/50 border border-[#D2DCB6] rounded-xl p-6 text-[#778873]">
              You have no active project assignments.
            </div>
          ) : (
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
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${
                        project.status === "COMPLETED" ? "bg-[#A1BC98]/30 text-[#4A5D23]" :
                        project.status === "ONGOING" ? "bg-[#D2DCB6] text-[#778873]" : "bg-slate-100 text-slate-500"
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-[#778873]/70 text-sm line-clamp-3 flex-grow mb-4">
                    {project.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
