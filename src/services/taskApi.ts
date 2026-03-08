import { tasks } from "../mocks/tasks"
import { Task } from "../types/task"
import { apiClient } from "./apiClient"

const USE_MOCK = true

export const taskApi = {

  async getTasksByProject(projectId: string): Promise<Task[]> {

    if (USE_MOCK) {
      return new Promise(resolve =>
        setTimeout(() => {
          resolve(tasks.filter(t => t.projectId === projectId))
        }, 300)
      )
    }

    return apiClient<Task[]>(`/projects/${projectId}/tasks`)
  },

  async createTask(task: Task): Promise<Task> {

    if (USE_MOCK) {
      return {
        ...task,
        id: Date.now().toString()
      }
    }

    return apiClient<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(task)
    })
  },

  async updateTask(taskId: string, updates: Partial<Task>) {

    if (USE_MOCK) {
      return { taskId, ...updates }
    }

    return apiClient(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(updates)
    })
  }

}