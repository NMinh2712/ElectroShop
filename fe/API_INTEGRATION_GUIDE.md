# TPF Shop Frontend - API Integration Guide

This document provides a comprehensive guide on how the TPF Shop frontend integrates with the backend API according to the official API specification.

## Environment Configuration

Set the following environment variable in your project:

\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
\`\`\`

This URL must match your backend API server location. The frontend will automatically fallback to demo data if the API is unavailable.

## Authentication Flow

### Login Process
1. User enters username and password on `/auth/login`
2. Frontend calls `POST /auth/login` with credentials
3. Backend returns JWT token and user data including roleId
4. Token stored in localStorage for subsequent requests
5. User redirected based on role:
   - roleId 1 (Admin) → `/admin`
   - roleId 2 (Staff) → `/admin`
   - roleId 3 (User) → `/`

### Registration Process
1. User fills registration form with username, email, password, name, phone, shippingAddress
2. Frontend calls `POST /auth/register`
3. User automatically logged in after successful registration
4. Redirected to home page

### Authorization
All authenticated requests include JWT token in Authorization header:
\`\`\`
Authorization: Bearer <JWT_TOKEN>
\`\`\`

## API Endpoints Used

### Public Endpoints (No Authentication Required)
- `GET /products` - List all products with pagination
- `GET /products/{id}` - Get product details
- `GET /products/slug/{slug}` - Get product by slug
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### User Endpoints (roleId 3)
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile
- `PUT /user/change-password` - Change password
- `POST /user/logout` - Logout
- `GET /user/cart` - View cart
- `POST /user/cart` - Add to cart
- `PUT /user/cart/{variantId}` - Update cart quantity
- `DELETE /user/cart/{variantId}` - Remove from cart
- `DELETE /user/cart` - Clear cart
- `POST /user/checkout` - Create order
- `GET /user/orders` - Get user's orders (paginated)
- `GET /user/orders/{id}` - Get order details
- `PUT /user/orders/{id}/cancel` - Cancel order
- `POST /user/products/{productId}/comments` - Add comment
- `PUT /user/comments/{commentId}` - Update comment
- `DELETE /user/comments/{commentId}` - Delete comment

### Staff Endpoints (roleId 2)
- `GET /staff/product` - List products (read-only)
- `GET /staff/product/{id}` - Get product details
- `GET /staff/order` - List all orders (with filters)
- `GET /staff/order/{id}` - Get order details
- `PUT /staff/order/{id}/status` - Update order status

### Admin Endpoints (roleId 1)
- `GET /admin/product` - List products (with filters)
- `GET /admin/product/{id}` - Get product details
- `POST /admin/product/add` - Create product (multipart/form-data with image)
- `PUT /admin/product/{id}` - Update product
- `DELETE /admin/product/{id}` - Delete product
- `GET /admin/order` - List all orders
- `GET /admin/order/{id}` - Get order details
- `PUT /admin/order/{id}/status` - Update order status
- `GET /admin/category` - List categories
- `POST /admin/category` - Create category
- `PUT /admin/category/{id}` - Update category
- `DELETE /admin/category/{id}` - Delete category
- `GET /admin/user` - List all users (TODO)
- `GET /admin/user/{id}` - Get user details (TODO)
- `PUT /admin/user/{id}/ban` - Ban user (TODO)
- `POST /admin/user/staff` - Create staff account (TODO)
- `PUT /admin/user/staff/{id}` - Update staff profile (TODO)
- `DELETE /admin/user/staff/{id}` - Delete staff (TODO)
- `GET /admin/voucher` - List vouchers (TODO)
- `POST /admin/voucher` - Create voucher (TODO)
- `PUT /admin/voucher/{id}` - Update voucher (TODO)
- `DELETE /admin/voucher/{id}` - Delete voucher (TODO)
- `GET /admin/statistics/orders` - Order statistics (TODO)
- `GET /admin/statistics/revenue` - Revenue statistics (TODO)
- `GET /admin/statistics/products` - Product sales statistics (TODO)

## Frontend Architecture

### API Client (`lib/api-client.ts`)
Centralized HTTP client handling:
- Automatic JWT token inclusion in headers
- Consistent request/response formatting
- Error handling and normalization
- Fallback to demo data when API is unavailable

### Types (`lib/types.ts`)
TypeScript interfaces matching API response structures:
- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedResponse<T>` - Paginated response structure
- Domain models: User, Product, Order, Cart, etc.

### Authentication Context (`contexts/auth-context.tsx`)
Global authentication state management:
- User login/logout
- Token persistence
- Role-based routing

### Custom Hooks
- `useAuth()` - Access authentication context
- `useApi()` - Generic API hook (if implemented)

## Key Features Implemented

### Authentication & Authorization
- ✅ Login/Register with JWT tokens
- ✅ Role-based access control (Admin, Staff, User)
- ✅ Automatic redirect based on user role
- ✅ Protected routes with authentication checks

### Product Management (Public)
- ✅ List products with pagination
- ✅ Search and filter products
- ✅ Get detailed product information
- ✅ Product variants and specifications

### Shopping Cart
- ✅ Add/remove items from cart
- ✅ Update item quantities
- ✅ Real-time cart synchronization
- ✅ Display cart totals

### Checkout & Orders
- ✅ Checkout with shipping address
- ✅ Payment method selection
- ✅ Voucher/promotion code support
- ✅ Order placement
- ✅ Order history and tracking

### User Account
- ✅ View and edit profile
- ✅ Change password
- ✅ View order history
- ✅ Order status tracking

### Admin Dashboard (Admin Only)
- ✅ Dashboard statistics
- ✅ Product management (CRUD)
- ✅ Order management and status updates
- ✅ User management
- ✅ Quick actions and recent orders

### Staff Dashboard (Staff + Admin)
- ✅ View products and orders
- ✅ Update order status
- ✅ Process customer orders

## Pagination

All list endpoints support 0-based pagination:

Query Parameters:
- `page` - Page number (0-based)
- `size` - Items per page (default: 10)
- `sortBy` - Sort field (default: "createdAt")
- `sortDir` - Sort direction ("ASC" or "DESC", default: "DESC")

Response:
\`\`\`json
{
  "success": true,
  "data": {
    "products": [...],
    "page": 0,
    "size": 10,
    "totalElements": 100,
    "totalPages": 10,
    "first": true,
    "last": false
  }
}
\`\`\`

## Error Handling

All API responses follow the standard format:

Success:
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
\`\`\`

Error:
\`\`\`json
{
  "success": false,
  "code": "E0400",
  "message": "User-friendly error message",
  "originMessage": "Technical error details"
}
\`\`\`

Frontend maps HTTP status codes to error codes:
- 400 → Bad Request (E0400)
- 401 → Unauthorized (E9998)
- 403 → Access Denied (E9999)
- 404 → Not Found (E0404)
- 500 → Server Error (E0500)

## Image Handling

### Product Images
- Stored in `/uploads/` directory on backend
- Accessed via: `http://localhost:8080/uploads/{filename}`
- Display in frontend: `<img src={`http://localhost:8080${imageUrl}`} />`

### Image Upload (Admin)
- Use FormData for multipart requests
- Only .jpg, .jpeg, .png, .webp files accepted
- Maximum file size: 5MB
- Server generates unique filename with UUID

## Demo Mode

When the API is unreachable, the frontend automatically uses demo data:
- Demo products populated from mock data
- Login with demo accounts: user/staff/admin (password: "password")
- All functionality works with in-memory state
- Blue banner indicates demo mode is active

## Testing Checklist

- [ ] User can register and login
- [ ] Admin/Staff redirected to `/admin` after login
- [ ] Regular users redirected to `/` after login
- [ ] Products page loads and displays items
- [ ] Search and filtering works
- [ ] Add to cart functionality works
- [ ] Checkout process completes successfully
- [ ] Order appears in user account
- [ ] Admin can view dashboard with statistics
- [ ] Admin can manage products (create, read, update, delete)
- [ ] Admin can manage orders and update status
- [ ] User profile can be viewed and edited
- [ ] Logout clears authentication

## Troubleshooting

### API Connection Issues
1. Check `NEXT_PUBLIC_API_URL` environment variable
2. Ensure backend server is running
3. Check backend logs for errors
4. Verify CORS configuration on backend

### Token Issues
- Clear localStorage and re-login: `localStorage.clear()`
- Check browser console for token errors
- Verify JWT token format and expiration

### Image Display Issues
- Verify image URL format: `/uploads/uuid-filename.ext`
- Check if image file exists on backend server
- Ensure full URL includes backend base: `http://localhost:8080${imageUrl}`

## Future Enhancements

- [ ] Implement user comments/ratings API endpoints
- [ ] Add admin statistics endpoints
- [ ] Implement voucher management APIs
- [ ] Add email verification endpoints
- [ ] Add password reset functionality
- [ ] Implement user ban/suspension
- [ ] Add staff management APIs
