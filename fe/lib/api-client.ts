import { mockProducts, mockUsers } from "@/lib/mock-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  code?: string
  originMessage?: string
}

export interface PaginatedResponse<T> {
  [key: string]: any
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

class ApiClient {
  private baseUrl = API_BASE_URL
  private usesMockData = false

  isUsingMockData() {
    return this.usesMockData
  }

  private async request<T>(method: string, endpoint: string, body?: any, isFormData = false): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body && !isFormData) {
      headers["Content-Type"] = "application/json"
      options.body = JSON.stringify(body)
    } else if (body && isFormData) {
      options.body = body
    }

    try {
      const response = await fetch(url, options)
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      let data: ApiResponse<T>
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // If not JSON, create error response
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`)
      }

      if (!response.ok) {
        const error = new Error(data.message || "An error occurred") as any
        error.success = false
        error.code = data.code || `E${response.status}`
        error.message = data.message || "An error occurred"
        error.originMessage = data.originMessage || response.statusText
        error.status = response.status
        throw error
      }

      return data
    } catch (error: any) {
      // If it's already an Error instance, just rethrow
      if (error instanceof Error) {
        throw error
      }
      // If it's a plain object, convert to Error
      if (error && typeof error === 'object') {
        const errorMessage = error.message || "An error occurred"
        const newError = new Error(errorMessage)
        Object.assign(newError, error)
        throw newError
      }
      // Otherwise, wrap in Error
      throw new Error(error?.message || String(error) || "An error occurred")
    }
  }

  private getMockProductsResponse(page = 0, size = 10): ApiResponse<PaginatedResponse<any>> {
    const products = mockProducts.map((p: any) => ({
      productId: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.description,
      defaultPrice: p.price * 1000000,
      imageUrl: p.images[0] || "/placeholder.svg",
      brandId: 1,
      categoryId: 1,
    }))

    const startIdx = page * size
    const endIdx = startIdx + size
    const paginatedProducts = products.slice(startIdx, endIdx)

    return {
      success: true,
      message: "Products retrieved (using demo data)",
      data: {
        products: paginatedProducts,
        page,
        size,
        totalElements: products.length,
        totalPages: Math.ceil(products.length / size),
        first: page === 0,
        last: endIdx >= products.length,
      },
    }
  }

  // Auth APIs
  async login(username: string, password: string): Promise<ApiResponse<any>> {
    try {
      return await this.request("POST", "/auth/login", { username, password })
    } catch (error) {
      const user = mockUsers.find((u: any) => u.username === username)

      if (user && password === "password") {
        this.usesMockData = true
        return {
          success: true,
          message: "Login successful (demo mode)",
          data: {
            token: "demo_token_" + Date.now(),
            userId: (user as any).id || (user as any).userId || 1,
            username: user.username,
            email: user.email,
            roleId: user.roleId,
            name: user.name,
          },
        }
      }
      throw error
    }
  }

  async register(data: {
    username: string
    email: string
    password: string
    confirmPassword: string
    name: string
    phone: string
    shippingAddress: string
  }): Promise<ApiResponse<any>> {
    return this.request("POST", "/auth/register", data)
  }

  // Public Product APIs
  async getProducts(
    page = 0,
    size = 10,
    keyword?: string,
    categoryId?: number,
    brandId?: number,
    sortBy = "createdAt",
    sortDir = "DESC",
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir,
      })

      if (keyword) params.append("keyword", keyword)
      if (categoryId) params.append("categoryId", categoryId.toString())
      if (brandId) params.append("brandId", brandId.toString())

      return await this.request("GET", `/products?${params.toString()}`, undefined)
    } catch (error) {
      this.usesMockData = true
      return this.getMockProductsResponse(page, size)
    }
  }

  async getProductById(id: number): Promise<ApiResponse<any>> {
    return this.request("GET", `/products/${id}`, undefined)
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<any>> {
    return this.request("GET", `/products/slug/${slug}`, undefined)
  }

  // User Profile APIs
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request("GET", "/user/profile", undefined)
  }

  async updateUserProfile(data: any): Promise<ApiResponse<any>> {
    return this.request("PUT", "/user/profile", data)
  }

  async changePassword(data: any): Promise<ApiResponse<any>> {
    return this.request("PUT", "/user/change-password", data)
  }

  // Cart APIs
  async getCart(): Promise<ApiResponse<any>> {
    return this.request("GET", "/user/cart", undefined)
  }

  async addToCart(variantId: number, quantity: number): Promise<ApiResponse<any>> {
    return this.request("POST", "/user/cart", { variantId, quantity })
  }

  async updateCartQuantity(variantId: number, quantity: number): Promise<ApiResponse<any>> {
    return this.request("PUT", `/user/cart/${variantId}`, { quantity })
  }

  async removeFromCart(variantId: number): Promise<ApiResponse<any>> {
    return this.request("DELETE", `/user/cart/${variantId}`, undefined)
  }

  async clearCart(): Promise<ApiResponse<any>> {
    return this.request("DELETE", "/user/cart", undefined)
  }

  // Checkout API
  async checkout(data: {
    shippingAddress: string
    paymentMethod: string
    voucherId?: number
    note?: string
  }): Promise<ApiResponse<any>> {
    return this.request("POST", "/user/checkout", data)
  }

  // User Orders APIs
  async getUserOrders(page = 0, size = 10, statusId?: number): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (statusId) params.append("statusId", statusId.toString())

    return this.request("GET", `/user/orders?${params.toString()}`, undefined)
  }

  async getUserOrderById(id: number): Promise<ApiResponse<any>> {
    return this.request("GET", `/user/orders/${id}`, undefined)
  }

  async cancelOrder(id: number, reason: string): Promise<ApiResponse<any>> {
    return this.request("PUT", `/user/orders/${id}/cancel`, { reason })
  }

  // Staff Product APIs (Read-only)
  async staffGetProducts(page = 0, size = 10, keyword?: string): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      })
      if (keyword) params.append("keyword", keyword)

      return await this.request("GET", `/staff/product?${params.toString()}`, undefined)
    } catch (error) {
      this.usesMockData = true
      return this.getMockProductsResponse(page, size)
    }
  }

  async staffGetProductById(id: number): Promise<ApiResponse<any>> {
    return this.request("GET", `/staff/product/${id}`, undefined)
  }

  async staffGetOrders(page = 0, size = 10, statusId?: number): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (statusId) params.append("statusId", statusId.toString())

    return this.request("GET", `/staff/order?${params.toString()}`, undefined)
  }

  async staffGetOrderById(id: number): Promise<ApiResponse<any>> {
    return this.request("GET", `/staff/order/${id}`, undefined)
  }

  async staffUpdateOrderStatus(id: number, statusId: number): Promise<ApiResponse<any>> {
    return this.request("PUT", `/staff/order/${id}/status`, { statusId })
  }

  // Admin Product APIs
  async adminCreateProduct(data: FormData): Promise<ApiResponse<any>> {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    // Don't set Content-Type header - browser will set it automatically with boundary for FormData

    // Debug: Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('=== API Request: Create Product ===')
      console.log('URL:', `${this.baseUrl}/admin/product/add`)
      console.log('Method: POST')
      console.log('Headers:', { ...headers, 'Content-Type': 'multipart/form-data (auto-set)' })
      console.log('FormData keys:', Array.from(data.keys()))
    }

    try {
      const response = await fetch(`${this.baseUrl}/admin/product/add`, {
        method: "POST",
        headers,
        body: data,
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      let result: ApiResponse<any>
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      } else {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`)
      }

      if (!response.ok) {
        const error = new Error(result.message || "Failed to create product") as any
        error.success = false
        error.code = result.code || `E${response.status}`
        error.message = result.message || "Failed to create product"
        error.originMessage = result.originMessage || response.statusText
        error.status = response.status
        throw error
      }
      return result
    } catch (error: any) {
      if (error instanceof Error) {
        throw error
      }
      if (error && typeof error === 'object') {
        const errorMessage = error.message || "Failed to create product"
        const newError = new Error(errorMessage)
        Object.assign(newError, error)
        throw newError
      }
      throw new Error(error?.message || String(error) || "Failed to create product")
    }
  }

  async adminGetProducts(page = 0, size = 10, keyword?: string): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      })
      if (keyword) params.append("keyword", keyword)

      return await this.request("GET", `/admin/product?${params.toString()}`, undefined)
    } catch (error) {
      this.usesMockData = true
      return this.getMockProductsResponse(page, size)
    }
  }

  async adminGetProductById(id: number): Promise<ApiResponse<any>> {
    return this.request("GET", `/admin/product/${id}`, undefined)
  }

  async adminUpdateProduct(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request("PUT", `/admin/product/${id}`, data)
  }

  async adminDeleteProduct(id: number): Promise<ApiResponse<any>> {
    return this.request("DELETE", `/admin/product/${id}`, undefined)
  }

  // Admin Order APIs
  async adminGetOrders(page = 0, size = 10, statusId?: number): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (statusId) params.append("statusId", statusId.toString())

    return this.request("GET", `/admin/order?${params.toString()}`, undefined)
  }

  async adminGetOrderById(id: number): Promise<ApiResponse<any>> {
    return this.request("GET", `/admin/order/${id}`, undefined)
  }

  async adminUpdateOrderStatus(id: number, statusId: number): Promise<ApiResponse<any>> {
    return this.request("PUT", `/admin/order/${id}/status`, { statusId })
  }

  // Admin Category APIs
  async adminGetCategories(): Promise<ApiResponse<any>> {
    return this.request("GET", "/admin/category", undefined)
  }

  async adminCreateCategory(data: any): Promise<ApiResponse<any>> {
    return this.request("POST", "/admin/category", data)
  }

  async adminUpdateCategory(id: number, data: any): Promise<ApiResponse<any>> {
    return this.request("PUT", `/admin/category/${id}`, data)
  }

  async adminDeleteCategory(id: number): Promise<ApiResponse<any>> {
    return this.request("DELETE", `/admin/category/${id}`, undefined)
  }
}

export const apiClient = new ApiClient()
