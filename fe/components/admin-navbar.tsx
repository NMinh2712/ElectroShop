"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"

export function AdminNavbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-card sticky top-0 z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-primary">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-sm">T</div>
          TPF Admin
        </Link>

        {/* Right Side - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {((user?.name || user?.username || user?.email)?.charAt(0) || "A").toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">{user?.name || user?.username || "Admin"}</p>
              <p className="text-xs text-muted-foreground">
                {user?.roleId === 1 ? "Admin" : user?.roleId === 2 ? "Staff" : "User"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2 bg-transparent">
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-muted/50 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {((user?.name || user?.username || user?.email)?.charAt(0) || "A").toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">{user?.name || user?.username || "Admin"}</p>
              <p className="text-xs text-muted-foreground">
                {user?.roleId === 1 ? "Admin" : user?.roleId === 2 ? "Staff" : "User"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full gap-2 bg-transparent">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      )}
    </nav>
  )
}
