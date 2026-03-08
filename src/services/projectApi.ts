import { Project } from "../types/project";
import { projects } from "../mocks/projects";

export const projectApi = {

  async getProjects(): Promise<Project[]> {
    return projects;
  },

  async getProject(id: string): Promise<Project | undefined> {

    const allProjects = await this.getProjects();

    return allProjects.find((project) => project.id === id);

  },

  async createProject(
    project: Omit<Project, "id" | "createdAt">
  ): Promise<Project> {

    const newProject: Project = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...project
    };

    projects.push(newProject);

    return newProject;
  }

};