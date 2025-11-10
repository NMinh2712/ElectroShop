"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  if (!user || user.roleId !== 1) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">Only administrators can manage users.</p>
        </div>
      </AdminLayout>
    )
  }

  // Note: Users management would require additional API endpoints for listing users
  // For now, showing the structure

  return (
    <AdminLayout>
      <div className="p-8">
        <Link href="/admin" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ChevronLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Staff & Admin</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <Card className="overflow-hidden">
          <div className="text-center py-12 text-muted-foreground">
            <p>User management requires additional backend endpoints</p>
            <p className="text-sm mt-2">Please configure the API for user listing and management</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
