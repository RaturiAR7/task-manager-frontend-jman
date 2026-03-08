const BASE_URL = "http://localhost:5000/api"

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  })

  if (!response.ok) {
    throw new Error("API request failed")
  }

  return response.json()
}