"use client"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockProducts, mockPromotions } from "@/lib/mock-data"
import { Star, Zap, Shield, Truck } from "lucide-react"

export default function Home() {
  const categories = ["Smartphones", "Tablets", "Accessories", "Computers"]
  const featuredProducts = mockProducts.slice(0, 6)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Welcome to TPF Shop</h1>
                <p className="text-lg mb-6 text-primary-foreground/90">
                  Discover the latest electronics with unbeatable prices and exceptional customer service.
                </p>
                <Link href="/products">
                  <Button size="lg" variant="secondary">
                    Shop Now
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <div className="bg-primary-foreground/10 rounded-2xl h-64 md:h-80 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=320&width=320"
                    alt="Featured Electronics"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <Truck className="w-10 h-10 text-primary" />
                <div>
                  <div className="font-semibold">Free Shipping</div>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Shield className="w-10 h-10 text-primary" />
                <div>
                  <div className="font-semibold">Secure Payment</div>
                  <p className="text-sm text-muted-foreground">100% secure transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Zap className="w-10 h-10 text-primary" />
                <div>
                  <div className="font-semibold">Fast Delivery</div>
                  <p className="text-sm text-muted-foreground">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Star className="w-10 h-10 text-primary" />
                <div>
                  <div className="font-semibold">Best Quality</div>
                  <p className="text-sm text-muted-foreground">Top rated products</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-balance">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category} href={`/products?category=${category}`}>
                  <Card className="p-6 text-center hover:shadow-lg transition cursor-pointer h-full flex flex-col items-center justify-center">
                    <img
                      src={`/placeholder.svg?height=100&width=100&query=${category}`}
                      alt={category}
                      className="w-20 h-20 object-cover mb-4 rounded"
                    />
                    <div className="font-semibold">{category}</div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-balance">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition h-full">
                    <div className="relative">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.originalPrice && (
                        <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                          Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">{product.brand}</div>
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-primary text-primary" />
                          <span className="text-sm font-semibold">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Promotions */}
        {mockPromotions.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8 text-balance">Active Promotions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockPromotions.map((promo) => (
                  <Card
                    key={promo.id}
                    className="p-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                  >
                    <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                    <p className="mb-4 text-primary-foreground/90">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{promo.discount}% OFF</div>
                      {promo.code && (
                        <div className="bg-primary-foreground/20 px-4 py-2 rounded-lg">
                          <div className="text-xs text-primary-foreground/70">Code</div>
                          <div className="text-lg font-bold font-mono">{promo.code}</div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
