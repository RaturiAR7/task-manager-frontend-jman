"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User } from "../types/user"
import { authApi } from "../services/authApi"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    localStorage.setItem("token", response.token)

    try {
      // Use /user/me to get the current user's profile — works for ALL roles
      const currentUser = await authApi.getMe()
      if (currentUser) {
        setUser(currentUser)
        localStorage.setItem("user", JSON.stringify(currentUser))
      }
    } catch (error) {
      console.error("Failed to fetch user details after login", error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}