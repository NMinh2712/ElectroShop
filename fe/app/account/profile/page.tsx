"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    shippingAddress: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await apiClient.getUserProfile()
        if (response.success) {
          setProfile(response.data)
          setFormData({
            name: response.data.name || "",
            phone: response.data.phone || "",
            shippingAddress: response.data.shippingAddress || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await apiClient.updateUserProfile(formData)
      if (response.success) {
        setProfile(response.data)
        setSuccess("Profile updated successfully")
        setEditing(false)
      } else {
        setError(response.message)
      }
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <>
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/account" className="flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft size={16} />
            Back to Account
          </Link>

          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          {error && (
            <Card className="p-4 mb-6 bg-destructive/10 border border-destructive/30 text-destructive">{error}</Card>
          )}

          {success && <Card className="p-4 mb-6 bg-accent/10 border border-accent/30 text-accent">{success}</Card>}

          <Card className="p-8">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Shipping Address</label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-semibold text-lg">{profile?.email}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <p className="font-semibold text-lg">{profile?.name || "Not provided"}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <p className="font-semibold text-lg">{profile?.phone || "Not provided"}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Shipping Address</label>
                  <p className="font-semibold text-lg">{profile?.shippingAddress || "Not provided"}</p>
                </div>

                <Button onClick={() => setEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
