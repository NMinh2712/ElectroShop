"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { useMockData } from "@/hooks/use-mock"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Eye } from "lucide-react"

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const { orders, updateOrderStatus } = useMockData()
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        </div>
      </AdminLayout>
    )
  }

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus)

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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
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
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-semibold">#{order.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-right font-bold">{order.total.toLocaleString()} VND</td>
                    <td className="px-6 py-4">
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) =>
                          updateOrderStatus(
                            order.id,
                            newStatus as "pending" | "processing" | "shipped" | "delivered" | "canceled",
                          )
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{order.createdAt.toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No orders found.</div>}
        </Card>

        {/* Order Details */}
        {selectedOrder && (
          <div className="mt-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Details: #{selectedOrder}</h2>
              {orders
                .find((o) => o.id === selectedOrder)
                ?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b">
                    <span>{item.productName}</span>
                    <span className="font-semibold">
                      {item.price.toLocaleString()} VND x {item.quantity}
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
