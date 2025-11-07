"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Bell, Lock, Palette, Database } from "lucide-react"

export default function AdminSettingsPage() {
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    return null
  }

  const settings = [
    {
      icon: <Bell size={24} />,
      title: "Notifications",
      description: "Manage email and push notifications",
    },
    {
      icon: <Lock size={24} />,
      title: "Security",
      description: "Change password and security settings",
    },
    {
      icon: <Palette size={24} />,
      title: "Appearance",
      description: "Customize dashboard theme",
    },
    {
      icon: <Database size={24} />,
      title: "Data",
      description: "Backup and export data",
    },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <Link href="/admin" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ChevronLeft size={18} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings.map((setting, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">{setting.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{setting.title}</h3>
                  <p className="text-muted-foreground text-sm">{setting.description}</p>
                  <Button variant="ghost" size="sm" className="mt-4">
                    Configure
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
