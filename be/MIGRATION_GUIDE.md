# Migration Guide - Add image_url to Products Table

## Vấn đề
Hibernate validation phát hiện thiếu cột `image_url` trong bảng `Products` của database.

## Giải pháp

### Cách 1: Chạy SQL Script (Khuyến nghị)
1. Mở SQL Server Management Studio hoặc công cụ quản lý database
2. Kết nối đến database `ElectroShop`
3. Chạy script sau:

```sql
USE [ElectroShop]
GO

-- Check if column already exists before adding
IF NOT EXISTS (
    SELECT * 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Products]') 
    AND name = 'image_url'
)
BEGIN
    ALTER TABLE [dbo].[Products]
    ADD [image_url] [nvarchar](500) NULL;
    
    PRINT 'Column image_url added successfully to Products table';
END
ELSE
BEGIN
    PRINT 'Column image_url already exists in Products table';
END
GO
```

4. Sau khi chạy script, đổi lại `spring.jpa.hibernate.ddl-auto=validate` trong `application.properties`

### Cách 2: Dùng Hibernate Auto Update (Tạm thời)
1. File `application.properties` đã được đổi sang `spring.jpa.hibernate.ddl-auto=update`
2. Start application - Hibernate sẽ tự động thêm cột `image_url`
3. Sau khi start thành công, đổi lại `spring.jpa.hibernate.ddl-auto=validate` để tránh tự động thay đổi schema

## Lưu ý
- Cách 1 an toàn hơn và khuyến nghị cho production
- Cách 2 chỉ nên dùng trong development
- Sau khi thêm cột thành công, luôn đổi lại `ddl-auto=validate` để bảo vệ database

