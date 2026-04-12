"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import TaskBoard from "@/src/components/dashboard/TaskBoard";

function formatDate(input?: unknown, withTime = true) {
  if (!input) return "—";

  const value =
    (typeof input === "object" && input && "$date" in (input as any))
      ? (input as any).$date
      : input;

  const d = new Date(value as any);
  if (isNaN(d.getTime())) return "—";

  const opts: Intl.DateTimeFormatOptions = withTime
    ? { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { year: "numeric", month: "short", day: "numeric" };

  return new Intl.DateTimeFormat(undefined, opts).format(d);
}

export default function ProjectDetailsPage() {
  const params = useParams();

  const projectId = useMemo(() => {
    const id = (params as Record<string, string | string[] | undefined>)?.id;
    return Array.isArray(id) ? id[0] : id;
  }, [params]);

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let canceled = false;

    async function fetchProject() {
      if (!projectId) {
        setError("Invalid or missing project ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await projectApi.getProject(projectId);
        if (!canceled) {
          if (data) {
            setProject(data);
          } else {
            setError("Project not found.");
          }
        }
      } catch (err) {
        console.error("Failed to fetch project details", err);
        if (!canceled) setError("Failed to fetch project details.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    fetchProject();
    return () => { canceled = true; };
  }, [projectId]);

  useEffect(() => {
    if (project?.name) {
      const prevTitle = document.title;
      document.title = `${project.name} • Projects`;
      return () => { document.title = prevTitle; };
    }
  }, [project?.name]);

  const formattedCreatedAt = useMemo(() => formatDate(project?.createdAt, true), [project?.createdAt]);
  const formattedDeadline = useMemo(() => {
    if (!project?.deadline) return "Not set";
    return formatDate(project.deadline, false);
  }, [project?.deadline]);

  const statusClass = (status?: string) => {
    if (status === "COMPLETED") return "status-completed";
    if (status === "ONGOING") return "status-ongoing";
    return "status-upcoming";
  };

  if (loading) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-white/50 text-sm">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center p-6">
        <div className="glass-card px-6 py-4 text-red-400 border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center p-6">
        <div className="text-white/50 text-xl font-semibold">No project data found.</div>
      </div>
    );
  }

  console.log("Project Data: ", project);
  return (
    <div className="page-bg relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-700 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-700 rounded-full opacity-8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header Card */}
        <div className="glass-card p-6 mb-8">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
            <h1 className="text-3xl font-bold text-white">
              {project.name ?? "Untitled Project"}
            </h1>
            {project.status && (
              <span className={`text-sm px-3 py-1 rounded-full whitespace-nowrap font-medium ${statusClass(project.status)}`}>
                {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
              </span>
            )}
          </div>

          <p className="text-white/50 mb-6 text-base leading-relaxed">
            {project.description ?? "No description provided."}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Created By", value: project.creator?.name || "—" },
              { label: "Created", value: formattedCreatedAt },
              { label: "Deadline", value: formattedDeadline },
              { label: "Completed Tasks", value: "0" },
              { label: "Pending Tasks", value: "0" },
              { label: "Assigned Members", value: "None" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/4 rounded-xl p-3 border border-white/6">
                <div className="text-xs text-white/40 font-medium mb-1">{label}</div>
                <div className="text-sm text-white font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Board Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">Project Tasks</h2>
          <div className="w-8 h-0.5 bg-pink-500 rounded-full mb-6" />
        </div>
        <TaskBoard projectId={projectId!} />
      </div>
    </div>
  );
}