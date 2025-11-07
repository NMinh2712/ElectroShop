"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, Voucher } from "@/lib/types"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (product: Partial<Product>) => void
  initialData?: Product
  isEditing?: boolean
}

export function ProductDialog({ open, onOpenChange, onSubmit, initialData, isEditing }: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: "",
      brand: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
    },
  )

  const handleSubmit = () => {
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Product Name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="Brand"
            value={formData.brand || ""}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={formData.category || ""}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price (VND)"
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Stock"
            value={formData.stock || ""}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
          />
          <Textarea
            placeholder="Description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEditing ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface VoucherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (voucher: Partial<Voucher>) => void
  initialData?: Voucher
  isEditing?: boolean
}

export function VoucherDialog({ open, onOpenChange, onSubmit, initialData, isEditing }: VoucherDialogProps) {
  const [formData, setFormData] = useState<Partial<Voucher>>(
    initialData || {
      code: "",
      description: "",
      discountPercent: 0,
      active: true,
    },
  )

  const handleSubmit = () => {
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Voucher" : "Add New Voucher"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Voucher Code"
            value={formData.code || ""}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Discount %"
              value={formData.discountPercent || ""}
              onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Or Amount"
              value={formData.discountAmount || ""}
              onChange={(e) => setFormData({ ...formData, discountAmount: Number(e.target.value) })}
            />
          </div>
          <Select
            value={formData.active ? "true" : "false"}
            onValueChange={(value) => setFormData({ ...formData, active: value === "true" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEditing ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
