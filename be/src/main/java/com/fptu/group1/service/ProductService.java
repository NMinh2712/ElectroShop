package com.fptu.group1.service;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fptu.group1.dto.response.PublicProductDetailResponse;
import com.fptu.group1.dto.response.PublicProductPageResponse;

@Service
public interface ProductService {
    PublicProductPageResponse getAllProducts(Pageable pageable, String keyword, Long categoryId, Long brandId);
    PublicProductDetailResponse getProductById(Long productId);
    PublicProductDetailResponse getProductBySlug(String slug);
}

