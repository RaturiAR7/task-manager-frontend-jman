import DashboardBoard from "@/src/components/dashboard/DashboardBoard";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-6">
        Create Project
      </button>

      <DashboardBoard projects={projects} />
    </div>
  );
}
