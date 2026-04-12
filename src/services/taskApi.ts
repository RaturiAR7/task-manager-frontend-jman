import { Task } from "../types/task";
import { apiClient } from "./apiClient";

export const taskApi = {

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return apiClient<Task[]>(`/projects/${projectId}/tasks`, {
      method: "GET",
    });
  },

  async getMyTasks(): Promise<Task[]> {
    return apiClient<Task[]>(`/projects/tasks`, {
      method: "GET",
    });
  },

  async createTask(
    projectId: string,
    task: { title: string; description?: string; userId?: string }
  ): Promise<Task> {
    const response = await apiClient<Task | { message: string; task: Task }>(
      `/projects/${projectId}/tasks`,
      {
        method: "POST",
        body: JSON.stringify(task),
      }
    );

    // Handle wrapped { message, task } response from backend
    if (response && typeof response === "object" && "task" in response) {
      return (response as { message: string; task: Task }).task;
    }

    return response as Task;
  },

  async updateTask(
    taskId: string,
    updates: { status?: Task["status"]; priority?: string }
  ): Promise<Task> {
    const response = await apiClient<Task | { message: string; task: Task }>(
      `/projects/tasks/${taskId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );

    if (response && typeof response === "object" && "task" in response) {
      return (response as { message: string; task: Task }).task;
    }

    return response as Task;
  },

  async deleteTask(taskId: string): Promise<void> {
    await apiClient<void>(`/projects/tasks/${taskId}`, {
      method: "DELETE",
    });
  },

};