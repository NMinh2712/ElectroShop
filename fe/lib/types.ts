export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  code?: string
  originMessage?: string
}

export interface PaginatedResponse<T> {
  [key: string]: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface User {
  userId: number
  username: string
  email: string
  name: string
  phone?: string
  shippingAddress?: string
  avatarUrl?: string
  roleId: number
  createdAt?: string
}

export interface LoginResponse {
  token: string
  userId: number
  username: string
  email: string
  roleId: number
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  name: string
  phone: string
  shippingAddress: string
}

export interface Product {
  productId: number
  name: string
  slug: string
  shortDescription: string
  fullDescription?: string
  defaultPrice: number
  imageUrl: string
  brandId: number
  categoryId: number
  variants?: ProductVariant[]
  specifications?: Specification[]
}

export interface ProductVariant {
  variantId: number
  sku: string
  attributes: string
  price: number
  stock: number
  isActive: boolean
}

export interface Specification {
  specKey: string
  specValue: string
}

export interface CartItem {
  variantId: number
  productId: number
  productName: string
  sku: string
  attributes: string
  price: number
  quantity: number
  subtotal: number
  imageUrl: string
}

export interface CartResponse {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface Order {
  orderId: number
  userId?: number
  userName?: string
  totalPrice: number
  shippingAddress?: string
  status: string
  statusName?: string
  paymentStatus?: string
  note?: string
  createdAt: string
  items?: OrderItem[]
  payment?: PaymentInfo
}

export interface OrderItem {
  variantId: number
  productId: number
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface PaymentInfo {
  paymentId: number
  paymentMethod: string
  paymentStatus: string
  amount: number
}

export interface Category {
  categoryId?: number
  name: string
  description?: string
  parentId?: number | null
}

export interface Brand {
  brandId?: number
  name: string
}

export interface Voucher {
  voucherId?: number
  code: string
  discountPercent?: number
  discountAmount?: number
  description?: string
  isActive?: boolean
}

export interface SupportTicket {
  ticketId?: number
  userId?: number
  subject: string
  message: string
  status: string
  createdAt?: string
  responses?: string[]
}

export interface FAQ {
  faqId?: number
  question: string
  answer: string
  category: string
}

export interface Comment {
  commentId?: number
  userId?: number
  userName?: string
  productId: number
  content: string
  rating: number
  createdAt?: string
  helpful?: number
}

export interface CheckoutData {
  shippingAddress: string
  paymentMethod: string
  voucherId?: number
  note?: string
}

export interface CheckoutResponse {
  orderId: number
  totalPrice: number
  status: string
  paymentStatus: string
  createdAt: string
}
