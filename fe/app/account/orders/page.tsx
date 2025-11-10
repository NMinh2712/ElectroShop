"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft, Package } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await apiClient.getUserOrders(currentPage, itemsPerPage)
        if (response.success) {
          setOrders(response.data.orders || [])
          setTotalPages(response.data.totalPages || 0)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, router, currentPage])

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

  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/account" className="flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft size={16} />
            Back to Account
          </Link>

          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to create your first order</p>
              <Link href="/products">
                <button className="text-primary hover:underline font-semibold">Browse Products</button>
              </Link>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link key={order.orderId} href={`/account/orders/${order.orderId}`} className="block">
                    <Card className="p-6 hover:shadow-lg transition">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-semibold">#{order.orderId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-semibold">{order.totalPrice?.toLocaleString("vi-VN")} VND</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <div
                            className={`inline-block text-xs font-semibold px-3 py-1 rounded ${
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
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-input rounded-lg hover:bg-muted disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === page ? "bg-primary text-primary-foreground" : "border-input hover:bg-muted"
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 border border-input rounded-lg hover:bg-muted disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
