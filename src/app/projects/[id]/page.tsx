"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { projectApi } from "@/src/services/projectApi";
import { Project } from "@/src/types/project";
import TaskBoard from "@/src/components/dashboard/TaskBoard";

function formatDate(input?: unknown, withTime = true) {
  if (!input) return "—";

  // Handle MongoDB Timestamp shape: { $date: '...' }
  const value =
    (typeof input === "object" && input && "$date" in (input as any))
      ? (input as any).$date
      : input;

  const d = new Date(value as any);
  if (isNaN(d.getTime())) return "—";

  // Use the browser's locale; customize as needed
  const opts: Intl.DateTimeFormatOptions = withTime
    ? { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { year: "numeric", month: "short", day: "numeric" };

  return new Intl.DateTimeFormat(undefined, opts).format(d);
}

export default function ProjectDetailsPage() {
  // ✅ useParams has no generics in App Router
  const params = useParams();

  // ✅ `useParams()` can return string | string[]
  const projectId = useMemo(() => {
    const id = (params as Record<string, string | string[] | undefined>)?.id;
    return Array.isArray(id) ? id[0] : id; // normalize to string | undefined
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
    return () => {
      canceled = true;
    };
  }, [projectId]);


  useEffect(() => {
    if (project?.name) {
      const prevTitle = document.title;
      document.title = `${project.name} • Projects`;
      return () => {
        document.title = prevTitle;
      };
    }
  }, [project?.name]);

  const formattedCreatedAt = useMemo(() => formatDate(project?.createdAt, true), [project?.createdAt]);
  const formattedDeadline = useMemo(() => {
    if (!project?.deadline) return "Not set";
    return formatDate(project.deadline, false);
  }, [project?.deadline]);

  const statusPill = useMemo(() => {
    const status = project?.status?.toUpperCase?.();
    if (!status) return null;

    const klass =
      status === "COMPLETED"
        ? "bg-[#A1BC98]/30 text-[#4A5D23]"
        : status === "ONGOING"
          ? "bg-[#D2DCB6] text-[#778873]"
          : "bg-slate-100 text-slate-500";

    const label = status.charAt(0) + status.slice(1).toLowerCase();
    return <span className={`text-sm px-3 py-1 rounded-full whitespace-nowrap ${klass}`}>{label}</span>;
  }, [project?.status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] flex items-center justify-center p-6">
        <div className="text-[#778873] text-xl font-semibold animate-pulse">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-sm border border-[#F8D7DA] text-red-600 px-4 py-3 rounded-xl shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] flex items-center justify-center p-6">
        <div className="text-[#778873] text-xl font-semibold">No project data found.</div>
      </div>
    );
  }

  console.log("Project D ata: ", project);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] p-6 relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A1BC98] rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#778873] rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm border border-[#D2DCB6] p-6 rounded-xl shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-[#778873]">
              {project.name ?? "Untitled Project"}
            </h1>
            {statusPill}
          </div>

          <p className="text-[#778873]/80 mb-6 text-lg">
            {project.description ?? "No description provided."}
          </p>

          <div className="flex flex-wrap gap-8 text-[#778873]">

            <p>
              <strong>Created By:</strong>
              {project.creator?.name}
            </p>

            <p>
              <strong>Created:</strong> {formattedCreatedAt}
            </p>
            <p>
              <strong>Deadline:</strong> {formattedDeadline}
            </p>
            {/* TODO: Replace 0/None with real counts/members once available */}
            <p>
              <strong>Completed Tasks:</strong> 0
            </p>
            <p>
              <strong>Pending Tasks:</strong> 0
            </p>
            <p>
              <strong>Assigned Members:</strong> None
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-[#778873] mt-8">Project Tasks</h2>
        <TaskBoard projectId={projectId!} />
      </div>
    </div>
  );
}