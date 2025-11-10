"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"
import type { LoginResponse, User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<LoginResponse>
  logout: () => void
  register: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.login(username, password)

      if (response.success) {
        const userData: User = {
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          roleId: response.data.roleId,
          name: response.data.name,
        }
        localStorage.setItem("auth_token", response.data.token)
        localStorage.setItem("auth_user", JSON.stringify(userData))
        setUser(userData)
        return response.data
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (err: any) {
      throw new Error(err.message || "Invalid username or password")
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    setUser(null)
  }

  const register = async (data: any) => {
    try {
      const response = await apiClient.register(data)

      if (response.success) {
        const userData: User = {
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          roleId: 3, // Default to ROLE_USER (3)
          name: response.data.name,
        }
        localStorage.setItem("auth_token", response.data.token || "")
        localStorage.setItem("auth_user", JSON.stringify(userData))
        setUser(userData)
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (err: any) {
      throw new Error(err.message || "Registration failed")
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register }}>
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
