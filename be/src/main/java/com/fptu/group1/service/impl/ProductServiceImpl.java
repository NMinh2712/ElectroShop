package com.fptu.group1.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fptu.group1.common.exception.ResourceNotFoundException;
import com.fptu.group1.dto.response.ProductSpecificationResponse;
import com.fptu.group1.dto.response.PublicProductDetailResponse;
import com.fptu.group1.dto.response.PublicProductListResponse;
import com.fptu.group1.dto.response.PublicProductPageResponse;
import com.fptu.group1.dto.response.PublicProductVariantResponse;
import com.fptu.group1.model.Brand;
import com.fptu.group1.model.Category;
import com.fptu.group1.model.Product;
import com.fptu.group1.model.ProductSpecification;
import com.fptu.group1.model.ProductVariant;
import com.fptu.group1.repository.BrandRepository;
import com.fptu.group1.repository.CategoryRepository;
import com.fptu.group1.repository.ProductRepository;
import com.fptu.group1.repository.ProductSpecificationRepository;
import com.fptu.group1.repository.ProductVariantRepository;
import com.fptu.group1.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public PublicProductPageResponse getAllProducts(Pageable pageable, String keyword, Long categoryId, Long brandId) {
        Page<Product> productPage;
        
        if (StringUtils.hasText(keyword)) {
            productPage = productRepository.searchActiveProductsWithFilters(keyword, categoryId, brandId, pageable);
        } else if (categoryId != null || brandId != null) {
            productPage = productRepository.findActiveByCategoryAndBrand(categoryId, brandId, pageable);
        } else {
            productPage = productRepository.findAllActive(pageable);
        }

        List<PublicProductListResponse> products = productPage.getContent().stream()
                .map(this::buildPublicProductListResponse)
                .collect(Collectors.toList());

        return PublicProductPageResponse.builder()
                .products(products)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .first(productPage.isFirst())
                .last(productPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PublicProductDetailResponse getProductById(Long productId) {
        Product product = productRepository.findActiveById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        return buildPublicProductDetailResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public PublicProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        
        if (Boolean.TRUE.equals(product.getIsDeleted())) {
            throw new ResourceNotFoundException("Product not found with slug: " + slug);
        }
        
        return buildPublicProductDetailResponse(product);
    }

    private PublicProductListResponse buildPublicProductListResponse(Product product) {
        Brand brand = product.getBrandId() != null ? brandRepository.findById(product.getBrandId()).orElse(null) : null;
        Category category = product.getCategoryId() != null ? categoryRepository.findById(product.getCategoryId()).orElse(null) : null;

        // Get price range from variants
        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getProductId());
        BigDecimal minPrice = product.getDefaultPrice();
        BigDecimal maxPrice = product.getDefaultPrice();
        
        if (!variants.isEmpty()) {
            minPrice = variants.stream()
                    .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                    .map(ProductVariant::getPrice)
                    .min(BigDecimal::compareTo)
                    .orElse(product.getDefaultPrice());
            maxPrice = variants.stream()
                    .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                    .map(ProductVariant::getPrice)
                    .max(BigDecimal::compareTo)
                    .orElse(product.getDefaultPrice());
        }

        return PublicProductListResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .brandId(product.getBrandId())
                .brandName(brand != null ? brand.getName() : null)
                .categoryId(product.getCategoryId())
                .categoryName(category != null ? category.getName() : null)
                .defaultPrice(product.getDefaultPrice())
                .imageUrl(product.getImageUrl())
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .build();
    }

    private PublicProductDetailResponse buildPublicProductDetailResponse(Product product) {
        Brand brand = product.getBrandId() != null ? brandRepository.findById(product.getBrandId()).orElse(null) : null;
        Category category = product.getCategoryId() != null ? categoryRepository.findById(product.getCategoryId()).orElse(null) : null;

        // Get active variants only
        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getProductId());
        List<PublicProductVariantResponse> variantResponses = variants.stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                .map(v -> PublicProductVariantResponse.builder()
                        .variantId(v.getVariantId())
                        .sku(v.getSku())
                        .attributes(v.getAttributes())
                        .price(v.getPrice())
                        .stock(v.getStock())
                        .isActive(v.getIsActive())
                        .build())
                .collect(Collectors.toList());

        // Get specifications
        List<ProductSpecification> specifications = productSpecificationRepository.findByProductId(product.getProductId());
        List<ProductSpecificationResponse> specResponses = specifications.stream()
                .map(s -> ProductSpecificationResponse.builder()
                        .specId(s.getSpecId())
                        .specKey(s.getSpecKey())
                        .specValue(s.getSpecValue())
                        .build())
                .collect(Collectors.toList());

        return PublicProductDetailResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .fullDescription(product.getFullDescription())
                .brandId(product.getBrandId())
                .brandName(brand != null ? brand.getName() : null)
                .categoryId(product.getCategoryId())
                .categoryName(category != null ? category.getName() : null)
                .modelNumber(product.getModelNumber())
                .releaseYear(product.getReleaseYear())
                .defaultPrice(product.getDefaultPrice())
                .imageUrl(product.getImageUrl())
                .variants(variantResponses)
                .specifications(specResponses)
                .build();
    }
}

