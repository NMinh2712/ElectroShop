"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Search, ShoppingCart, Menu, X } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount] = useState(2)

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">T</div>
            TPF Shop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-foreground hover:text-primary transition">
              Products
            </Link>
            <Link href="/promotions" className="text-foreground hover:text-primary transition">
              Promotions
            </Link>
            <Link href="/support" className="text-foreground hover:text-primary transition">
              Support
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-muted rounded-lg px-3 py-2 gap-2 flex-1 max-w-xs">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>

            <Link href="/cart" className="relative hover:text-primary transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/account" className="flex items-center gap-2 hover:text-primary transition">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button>Login</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t pt-4">
            <Link href="/products" className="block py-2 hover:text-primary transition">
              Products
            </Link>
            <Link href="/promotions" className="block py-2 hover:text-primary transition">
              Promotions
            </Link>
            <Link href="/support" className="block py-2 hover:text-primary transition">
              Support
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
