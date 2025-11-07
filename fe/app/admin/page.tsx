"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockProducts, mockOrders, mockUsers } from "@/lib/mock-data"
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
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

  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = mockOrders.length
  const completedOrders = mockOrders.filter((o) => o.status === "delivered").length
  const totalProducts = mockProducts.length
  const totalUsers = mockUsers.filter((u) => u.role === "user").length
  const lowStockProducts = mockProducts.filter((p) => p.stock < 10).length

  // Calculate order statistics
  const revenueThisMonth = mockOrders
    .filter((o) => {
      const today = new Date()
      const orderDate = o.createdAt
      return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear()
    })
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrders = mockOrders.filter((o) => o.status !== "delivered").length

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{user.role === "admin" ? "Admin Dashboard" : "Staff Dashboard"}</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}. Here's your business overview.</p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Revenue</h3>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Lifetime earnings</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Orders</h3>
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{totalOrders}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {completedOrders} completed, {pendingOrders} pending
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Products</h3>
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{totalProducts}</p>
            <p className="text-xs text-muted-foreground mt-2">{lowStockProducts} low stock items</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Total Users</h3>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{totalUsers}</p>
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
              {user.role === "admin" && (
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
              {mockOrders.slice(0, 8).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition"
                >
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.createdAt.toLocaleDateString()} • {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total}</p>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        order.status === "delivered"
                          ? "bg-accent/10 text-accent"
                          : order.status === "shipped"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue Overview */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">This Month Revenue</p>
              <p className="text-2xl font-bold">${revenueThisMonth.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">
                {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Order Value</p>
              <p className="text-2xl font-bold">${totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold text-primary">{pendingOrders}</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
