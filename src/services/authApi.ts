import { User } from "../types/user"
import { apiClient } from "./apiClient"

interface LoginResponse {
  token: string
}

interface RegisterResponse {
  message?: string
}

export const authApi = {

  async register(data: any): Promise<RegisterResponse> {
    return apiClient<RegisterResponse>("/user/register", {
      method: "POST",
      body: JSON.stringify(data)
    })
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient<LoginResponse>("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })
  },

  // Returns all users with safe fields only — accessible to any authenticated user
  async getAllUsers(): Promise<User[]> {
    return apiClient<User[]>("/user/users", {
      method: "GET"
    })
  },

  // Returns the current logged-in user's profile from JWT
  async getMe(): Promise<User> {
    return apiClient<User>("/user/me", {
      method: "GET"
    })
  }
}