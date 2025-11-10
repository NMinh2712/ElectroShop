package com.fptu.group1.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fptu.group1.common.constant.RouteConst;
import com.fptu.group1.dto.ApiResponse;
import com.fptu.group1.dto.response.PublicProductDetailResponse;
import com.fptu.group1.dto.response.PublicProductPageResponse;
import com.fptu.group1.service.ProductService;

@RestController
@RequestMapping(RouteConst.API_BASE + "/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<PublicProductPageResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PublicProductPageResponse response = productService.getAllProducts(pageable, keyword, categoryId, brandId);

        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", response));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<PublicProductDetailResponse>> getProductById(
            @PathVariable("id") Long productId) {

        PublicProductDetailResponse response = productService.getProductById(productId);

        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", response));
    }

    @GetMapping(value = "/slug/{slug}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<PublicProductDetailResponse>> getProductBySlug(
            @PathVariable("slug") String slug) {

        PublicProductDetailResponse response = productService.getProductBySlug(slug);

        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", response));
    }
}

