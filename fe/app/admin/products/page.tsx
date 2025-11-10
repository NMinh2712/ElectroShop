"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { AdminProductForm } from "@/components/admin-product-form"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, ChevronLeft, Loader2 } from "lucide-react"

export default function AdminProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await apiClient.adminGetProducts(page, 10, searchTerm)
      if (response.success) {
        setProducts(response.data.products || [])
        setTotalPages(response.data.totalPages || 0)
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, searchTerm])

  const handleDelete = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await apiClient.adminDeleteProduct(productId)
        fetchProducts()
      } catch (err: any) {
        setError(err.message || "Failed to delete product")
      }
    }
  }

  const handleEdit = async (productId: number) => {
    try {
      const response = await apiClient.adminGetProductById(productId)
      if (response.success) {
        setEditingProduct(response.data)
        setFormOpen(true)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load product")
    }
  }

  const handleFormSuccess = () => {
    fetchProducts()
    setFormOpen(false)
    setEditingProduct(null)
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
          <h1 className="text-3xl font-bold">Manage Products</h1>
          {user.roleId === 1 && (
            <Button onClick={() => {
              setEditingProduct(null)
              setFormOpen(true)
            }}>
              <Plus size={18} className="mr-2" />
              Add Product
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-6 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Products Table */}
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
                    <th className="text-left px-6 py-3 font-semibold">Product</th>
                    <th className="text-left px-6 py-3 font-semibold">Brand</th>
                    <th className="text-left px-6 py-3 font-semibold">Category</th>
                    <th className="text-right px-6 py-3 font-semibold">Price</th>
                    <th className="text-right px-6 py-3 font-semibold">Stock</th>
                    {user.roleId === 1 && <th className="text-center px-6 py-3 font-semibold">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId} className="border-b hover:bg-muted/50 transition">
                      <td className="px-6 py-4 font-semibold">{product.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{product.brandName}</td>
                      <td className="px-6 py-4 text-muted-foreground">{product.categoryName}</td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {product.defaultPrice?.toLocaleString()} VND
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${(product.stock || 0) < 10 ? "text-destructive" : "text-accent"}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      {user.roleId === 1 && (
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(product.productId)}>
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(product.productId)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No products found.</div>
          )}
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = page < 3 ? i : page - 2 + i
              if (pageNum >= totalPages) return null
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </Button>
              )
            })}
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}

        {/* Product Form Dialog */}
        {user.roleId === 1 && (
          <AdminProductForm
            open={formOpen}
            onOpenChange={setFormOpen}
            onSuccess={handleFormSuccess}
            productId={editingProduct?.productId}
            initialData={editingProduct}
          />
        )}
      </div>
    </AdminLayout>
  )
}
