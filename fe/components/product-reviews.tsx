"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useComments } from "@/contexts/comments-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Product, Comment } from "@/lib/types"
import { Star, AlertCircle } from "lucide-react"

interface ProductReviewsProps {
  product: Product
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const { user } = useAuth()
  const { getProductComments, addComment } = useComments()
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("reviews")
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating-high" | "rating-low">("recent")

  const comments = getProductComments(product.productId || 0)

  const averageRating =
    comments.length > 0 ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1) : "0"

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "rating-high":
        return b.rating - a.rating
      case "rating-low":
        return a.rating - b.rating
      case "helpful":
        return (b.rating === 5 ? 1 : 0) - (a.rating === 5 ? 1 : 0)
      case "recent":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newComment: Comment = {
      id: `com${Date.now()}`,
      userId: user.userId,
      userName: user.name || user.username || "Anonymous",
      productId: product.productId || 0,
      rating,
      text: reviewText,
      createdAt: new Date(),
    }

    addComment(newComment)
    setReviewText("")
    setRating(5)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="mb-12">
      {/* Tab Navigation */}
      <div className="flex gap-8 border-b mb-6">
        {["description", "specs", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-2 font-semibold capitalize transition ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary -mb-2"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "reviews" && (
        <div className="space-y-8">
          {/* Review Form */}
          {user ? (
            <Card className="p-6 bg-muted/30">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              {submitted && (
                <div className="mb-4 bg-accent/10 border border-accent/30 rounded-lg p-3 text-sm text-accent font-medium">
                  ✓ Thank you! Your review has been posted.
                </div>
              )}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition"
                      >
                        <Star
                          size={24}
                          className={star <= rating ? "fill-primary text-primary" : "text-muted-foreground"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Your Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" disabled={!reviewText.trim()}>
                  Post Review
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="p-6 bg-muted/30">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-muted-foreground flex-shrink-0" />
                <p className="text-muted-foreground">Please log in to write a review</p>
              </div>
            </Card>
          )}

          {/* Reviews List */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Customer Reviews ({comments.length})</h3>
              {comments.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm px-2 py-1 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="rating-high">Highest Rated</option>
                    <option value="rating-low">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              )}
            </div>

            {comments.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {sortedComments.map((comment) => (
                  <Card key={comment.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold">{comment.userName}</div>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < comment.rating ? "fill-primary text-primary" : "text-muted-foreground"}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{comment.createdAt.toLocaleDateString()}</div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{comment.text}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description Tab Content */}
      {activeTab === "description" && (
        <div className="prose prose-sm max-w-none">
          <p>{product.fullDescription || product.shortDescription || "No description available"}</p>
        </div>
      )}

      {/* Specs Tab Content */}
      {activeTab === "specs" && (
        <div className="space-y-4">
          {product.specifications && product.specifications.length > 0 ? (
            product.specifications.map((spec, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                <span className="font-semibold">{spec.specKey}</span>
                <span className="text-muted-foreground">{spec.specValue}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No specifications available</p>
          )}
        </div>
      )}
    </div>
  )
}
