"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"

export default function CartPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const fetchCart = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getCart()
        if (response.success) {
          setCartItems(response.data.items || [])
          setError("")
        } else {
          setError(response.message)
        }
      } catch (error: any) {
        setError("Failed to load cart")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [isAuthenticated, router])

  const handleRemoveItem = async (variantId: number) => {
    try {
      const response = await apiClient.removeFromCart(variantId)
      if (response.success) {
        setCartItems(cartItems.filter((item) => item.variantId !== variantId))
      } else {
        setError(response.message)
      }
    } catch (error: any) {
      setError("Failed to remove item from cart")
      console.error(error)
    }
  }

  const handleUpdateQuantity = async (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveItem(variantId)
      return
    }

    try {
      const response = await apiClient.updateCartQuantity(variantId, quantity)
      if (response.success) {
        setCartItems(response.data.items || [])
      } else {
        setError(response.message)
      }
    } catch (error: any) {
      setError("Failed to update quantity")
      console.error(error)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">Loading cart...</main>
        <Footer />
      </>
    )
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/products" className="flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {error && (
            <Card className="p-4 mb-6 bg-destructive/10 border border-destructive/30 text-destructive">{error}</Card>
          )}

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingCart size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.variantId} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={`http://localhost:8080${item.imageUrl}` || "/placeholder.svg"}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold hover:text-primary transition">{item.productName}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.attributes}</p>
                        <p className="text-sm text-muted-foreground mb-2">SKU: {item.sku}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <span className="text-lg font-bold">{item.price?.toLocaleString("vi-VN")} VND</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.variantId, item.quantity - 1)}
                              className="px-2 py-1 border border-input rounded hover:bg-muted"
                            >
                              -
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                              className="px-2 py-1 border border-input rounded hover:bg-muted"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.variantId)}
                              className="text-destructive hover:text-destructive/80 transition ml-4"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-20">
                  <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Total Items</span>
                      <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{totalPrice?.toLocaleString("vi-VN")} VND</span>
                    </div>
                  </div>
                  <Link href="/checkout" className="block">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
