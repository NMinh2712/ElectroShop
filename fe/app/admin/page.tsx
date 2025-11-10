"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    completedOrders: 0,
    pendingOrders: 0,
    revenueThisMonth: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || (user.roleId !== 1 && user.roleId !== 2)) {
      router.push("/")
      return
    }

    const fetchData = async () => {
      try {
        const ordersRes = await apiClient.adminGetOrders(0, 8)
        const productsRes = await apiClient.adminGetProducts(0, 100)

        if (ordersRes.success && productsRes.success) {
          const orders = ordersRes.data.orders || []
          const products = productsRes.data.products || []

          const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
          const completedOrders = orders.filter((o) => o.status === "DELIVERED").length
          const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length

          setStats({
            totalRevenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalUsers: 0, // Would require separate API call
            completedOrders,
            pendingOrders,
            revenueThisMonth: totalRevenue, // Simplified - backend should filter by month
          })
          setRecentOrders(orders)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!user || (user.roleId !== 1 && user.roleId !== 2)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  const isAdmin = user.roleId === 1

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{isAdmin ? "Admin Dashboard" : "Staff Dashboard"}</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}. Here's your business overview.</p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Revenue</h3>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">${(stats.totalRevenue / 1000000).toFixed(0)}M</p>
            <p className="text-xs text-muted-foreground mt-2">Lifetime earnings</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Orders</h3>
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedOrders} completed, {stats.pendingOrders} pending
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Products</h3>
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
            <p className="text-xs text-muted-foreground mt-2">In catalog</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Users</h3>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-2">Active customers</p>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full justify-between bg-transparent">
                  <span className="flex items-center gap-2">
                    <Package size={18} />
                    Manage Products
                  </span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full justify-between bg-transparent">
                  <span className="flex items-center gap-2">
                    <ShoppingCart size={18} />
                    View Orders
                  </span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
              {isAdmin && (
                <>
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <span className="flex items-center gap-2">
                        <Users size={18} />
                        Manage Users
                      </span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link href="/admin/promotions">
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <span className="flex items-center gap-2">
                        <BarChart3 size={18} />
                        Promotions
                      </span>
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
                >
                  <div>
                    <p className="font-semibold">Order #{order.orderId}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.userName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.totalPrice?.toLocaleString("vi-VN")} VND</p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        order.status === "DELIVERED"
                          ? "bg-accent/10 text-accent"
                          : order.status === "SHIPPED"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">This Month Revenue</p>
              <p className="text-2xl font-bold">${(stats.revenueThisMonth / 1000000).toFixed(0)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Order Value</p>
              <p className="text-2xl font-bold">
                ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders / 1000000).toFixed(0) : 0}M
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold text-primary">{stats.pendingOrders}</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
