"use client"

import { useState, useCallback } from "react"
import {
  mockUsers,
  mockProducts,
  mockOrders,
  mockPromotions,
  mockVouchers,
  mockFAQs,
  mockSupportTickets,
  mockData,
} from "@/lib/mock-data"
import type { User, Product, Order, Promotion, Voucher, FAQ, SupportTicket } from "@/lib/types"

export function useMockData() {
  // Users Management
  const [users, setUsers] = useState<User[]>(mockUsers)

  const addUser = useCallback((user: User) => {
    setUsers((prev) => [...prev, user])
  }, [])

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }, [])

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const resetUserPassword = useCallback((id: string, newPassword: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...{ password: newPassword } } : u)))
  }, [])

  const toggleUserStatus = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              isVerified: !u.isVerified,
            }
          : u,
      ),
    )
  }, [])

  // Products Management
  const [products, setProducts] = useState<Product[]>(mockProducts)

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product])
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateStock = useCallback((id: string, newStock: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p)))
  }, [])

  // Orders Management
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const updateOrderStatus = useCallback(
    (id: string, status: "pending" | "processing" | "shipped" | "delivered" | "canceled") => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    },
    [],
  )

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [...prev, order])
  }, [])

  // Promotions & Vouchers
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers)

  const addVoucher = useCallback((voucher: Voucher) => {
    setVouchers((prev) => [...prev, voucher])
  }, [])

  const updateVoucher = useCallback((id: string, updates: Partial<Voucher>) => {
    setVouchers((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)))
  }, [])

  const deleteVoucher = useCallback((id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id))
  }, [])

  const addPromotion = useCallback((promotion: Promotion) => {
    setPromotions((prev) => [...prev, promotion])
  }, [])

  const deletePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }, [])

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTickets)

  const updateTicketStatus = useCallback((id: string, status: "open" | "in-progress" | "closed") => {
    setSupportTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }, [])

  const addResponseToTicket = useCallback((id: string, response: string) => {
    setSupportTickets((prev) => prev.map((t) => (t.id === id ? { ...t, responses: [...t.responses, response] } : t)))
  }, [])

  // FAQs
  const [faqs, setFAQs] = useState<FAQ[]>(mockFAQs)

  const addFAQ = useCallback((faq: FAQ) => {
    setFAQs((prev) => [...prev, faq])
  }, [])

  const updateFAQ = useCallback((id: string, updates: Partial<FAQ>) => {
    setFAQs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }, [])

  const deleteFAQ = useCallback((id: string) => {
    setFAQs((prev) => prev.filter((f) => f.id !== id))
  }, [])

  return {
    // Users
    users,
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    toggleUserStatus,
    // Products
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    // Orders
    orders,
    addOrder,
    updateOrderStatus,
    // Promotions
    promotions,
    addPromotion,
    deletePromotion,
    // Vouchers
    vouchers,
    addVoucher,
    updateVoucher,
    deleteVoucher,
    // Support Tickets
    supportTickets,
    updateTicketStatus,
    addResponseToTicket,
    // FAQs
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    // Raw data
    mockData,
  }
}
