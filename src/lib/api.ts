const BASE_URL = "http://localhost:5000/api";

export async function getProjects() {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function updateProjectStatus(id : string, status : string){
    const res = await fetch("");
    if(!res.ok)  new Error("Failed to fetch projects");
    return res.json();
}


