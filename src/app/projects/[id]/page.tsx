interface Project {
  id: string;
  name: string;
  employer: string;
  status: "Not Started" | "In Progress" | "Completed";
  description: string;
  startDate: string;
  endDate: string;
  teamSize: number;
  tasks: { total: number; completed: number };
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const projectId = params.id;

  // Simple project data
  const project: Project = {
    id: projectId,
    name: "Project Alpha",
    employer: "Alice Johnson",
    status: "In Progress",
    description: "A collaborative internal project management platform that helps teams track progress and manage tasks efficiently.",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    teamSize: 8,
    tasks: { total: 24, completed: 15 }
  };

  const completionRate = Math.round((project.tasks.completed / project.tasks.total) * 100);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Not Started": return "bg-[#D2DCB6] text-[#778873]";
      case "In Progress": return "bg-[#A1BC98] text-white";
      case "Completed": return "bg-[#778873] text-white";
      default: return "bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] via-white to-[#D2DCB6] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <a href="/projects" className="inline-block text-[#778873] hover:text-[#A1BC98] mb-6">
          ← Back to Projects
        </a>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md border border-[#D2DCB6] p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#778873] mb-2">{project.name}</h1>
              <p className="text-gray-600">Employer: {project.employer}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 pb-6 border-b border-[#D2DCB6]">{project.description}</p>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#F1F3E0] p-4 rounded-lg">
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="text-lg font-semibold text-[#778873]">{project.startDate}</p>
            </div>
            <div className="bg-[#F1F3E0] p-4 rounded-lg">
              <p className="text-sm text-gray-600">End Date</p>
              <p className="text-lg font-semibold text-[#778873]">{project.endDate}</p>
            </div>
            <div className="bg-[#F1F3E0] p-4 rounded-lg">
              <p className="text-sm text-gray-600">Team Size</p>
              <p className="text-lg font-semibold text-[#778873]">{project.teamSize}</p>
            </div>
            <div className="bg-[#F1F3E0] p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tasks</p>
              <p className="text-lg font-semibold text-[#778873]">{project.tasks.completed}/{project.tasks.total}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-[#778873]">Overall Progress</span>
              <span className="text-sm font-medium text-[#A1BC98]">{completionRate}%</span>
            </div>
            <div className="w-full bg-[#D2DCB6] rounded-full h-4">
              <div 
                className="bg-[#A1BC98] h-4 rounded-full"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}