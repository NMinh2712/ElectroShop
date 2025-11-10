"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Eye, Loader2 } from "lucide-react"

const ORDER_STATUSES = {
  1: "PENDING",
  2: "CONFIRMED",
  3: "PROCESSING",
  4: "SHIPPED",
  5: "DELIVERED",
  6: "CANCELLED",
  7: "REFUNDED",
}

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const statusId = filterStatus === "all" ? undefined : Number.parseInt(filterStatus)
        const response = await apiClient.adminGetOrders(page, 10, statusId)
        if (response.success) {
          setOrders(response.data.orders || [])
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [page, filterStatus])

  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    try {
      const response = await apiClient.adminUpdateOrderStatus(orderId, newStatusId)
      if (response.success) {
        setOrders(orders.map((o) => (o.orderId === orderId ? { ...o, statusId: newStatusId } : o)))
      }
    } catch (err: any) {
      setError(err.message || "Failed to update order status")
    }
  }

  const handleViewDetails = async (orderId: number) => {
    if (selectedOrder?.orderId === orderId) {
      setSelectedOrder(null)
      return
    }

    try {
      const response = await apiClient.adminGetOrderById(orderId)
      if (response.success) {
        setSelectedOrder(response.data)
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch order details")
    }
  }

  if (!user || (user.roleId !== 1 && user.roleId !== 2)) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <Link href="/admin" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ChevronLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <div className="w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="1">Pending</SelectItem>
                <SelectItem value="2">Confirmed</SelectItem>
                <SelectItem value="3">Processing</SelectItem>
                <SelectItem value="4">Shipped</SelectItem>
                <SelectItem value="5">Delivered</SelectItem>
                <SelectItem value="6">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-6 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold">Order ID</th>
                    <th className="text-left px-6 py-3 font-semibold">Items</th>
                    <th className="text-right px-6 py-3 font-semibold">Total</th>
                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                    <th className="text-left px-6 py-3 font-semibold">Date</th>
                    <th className="text-center px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId} className="border-b hover:bg-muted/50 transition">
                      <td className="px-6 py-4 font-semibold">#{order.orderId}</td>
                      <td className="px-6 py-4 text-muted-foreground">{order.itemCount || 0} items</td>
                      <td className="px-6 py-4 text-right font-bold">{order.totalPrice?.toLocaleString()} VND</td>
                      <td className="px-6 py-4">
                        <Select
                          value={order.statusId.toString()}
                          onValueChange={(newStatus) => handleStatusChange(order.orderId, Number.parseInt(newStatus))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Pending</SelectItem>
                            <SelectItem value="2">Confirmed</SelectItem>
                            <SelectItem value="3">Processing</SelectItem>
                            <SelectItem value="4">Shipped</SelectItem>
                            <SelectItem value="5">Delivered</SelectItem>
                            <SelectItem value="6">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(order.orderId)}>
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No orders found.</div>
          )}
        </Card>

        {/* Order Details */}
        {selectedOrder && (
          <div className="mt-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Details: #{selectedOrder.orderId}</h2>
              {selectedOrder.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <span>{item.productName}</span>
                  <span className="font-semibold">
                    {item.unitPrice?.toLocaleString()} VND x {item.quantity}
                  </span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
