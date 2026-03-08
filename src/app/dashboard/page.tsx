"use client";

import DashboardBoard from "@/src/components/dashboard/DashboardBoard";
import CreateProjectModal from "../../components/dashboard/createProjectModal";
import { useEffect, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

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

    fetchProjects();
  }, []);

  async function createProject(project: { name: string; description: string }) {

    try {
      const newProject = await projectApi.createProject(project);

      setProjects((prev) => [...prev, newProject]);

      setShowModal(false);

    } catch (error) {
      console.error("Failed to create project", error);
    }
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Project
        </button>

        <button
          onClick={() => router.push("/projects")}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          View All Projects
        </button>

      </div>

      {/* Kanban Board */}
      <DashboardBoard />

      {/* Modal */}
      {showModal && (
        <CreateProjectModal
          onCreate={createProject}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}