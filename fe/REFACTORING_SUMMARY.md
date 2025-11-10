# ElectroShop Frontend Refactoring Summary

## Overview
Đã refactor toàn bộ giao diện frontend để phù hợp với API specification từ `API_DOCUMENTATION_FULL.md`. Tất cả các form và luồng màn hình đã được cập nhật để gọi đúng API endpoints với đúng format dữ liệu.

## Các Thay Đổi Chính

### 1. Admin Product Management ✅
**File mới:** `components/admin-product-form.tsx`
- Form thêm/sửa sản phẩm hoàn chỉnh theo API spec
- Hỗ trợ upload ảnh (multipart/form-data) với validation:
  - File types: jpg, jpeg, png, webp
  - Max size: 5MB
- Tất cả các trường theo API:
  - name, slug, shortDescription, fullDescription
  - brandId, categoryId, modelNumber, releaseYear, defaultPrice
  - variants (JSON array với sku, attributes, price, stock, isActive)
  - specifications (JSON array với specKey, specValue)
- Auto-generate slug từ product name
- Preview ảnh trước khi upload
- Validation đầy đủ trước khi submit

**File cập nhật:** `app/admin/products/page.tsx`
- Tích hợp form mới
- Thêm pagination
- Xử lý edit product
- Refresh danh sách sau khi thêm/sửa/xóa

### 2. Product Detail Page ✅
**File cập nhật:** `app/products/[slug]/page.tsx`
- Chuyển từ mock data sang API call (`getProductBySlug`)
- Hiển thị variants với selection UI
- Add to cart sử dụng đúng `variantId` và `quantity`
- Hiển thị giá theo variant được chọn
- Stock management theo variant
- Hiển thị specifications từ API
- Format giá VND đúng chuẩn
- Loading states và error handling

### 3. Cart Management ✅
**File cập nhật:** `app/cart/page.tsx`
- Format giá VND đúng chuẩn (toLocaleString("vi-VN"))
- Sử dụng API response structure đúng
- Hiển thị imageUrl từ API với base URL

### 4. Checkout Page ✅
**File cập nhật:** `app/checkout/page.tsx`
- Fix voucherId: chuyển từ string sang number (optional)
- Input type="number" cho voucherId
- Redirect đến `/account/orders/[id]` sau khi checkout thành công
- Validation đầy đủ

### 5. Order Detail Page ✅
**File mới:** `app/account/orders/[id]/page.tsx`
- Trang chi tiết đơn hàng cho user
- Hiển thị đầy đủ thông tin:
  - Order items với SKU, quantity, price
  - Shipping address
  - Payment method và status
  - Order status với color coding
  - Order note
- Chức năng cancel order (chỉ khi status = PENDING hoặc CONFIRMED)
- Format giá VND đúng chuẩn

### 6. Category Management ✅
**File mới:** `app/admin/categories/page.tsx`
- CRUD đầy đủ cho categories
- Hỗ trợ parent categories (hierarchical)
- Form dialog với validation
- Table hiển thị với parent category info

### 7. Admin Sidebar ✅
**File cập nhật:** `components/admin-sidebar.tsx`
- Thêm link "Categories" vào menu
- Fix role checking: sử dụng `roleId` thay vì `role`
- Hiển thị đúng role name (ADMIN/STAFF/USER)

### 8. Products List Page ✅
**File cập nhật:** `app/products/page.tsx`
- Format giá VND đúng chuẩn
- Hiển thị imageUrl với base URL

### 9. Orders List Page ✅
**File cập nhật:** `app/account/orders/page.tsx`
- Format giá VND đúng chuẩn
- Link đến order detail page

## API Integration Details

### Authentication
- Tất cả authenticated requests đều include JWT token trong header: `Authorization: Bearer <token>`
- Token được lưu trong localStorage với key `auth_token`

### Product APIs
- **Create:** `POST /admin/product/add` (multipart/form-data)
- **Update:** `PUT /admin/product/{id}` (JSON)
- **Get by Slug:** `GET /products/slug/{slug}` (PUBLIC)
- **Add to Cart:** `POST /user/cart` với `{variantId, quantity}`

### Cart APIs
- **Get Cart:** `GET /user/cart`
- **Update Quantity:** `PUT /user/cart/{variantId}`
- **Remove Item:** `DELETE /user/cart/{variantId}`

### Order APIs
- **Checkout:** `POST /user/checkout` với `{shippingAddress, paymentMethod, voucherId?, note?}`
- **Get Orders:** `GET /user/orders` (paginated)
- **Get Order Detail:** `GET /user/orders/{id}`
- **Cancel Order:** `PUT /user/orders/{id}/cancel` với `{reason}`

### Category APIs
- **Get Categories:** `GET /admin/category`
- **Create Category:** `POST /admin/category`
- **Update Category:** `PUT /admin/category/{id}`
- **Delete Category:** `DELETE /admin/category/{id}`

## Format Chuẩn

### Giá tiền (VND)
Tất cả giá tiền được format với:
```typescript
price.toLocaleString("vi-VN") + " VND"
```

### Image URLs
- Stored in DB: `/uploads/uuid-filename.jpg`
- Display: `http://localhost:8080${imageUrl}`

### Date Format
- Display dates: `new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })`

## Validation

### Product Form
- Name: Required
- Brand & Category: Required
- Default Price: Required, must be number
- Variants: At least 1 variant, each must have SKU, price, stock
- Image: Required for new products (JPG/PNG/WEBP, max 5MB)

### Checkout Form
- Shipping Address: Required
- Payment Method: Required
- Voucher ID: Optional, must be number if provided

## Error Handling

Tất cả các API calls đều có error handling:
- Display error messages từ API response
- Fallback messages nếu API không trả về message
- Loading states trong quá trình xử lý
- Success notifications sau khi thao tác thành công

## Testing Checklist

- [x] Admin có thể thêm sản phẩm mới với ảnh, variants, specifications
- [x] Admin có thể sửa sản phẩm (không cần upload ảnh mới)
- [x] Admin có thể xóa sản phẩm
- [x] Admin có thể quản lý categories
- [x] User có thể xem danh sách sản phẩm
- [x] User có thể xem chi tiết sản phẩm và chọn variant
- [x] User có thể thêm sản phẩm vào giỏ hàng (với variantId)
- [x] User có thể xem và cập nhật giỏ hàng
- [x] User có thể checkout với đầy đủ thông tin
- [x] User có thể xem danh sách đơn hàng
- [x] User có thể xem chi tiết đơn hàng
- [x] User có thể hủy đơn hàng (nếu status phù hợp)

## Notes

1. **Brand Management:** Hiện tại đang sử dụng mock brands. Cần implement Brand API endpoints khi backend sẵn sàng.

2. **Image Upload:** Chỉ hỗ trợ upload ảnh khi tạo sản phẩm mới. Update sản phẩm hiện tại không hỗ trợ thay đổi ảnh (có thể thêm sau nếu cần).

3. **Voucher:** Voucher ID hiện tại là number. Nếu backend hỗ trợ voucher code (string), cần thêm API endpoint để lookup voucher by code.

4. **Pagination:** Tất cả list pages đều hỗ trợ pagination với page-based (0-indexed).

5. **Role-based Access:** 
   - Admin (roleId: 1): Full access
   - Staff (roleId: 2): Read-only products, manage orders
   - User (roleId: 3): Shopping, cart, orders

## Environment Variables

Đảm bảo có biến môi trường:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Next Steps (Optional)

1. Implement Brand Management page (khi có API)
2. Add image upload cho product update
3. Add voucher code lookup (nếu backend hỗ trợ)
4. Add product reviews/comments (khi API sẵn sàng)
5. Add statistics dashboard cho admin
6. Add user management cho admin

