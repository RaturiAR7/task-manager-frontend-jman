"use client";

import { updateProjectStatus } from "@/src/lib/api";
import { DndContext } from "@dnd-kit/core";
import StatusColumn from "./StatusColumn";
import Project from "../../types/project";

type StatusColumnProps = {
    id: string;
    title: string;
    projects: Project[];
}


const DashboardBoard = ({projects}: {projects : Project[]}) => {
  async function handleDragEnd(event : any){
    // dnd-kit provides us two things
    // active -> what you dragged
    // over -> what you dropped
    const {active, over} = event;
    if(!over){
        return;
        // if dragged outside simply return
    }

    const projectId = active.id;
    const newStatus = over.id;
    // updating the status in our database
    await updateProjectStatus(projectId, newStatus);
  }    
  return (
    <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-5">
            <StatusColumn 
                id = "pending" title = "pending"
                projects = {projects.filter(p => p.status === "pending")}
            />

            <StatusColumn 
                id = "ongoing" title = "ongoing"
                projects = {projects.filter(p => p.status === "ongoing")}
            />

            <StatusColumn 
                id = "" title = "completed"
                projects = {projects.filter(p => p.status === "completed")}
            />
        </div>

    </DndContext>
  )
}

export default DashboardBoard