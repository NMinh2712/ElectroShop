"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  register: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string): Promise<User> => {
    // Mock authentication - in production this would call an API
    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && password === "password") {
      setUser(foundUser)
      return foundUser
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
  }

  const register = async (data: any) => {
    // Mock registration
    const newUser: User = {
      id: "user" + Date.now(),
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: "user",
      createdAt: new Date(),
    }
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
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
