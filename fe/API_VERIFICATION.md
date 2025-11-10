# API Verification - Add Product

## API Documentation Requirements

**Endpoint**: `POST /admin/product/add`  
**Role**: ROLE_ADMIN  
**Content-Type**: `multipart/form-data`

### Form Data Fields (Theo Documentation gốc):
- `image` (file): Product image
- `name` (string): Product name
- `slug` (string, optional)
- `shortDescription` (string, optional)
- `fullDescription` (string, optional)
- `brandId` (long): Brand ID
- `categoryId` (long): Category ID
- `modelNumber` (string, optional)
- `releaseYear` (integer, optional)
- `defaultPrice` (decimal): Default price
- `variants` (string, JSON): Array of variants
- `specifications` (string, JSON): Array of specifications

### Backend Implementation (Theo user message):
Backend đã được sửa để nhận:
- `image` (file): MultipartFile
- `product` (string): JSON string chứa tất cả product fields
- `variants` (string): JSON string
- `specifications` (string): JSON string

## Frontend Implementation Check

### ✅ Current Implementation

**File**: `components/admin-product-form.tsx`

```typescript
// Prepare product JSON object
const productData = {
  name: formData.name,
  slug: formData.slug || generateSlug(formData.name),
  shortDescription: formData.shortDescription || null,
  fullDescription: formData.fullDescription || null,
  brandId: parseInt(formData.brandId),
  categoryId: parseInt(formData.categoryId),
  modelNumber: formData.modelNumber || null,
  releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : null,
  defaultPrice: parseFloat(formData.defaultPrice),
}

// Create FormData
const formDataToSend = new FormData()
formDataToSend.append("image", imageFile)
formDataToSend.append("product", JSON.stringify(productData))
formDataToSend.append("variants", JSON.stringify(variantsJson))
formDataToSend.append("specifications", JSON.stringify(specsJson))
```

### ✅ Variants Format

```typescript
const variantsJson = variants.map((v) => ({
  sku: v.sku,
  attributes: v.attributes || "",
  price: parseFloat(v.price as string),
  stock: parseInt(v.stock as string),
  isActive: v.isActive !== false,
}))
```

**Expected by API**:
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

✅ **Match**: ✅

### ✅ Specifications Format

```typescript
const specsJson = specifications.filter((s) => s.specKey && s.specValue)
```

**Expected by API**:
```json
[
  {
    "specKey": "Screen Size",
    "specValue": "14 inches"
  }
]
```

✅ **Match**: ✅

## API Client Check

**File**: `lib/api-client.ts`

```typescript
async adminCreateProduct(data: FormData): Promise<ApiResponse<any>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  const headers: Record<string, string> = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  // Don't set Content-Type - browser sets it automatically with boundary

  const response = await fetch(`${this.baseUrl}/admin/product/add`, {
    method: "POST",
    headers,
    body: data,
  })
  // ... error handling
}
```

**Base URL**: `http://localhost:8080/api/v1`  
**Full Endpoint**: `http://localhost:8080/api/v1/admin/product/add`

✅ **Correct**

## Verification Checklist

- [x] Endpoint: `/admin/product/add` ✅
- [x] Method: POST ✅
- [x] Content-Type: multipart/form-data (auto-set by browser) ✅
- [x] Authorization header với JWT token ✅
- [x] Image file được append đúng ✅
- [x] Product data được stringify thành JSON ✅
- [x] Variants được stringify thành JSON array ✅
- [x] Specifications được stringify thành JSON array ✅
- [x] All required fields present ✅
- [x] Data types correct (brandId, categoryId as numbers, price as decimal) ✅

## Potential Issues to Check

1. **Backend Compatibility**: 
   - Nếu backend vẫn expect các field riêng lẻ → cần sửa lại
   - Nếu backend đã update để nhận `product` JSON → OK

2. **Error Handling**: 
   - ✅ Đã có error handling
   - ✅ Log chi tiết errors

3. **Response Handling**:
   - ✅ Check response.ok
   - ✅ Parse JSON response
   - ✅ Handle error responses

## Testing Recommendations

1. Test với valid data → should work
2. Test với missing required fields → should show validation errors
3. Test với invalid image format → should show error
4. Test với invalid JSON → should show parsing error
5. Check network tab để verify FormData structure

