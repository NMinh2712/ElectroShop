"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProductReviews } from "@/components/product-reviews"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { Star, Heart, Share2, ShoppingCart, ChevronLeft, Loader2 } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/types"

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getProductBySlug(slug)
        if (response.success) {
          const productData = response.data
          setProduct(productData)
          if (productData.variants && productData.variants.length > 0) {
            const activeVariant = productData.variants.find((v: ProductVariant) => v.isActive) || productData.variants[0]
            setSelectedVariant(activeVariant)
          }
        } else {
          setError("Product not found")
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (!selectedVariant) {
      setError("Please select a variant")
      return
    }

    setAddingToCart(true)
    setError("")

    try {
      const response = await apiClient.addToCart(selectedVariant.variantId, quantity)
      if (response.success) {
        setCartAdded(true)
        setTimeout(() => setCartAdded(false), 2000)
        setQuantity(1)
      } else {
        setError(response.message || "Failed to add to cart")
      }
    } catch (err: any) {
      setError(err.message || "Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setQuantity(1)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading product...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (error && !product) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return null
  }

  const maxStock = selectedVariant?.stock || 0

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Link href="/products" className="flex items-center gap-2 text-primary hover:underline mb-6">
            <ChevronLeft size={16} />
            Back to Products
          </Link>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Images */}
            <div>
              <div className="mb-4 rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.imageUrl ? `http://localhost:8080${product.imageUrl}` : "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                {product.shortDescription && (
                  <p className="text-muted-foreground mb-4">{product.shortDescription}</p>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-3xl font-bold">
                    {selectedVariant?.price?.toLocaleString("vi-VN") || product.defaultPrice?.toLocaleString("vi-VN")} VND
                  </span>
                </div>
              </div>

              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-3 block">Select Variant</label>
                  <div className="space-y-2">
                    {product.variants
                      .filter((v) => v.isActive)
                      .map((variant) => (
                        <button
                          key={variant.variantId}
                          onClick={() => handleVariantSelect(variant)}
                          className={`w-full text-left px-4 py-3 border-2 rounded-lg transition ${
                            selectedVariant?.variantId === variant.variantId
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{variant.attributes || "Default"}</div>
                              <div className="text-sm text-muted-foreground">SKU: {variant.sku}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{variant.price?.toLocaleString("vi-VN")} VND</div>
                              <div className="text-sm text-muted-foreground">
                                Stock: {variant.stock}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                <span className={`text-sm font-semibold ${maxStock > 0 ? "text-accent" : "text-destructive"}`}>
                  {maxStock > 0 ? `${maxStock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* Quantity */}
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-semibold">Quantity:</label>
                <div className="flex items-center border border-input rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                    className="px-3 py-2 hover:bg-muted transition"
                    disabled={quantity >= maxStock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                {cartAdded && (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 text-sm text-accent font-medium">
                    ✓ Added to cart!
                  </div>
                )}
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={maxStock === 0 || addingToCart || !selectedVariant}
                    className="flex-1 gap-2"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setWishlist(!wishlist)}>
                    <Heart size={18} fill={wishlist ? "currentColor" : "none"} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>

              {/* Specs */}
              {product.specifications && product.specifications.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Key Specifications</h3>
                  <div className="space-y-2">
                    {product.specifications.slice(0, 8).map((spec, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{spec.specKey}</span>
                        <span className="font-semibold">{spec.specValue}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Full Description */}
          {product.fullDescription && (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Product Description</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
            </Card>
          )}

          {/* Reviews Section */}
          <ProductReviews product={product} />
        </div>
      </main>
      <Footer />
    </>
  )
}
