# ElectroShop API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
Tất cả các API yêu cầu authentication (trừ Public APIs) cần gửi JWT token trong header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Role Requirements
- **ROLE_ADMIN**: Chỉ Admin mới có quyền truy cập
- **ROLE_USER**: User đã đăng nhập (bao gồm ADMIN, MODERATOR, USER)
- **PUBLIC**: Không cần authentication (Guest có thể truy cập)

---

## 1. Authentication APIs

### 1.1. Register
- **Endpoint**: `POST /auth/register`
- **Role**: PUBLIC
- **Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "name": "string",
  "phone": "string",
  "shippingAddress": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "username": "string",
    "email": "string",
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

### 1.2. Login
- **Endpoint**: `POST /auth/login`
- **Role**: PUBLIC
- **Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "userId": 1,
    "username": "string",
    "email": "string",
    "roleId": 3
  }
}
```

---

## 2. Public Product APIs (User/Guest)

### 2.1. Get All Products
- **Endpoint**: `GET /products`
- **Role**: PUBLIC
- **Query Parameters**:
  - `page` (default: 0): Page number (0-based)
  - `size` (default: 10): Page size
  - `sortBy` (default: "createdAt"): Sort field
  - `sortDir` (default: "DESC"): Sort direction (ASC/DESC)
  - `keyword` (optional): Search keyword
  - `categoryId` (optional): Filter by category
  - `brandId` (optional): Filter by brand
- **Response**:
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "productId": 1,
        "name": "ASUS ZenBook 14 OLED",
        "slug": "asus-zenbook-14-oled",
        "shortDescription": "Ultra-thin laptop",
        "brandId": 1,
        "brandName": "ASUS",
        "categoryId": 1,
        "categoryName": "Laptops",
        "defaultPrice": 25000000,
        "imageUrl": "https://example.com/image.jpg",
        "minPrice": 25000000,
        "maxPrice": 28000000
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10,
    "first": true,
    "last": false
  }
}
```

### 2.2. Get Product by ID
- **Endpoint**: `GET /products/{id}`
- **Role**: PUBLIC
- **Response**:
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "productId": 1,
    "name": "ASUS ZenBook 14 OLED",
    "slug": "asus-zenbook-14-oled",
    "shortDescription": "Ultra-thin laptop",
    "fullDescription": "Full description...",
    "brandId": 1,
    "brandName": "ASUS",
    "categoryId": 1,
    "categoryName": "Laptops",
    "modelNumber": "UX3402ZA",
    "releaseYear": 2024,
    "defaultPrice": 25000000,
    "imageUrl": "https://example.com/image.jpg",
    "variants": [
      {
        "variantId": 1,
        "sku": "LAPTOP-ASUS-001",
        "attributes": "Color: Black",
        "price": 25000000,
        "stock": 50,
        "isActive": true
      }
    ],
    "specifications": [
      {
        "specId": 1,
        "specKey": "Screen Size",
        "specValue": "14 inches"
      }
    ]
  }
}
```

### 2.3. Get Product by Slug
- **Endpoint**: `GET /products/slug/{slug}`
- **Role**: PUBLIC
- **Response**: Tương tự Get Product by ID

---

## 3. Cart Management APIs (User)

### 3.1. Add Product to Cart
- **Endpoint**: `POST /user/cart`
- **Role**: ROLE_USER (Authenticated)
- **Request Body**:
```json
{
  "variantId": 1,
  "quantity": 2
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": {
    "items": [
      {
        "cartId": 1,
        "variantId": 1,
        "productId": 1,
        "productName": "ASUS ZenBook 14 OLED",
        "productImageUrl": "https://example.com/image.jpg",
        "sku": "LAPTOP-ASUS-001",
        "attributes": "Color: Black",
        "unitPrice": 25000000,
        "quantity": 2,
        "subtotal": 50000000,
        "stock": 50,
        "isActive": true,
        "addedAt": "2024-01-01T00:00:00"
      }
    ],
    "totalItems": 2,
    "totalPrice": 50000000
  }
}
```

### 3.2. View Cart
- **Endpoint**: `GET /user/cart`
- **Role**: ROLE_USER (Authenticated)
- **Response**: Tương tự Add Product to Cart

### 3.3. Update Cart Quantity
- **Endpoint**: `PUT /user/cart/{variantId}`
- **Role**: ROLE_USER (Authenticated)
- **Request Body**:
```json
{
  "quantity": 3
}
```
- **Response**: Tương tự Add Product to Cart

### 3.4. Remove Product from Cart
- **Endpoint**: `DELETE /user/cart/{variantId}`
- **Role**: ROLE_USER (Authenticated)
- **Response**:
```json
{
  "success": true,
  "message": "Product removed from cart successfully",
  "data": null
}
```

### 3.5. Clear Cart
- **Endpoint**: `DELETE /user/cart`
- **Role**: ROLE_USER (Authenticated)
- **Response**:
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": null
}
```

---

## 4. Checkout API (User)

### 4.1. Checkout
- **Endpoint**: `POST /user/checkout`
- **Role**: ROLE_USER (Authenticated)
- **Request Body**:
```json
{
  "shippingAddress": "123 Main Street, Ho Chi Minh City",
  "note": "Please deliver in the morning",
  "voucherId": 1,
  "paymentMethod": "CREDIT_CARD"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": 1,
    "totalPrice": 50000000,
    "shippingAddress": "123 Main Street, Ho Chi Minh City",
    "statusId": 1,
    "statusName": "PENDING",
    "createdAt": "2024-01-01T00:00:00",
    "message": "Order created successfully"
  }
}
```

---

## 5. Admin Product Management APIs

### 5.1. Add Product
- **Endpoint**: `POST /admin/product/add`
- **Role**: ROLE_ADMIN
- **Request Body**:
```json
{
  "name": "ASUS ZenBook 14 OLED",
  "slug": "asus-zenbook-14-oled",
  "shortDescription": "Ultra-thin laptop",
  "fullDescription": "Full description...",
  "brandId": 1,
  "categoryId": 1,
  "modelNumber": "UX3402ZA",
  "releaseYear": 2024,
  "defaultPrice": 25000000,
  "imageUrl": "https://example.com/image.jpg",
  "variants": [
    {
      "sku": "LAPTOP-ASUS-001",
      "attributes": "Color: Black",
      "price": 25000000,
      "stock": 50,
      "isActive": true
    }
  ],
  "specifications": [
    {
      "specKey": "Screen Size",
      "specValue": "14 inches"
    }
  ]
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "productId": 1,
    "name": "ASUS ZenBook 14 OLED",
    "slug": "asus-zenbook-14-oled",
    "brandId": 1,
    "categoryId": 1,
    "imageUrl": "https://example.com/image.jpg",
    "variantCount": 1,
    "specificationCount": 1,
    "createdAt": "2024-01-01T00:00:00",
    "message": "Product created successfully"
  }
}
```

### 5.2. Update Product
- **Endpoint**: `PUT /admin/product/{id}`
- **Role**: ROLE_ADMIN
- **Request Body**: Tương tự Add Product (tất cả fields optional)
- **Response**: ProductDetailResponse

### 5.3. Get All Products (Admin)
- **Endpoint**: `GET /admin/product`
- **Role**: ROLE_ADMIN
- **Query Parameters**: page, size, sortBy, sortDir, keyword
- **Response**: ProductPageResponse

### 5.4. Get Product Detail (Admin)
- **Endpoint**: `GET /admin/product/{id}`
- **Role**: ROLE_ADMIN
- **Response**: ProductDetailResponse

### 5.5. Delete Product
- **Endpoint**: `DELETE /admin/product/{id}`
- **Role**: ROLE_ADMIN
- **Response**:
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

---

## 6. Admin Order Management APIs

### 6.1. Get All Orders
- **Endpoint**: `GET /admin/order`
- **Role**: ROLE_ADMIN
- **Query Parameters**:
  - `page` (default: 0)
  - `size` (default: 10)
  - `sortBy` (default: "createdAt")
  - `sortDir` (default: "DESC")
  - `statusId` (optional): Filter by status
- **Response**:
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "orderId": 1,
        "userId": 1,
        "totalPrice": 50000000,
        "shippingAddress": "123 Main Street",
        "statusId": 1,
        "statusName": "PENDING",
        "createdAt": "2024-01-01T00:00:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10,
    "first": true,
    "last": false
  }
}
```

### 6.2. Get Order Detail
- **Endpoint**: `GET /admin/order/{id}`
- **Role**: ROLE_ADMIN
- **Response**:
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "orderId": 1,
    "userId": 1,
    "totalPrice": 50000000,
    "shippingAddress": "123 Main Street",
    "statusId": 1,
    "statusName": "PENDING",
    "note": "Please deliver in the morning",
    "voucherId": 1,
    "items": [
      {
        "orderDetailId": 1,
        "variantId": 1,
        "productId": 1,
        "productName": "ASUS ZenBook 14 OLED",
        "sku": "LAPTOP-ASUS-001",
        "attributes": "Color: Black",
        "quantity": 2,
        "unitPrice": 25000000,
        "warrantyMonths": 0
      }
    ],
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

### 6.3. Update Order Status
- **Endpoint**: `PUT /admin/order/{id}/status`
- **Role**: ROLE_ADMIN
- **Request Body**:
```json
{
  "statusId": 2
}
```
- **Response**: OrderDetailResponse

---

## 7. Admin Category Management APIs

### 7.1. Create Category
- **Endpoint**: `POST /admin/category`
- **Role**: ROLE_ADMIN
- **Request Body**:
```json
{
  "name": "Laptops",
  "description": "Laptop computers",
  "parentId": null
}
```
- **Response**: CategoryResponse

### 7.2. Get All Categories
- **Endpoint**: `GET /admin/category`
- **Role**: ROLE_ADMIN
- **Response**: List<CategoryResponse>

### 7.3. Get Category by ID
- **Endpoint**: `GET /admin/category/{id}`
- **Role**: ROLE_ADMIN
- **Response**: CategoryResponse

### 7.4. Update Category
- **Endpoint**: `PUT /admin/category/{id}`
- **Role**: ROLE_ADMIN
- **Request Body**: Tương tự Create Category (tất cả fields optional)
- **Response**: CategoryResponse

### 7.5. Delete Category
- **Endpoint**: `DELETE /admin/category/{id}`
- **Role**: ROLE_ADMIN
- **Response**:
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "code": "E0400",
  "message": "Validation failed",
  "errors": {
    "name": "Product name is required"
  }
}
```

### Not Found (404)
```json
{
  "code": "E0404",
  "message": "Product not found with ID: 1"
}
```

### Unauthorized (401)
```json
{
  "code": "E9998",
  "message": "Invalid username or password"
}
```

### Access Denied (403)
```json
{
  "code": "E9999",
  "message": "Access Denied: You do not have permission."
}
```

---

## Order Status IDs
- 1: PENDING
- 2: CONFIRMED
- 3: PROCESSING
- 4: SHIPPED
- 5: DELIVERED
- 6: CANCELLED
- 7: REFUNDED

---

## Payment Methods
- CREDIT_CARD
- DEBIT_CARD
- BANK_TRANSFER
- COD (Cash on Delivery)
- E_WALLET

---

## Notes
1. Tất cả các API trả về format: `{ success, message, data }`
2. Pagination: page bắt đầu từ 0
3. JWT token có thời gian hết hạn, cần refresh khi token expired
4. Cart sẽ tự động clear sau khi checkout thành công
5. Product delete là soft delete (isDeleted = true)
6. Category delete là hard delete (nhưng validate children trước)

