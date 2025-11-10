package com.fptu.group1.service;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fptu.group1.dto.request.AddProductRequest;
import com.fptu.group1.dto.request.UpdateProductRequest;
import com.fptu.group1.dto.response.AddProductResponse;
import com.fptu.group1.dto.response.ProductDetailResponse;
import com.fptu.group1.dto.response.ProductPageResponse;

@Service
public interface ProductAdminService {
    AddProductResponse addProduct(AddProductRequest request);
    ProductDetailResponse updateProduct(Long productId, UpdateProductRequest request);
    ProductPageResponse getAllProducts(Pageable pageable, String keyword);
    ProductDetailResponse getProductById(Long productId);
    void deleteProduct(Long productId);
    
    // Image upload methods
    String uploadProductImage(MultipartFile image);
    
    /**
     * Parse product request from JSON strings (used for multipart/form-data)
     * @param productJson JSON string containing product data (name, slug, shortDescription, etc.)
     * @param variantsJson Optional JSON string containing variants array
     * @param specsJson Optional JSON string containing specifications array
     * @return AddProductRequest object
     */
    AddProductRequest parseProductRequest(String productJson, String variantsJson, String specsJson);
}

