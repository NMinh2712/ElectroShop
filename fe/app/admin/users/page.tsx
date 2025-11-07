"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { useMockData } from "@/hooks/use-mock"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Mail, Phone, Calendar, Lock, ToggleLeft as Toggle2, Trash2 } from "lucide-react"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const { users, updateUser, deleteUser } = useMockData()
  const [searchTerm, setSearchTerm] = useState("")

  if (!user || user.role !== "admin") {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">Only administrators can manage users.</p>
        </div>
      </AdminLayout>
    )
  }

  const staffUsers = users.filter((u) => u.role === "staff" || u.role === "admin")
  const filtered = staffUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Name</th>
                  <th className="text-left px-6 py-3 font-semibold">Email</th>
                  <th className="text-left px-6 py-3 font-semibold">Role</th>
                  <th className="text-left px-6 py-3 font-semibold">Phone</th>
                  <th className="text-left px-6 py-3 font-semibold">Joined</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-center px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((staffUser) => (
                  <tr key={staffUser.id} className="border-b hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-semibold">{staffUser.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        {staffUser.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          staffUser.role === "admin"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {staffUser.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        {staffUser.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {staffUser.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          staffUser.isVerified ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {staffUser.isVerified ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateUser(staffUser.id, {
                              isVerified: !staffUser.isVerified,
                            })
                          }
                          title="Toggle status"
                        >
                          <Toggle2 size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" title="Reset password">
                          <Lock size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteUser(staffUser.id)}
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No staff or admin users found.</div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
