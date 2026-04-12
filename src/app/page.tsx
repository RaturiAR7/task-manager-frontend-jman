"use client";

import { ArrowRight, Layers, Users, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  return (
    <div className="page-bg relative overflow-hidden">
      {/* Animated glow orbs */}
      <div className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl bg-blue-600 animate-pulse" />
      <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl bg-pink-600 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-4 blur-3xl bg-blue-900" />

      {/* Hero Section */}
      <section className="relative z-10 text-center py-40 px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Modern Project Management
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Manage Projects{" "}
          <br className="hidden md:block" />
          <span className="text-pink-400">Without the Chaos</span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
          A collaborative internal platform to create projects, assign tasks,
          and track progress using intuitive Kanban boards.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/auth")}
            className="glow-btn inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all"
          >
            Get Started <ArrowRight size={18} />
          </button>
          <button
            onClick={() => router.push("/auth")}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
          >
            Sign In
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-16">
          {[
            { icon: <Layers size={14} />, label: "Kanban Boards" },
            { icon: <Users size={14} />, label: "Team Management" },
            { icon: <BarChart3 size={14} />, label: "Progress Tracking" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/8 bg-white/4 text-white/50 text-sm backdrop-blur-sm"
            >
              <span className="text-blue-400">{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🗂️",
              title: "Project Boards",
              desc: "Organize work across Upcoming, Ongoing, and Completed stages with drag-and-drop ease.",
            },
            {
              icon: "✅",
              title: "Task Management",
              desc: "Create, assign, and move tasks between Todo, In Progress, and Done columns.",
            },
            {
              icon: "👥",
              title: "Team Collaboration",
              desc: "Manage roles, assign members to projects, and track who's working on what.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="glass-card p-6 group hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;