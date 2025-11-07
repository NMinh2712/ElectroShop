"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { useMockData } from "@/hooks/use-mock"
import { VoucherDialog } from "@/components/admin-dialogs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Plus, Edit2, Trash2, Percent, DollarSign } from "lucide-react"
import type { Voucher } from "@/lib/types"

export default function AdminPromotionsPage() {
  const { user } = useAuth()
  const { vouchers, addVoucher, updateVoucher, deleteVoucher } = useMockData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState<Voucher | undefined>()

  if (!user || user.role !== "admin") {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">Only administrators can manage promotions.</p>
        </div>
      </AdminLayout>
    )
  }

  const handleAddVoucher = (formData: Partial<Voucher>) => {
    if (editingVoucher) {
      updateVoucher(editingVoucher.id, formData)
      setEditingVoucher(undefined)
    } else {
      const newVoucher: Voucher = {
        id: "vouch" + Date.now(),
        code: formData.code || "",
        discountPercent: formData.discountPercent,
        discountAmount: formData.discountAmount,
        description: formData.description || "",
        active: formData.active !== false,
      }
      addVoucher(newVoucher)
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
          <h1 className="text-3xl font-bold">Manage Promotions</h1>
          <Button
            onClick={() => {
              setEditingVoucher(undefined)
              setDialogOpen(true)
            }}
          >
            <Plus size={18} className="mr-2" />
            Add Voucher
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((voucher) => (
            <Card key={voucher.id} className="p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {voucher.discountPercent ? (
                        <Percent className="w-5 h-5 text-primary" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg">{voucher.code}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{voucher.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingVoucher(voucher)
                      setDialogOpen(true)
                    }}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteVoucher(voucher.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-semibold text-primary">
                    {voucher.discountPercent ? `${voucher.discountPercent}%` : `₫${voucher.discountAmount}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={`font-semibold px-2 py-1 rounded text-xs ${
                      voucher.active ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {voucher.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <VoucherDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleAddVoucher}
          initialData={editingVoucher}
          isEditing={!!editingVoucher}
        />
      </div>
    </AdminLayout>
  )
}
