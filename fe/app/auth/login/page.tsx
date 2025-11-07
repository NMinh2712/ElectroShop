"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = await login(email, password)

      if (user.role === "admin" || user.role === "staff") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { email: "user@example.com", password: "password", role: "User" },
    { email: "staff@example.com", password: "password", role: "Staff" },
    { email: "admin@example.com", password: "password", role: "Admin" },
  ]

  const handleQuickLogin = (quickEmail: string) => {
    setEmail(quickEmail)
    setPassword("password")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white mx-auto mb-4">
              <span className="font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to TPF Shop</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="border-t pt-6 mb-6">
            <p className="text-xs text-muted-foreground mb-3 font-semibold">Demo Accounts:</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickLogin(account.email)}
                  className="w-full text-left px-3 py-2 border border-border rounded-lg hover:bg-muted transition text-sm"
                >
                  <div className="font-medium">{account.role}</div>
                  <div className="text-xs text-muted-foreground">{account.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
