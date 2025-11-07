"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    try {
      await register(formData)
      setSuccess(true)
      setTimeout(() => router.push("/"), 2000)
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white mx-auto mb-4">
              <span className="font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join TPF Shop today</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto mb-4 text-accent" />
              <h2 className="text-lg font-semibold mb-2">Account Created!</h2>
              <p className="text-muted-foreground">Redirecting to home...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex gap-2 text-sm text-destructive">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912345678"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <Button className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
