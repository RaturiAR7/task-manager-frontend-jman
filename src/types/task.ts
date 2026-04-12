export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: string;   // userId (string), matches backend `assignedTo`
  createdBy?: string;
  priority?: string;
  createdAt?: string;
}