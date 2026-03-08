import { Task } from "../types/task";

export const tasks: Task[] = [
  {
    id: "1",
    projectId: "p1",
    title: "Create Login Page",
    description: "Implement authentication UI",
    status: "todo"
  },
  {
    id: "2",
    projectId: "p1",
    title: "Build Kanban Board",
    description: "Implement board UI",
    status: "in-progress"
  },
  {
    id: "3",
    projectId: "p2",
    title: "Landing Page Design",
    description: "Design marketing landing page",
    status: "done"
  }
];