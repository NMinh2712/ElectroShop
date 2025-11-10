"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  BarChart3,
  HelpCircle,
  Settings,
  LogOut,
  FolderTree,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Products", href: "/admin/products", icon: <Package size={20} /> },
    { label: "Categories", href: "/admin/categories", icon: <FolderTree size={20} />, adminOnly: true },
    { label: "Orders", href: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { label: "Users", href: "/admin/users", icon: <Users size={20} />, adminOnly: true },
    { label: "Promotions", href: "/admin/promotions", icon: <Ticket size={20} />, adminOnly: true },
    { label: "FAQs", href: "/admin/faqs", icon: <HelpCircle size={20} />, adminOnly: true },
    { label: "Support", href: "/admin/support", icon: <BarChart3 size={20} /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings size={20} />, adminOnly: true },
  ]

  const filteredItems = navItems.filter((item) => !item.adminOnly || user?.roleId === 1)

  return (
    <aside className="w-64 bg-muted/30 border-r border-border h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-primary">ElectroShop</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {user?.roleId === 1 ? "ADMIN" : user?.roleId === 2 ? "STAFF" : "USER"} Panel
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/30">
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent"
          onClick={() => {
            logout()
            window.location.href = "/"
          }}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
