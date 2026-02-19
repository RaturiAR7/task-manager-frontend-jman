"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FolderKanban, Users, Clock } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  employer: string;
  status: "Not Started" | "In Progress" | "Completed";
  taskCount?: number;
  dueDate?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: "1", 
      name: "Project Alpha", 
      description: "First project - Building a collaborative platform", 
      employer: "Alice", 
      status: "In Progress",
      taskCount: 8,
      dueDate: "2024-04-15"
    },
    { 
      id: "2", 
      name: "Project Beta", 
      description: "Second project - Marketing campaign", 
      employer: "Bob", 
      status: "Not Started",
      taskCount: 12,
      dueDate: "2024-05-01"
    },
    { 
      id: "3", 
      name: "Project Gamma", 
      description: "Third project - Product redesign", 
      employer: "Charlie", 
      status: "Completed",
      taskCount: 15,
      dueDate: "2024-03-20"
    },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Not Started": return "bg-[#D2DCB6] text-[#778873]";
      case "In Progress": return "bg-[#A1BC98] text-white";
      case "Completed": return "bg-[#778873] text-white";
      default: return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] via-white to-[#D2DCB6] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#778873] mb-2">Projects</h1>
            <p className="text-gray-600">Manage and track all your team projects</p>
          </div>
          <Link
            href="/projects/create"
            className="bg-[#A1BC98] text-white px-6 py-3 rounded-lg hover:bg-[#778873] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Create New Project
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#D2DCB6] hover:border-[#A1BC98] group"
            >
              <div className="flex justify-between items-start mb-3">
                <FolderKanban className="text-[#A1BC98] group-hover:text-[#778873] transition-colors" size={24} />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-[#778873] mb-2 group-hover:text-[#A1BC98] transition-colors">
                {project.name}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#A1BC98]" />
                  <span className="font-medium">Employer:</span> {project.employer}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#A1BC98]" />
                  <span className="font-medium">Due:</span> {project.dueDate}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#D2DCB6]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#778873] font-medium">Tasks</span>
                  <span className="bg-[#F1F3E0] px-2 py-1 rounded-full text-[#778873] font-medium">
                    {project.taskCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}