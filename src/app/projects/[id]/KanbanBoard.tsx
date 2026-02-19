"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { SortableTask } from "./SortableTask";

interface Task {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
}

interface KanbanProps {
  tasks: Task[];
}

const statusConfig = {
  "To Do": { bg: "#F1F3E0", text: "#778873", border: "#D2DCB6" },
  "In Progress": { bg: "#D2DCB6", text: "#778873", border: "#A1BC98" },
  "Done": { bg: "#A1BC98", text: "white", border: "#778873" },
};

export default function KanbanBoard({ tasks }: KanbanProps) {
  const [board, setBoard] = useState<Record<string, Task[]>>({
    "To Do": tasks.filter((t) => t.status === "To Do"),
    "In Progress": tasks.filter((t) => t.status === "In Progress"),
    "Done": tasks.filter((t) => t.status === "Done"),
  });

  const statuses = ["To Do", "In Progress", "Done"];

  // Define sensors inside the component
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    let sourceCol = "";
    let destCol = "";
    for (const col of statuses) {
      if (board[col].find((t) => t.id === active.id)) sourceCol = col;
      if (board[col].find((t) => t.id === over.id)) destCol = col;
    }

    if (!sourceCol || !destCol) return;

    if (sourceCol === destCol) {
      const items = Array.from(board[sourceCol]);
      const oldIndex = items.findIndex((t) => t.id === active.id);
      const newIndex = items.findIndex((t) => t.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setBoard({ ...board, [sourceCol]: newItems });
    } else {
      const sourceItems = Array.from(board[sourceCol]);
      const destItems = Array.from(board[destCol]);
      const movingTaskIndex = sourceItems.findIndex((t) => t.id === active.id);
      const [movingTask] = sourceItems.splice(movingTaskIndex, 1);
      movingTask.status = destCol as Task["status"];
      destItems.splice(0, 0, movingTask);
      setBoard({ ...board, [sourceCol]: sourceItems, [destCol]: destItems });
    }
  };

  const addTask = (status: string) => {
    const title = prompt("Enter task title:");
    if (!title) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: status as Task["status"],
    };
    
    setBoard({
      ...board,
      [status]: [...board[status], newTask],
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map((status) => (
          <div 
            key={status} 
            className="rounded-xl min-h-[400px] flex flex-col"
            style={{ backgroundColor: statusConfig[status as keyof typeof statusConfig].bg + '40' }}
          >
            {/* Column Header */}
            <div 
              className="p-4 rounded-t-xl flex justify-between items-center"
              style={{ 
                backgroundColor: statusConfig[status as keyof typeof statusConfig].bg,
                borderBottom: `2px solid ${statusConfig[status as keyof typeof statusConfig].border}`
              }}
            >
              <h3 className="font-semibold" style={{ color: statusConfig[status as keyof typeof statusConfig].text }}>
                {status} ({board[status].length})
              </h3>
              <button
                onClick={() => addTask(status)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                style={{ color: statusConfig[status as keyof typeof statusConfig].text }}
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Tasks Container */}
            <div className="p-3 flex-1">
              <SortableContext items={board[status].map(task => task.id)} strategy={verticalListSortingStrategy}>
                {board[status].map((task) => (
                  <SortableTask key={task.id} task={task} />
                ))}
              </SortableContext>
              
              {board[status].length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-[#D2DCB6] rounded-lg">
                  No tasks yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}