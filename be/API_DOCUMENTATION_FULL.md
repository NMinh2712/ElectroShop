# ElectroShop API Documentation - Complete Guide

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
Tất cả các API yêu cầu authentication cần gửi JWT token trong header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Role Requirements
- **ROLE_ADMIN**: Chỉ Admin mới có quyền truy cập
- **ROLE_STAFF**: Staff có quyền xem và quản lý đơn hàng, xem sản phẩm
- **ROLE_USER**: User đã đăng nhập (Customer)
- **PUBLIC**: Không cần authentication (Guest có thể truy cập)

---

## 1. Authentication APIs (Guest/Public)

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

### 1.3. Verify Email (TODO - Cần implement)
- **Endpoint**: `POST /auth/verify-email`
- **Role**: PUBLIC
- **Request Body**:
```json
{
  "token": "verification_token_from_email"
}
```

### 1.4. Forgot Password (TODO - Cần implement)
- **Endpoint**: `POST /auth/forgot-password`
- **Role**: PUBLIC
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```

### 1.5. Reset Password (TODO - Cần implement)
- **Endpoint**: `POST /auth/reset-password`
- **Role**: PUBLIC
- **Request Body**:
```json
{
  "token": "reset_token",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

---

## 2. Public Product APIs (Guest/User)

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
        "defaultPrice": 25000000,
        "imageUrl": "/uploads/uuid-filename.jpg",
        "brandId": 1,
        "categoryId": 1
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
    "defaultPrice": 25000000,
    "imageUrl": "/uploads/uuid-filename.jpg",
    "brandId": 1,
    "categoryId": 1,
    "variants": [
      {
        "variantId": 1,
        "sku": "LAPTOP-ASUS-001-512GB",
        "attributes": "Storage: 512GB SSD",
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
}
```

### 2.3. Get Product by Slug
- **Endpoint**: `GET /products/slug/{slug}`
- **Role**: PUBLIC
- **Response**: Same as Get Product by ID

---

## 3. Customer APIs (ROLE_USER)

### 3.1. Profile Management

#### 3.1.1. Get Profile
- **Endpoint**: `GET /user/profile`
- **Role**: ROLE_USER
- **Response**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "userId": 1,
    "username": "string",
    "email": "string",
    "name": "string",
    "phone": "string",
    "shippingAddress": "string",
    "avatarUrl": "string",
    "roleId": 3
  }
}
```

#### 3.1.2. Update Profile
- **Endpoint**: `PUT /user/profile`
- **Role**: ROLE_USER
- **Request Body**:
```json
{
  "name": "string",
  "phone": "string",
  "shippingAddress": "string",
  "avatarUrl": "string"
}
```

#### 3.1.3. Change Password
- **Endpoint**: `PUT /user/change-password`
- **Role**: ROLE_USER
- **Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

#### 3.1.4. Logout
- **Endpoint**: `POST /user/logout`
- **Role**: ROLE_USER
- **Response**:
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

### 3.2. Cart Management

#### 3.2.1. Add Product to Cart
- **Endpoint**: `POST /user/cart`
- **Role**: ROLE_USER
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
        "variantId": 1,
        "productId": 1,
        "productName": "ASUS ZenBook 14 OLED",
        "sku": "LAPTOP-ASUS-001-512GB",
        "attributes": "Storage: 512GB SSD",
        "price": 25000000,
        "quantity": 2,
        "subtotal": 50000000,
        "imageUrl": "/uploads/uuid-filename.jpg"
      }
    ],
    "totalItems": 2,
    "totalPrice": 50000000
  }
}
```

#### 3.2.2. View Cart
- **Endpoint**: `GET /user/cart`
- **Role**: ROLE_USER
- **Response**: Same as Add Product to Cart

#### 3.2.3. Update Cart Quantity
- **Endpoint**: `PUT /user/cart/{variantId}`
- **Role**: ROLE_USER
- **Request Body**:
```json
{
  "quantity": 3
}
```

#### 3.2.4. Remove Product from Cart
- **Endpoint**: `DELETE /user/cart/{variantId}`
- **Role**: ROLE_USER

#### 3.2.5. Clear Cart
- **Endpoint**: `DELETE /user/cart`
- **Role**: ROLE_USER

### 3.3. Checkout

#### 3.3.1. Checkout
- **Endpoint**: `POST /user/checkout`
- **Role**: ROLE_USER
- **Request Body**:
```json
{
  "shippingAddress": "123 Main St, City",
  "paymentMethod": "CREDIT_CARD",
  "voucherId": 1,
  "note": "Please deliver in the morning"
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
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

### 3.4. Orders

#### 3.4.1. Get My Orders
- **Endpoint**: `GET /user/orders`
- **Role**: ROLE_USER
- **Query Parameters**: `page`, `size`, `sortBy`, `sortDir`, `statusId` (optional)
- **Response**:
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "orderId": 1,
        "totalPrice": 50000000,
        "status": "PENDING",
        "createdAt": "2024-01-01T00:00:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 5,
    "totalPages": 1
  }
}
```

#### 3.4.2. Get Order Detail
- **Endpoint**: `GET /user/orders/{id}`
- **Role**: ROLE_USER
- **Response**: Same as Staff Get Order Detail

#### 3.4.3. Cancel Order
- **Endpoint**: `PUT /user/orders/{id}/cancel`
- **Role**: ROLE_USER
- **Request Body**:
```json
{
  "reason": "Changed my mind"
}
```

### 3.5. Comment/Rating (TODO - Cần implement)

#### 3.5.1. Add Comment
- **Endpoint**: `POST /user/products/{productId}/comments`
- **Role**: ROLE_USER
- **Request Body**:
```json
{
  "content": "Great product!",
  "rating": 5,
  "parentCommentId": null
}
```

#### 3.5.2. Update Comment
- **Endpoint**: `PUT /user/comments/{commentId}`
- **Role**: ROLE_USER

#### 3.5.3. Delete Comment
- **Endpoint**: `DELETE /user/comments/{commentId}`
- **Role**: ROLE_USER

---

## 4. Staff APIs (ROLE_STAFF)

### 4.1. Product Management (Read Only)

#### 4.1.1. Get All Products
- **Endpoint**: `GET /staff/product`
- **Role**: ROLE_STAFF or ROLE_ADMIN
- **Query Parameters**: Same as Public Get All Products
- **Response**: Same as Public Get All Products

#### 4.1.2. Get Product by ID
- **Endpoint**: `GET /staff/product/{id}`
- **Role**: ROLE_STAFF or ROLE_ADMIN
- **Response**: Same as Public Get Product by ID

### 4.2. Order Management

#### 4.2.1. Get All Orders
- **Endpoint**: `GET /staff/order`
- **Role**: ROLE_STAFF or ROLE_ADMIN
- **Query Parameters**: `page`, `size`, `sortBy`, `sortDir`, `statusId` (optional)
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
        "userName": "John Doe",
        "totalPrice": 50000000,
        "status": "PENDING",
        "statusName": "Pending",
        "createdAt": "2024-01-01T00:00:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 50,
    "totalPages": 5
  }
}
```

#### 4.2.2. Get Order Detail
- **Endpoint**: `GET /staff/order/{id}`
- **Role**: ROLE_STAFF or ROLE_ADMIN
- **Response**:
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "orderId": 1,
    "userId": 1,
    "userName": "John Doe",
    "totalPrice": 50000000,
    "shippingAddress": "123 Main St",
    "status": "PENDING",
    "statusName": "Pending",
    "note": "Please deliver in the morning",
    "createdAt": "2024-01-01T00:00:00",
    "items": [
      {
        "variantId": 1,
        "productId": 1,
        "productName": "ASUS ZenBook 14 OLED",
        "sku": "LAPTOP-ASUS-001-512GB",
        "quantity": 2,
        "unitPrice": 25000000,
        "subtotal": 50000000
      }
    ],
    "payment": {
      "paymentId": 1,
      "paymentMethod": "CREDIT_CARD",
      "paymentStatus": "PENDING",
      "amount": 50000000
    }
  }
}
```

#### 4.2.3. Update Order Status
- **Endpoint**: `PUT /staff/order/{id}/status`
- **Role**: ROLE_STAFF or ROLE_ADMIN
- **Request Body**:
```json
{
  "statusId": 2
}
```
- **Response**: Same as Get Order Detail

---

## 5. Admin APIs (ROLE_ADMIN)

### 5.1. Product Management

#### 5.1.1. Add Product (with Image Upload)
- **Endpoint**: `POST /admin/product/add`
- **Role**: ROLE_ADMIN
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `image` (file): Product image (jpg, jpeg, png, webp, max 5MB)
  - `name` (string): Product name
  - `slug` (string, optional): URL-friendly slug
  - `shortDescription` (string, optional): Short description
  - `fullDescription` (string, optional): Full description
  - `brandId` (long): Brand ID
  - `categoryId` (long): Category ID
  - `modelNumber` (string, optional): Model number
  - `releaseYear` (integer, optional): Release year
  - `defaultPrice` (decimal): Default price
  - `variants` (string, JSON): Array of variants
  - `specifications` (string, JSON): Array of specifications
- **Variants JSON Format**:
```json
[
  {
    "sku": "LAPTOP-ASUS-001-512GB",
    "attributes": "Storage: 512GB SSD, Color: Jade Black",
    "price": 25000000,
    "stock": 50,
    "isActive": true
  }
]
```
- **Specifications JSON Format**:
```json
[
  {
    "specKey": "Screen Size",
    "specValue": "14 inches"
  }
]
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
    "imageUrl": "/uploads/uuid-filename.jpg",
    "variantCount": 2,
    "specificationCount": 10,
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

#### 5.1.2. Update Product
- **Endpoint**: `PUT /admin/product/{id}`
- **Role**: ROLE_ADMIN
- **Request Body**: Same as AddProductRequest (JSON)
- **Response**: ProductDetailResponse

#### 5.1.3. Get All Products
- **Endpoint**: `GET /admin/product`
- **Role**: ROLE_ADMIN
- **Query Parameters**: Same as Public Get All Products
- **Response**: ProductPageResponse

#### 5.1.4. Get Product by ID
- **Endpoint**: `GET /admin/product/{id}`
- **Role**: ROLE_ADMIN
- **Response**: ProductDetailResponse

#### 5.1.5. Delete Product
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

### 5.2. Category Management

#### 5.2.1. Create Category
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

#### 5.2.2. Update Category
- **Endpoint**: `PUT /admin/category/{id}`
- **Role**: ROLE_ADMIN

#### 5.2.3. Get All Categories
- **Endpoint**: `GET /admin/category`
- **Role**: ROLE_ADMIN

#### 5.2.4. Get Category by ID
- **Endpoint**: `GET /admin/category/{id}`
- **Role**: ROLE_ADMIN

#### 5.2.5. Delete Category
- **Endpoint**: `DELETE /admin/category/{id}`
- **Role**: ROLE_ADMIN

### 5.3. Order Management

#### 5.3.1. Get All Orders
- **Endpoint**: `GET /admin/order`
- **Role**: ROLE_ADMIN
- **Same as Staff Get All Orders**

#### 5.3.2. Get Order Detail
- **Endpoint**: `GET /admin/order/{id}`
- **Role**: ROLE_ADMIN
- **Same as Staff Get Order Detail**

#### 5.3.3. Update Order Status
- **Endpoint**: `PUT /admin/order/{id}/status`
- **Role**: ROLE_ADMIN
- **Same as Staff Update Order Status**

### 5.4. User Management (TODO - Cần implement)

#### 5.4.1. Get All Users
- **Endpoint**: `GET /admin/user`
- **Role**: ROLE_ADMIN
- **Query Parameters**: `page`, `size`, `roleId` (optional), `isBanned` (optional)

#### 5.4.2. Get User by ID
- **Endpoint**: `GET /admin/user/{id}`
- **Role**: ROLE_ADMIN

#### 5.4.3. Ban User
- **Endpoint**: `PUT /admin/user/{id}/ban`
- **Role**: ROLE_ADMIN
- **Request Body**:
```json
{
  "isBanned": true,
  "reason": "Violation of terms"
}
```

#### 5.4.4. Create Staff Account
- **Endpoint**: `POST /admin/user/staff`
- **Role**: ROLE_ADMIN
- **Request Body**:
```json
{
  "username": "staff1",
  "email": "staff@example.com",
  "password": "string",
  "name": "Staff Name",
  "phone": "string"
}
```

#### 5.4.5. Update Staff Profile
- **Endpoint**: `PUT /admin/user/staff/{id}`
- **Role**: ROLE_ADMIN

#### 5.4.6. Delete Staff
- **Endpoint**: `DELETE /admin/user/staff/{id}`
- **Role**: ROLE_ADMIN

### 5.5. Statistics (TODO - Cần implement)

#### 5.5.1. Get Order Statistics
- **Endpoint**: `GET /admin/statistics/orders`
- **Role**: ROLE_ADMIN
- **Query Parameters**: `startDate`, `endDate`

#### 5.5.2. Get Revenue Statistics
- **Endpoint**: `GET /admin/statistics/revenue`
- **Role**: ROLE_ADMIN

#### 5.5.3. Get Product Sales Statistics
- **Endpoint**: `GET /admin/statistics/products`
- **Role**: ROLE_ADMIN

### 5.6. Voucher/Promotion Management (TODO - Cần implement)

#### 5.6.1. Create Voucher
- **Endpoint**: `POST /admin/voucher`
- **Role**: ROLE_ADMIN

#### 5.6.2. Update Voucher
- **Endpoint**: `PUT /admin/voucher/{id}`
- **Role**: ROLE_ADMIN

#### 5.6.3. Get All Vouchers
- **Endpoint**: `GET /admin/voucher`
- **Role**: ROLE_ADMIN

#### 5.6.4. Delete Voucher
- **Endpoint**: `DELETE /admin/voucher/{id}`
- **Role**: ROLE_ADMIN

---

## 6. Image Upload Flow

### 6.1. Upload Process
1. Client sends `multipart/form-data` request with image file
2. Server validates file (type: jpg/jpeg/png/webp, size < 5MB)
3. Server generates unique filename: `UUID + extension`
4. Server saves file to `uploads/` folder
5. Server returns image URL: `/uploads/{filename}`
6. Client can access image via: `http://localhost:8080/uploads/{filename}`

### 6.2. Image URL Format
- **Stored in DB**: `/uploads/uuid-filename.jpg`
- **Full URL**: `http://localhost:8080/uploads/uuid-filename.jpg`
- **Frontend Usage**: Use the stored URL directly or prepend base URL

### 6.3. File Validation
- **Allowed Types**: jpg, jpeg, png, webp
- **Max Size**: 5MB
- **Content-Type Validation**: Server checks both extension and content-type

---

## 7. Error Responses

### 7.1. Standard Error Format
```json
{
  "success": false,
  "code": "E0400",
  "message": "Error message",
  "originMessage": "Original exception message"
}
```

### 7.2. Common Error Codes
- `E9999`: Access Denied (403)
- `E9998`: Unauthorized (401)
- `E0400`: Bad Request (400)
- `E0404`: Resource Not Found (404)
- `E0500`: Internal Server Error (500)

---

## 8. Pagination

All list endpoints support pagination:
- `page`: Page number (0-based, default: 0)
- `size`: Page size (default: 10)
- `sortBy`: Sort field (default: "createdAt")
- `sortDir`: Sort direction - "ASC" or "DESC" (default: "DESC")

---

## 9. Notes for Frontend Developers

### 9.1. Image Upload
- Use `FormData` for multipart/form-data requests
- Example:
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('name', 'Product Name');
formData.append('brandId', '1');
formData.append('categoryId', '1');
formData.append('defaultPrice', '25000000');
formData.append('variants', JSON.stringify(variantsArray));
formData.append('specifications', JSON.stringify(specsArray));

fetch('/api/v1/admin/product/add', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

### 9.2. Image Display
- Use the `imageUrl` from API response
- Prepend base URL if needed: `http://localhost:8080${imageUrl}`
- Example: `<img src={`http://localhost:8080${product.imageUrl}`} />`

### 9.3. Authentication
- Store JWT token after login
- Include in all authenticated requests: `Authorization: Bearer {token}`
- Handle 401 (Unauthorized) by redirecting to login

### 9.4. Error Handling
- Check `success` field in response
- Display `message` to user
- Log `originMessage` for debugging

---

## 10. Testing

### 10.1. Postman Collections
- `ElectroShop_Product_Admin_API.postman_collection.json` - Product Admin APIs
- `ElectroShop_Category_Admin_API.postman_collection.json` - Category Admin APIs
- `ElectroShop_Order_Admin_API.postman_collection.json` - Order Admin APIs
- `ElectroShop_Public_Product_API.postman_collection.json` - Public Product APIs
- `ElectroShop_Cart_Management_API.postman_collection.json` - Cart Management APIs
- `ElectroShop_Checkout_API.postman_collection.json` - Checkout APIs

### 10.2. Base URL Variable
Set `base_url` variable in Postman: `http://localhost:8080`

### 10.3. JWT Token Variable
After login, save token to `jwt_token` variable and use in Authorization header.

