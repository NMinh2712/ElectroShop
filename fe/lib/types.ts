export type UserRole = "user" | "staff" | "admin"

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  avatar?: string
  createdAt: Date
  isVerified?: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviews: number
  stock: number
  variants: ProductVariant[]
  specs: Record<string, string>
}

export interface ProductVariant {
  id: string
  color: string
  sku: string
  stock: number
}

export interface CartItem {
  productId: string
  variantId: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled"
  createdAt: Date
  shippingAddress?: Address
}

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  variantColor: string
}

export interface Comment {
  id: string
  userId: string
  userName: string
  productId: string
  rating: number
  text: string
  createdAt: Date
  helpful?: number
}

export interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  code?: string
  startDate: Date
  endDate: Date
}

export interface Address {
  id?: string
  fullName: string
  address: string
  phone: string
  city?: string
  district?: string
  ward?: string
  isDefault?: boolean
}

export interface Voucher {
  id: string
  code: string
  discountPercent?: number
  discountAmount?: number
  description: string
  active: boolean
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  message: string
  status: "open" | "in-progress" | "closed"
  createdAt: Date
  responses: string[]
}

export interface AdminStats {
  revenue: number[]
  orders: number
  products: number
  users: number
  topProducts: string[]
}

export interface Brand {
  id: string
  name: string
  logo?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image?: string
}
