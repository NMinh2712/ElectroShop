# Debug Guide - Image Upload Issue

## 🔍 Vấn đề

Product được tạo thành công nhưng `imageUrl` là `null` trong response.

## ✅ Đã sửa

1. **Thêm validation chi tiết hơn:**
   - Check `image != null && !image.isEmpty() && image.getSize() > 0`
   - Verify file được save thành công trước khi return URL

2. **Thêm logging chi tiết:**
   - Log khi bắt đầu xử lý image
   - Log filename và size
   - Log imageUrl sau khi upload
   - Log nếu image không được cung cấp

3. **Cải thiện error handling:**
   - Throw exception rõ ràng nếu file không được save
   - Validate file trước khi save

## 🧪 Cách kiểm tra

### 1. Kiểm tra Logs

Khi test add product với image, check logs để xem:

```
DEBUG - Processing image upload - Original filename: test.jpg, Size: 12345 bytes
INFO - File stored successfully: /path/to/uploads/uuid.jpg -> URL: /uploads/uuid.jpg
INFO - Product image uploaded successfully: /uploads/uuid.jpg
DEBUG - Image URL set to request: /uploads/uuid.jpg
```

**Nếu không thấy logs này:**
- Image không được gửi từ frontend
- Image bị empty hoặc size = 0

### 2. Kiểm tra Request từ Frontend

**Trong Postman:**
1. Chọn tab **Body** → **form-data**
2. Đảm bảo có field `image` với type là **File**
3. Chọn một file image (jpg, png, jpeg, webp)
4. Check file size < 5MB

**Trong Browser DevTools (nếu dùng Frontend):**
1. Mở Network tab
2. Tìm request đến `/api/v1/admin/product/add`
3. Check **Request Payload** hoặc **Form Data**
4. Đảm bảo có field `image` với file data

### 3. Kiểm tra File System

Sau khi upload thành công, check thư mục `uploads/`:
- File có được tạo không?
- File có đúng tên không? (UUID + extension)
- File có size > 0 không?

**Location:** `{project_root}/uploads/` hoặc path được config trong `application.properties`

### 4. Kiểm tra Database

Query database để xem `image_url` có được lưu không:

```sql
SELECT product_id, name, image_url 
FROM Products 
WHERE product_id = {your_product_id};
```

**Nếu `image_url` là NULL:**
- Image không được upload (check logs)
- Image upload fail nhưng không throw exception
- Request không có image field

## 🔧 Các trường hợp có thể xảy ra

### Case 1: Image không được gửi
**Symptoms:**
- Log: "No image provided or image is empty"
- `imageUrl` = null trong response

**Solution:**
- Đảm bảo Frontend gửi field `image` trong FormData
- Check Postman có chọn file trong form-data không

### Case 2: Image upload fail
**Symptoms:**
- Log: "Image validation failed" hoặc "Failed to upload image"
- Exception được throw

**Solution:**
- Check file type (chỉ jpg, jpeg, png, webp)
- Check file size (< 5MB)
- Check file có extension không
- Check quyền ghi vào thư mục `uploads/`

### Case 3: File được save nhưng URL không được set
**Symptoms:**
- Log: "File stored successfully" nhưng không có "Image URL set to request"
- `imageUrl` = null trong response

**Solution:**
- Check `uploadProductImage` có return URL không
- Check `request.setImageUrl()` có được gọi không
- Check exception có bị catch và ignore không

### Case 4: Database không lưu imageUrl
**Symptoms:**
- Log: "Image URL set to request: /uploads/xxx.jpg"
- Nhưng database `image_url` = NULL

**Solution:**
- Check Product entity có field `imageUrl` không
- Check `@Column(name = "image_url")` mapping đúng không
- Check database column `image_url` có tồn tại không

## 📝 Test Cases

### Test 1: Upload với image hợp lệ
```
Request:
- product: {"name":"Test","brandId":1,"categoryId":1,"defaultPrice":1000000}
- image: [valid jpg file, < 5MB]

Expected:
- Status: 201
- imageUrl: "/uploads/{uuid}.jpg"
- File exists in uploads/ folder
```

### Test 2: Upload không có image
```
Request:
- product: {"name":"Test","brandId":1,"categoryId":1,"defaultPrice":1000000}
- (no image field)

Expected:
- Status: 201
- imageUrl: null
- No error
```

### Test 3: Upload với file không hợp lệ
```
Request:
- product: {...}
- image: [invalid file type or > 5MB]

Expected:
- Status: 400
- Error message về file validation
```

## 🐛 Debug Steps

1. **Enable DEBUG logging:**
   ```properties
   logging.level.com.fptu.group1.controller.admin=DEBUG
   logging.level.com.fptu.group1.service.impl=DEBUG
   ```

2. **Test với Postman:**
   - Import collection `ElectroShop_Add_Product_Multipart.postman_collection.json`
   - Set `admin_token` variable
   - Chọn request "Add Product with Image (Multipart)"
   - Chọn file image
   - Send request
   - Check logs

3. **Check response:**
   - Status code
   - Response body có `imageUrl` không
   - `imageUrl` có giá trị không

4. **Check file system:**
   - Navigate to `uploads/` folder
   - Check file có được tạo không

5. **Check database:**
   - Query `Products` table
   - Check `image_url` column

## 📚 Related Files

- `ProductAdminController.java` - Controller xử lý request
- `ProductAdminServiceImpl.java` - Service xử lý business logic
- `FileStorageServiceImpl.java` - Service lưu file
- `WebConfig.java` - Cấu hình static resource handler
- `application.properties` - Cấu hình multipart

## ⚠️ Lưu ý

1. **Thư mục uploads phải có quyền ghi**
2. **File size limit: 5MB** (config trong `application.properties`)
3. **Allowed file types:** jpg, jpeg, png, webp
4. **Image URL format:** `/uploads/{uuid}.{extension}`
5. **Static resource handler:** `/uploads/**` được expose qua `WebConfig`

