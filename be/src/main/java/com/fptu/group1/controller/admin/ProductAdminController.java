package com.fptu.group1.controller.admin;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fptu.group1.common.constant.AuthorityConst;
import com.fptu.group1.common.constant.RouteConst;
import com.fptu.group1.dto.ApiResponse;
import com.fptu.group1.dto.request.AddProductRequest;
import com.fptu.group1.dto.request.UpdateProductRequest;
import com.fptu.group1.dto.response.AddProductResponse;
import com.fptu.group1.dto.response.ProductDetailResponse;
import com.fptu.group1.dto.response.ProductPageResponse;
import com.fptu.group1.service.ProductAdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(RouteConst.API_BASE + RouteConst.ADMIN_PRODUCT_ROUTE)
public class ProductAdminController {

    private final ProductAdminService productAdminService;

    // Explicit constructor to satisfy IDEs that don't process Lombok annotations
    public ProductAdminController(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    /**
     * Add product with image upload (multipart/form-data)
     * 
     * Frontend should send FormData with:
     * - product: JSON string containing product data
     * - image: (optional) Image file
     * - variants: (optional) JSON string containing variants array
     * - specifications: (optional) JSON string containing specifications array
     * 
     * @param image Optional image file
     * @param productJson Required JSON string with product data
     * @param variantsJson Optional JSON string with variants array
     * @param specsJson Optional JSON string with specifications array
     * @return Created product response
     */
    @PostMapping(value = "/add", 
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<AddProductResponse>> addProduct(
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestParam("product") String productJson,
            @RequestParam(value = "variants", required = false) String variantsJson,
            @RequestParam(value = "specifications", required = false) String specsJson) {

        // Parse JSON strings to AddProductRequest
        AddProductRequest request = productAdminService.parseProductRequest(
                productJson, variantsJson, specsJson);

        // Handle image upload if provided
        if (image != null && !image.isEmpty() && image.getSize() > 0) {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ProductAdminController.class);
            logger.debug("Processing image upload - Original filename: {}, Size: {} bytes", 
                    image.getOriginalFilename(), image.getSize());
            
            String imageUrl = productAdminService.uploadProductImage(image);
            if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                request.setImageUrl(imageUrl);
                logger.debug("Image URL set to request: {}", imageUrl);
            } else {
                logger.warn("Image upload returned null or empty URL");
            }
        } else {
            org.slf4j.LoggerFactory.getLogger(ProductAdminController.class)
                .debug("No image provided or image is empty");
        }

        // Create product
        AddProductResponse response = productAdminService.addProduct(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", response));
    }

    // Endpoint for application/json (without image upload, backward compatibility)
    @PostMapping(value = "/add/json", 
            consumes = MediaType.APPLICATION_JSON_VALUE, 
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<AddProductResponse>> addProductJson(
            @Valid @RequestBody AddProductRequest request) {

        AddProductResponse response = productAdminService.addProduct(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", response));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<ProductDetailResponse>> updateProduct(
            @PathVariable("id") Long productId,
            @Valid @RequestBody UpdateProductRequest request) {

        ProductDetailResponse response = productAdminService.updateProduct(productId, request);

        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", response));
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<ProductPageResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) String keyword) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        ProductPageResponse response = productAdminService.getAllProducts(pageable, keyword);

        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", response));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getProductById(
            @PathVariable("id") Long productId) {

        ProductDetailResponse response = productAdminService.getProductById(productId);

        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", response));
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable("id") Long productId) {

        productAdminService.deleteProduct(productId);

        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }
}

