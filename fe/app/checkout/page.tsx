"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    shippingAddress: user?.shippingAddress || "",
    paymentMethod: "CREDIT_CARD",
    voucherId: undefined as number | undefined,
    note: "",
  })

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-lg font-semibold mb-4">Please log in to checkout</h2>
            <Link href="/auth/login">
              <Button>Go to Login</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const checkoutData = {
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        voucherId: formData.voucherId,
        note: formData.note || undefined,
      }

      const response = await apiClient.checkout(checkoutData)

      if (response.success) {
        router.push(`/account/orders/${response.data.orderId}`)
      } else {
        setError(response.message)
      }
    } catch (error: any) {
      let errorMessage = "Checkout failed"
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.code) {
        errorMessage = `Error ${error.code}: ${error.message || "Checkout failed"}`
      }
      
      setError(errorMessage)
      
      // Better error logging
      console.error("Checkout error:", {
        message: errorMessage,
        code: error?.code,
        status: error?.status,
        originMessage: error?.originMessage,
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

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {error && (
            <Card className="p-4 mb-6 bg-destructive/10 border border-destructive/30 text-destructive">{error}</Card>
          )}

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Shipping Address</label>
                <textarea
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Enter your shipping address"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Voucher ID (Optional)</label>
                <input
                  type="number"
                  value={formData.voucherId || ""}
                  onChange={(e) => setFormData({ ...formData, voucherId: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Enter voucher ID (number)"
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Order Note (Optional)</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Add any special instructions or notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-4">
                <Link href="/cart" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Cart
                  </Button>
                </Link>
                <Button className="flex-1" disabled={loading}>
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
