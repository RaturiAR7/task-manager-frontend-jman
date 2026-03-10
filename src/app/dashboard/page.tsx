"use client";

import ProjectBoard from "@/src/components/dashboard/ProjectBoard";
import CreateProjectModal from "../../components/dashboard/createProjectModal";
import { useEffect, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { authApi } from "@/src/services/authApi";

export default function DashboardPage() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
 const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {

        const user = await authApi.getMe();
        console.log("Current user:", user);
        const data = await projectApi.getProjects();
        console.log("Fetched projects:", data);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    }
    fetchProjects();
  }, []);

  async function createProject(project: { name: string; description: string; memberIds: string[] }) {
    const newProject = await projectApi.createProject(project);
    console.log("Created project:", newProject);

    setProjects((prev) => [...prev, newProject]);
    setShowModal(false);
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
    <div className="min-h-screen bg-gradient-to-br  p-6 relative overflow-hidden">
      <div className="relative z-10">

        <div className="flex justify-between items-center mb-6">
          
          <div className="flex gap-4">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#778873] hover:bg-[#A1BC98] text-[#F1F3E0]"
            >
              Create Project
            </Button>

            <Button
              onClick={() => router.push("/projects")}
              variant="outline"
              className="border-[#D2DCB6] text-[#778873] hover:bg-[#D2DCB6]/50"
            >
              View All Projects
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D2DCB6] flex items-center justify-center text-[#778873] font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-[#778873] font-semibold text-sm">
                {user?.name || 'User'}
              </span>
              <span className="text-[#778873] text-xs opacity-80">
                {user?.email || 'user@example.com'}
              </span>
            </div>
          </div>

        </div>
        {/* Kanban Board */}
        <ProjectBoard projects={projects} setProjects={setProjects} />

        {/* Modal */}
        {showModal && (
          <CreateProjectModal
            onCreate={createProject}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>

    </div>
    </ProtectedRoute>
  );
}