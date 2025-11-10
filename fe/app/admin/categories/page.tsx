"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit2, Trash2, ChevronLeft, Loader2 } from "lucide-react"
import type { Category } from "@/lib/types"

export default function AdminCategoriesPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: null as number | null,
  })

  useEffect(() => {
    if (user && user.roleId === 1) {
      fetchCategories()
    }
  }, [user])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await apiClient.adminGetCategories()
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await apiClient.adminDeleteCategory(categoryId)
        fetchCategories()
      } catch (err: any) {
        setError(err.message || "Failed to delete category")
      }
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || "",
      description: category.description || "",
      parentId: category.parentId || null,
    })
    setFormOpen(true)
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setFormData({
      name: "",
      description: "",
      parentId: null,
    })
    setFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (editingCategory && editingCategory.categoryId) {
        await apiClient.adminUpdateCategory(editingCategory.categoryId, formData)
      } else {
        await apiClient.adminCreateCategory(formData)
      }
      setFormOpen(false)
      fetchCategories()
    } catch (err: any) {
      setError(err.message || "Failed to save category")
    }
  }

  if (!user || user.roleId !== 1) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        </div>
      </AdminLayout>
    )
  }

  const parentCategories = categories.filter((c) => !c.parentId)

  return (
    <AdminLayout>
      <div className="p-8">
        <Link href="/admin" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ChevronLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <Button onClick={handleAdd}>
            <Plus size={18} className="mr-2" />
            Add Category
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-6 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Categories List */}
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
                    <th className="text-left px-6 py-3 font-semibold">Name</th>
                    <th className="text-left px-6 py-3 font-semibold">Description</th>
                    <th className="text-left px-6 py-3 font-semibold">Parent Category</th>
                    <th className="text-center px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => {
                    const parent = categories.find((c) => c.categoryId === category.parentId)
                    return (
                      <tr key={category.categoryId} className="border-b hover:bg-muted/50 transition">
                        <td className="px-6 py-4 font-semibold">{category.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{category.description || "-"}</td>
                        <td className="px-6 py-4 text-muted-foreground">{parent?.name || "None"}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(category.categoryId!)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
          {!loading && categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No categories found.</div>
          )}
        </Card>

        {/* Category Form Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Laptops"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="parentId">Parent Category (Optional)</Label>
                <Select
                  value={formData.parentId?.toString() || ""}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value ? parseInt(value) : null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Top Level)</SelectItem>
                    {parentCategories
                      .filter((c) => !editingCategory || c.categoryId !== editingCategory.categoryId)
                      .map((cat) => (
                        <SelectItem key={cat.categoryId} value={cat.categoryId!.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCategory ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

