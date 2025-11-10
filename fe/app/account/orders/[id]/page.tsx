"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft, Package, Loader2 } from "lucide-react"
import type { Order } from "@/lib/types"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getUserOrderById(parseInt(id))
        if (response.success) {
          setOrder(response.data)
        } else {
          setError("Order not found")
        }
      } catch (err: any) {
        setError(err.message || "Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [isAuthenticated, router, id])

  const handleCancel = async () => {
    const reason = prompt("Please provide a reason for cancellation:")
    if (!reason) return

    setCancelling(true)
    try {
      const response = await apiClient.cancelOrder(parseInt(id), reason)
      if (response.success) {
        setOrder({ ...order!, status: "CANCELLED" })
      } else {
        setError(response.message || "Failed to cancel order")
      }
    } catch (err: any) {
      setError(err.message || "Failed to cancel order")
    } finally {
      setCancelling(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Loading order...</h1>
        </div>
        <Footer />
      </>
    )
  }

  if (error && !order) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link href="/account/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  if (!order) {
    return null
  }

  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED"

  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/account/orders" className="flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft size={16} />
            Back to Orders
          </Link>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
              <p className="text-muted-foreground mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div
              className={`inline-block text-sm font-semibold px-4 py-2 rounded ${
                order.status === "DELIVERED"
                  ? "bg-accent/10 text-accent"
                  : order.status === "SHIPPED"
                    ? "bg-primary/10 text-primary"
                    : order.status === "CANCELLED"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              {order.statusName || order.status}
            </div>
          </div>

          {error && (
            <Card className="p-4 mb-6 bg-destructive/10 border border-destructive/30 text-destructive">{error}</Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Items</h2>
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 pb-4 border-b last:border-0">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.productName}</h3>
                          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                          <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.unitPrice?.toLocaleString("vi-VN")} VND</p>
                          <p className="text-sm text-muted-foreground">Subtotal: {item.subtotal?.toLocaleString("vi-VN")} VND</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No items found</p>
                )}
              </Card>

              {order.note && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-2">Order Note</h2>
                  <p className="text-muted-foreground">{order.note}</p>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  {order.shippingAddress && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                      <p className="font-medium">{order.shippingAddress}</p>
                    </div>
                  )}

                  {order.payment && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <p className="font-medium">{order.payment.paymentMethod}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Status: <span className={order.payment.paymentStatus === "PAID" ? "text-accent" : "text-muted-foreground"}>{order.payment.paymentStatus}</span>
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{order.totalPrice?.toLocaleString("vi-VN")} VND</span>
                    </div>
                  </div>

                  {canCancel && (
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={handleCancel}
                      disabled={cancelling}
                    >
                      {cancelling ? "Cancelling..." : "Cancel Order"}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

