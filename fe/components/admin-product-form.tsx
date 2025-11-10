"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Product, ProductVariant, Specification, Category } from "@/lib/types"

interface AdminProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  productId?: number
  initialData?: any
}

// Debug helper to log FormData (for development only)
const logFormData = (formData: FormData) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('=== FormData Contents ===')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          type: value.type,
          size: value.size,
        })
      } else {
        try {
          const parsed = JSON.parse(value as string)
          console.log(`${key}:`, parsed)
        } catch {
          console.log(`${key}:`, value)
        }
      }
    }
    console.log('========================')
  }
}

export function AdminProductForm({ open, onOpenChange, onSuccess, productId, initialData }: AdminProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    brandId: "",
    categoryId: "",
    modelNumber: "",
    releaseYear: "",
    defaultPrice: "",
  })

  const [variants, setVariants] = useState<ProductVariant[]>([
    { sku: "", attributes: "", price: "", stock: "", isActive: true } as any,
  ])

  const [specifications, setSpecifications] = useState<Specification[]>([{ specKey: "", specValue: "" }])

  useEffect(() => {
    if (open) {
      fetchCategories()
      fetchBrands()
      if (initialData && productId) {
        loadProductData(initialData)
      } else {
        resetForm()
      }
    }
  }, [open, productId, initialData])

  const fetchCategories = async () => {
    try {
      const response = await apiClient.adminGetCategories()
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err)
    }
  }

  const fetchBrands = async () => {
    // TODO: Add brand API endpoint when available
    // For now, using mock brands
    setBrands([
      { brandId: 1, name: "Apple" },
      { brandId: 2, name: "Samsung" },
      { brandId: 3, name: "Sony" },
      { brandId: 4, name: "Dell" },
      { brandId: 5, name: "Xiaomi" },
    ])
  }

  const loadProductData = (data: any) => {
    setFormData({
      name: data.name || "",
      slug: data.slug || "",
      shortDescription: data.shortDescription || "",
      fullDescription: data.fullDescription || "",
      brandId: data.brandId?.toString() || "",
      categoryId: data.categoryId?.toString() || "",
      modelNumber: data.modelNumber || "",
      releaseYear: data.releaseYear?.toString() || "",
      defaultPrice: data.defaultPrice?.toString() || "",
    })
    if (data.imageUrl) {
      setImagePreview(`http://localhost:8080${data.imageUrl}`)
    }
    if (data.variants && data.variants.length > 0) {
      setVariants(
        data.variants.map((v: any) => ({
          sku: v.sku || "",
          attributes: v.attributes || "",
          price: v.price?.toString() || "",
          stock: v.stock?.toString() || "",
          isActive: v.isActive !== false,
        })),
      )
    }
    if (data.specifications && data.specifications.length > 0) {
      setSpecifications(data.specifications)
    } else {
      setSpecifications([{ specKey: "", specValue: "" }])
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      brandId: "",
      categoryId: "",
      modelNumber: "",
      releaseYear: "",
      defaultPrice: "",
    })
    setVariants([{ sku: "", attributes: "", price: "", stock: "", isActive: true } as any])
    setSpecifications([{ specKey: "", specValue: "" }])
    setImageFile(null)
    setImagePreview("")
    setError("")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload JPG, PNG, or WEBP image.")
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.")
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError("")
    }
  }

  const addVariant = () => {
    setVariants([...variants, { sku: "", attributes: "", price: "", stock: "", isActive: true } as any])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { specKey: "", specValue: "" }])
  }

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const updateSpecification = (index: number, field: "specKey" | "specValue", value: string) => {
    const updated = [...specifications]
    updated[index] = { ...updated[index], [field]: value }
    setSpecifications(updated)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validation
      if (!formData.name) {
        setError("Product name is required")
        setLoading(false)
        return
      }
      if (!formData.brandId || !formData.categoryId) {
        setError("Brand and Category are required")
        setLoading(false)
        return
      }
      if (!formData.defaultPrice) {
        setError("Default price is required")
        setLoading(false)
        return
      }
      if (variants.length === 0 || variants.some((v) => !v.sku || !v.price || !v.stock)) {
        setError("All variants must have SKU, price, and stock")
        setLoading(false)
        return
      }

      // Prepare variants JSON
      const variantsJson = variants.map((v) => ({
        sku: v.sku,
        attributes: v.attributes || "",
        price: parseFloat(v.price as string),
        stock: parseInt(v.stock as string),
        isActive: v.isActive !== false,
      }))

      // Prepare specifications JSON (filter empty ones)
      const specsJson = specifications.filter((s) => s.specKey && s.specValue)

      if (productId) {
        // Update existing product (JSON format, no image upload for now)
        const updateData = {
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          shortDescription: formData.shortDescription,
          fullDescription: formData.fullDescription,
          brandId: parseInt(formData.brandId),
          categoryId: parseInt(formData.categoryId),
          modelNumber: formData.modelNumber || null,
          releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : null,
          defaultPrice: parseFloat(formData.defaultPrice),
          variants: variantsJson,
          specifications: specsJson,
        }

        await apiClient.adminUpdateProduct(productId, updateData)
      } else {
        // Create new product (multipart/form-data)
        if (!imageFile) {
          setError("Product image is required")
          setLoading(false)
          return
        }

        // Prepare product JSON object
        const productData = {
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          shortDescription: formData.shortDescription || null,
          fullDescription: formData.fullDescription || null,
          brandId: parseInt(formData.brandId),
          categoryId: parseInt(formData.categoryId),
          modelNumber: formData.modelNumber || null,
          releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : null,
          defaultPrice: parseFloat(formData.defaultPrice),
        }

        // Create FormData with proper structure for backend
        const formDataToSend = new FormData()
        
        // Add image file
        formDataToSend.append("image", imageFile)
        
        // Add product as JSON string
        formDataToSend.append("product", JSON.stringify(productData))
        
        // Add variants as JSON string
        formDataToSend.append("variants", JSON.stringify(variantsJson))
        
        // Add specifications as JSON string
        formDataToSend.append("specifications", JSON.stringify(specsJson))

        // Debug: Log FormData in development
        logFormData(formDataToSend)

        await apiClient.adminCreateProduct(formDataToSend)
      }

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (err: any) {
      setError(err.message || "Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productId ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (!formData.slug) {
                      setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })
                    }
                  }}
                  placeholder="e.g., ASUS ZenBook 14 OLED"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL-friendly)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated from name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brandId">Brand *</Label>
                  <Select value={formData.brandId} onValueChange={(value) => setFormData({ ...formData, brandId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.brandId} value={brand.brandId.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.categoryId} value={cat.categoryId?.toString() || ""}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modelNumber">Model Number</Label>
                  <Input
                    id="modelNumber"
                    value={formData.modelNumber}
                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <Label htmlFor="releaseYear">Release Year</Label>
                  <Input
                    id="releaseYear"
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="defaultPrice">Default Price (VND) *</Label>
                <Input
                  id="defaultPrice"
                  type="number"
                  value={formData.defaultPrice}
                  onChange={(e) => setFormData({ ...formData, defaultPrice: e.target.value })}
                  placeholder="25000000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief product description"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>
            </div>
          </Card>

          {/* Image Upload */}
          {!productId && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Product Image *</h3>
              <div>
                <Label htmlFor="image">Image (JPG, PNG, WEBP, max 5MB)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  required={!productId}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Variants */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Product Variants *</h3>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus size={16} className="mr-2" />
                Add Variant
              </Button>
            </div>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <Card key={index} className="p-4 bg-muted/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Variant {index + 1}</span>
                    {variants.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(index)}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>SKU *</Label>
                      <Input
                        value={variant.sku || ""}
                        onChange={(e) => updateVariant(index, "sku", e.target.value)}
                        placeholder="LAPTOP-ASUS-001-512GB"
                        required
                      />
                    </div>
                    <div>
                      <Label>Attributes</Label>
                      <Input
                        value={variant.attributes || ""}
                        onChange={(e) => updateVariant(index, "attributes", e.target.value)}
                        placeholder="Storage: 512GB SSD, Color: Jade Black"
                      />
                    </div>
                    <div>
                      <Label>Price (VND) *</Label>
                      <Input
                        type="number"
                        value={variant.price || ""}
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                        placeholder="25000000"
                        required
                      />
                    </div>
                    <div>
                      <Label>Stock *</Label>
                      <Input
                        type="number"
                        value={variant.stock || ""}
                        onChange={(e) => updateVariant(index, "stock", e.target.value)}
                        placeholder="50"
                        required
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Specifications */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Specifications</h3>
              <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                <Plus size={16} className="mr-2" />
                Add Specification
              </Button>
            </div>
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={spec.specKey}
                    onChange={(e) => updateSpecification(index, "specKey", e.target.value)}
                    placeholder="Key (e.g., Screen Size)"
                    className="flex-1"
                  />
                  <Input
                    value={spec.specValue}
                    onChange={(e) => updateSpecification(index, "specValue", e.target.value)}
                    placeholder="Value (e.g., 14 inches)"
                    className="flex-1"
                  />
                  {specifications.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecification(index)}>
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : productId ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

