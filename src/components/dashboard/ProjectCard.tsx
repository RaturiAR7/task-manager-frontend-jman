"use client";

import { useRouter } from "next/navigation";
import { Project } from "@/src/types/project";
const router = useRouter();

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {

  const router = useRouter();

  function openProject() {
    router.push(`/projects/${project.id}`);
  }

  return (
    <div
      key={project.id}
      onClick={() => router.push(`/projects/${project.id}`)}
      className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
    >
      <h2 className="text-lg font-semibold">{project.name}</h2>

      <p className="text-gray-500 text-sm mt-2">
        {project.description || "No description"}
      </p>
    </div>
  );
}