import { Project } from "../types/project";
import { apiClient } from "./apiClient";

export const projectApi = {

  async getProjects(): Promise<Project[]> {
    return apiClient<Project[]>("/projects", {
      method: "GET"
    });
  },

  async getProject(id: string): Promise<Project> {
    const response = await apiClient<{ message: string; project: Project }>(
      `/projects/${id}`,
      { method: "GET" }
    );

    return response.project;
  },


  async createProject(
    project: Omit<Project, "id" | "createdAt">
  ): Promise<Project> {
    const response = await apiClient<Project | { message: string; project: Project }>("/projects", {
      method: "POST",
      body: JSON.stringify(project)
    });

    // Handle both wrapped { project: {...} } and direct Project responses
    if (response && typeof response === "object" && "project" in response) {
      return (response as { message: string; project: Project }).project;
    }

    return response as Project;
  },

  async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<Project> {
    return apiClient<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates)
    });
  },

  async deleteProject(id: string): Promise<void> {
    return apiClient<void>(`/projects/${id}`, {
      method: "DELETE"
    });
  },

  async addMember(projectId: string, userId: string): Promise<void> {
    return apiClient<void>(`/projects/${projectId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId })
    });
  },

  async getMembers(projectId: string): Promise<any[]> {
    const response = await apiClient<{ members: any[] } | any[]>(`/projects/${projectId}/members`, {
      method: "GET"
    });
    // API returns { members: [...] } — unwrap it
    if (response && !Array.isArray(response) && "members" in (response as any)) {
      return (response as { members: any[] }).members;
    }
    return response as any[];
  },

  async removeMember(projectId: string, userId: string): Promise<void> {
    return apiClient<void>(`/projects/${projectId}/members/${userId}`, {
      method: "DELETE"
    });
  }

};