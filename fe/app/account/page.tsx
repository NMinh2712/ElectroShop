"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Package, UserIcon, LogOut, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([apiClient.getUserProfile(), apiClient.getUserOrders(0, 5)])

        if (profileRes.success) {
          setProfile(profileRes.data)
        }
        if (ordersRes.success) {
          setOrders(ordersRes.data.orders || [])
        }
      } catch (error: any) {
        // Better error logging
        const errorMessage = error instanceof Error ? error.message : (error?.message || "Unknown error")
        console.error("Failed to fetch account data:", {
          message: errorMessage,
          code: error?.code,
          status: error?.status,
          error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          } : error,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router])

  if (!isAuthenticated || loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
        <Footer />
      </>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isAdmin = user?.roleId === 1
  const isStaff = user?.roleId === 2

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div>
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {((user?.name || user?.username || user?.email)?.charAt(0) || "U").toUpperCase()}
                  </div>
                  <h2 className="font-bold text-lg">{user?.name || user?.username || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email || "No email"}</p>
                  <div className="mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded w-fit mx-auto">
                    {user?.roleId === 1 ? "Admin" : user?.roleId === 2 ? "Staff" : "User"}
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Link
                    href="/account/profile"
                    className="flex items-center justify-between p-2 hover:bg-muted rounded transition"
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon size={18} />
                      <span>Profile</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center justify-between p-2 hover:bg-muted rounded transition"
                  >
                    <div className="flex items-center gap-2">
                      <Package size={18} />
                      <span>Orders</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                  {(isAdmin || isStaff) && (
                    <Link
                      href="/admin"
                      className="flex items-center justify-between p-2 hover:bg-muted rounded transition text-primary font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon size={18} />
                        <span>{isAdmin ? "Admin" : "Staff"} Panel</span>
                      </div>
                      <ChevronRight size={16} />
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-2 hover:bg-muted rounded transition text-destructive mt-2 pt-4 border-t"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut size={18} />
                      <span>Logout</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* User Info */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Account Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-semibold">{profile?.name || user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-semibold">{profile?.email || user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <p className="font-semibold">{profile?.phone || user?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Shipping Address</label>
                    <p className="font-semibold">{profile?.shippingAddress || "Not provided"}</p>
                  </div>
                </div>
              </Card>

              {/* Recent Orders */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Recent Orders ({orders.length})</h2>
                  <Link href="/account/orders" className="text-primary hover:underline text-sm">
                    View All
                  </Link>
                </div>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Link
                        key={order.orderId}
                        href={`/account/orders/${order.orderId}`}
                        className="border rounded-lg p-4 hover:bg-muted transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Order #{order.orderId}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{order.totalPrice?.toLocaleString("vi-VN")} VND</p>
                            <div
                              className={`text-xs font-semibold px-2 py-1 rounded w-fit mt-1 ${
                                order.status === "DELIVERED"
                                  ? "bg-accent/10 text-accent"
                                  : order.status === "SHIPPED"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {order.status}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
