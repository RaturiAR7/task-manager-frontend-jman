"use client";

import { useParams } from "next/navigation";

export default function TaskDetailsPage() {

  const params = useParams();
  const taskId = params.taskId;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Task Details
      </h1>

      <p>Task ID: {taskId}</p>

    </div>
  );
}