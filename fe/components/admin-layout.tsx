"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminNavbar } from "@/components/admin-navbar"

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== "admin" && user.role !== "staff")) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user || (user.role !== "admin" && user.role !== "staff")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
