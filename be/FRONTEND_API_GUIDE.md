# Frontend API Guide - Add Product với Image Upload

## 📌 Endpoint

**POST** `/api/v1/admin/product/add`

**Content-Type:** `multipart/form-data`

**Authorization:** Required (JWT Token với role ADMIN)

---

## 📤 Cách gửi request từ Frontend

### ✅ Axios Example

```javascript
const formData = new FormData();

// 1. Gửi product data dưới dạng JSON string
formData.append("product", JSON.stringify({
  name: "Lenovo Legion",
  slug: "lenovo-legion", // optional, sẽ tự generate nếu không có
  shortDescription: "Gaming laptop",
  fullDescription: "Full description here...",
  brandId: 2,
  categoryId: 2,
  modelNumber: "G713RW-RTX3070", // optional
  releaseYear: 2025, // optional
  defaultPrice: 23001000
}));

// 2. Gửi image file (optional)
if (imageFile) {
  formData.append("image", imageFile);
}

// 3. Gửi variants dưới dạng JSON string (optional)
formData.append("variants", JSON.stringify([
  {
    "sku": "Legion",
    "attributes": "512",
    "price": 360000,
    "stock": 12,
    "isActive": true
  }
]));

// 4. Gửi specifications dưới dạng JSON string (optional)
formData.append("specifications", JSON.stringify([
  {
    "specKey": "RAM",
    "specValue": "16GB"
  },
  {
    "specKey": "Storage",
    "specValue": "512GB SSD"
  }
]));

// 5. Gửi request
const response = await axios.post(
  "/api/v1/admin/product/add",
  formData,
  {
    headers: {
      "Authorization": `Bearer ${token}`,
      // KHÔNG set Content-Type header - Axios tự động set boundary cho multipart
    }
  }
);
```

---

## 📋 FormData Fields

| Field Name      | Type   | Required | Description                                    |
| --------------- | ------ | -------- | ---------------------------------------------- |
| `product`       | String | ✅ Yes   | JSON string chứa product data                  |
| `image`         | File   | ❌ No    | Image file (jpg, png, jpeg, gif, webp)        |
| `variants`      | String | ❌ No    | JSON string chứa array of variants             |
| `specifications`| String | ❌ No    | JSON string chứa array of specifications       |

---

## 📝 Product JSON Structure

```json
{
  "name": "string (required)",
  "slug": "string (optional)",
  "shortDescription": "string (optional)",
  "fullDescription": "string (optional)",
  "brandId": "number (required)",
  "categoryId": "number (required)",
  "modelNumber": "string (optional)",
  "releaseYear": "number (optional)",
  "defaultPrice": "number (required)"
}
```

---

## 📝 Variants JSON Structure

```json
[
  {
    "sku": "string (required)",
    "attributes": "string (optional)",
    "price": "number (required)",
    "stock": "number (optional, default: 0)",
    "isActive": "boolean (optional, default: true)"
  }
]
```

---

## 📝 Specifications JSON Structure

```json
[
  {
    "specKey": "string (required)",
    "specValue": "string (optional)"
  }
]
```

---

## ✅ Response Success

**Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "productId": 1,
    "name": "Lenovo Legion",
    "slug": "lenovo-legion",
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

---

## ❌ Error Responses

### 400 Bad Request - Invalid JSON Format

```json
{
  "success": false,
  "message": "Invalid product JSON format: ...",
  "code": "E0400"
}
```

### 400 Bad Request - Missing Required Field

```json
{
  "success": false,
  "message": "Product JSON is required",
  "code": "E0400"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized",
  "code": "E9998"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access Denied",
  "code": "E9999"
}
```

---

## 🔄 Alternative: JSON-only Endpoint (No Image Upload)

Nếu không cần upload image, có thể dùng endpoint JSON:

**POST** `/api/v1/admin/product/add/json`

**Content-Type:** `application/json`

```javascript
const response = await axios.post(
  "/api/v1/admin/product/add/json",
  {
    name: "Lenovo Legion",
    slug: "lenovo-legion",
    shortDescription: "Gaming laptop",
    fullDescription: "Full description...",
    brandId: 2,
    categoryId: 2,
    modelNumber: "G713RW-RTX3070",
    releaseYear: 2025,
    defaultPrice: 23001000,
    imageUrl: "/uploads/existing-image.jpg", // optional
    variants: [
      {
        sku: "Legion",
        attributes: "512",
        price: 360000,
        stock: 12,
        isActive: true
      }
    ],
    specifications: [
      {
        specKey: "RAM",
        specValue: "16GB"
      }
    ]
  },
  {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }
);
```

---

## ⚠️ Important Notes

1. **KHÔNG set `Content-Type` header** khi dùng FormData với Axios - Axios tự động set boundary
2. **Product data phải là JSON string**, không phải JSON object
3. **Variants và Specifications cũng phải là JSON string**
4. **Image file** sẽ được validate (type và size) trước khi upload
5. **Slug** sẽ tự động generate từ name nếu không được cung cấp
6. **Image URL** sẽ được tự động set sau khi upload thành công

---

## 🧪 Testing với Postman

1. Chọn method: **POST**
2. URL: `http://localhost:8080/api/v1/admin/product/add`
3. Headers:
   - `Authorization: Bearer <your-jwt-token>`
   - **KHÔNG set Content-Type** (Postman tự động set)
4. Body → form-data:
   - `product` (Text): `{"name":"Test","brandId":2,"categoryId":2,"defaultPrice":1000000}`
   - `image` (File): Chọn file image
   - `variants` (Text): `[{"sku":"SKU001","price":100000,"stock":10,"isActive":true}]`
   - `specifications` (Text): `[{"specKey":"RAM","specValue":"16GB"}]`

---

## 📚 Example: React Hook

```javascript
import { useState } from 'react';
import axios from 'axios';

const useAddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProduct = async (productData, imageFile, variants, specifications) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Add product data as JSON string
      formData.append("product", JSON.stringify(productData));
      
      // Add image if provided
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      // Add variants if provided
      if (variants && variants.length > 0) {
        formData.append("variants", JSON.stringify(variants));
      }
      
      // Add specifications if provided
      if (specifications && specifications.length > 0) {
        formData.append("specifications", JSON.stringify(specifications));
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/v1/admin/product/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
      setLoading(false);
      throw err;
    }
  };

  return { addProduct, loading, error };
};

export default useAddProduct;
```

---

## 🎯 Summary

| Request Type        | Endpoint                    | Content-Type          | Image Upload |
| ------------------- | --------------------------- | --------------------- | ------------ |
| FormData (Multipart)| `/api/v1/admin/product/add` | `multipart/form-data` | ✅ Yes       |
| JSON                | `/api/v1/admin/product/add/json` | `application/json` | ❌ No        |

