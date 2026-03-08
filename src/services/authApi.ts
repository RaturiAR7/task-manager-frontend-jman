import { users } from "../mocks/users"
import { User } from "../types/user"
import { apiClient } from "./apiClient"

const USE_MOCK = true

interface LoginResponse {
  token: string
  user: User
}

export const authApi = {

  async login(email: string, password: string): Promise<LoginResponse> {

    if (USE_MOCK) {

      const user = users.find(
        u => u.email === email && u.password === password
      )

      if (!user) {
        throw new Error("Invalid credentials")
      }

      const { password: _, ...userData } = user

      return {
        token: "mock-token",
        user: userData
      }
    }

    return apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })
  }

}