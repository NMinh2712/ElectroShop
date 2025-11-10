# Hướng dẫn Test Add Product với Multipart FormData

## 📋 Tổng quan

Postman collection này dùng để test API **Add Product** với image upload sử dụng `multipart/form-data`.

## 🚀 Cách sử dụng

### 1. Import Collection vào Postman

1. Mở Postman
2. Click **Import** button
3. Chọn file `ElectroShop_Add_Product_Multipart.postman_collection.json`
4. Collection sẽ xuất hiện trong Postman

### 2. Cấu hình Variables

Trong Postman collection, cần set các variables:

- **`base_url`**: URL của backend (mặc định: `http://localhost:8080`)
- **`admin_token`**: JWT token của Admin user

**Cách set variables:**
1. Click vào collection name
2. Chọn tab **Variables**
3. Set giá trị cho `base_url` và `admin_token`

**Lấy Admin Token:**
```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

Copy `token` từ response và paste vào `admin_token` variable.

### 3. Test các Request

Collection có 4 requests:

#### ✅ Request 1: Add Product with Image (Multipart)
- **Method**: POST
- **URL**: `{{base_url}}/api/v1/admin/product/add`
- **Body Type**: form-data
- **Fields**:
  - `product`: JSON string (required)
  - `image`: File (optional)
  - `variants`: JSON string (optional)
  - `specifications`: JSON string (optional)

**Example:**
```
product: {"name":"Lenovo Legion 5 Pro","brandId":2,"categoryId":2,"defaultPrice":23001000}
image: [Select file]
variants: [{"sku":"Legion-512GB","price":360000,"stock":12,"isActive":true}]
specifications: [{"specKey":"Processor","specValue":"AMD Ryzen 7"}]
```

#### ✅ Request 2: Add Product without Image
- Tương tự Request 1 nhưng không có `image` field
- Image có thể set sau qua update endpoint

#### ✅ Request 3: Add Product - Minimal Data
- Chỉ có field `product` với các field bắt buộc:
  - `name`
  - `brandId`
  - `categoryId`
  - `defaultPrice`
- Slug sẽ tự động generate từ name

#### ✅ Request 4: Add Product - JSON Endpoint
- **Method**: POST
- **URL**: `{{base_url}}/api/v1/admin/product/add/json`
- **Content-Type**: `application/json`
- **Body**: JSON object (không phải string)
- Dùng khi không cần upload image

## 📝 Format của các Fields

### Product JSON String
```json
{
  "name": "Product Name",
  "slug": "product-slug",  // optional, auto-generated if not provided
  "shortDescription": "Short description",
  "fullDescription": "Full description",
  "brandId": 1,
  "categoryId": 1,
  "modelNumber": "MODEL-123",
  "releaseYear": 2024,
  "defaultPrice": 1000000
}
```

**Required fields:**
- `name`
- `brandId`
- `categoryId`
- `defaultPrice`

### Variants JSON String
```json
[
  {
    "sku": "SKU-001",
    "attributes": "512GB SSD, 16GB RAM",
    "price": 1000000,
    "stock": 10,
    "isActive": true
  }
]
```

### Specifications JSON String
```json
[
  {
    "specKey": "Processor",
    "specValue": "Intel Core i7"
  },
  {
    "specKey": "RAM",
    "specValue": "16GB"
  }
]
```

## ⚠️ Lưu ý quan trọng

1. **Tất cả JSON fields phải là STRING**, không phải JSON object
   - ✅ Đúng: `product` = `"{\"name\":\"Test\"}"`
   - ❌ Sai: `product` = `{"name":"Test"}` (sẽ bị lỗi parse)

2. **Image file requirements:**
   - Allowed types: `jpg`, `jpeg`, `png`, `webp`
   - Max size: `5MB`
   - Field name: `image`

3. **Content-Type header:**
   - KHÔNG set `Content-Type` header khi dùng form-data
   - Postman tự động set boundary cho multipart

4. **Authorization:**
   - Phải có JWT token trong header
   - Token phải có role `ADMIN`

## 🧪 Test Scripts

Mỗi request đã có test scripts tự động:
- Check status code (201 for success)
- Check response structure
- Validate product data

## 📊 Expected Response

**Success (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "productId": 1,
    "name": "Lenovo Legion 5 Pro",
    "slug": "lenovo-legion-5-pro",
    "brandId": 2,
    "categoryId": 2,
    "imageUrl": "/uploads/product_1234567890.jpg",
    "variantCount": 1,
    "specificationCount": 2,
    "createdAt": "2025-01-15T10:30:00",
    "message": "Product created successfully"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Product JSON is required",
  "code": "E0400"
}
```

## 🔍 Troubleshooting

### Lỗi: "Content-Type not supported"
- **Nguyên nhân**: Đang set `Content-Type: application/json` header
- **Giải pháp**: Xóa header `Content-Type` khi dùng form-data

### Lỗi: "Product JSON is required"
- **Nguyên nhân**: Field `product` bị thiếu hoặc empty
- **Giải pháp**: Đảm bảo có field `product` với JSON string hợp lệ

### Lỗi: "Invalid product JSON format"
- **Nguyên nhân**: JSON string không hợp lệ
- **Giải pháp**: Kiểm tra JSON string có đúng format không (escape quotes, etc.)

### Lỗi: "401 Unauthorized"
- **Nguyên nhân**: Token không hợp lệ hoặc thiếu
- **Giải pháp**: Lấy token mới từ login endpoint và update `admin_token` variable

### Lỗi: "403 Forbidden"
- **Nguyên nhân**: User không có role ADMIN
- **Giải pháp**: Đăng nhập với account có role ADMIN

## 📚 Tham khảo

- API Documentation: `API_DOCUMENTATION_FULL.md`
- Frontend Guide: `FRONTEND_API_GUIDE.md`

