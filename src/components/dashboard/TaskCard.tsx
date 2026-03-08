"use client";

import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Task {
  id: string;
  title: string;
  status: string;
}

export default function TaskCard({ task }: { task: Task }) {

  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  function openTask() {
    router.push(`/tasks/${task.id}`);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={openTask}
      className="bg-white p-3 rounded shadow mb-3 cursor-pointer"
    >
      {task.title}
    </div>
  );
}