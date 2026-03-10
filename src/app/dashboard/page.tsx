"use client";

import ProjectBoard from "@/src/components/dashboard/ProjectBoard";
import CreateProjectModal from "../../components/dashboard/createProjectModal";
import { useEffect, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

export default function DashboardPage() {

  console.log("Inside the dashboard")

  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await projectApi.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    }
    console.log("hiiii")

    fetchProjects();
  }, []);


  console.log("All projects", projects)

  async function createProject(project: { name: string; description: string; memberIds: string[] }) {
    const newProject = await projectApi.createProject(project);
    console.log("Created project:", newProject);

    setProjects((prev) => [...prev, newProject]);
    setShowModal(false);
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A1BC98] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#778873] rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-[#778873]">
          Dashboard
        </h1>

        <div className="flex gap-4 mb-6">

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