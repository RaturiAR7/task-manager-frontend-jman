"use client";

import { useDroppable } from "@dnd-kit/core";
import ProjectCard from "./ProjectCard";
import Project from "@/src/types/project";

type Props = {
    id : string;
    title : string;
    projects : Project[];
}

const StatusColumn = ({id, title, projects} : Props) => {
    const {setNodeRef} = useDroppable({id});
  return (
    <div ref={setNodeRef} className="flex gap-5">
        <h2 className="font-bold mb-4">{title}</h2>
        {
            projects.map(project => (
                <ProjectCard key={project.id} project={project}/>
            ))
        }
    </div>
  )
}

export default StatusColumn