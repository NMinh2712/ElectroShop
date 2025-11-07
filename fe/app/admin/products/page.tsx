"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { useMockData } from "@/hooks/use-mock"
import { ProductDialog } from "@/components/admin-dialogs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, ChevronLeft } from "lucide-react"
import type { Product } from "@/lib/types"

export default function AdminProductsPage() {
  const { user } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct } = useMockData()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        </div>
      </AdminLayout>
    )
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData)
      setEditingProduct(undefined)
    } else {
      const newProduct: Product = {
        id: "prod" + Date.now(),
        name: formData.name || "",
        slug: formData.name?.toLowerCase().replace(/\s+/g, "-") || "",
        brand: formData.brand || "",
        category: formData.category || "",
        price: formData.price || 0,
        description: formData.description || "",
        images: [],
        rating: 0,
        reviews: 0,
        stock: formData.stock || 0,
        variants: [],
        specs: {},
      }
      addProduct(newProduct)
    }
    setDialogOpen(false)
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
          {user.role === "admin" && (
            <Button
              onClick={() => {
                setEditingProduct(undefined)
                setDialogOpen(true)
              }}
            >
              <Plus size={18} className="mr-2" />
              Add Product
            </Button>
          )}
        </div>

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
            <table className="w-full">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Product</th>
                  <th className="text-left px-6 py-3 font-semibold">Brand</th>
                  <th className="text-left px-6 py-3 font-semibold">Category</th>
                  <th className="text-right px-6 py-3 font-semibold">Price</th>
                  <th className="text-right px-6 py-3 font-semibold">Stock</th>
                  {user.role === "admin" && <th className="text-center px-6 py-3 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-semibold">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.brand}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 text-right font-semibold">{product.price.toLocaleString()} VND</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-semibold ${product.stock < 10 ? "text-destructive" : "text-accent"}`}>
                        {product.stock}
                      </span>
                    </td>
                    {user.role === "admin" && (
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product)
                              setDialogOpen(true)
                            }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteProduct(product.id)}
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
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No products found.</div>}
        </Card>

        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleAddProduct}
          initialData={editingProduct}
          isEditing={!!editingProduct}
        />
      </div>
    </AdminLayout>
  )
}
