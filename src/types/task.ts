export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: number;
}