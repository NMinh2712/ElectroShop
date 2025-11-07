"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { useMockData } from "@/hooks/use-mock"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, Plus, Edit2, Trash2, ChevronDown } from "lucide-react"
import type { FAQ } from "@/lib/types"

export default function AdminFAQsPage() {
  const { user } = useAuth()
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useMockData()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | undefined>()
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
    category: "",
  })

  if (!user || user.role !== "admin") {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        </div>
      </AdminLayout>
    )
  }

  const handleOpenDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFAQ(faq)
      setFormData(faq)
    } else {
      setEditingFAQ(undefined)
      setFormData({ question: "", answer: "", category: "" })
    }
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    if (formData.question && formData.answer && formData.category) {
      if (editingFAQ) {
        updateFAQ(editingFAQ.id, formData)
      } else {
        const newFAQ: FAQ = {
          id: "faq" + Date.now(),
          question: formData.question,
          answer: formData.answer,
          category: formData.category,
        }
        addFAQ(newFAQ)
      }
      setDialogOpen(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <Link href="/admin" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ChevronLeft size={18} />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage FAQs</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={18} className="mr-2" />
            Add FAQ
          </Button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="p-6 hover:shadow-lg transition">
              <button onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)} className="w-full">
                <div className="flex justify-between items-start">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronDown
                        size={20}
                        className={`transition-transform flex-shrink-0 ${expandedId === faq.id ? "rotate-180" : ""}`}
                      />
                      <h3 className="font-semibold text-lg hover:text-primary transition">{faq.question}</h3>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded inline-block mt-2">{faq.category}</span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDialog(faq)
                      }}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFAQ(faq.id)
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </button>
              {expandedId === faq.id && <div className="mt-4 pl-8 text-muted-foreground">{faq.answer}</div>}
            </Card>
          ))}
        </div>

        {/* FAQ Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingFAQ ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Question"
                value={formData.question || ""}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <Textarea
                placeholder="Answer"
                value={formData.answer || ""}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>{editingFAQ ? "Update" : "Add"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
