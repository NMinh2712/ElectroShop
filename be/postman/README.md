# ElectroShop Product Admin API - Postman Collection

## Mô tả
Collection này chứa các API request để test chức năng Add Product của Admin trong hệ thống ElectroShop.

## Cài đặt

1. Mở Postman
2. Click Import
3. Chọn file `ElectroShop_Product_Admin_API.postman_collection.json`
4. Collection sẽ được import vào Postman

## Biến môi trường

Collection sử dụng biến `base_url` mặc định là `http://localhost:8080`. Bạn có thể thay đổi trong phần Variables của collection hoặc tạo một Environment.

## Các Request trong Collection

### 1. Add Product - Laptop Example
- **Mô tả**: Thêm sản phẩm laptop với đầy đủ thông tin, variants và specifications
- **Method**: POST
- **Endpoint**: `/api/v1/admin/product/add`
- **Body**: JSON với thông tin laptop ASUS ZenBook 14 OLED

### 2. Add Product - Mouse Example
- **Mô tả**: Thêm sản phẩm chuột máy tính với nhiều biến thể màu sắc
- **Method**: POST
- **Endpoint**: `/api/v1/admin/product/add`
- **Body**: JSON với thông tin Logitech MX Master 3S

### 3. Add Product - Keyboard Example
- **Mô tả**: Thêm sản phẩm bàn phím cơ với các loại switch khác nhau
- **Method**: POST
- **Endpoint**: `/api/v1/admin/product/add`
- **Body**: JSON với thông tin Corsair K70 RGB TKL

### 4. Add Product - Minimal Example
- **Mô tả**: Thêm sản phẩm với các trường tối thiểu bắt buộc
- **Method**: POST
- **Endpoint**: `/api/v1/admin/product/add`
- **Body**: JSON với thông tin tối thiểu

### 5. Add Product - Error: Missing Required Fields
- **Mô tả**: Test validation error khi thiếu các trường bắt buộc
- **Method**: POST
- **Endpoint**: `/api/v1/admin/product/add`
- **Expected**: Response 400 Bad Request với thông báo validation error

### 6. Add Product - Error: Invalid Brand ID
- **Mô tả**: Test error khi brand ID không tồn tại
- **Method**: POST
- **Endpoint**: `/api/v1/admin/product/add`
- **Expected**: Response 404 Not Found với thông báo "Brand not found"

### 7. Add Product - Error: Duplicate SKU
- **Mô tả**: Test error khi có SKU trùng lặp trong variants
- **Method**: POST
- **Endpoint**: `/api/v1/admin/product/add`
- **Expected**: Response 400 Bad Request với thông báo "Duplicate SKU found in variants"

## Lưu ý

1. **Brand ID và Category ID**: Đảm bảo các ID này tồn tại trong database trước khi test. Bạn có thể cần tạo Brand và Category trước.

2. **SKU**: Mỗi variant phải có SKU duy nhất. Nếu SKU đã tồn tại trong database, request sẽ bị từ chối.

3. **Slug**: Nếu không cung cấp slug, hệ thống sẽ tự động tạo từ tên sản phẩm. Slug phải là duy nhất.

4. **Validation**: Tất cả các trường bắt buộc phải được điền:
   - `name`: Bắt buộc, tối đa 255 ký tự
   - `brandId`: Bắt buộc, phải là số dương
   - `categoryId`: Bắt buộc, phải là số dương
   - `variants`: Mỗi variant phải có `sku`, `price`, `stock`

## Cấu trúc Request Body

```json
{
  "name": "Tên sản phẩm",
  "slug": "url-friendly-slug", // Optional, sẽ tự động tạo nếu không có
  "shortDescription": "Mô tả ngắn",
  "fullDescription": "Mô tả chi tiết",
  "brandId": 1,
  "categoryId": 1,
  "modelNumber": "MODEL-123",
  "releaseYear": 2024,
  "defaultPrice": 1000000,
  "variants": [
    {
      "sku": "SKU-001",
      "attributes": "Color: Red, Size: Large",
      "price": 1000000,
      "stock": 50,
      "isActive": true
    }
  ],
  "specifications": [
    {
      "specKey": "Screen Size",
      "specValue": "15.6 inches"
    }
  ]
}
```

## Response thành công

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
    "variantCount": 2,
    "specificationCount": 10,
    "createdAt": "2024-01-01T10:00:00",
    "message": "Product created successfully"
  }
}
```

## Response lỗi

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "E0400",
  "errors": {
    "name": "Product name is required",
    "brandId": "Brand ID is required"
  }
}
```

### Resource Not Found (404)
```json
{
  "success": false,
  "message": "Brand not found with ID: 9999",
  "code": "E0404"
}
```

### Bad Request (400)
```json
{
  "success": false,
  "message": "Product with slug 'existing-slug' already exists",
  "code": "E0400"
}
```

