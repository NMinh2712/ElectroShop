"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProductReviews } from "@/components/product-reviews"
import { useCart } from "@/components/cart-context"
import { mockProducts } from "@/lib/mock-data"
import { Star, Heart, Share2, ShoppingCart, ChevronLeft } from "lucide-react"

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = mockProducts.find((p) => p.slug === params.slug)
  const { addToCart } = useCart()
  const [selectedColor, setSelectedColor] = useState(product?.variants[0]?.color || "")
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)

  if (!product) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      })
      setCartAdded(true)
      setTimeout(() => setCartAdded(false), 2000)
      setQuantity(1)
    }
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    const variant = product.variants.find((v) => v.color === color)
    if (variant) {
      setSelectedVariant(variant)
    }
  }

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
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img || "/placeholder.svg"}
                    alt={`View ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-border hover:border-primary cursor-pointer transition"
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <div className="text-muted-foreground text-sm mb-2">{product.category}</div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-3xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                      <span className="text-accent font-semibold">
                        Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <label className="text-sm font-semibold mb-3 block">Color</label>
                <div className="flex gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleColorSelect(variant.color)}
                      className={`px-4 py-2 border-2 rounded-lg transition ${
                        selectedColor === variant.color
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span className={`text-sm font-semibold ${product.stock > 0 ? "text-accent" : "text-destructive"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* Quantity */}
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-semibold">Quantity:</label>
                <div className="flex items-center border border-input rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-muted transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                {cartAdded && (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 text-sm text-accent font-medium">
                    ✓ Added to cart!
                  </div>
                )}
                <div className="flex gap-4">
                  <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 gap-2">
                    <ShoppingCart size={18} />
                    Add to Cart
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
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Key Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specs)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReviews product={product} />
        </div>
      </main>
      <Footer />
    </>
  )
}
