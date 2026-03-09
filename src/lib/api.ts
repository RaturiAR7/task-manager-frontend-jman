const BASE_URL = "http://localhost:5000";

export async function getProjects() {
  const res = await fetch(`${BASE_URL}/projects`, {
    headers: {
      "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function updateProjectStatus(id : string, status : string){
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`
      },
      body: JSON.stringify({ status })
    });
    if(!res.ok) throw new Error("Failed to update project status");
    return res.json();
}
