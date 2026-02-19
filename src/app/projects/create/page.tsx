"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function CreateProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [employer, setEmployer] = useState("");
  const [dueDate, setDueDate] = useState("");
  const router = useRouter();

  const handleCreateProject = () => {
    if (!name.trim() || !employer.trim()) return;
    
    // Ideally, you'd call an API here
    alert("Project created successfully! (Demo)");
    router.push("/projects");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] via-white to-[#D2DCB6] p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#778873] hover:text-[#A1BC98] transition-colors mb-6"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back
        </button>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-[#D2DCB6]">
          <h1 className="text-3xl font-bold text-[#778873] mb-6">Create New Project</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Project Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Marketing Campaign 2024"
                className="w-full border border-[#D2DCB6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Employer *
              </label>
              <input
                type="text"
                placeholder="Client or team lead name"
                className="w-full border border-[#D2DCB6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Due Date
              </label>
              <input
                type="date"
                className="w-full border border-[#D2DCB6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Project Description
              </label>
              <textarea
                placeholder="Describe the project goals, scope, and requirements..."
                rows={5}
                className="w-full border border-[#D2DCB6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A1BC98] focus:border-transparent resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              onClick={handleCreateProject}
              disabled={!name.trim() || !employer.trim()}
              className="w-full bg-[#A1BC98] text-white py-3 rounded-lg hover:bg-[#778873] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}