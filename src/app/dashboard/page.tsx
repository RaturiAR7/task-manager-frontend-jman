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
    <div className="page-bg relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-700 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-700 rounded-full opacity-8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-3xl font-bold text-white mb-1">
            Dashboard
          </h1>
          <div className="w-12 h-0.5 bg-pink-500 rounded-full" />
        </div>

        <div className="flex gap-3 mb-8">
          <Button
            onClick={() => setShowModal(true)}
          >
            + Create Project
          </Button>

          <Button
            onClick={() => router.push("/projects")}
            variant="outline"
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