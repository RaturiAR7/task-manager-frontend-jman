const BASE_URL = "http://localhost:5000"

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      (headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }
  console.log("Endpoint ",endpoint)
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  // Add support for 204 No Content which don't return JSON
  if (response.status === 204) {
    return {} as T;
  }

  if (!response.ok) {
    throw new Error("API request failed")
  }

  return response.json()
}