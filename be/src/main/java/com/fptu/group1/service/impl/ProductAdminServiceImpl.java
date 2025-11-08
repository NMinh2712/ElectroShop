package com.fptu.group1.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fptu.group1.common.exception.BadRequestException;
import com.fptu.group1.common.exception.ResourceNotFoundException;
import com.fptu.group1.dto.request.AddProductRequest;
import com.fptu.group1.dto.request.ProductSpecificationRequest;
import com.fptu.group1.dto.request.ProductVariantRequest;
import com.fptu.group1.dto.response.AddProductResponse;
import com.fptu.group1.model.Product;
import com.fptu.group1.model.ProductSpecification;
import com.fptu.group1.model.ProductVariant;
import com.fptu.group1.repository.BrandRepository;
import com.fptu.group1.repository.CategoryRepository;
import com.fptu.group1.repository.ProductRepository;
import com.fptu.group1.repository.ProductSpecificationRepository;
import com.fptu.group1.repository.ProductVariantRepository;
import com.fptu.group1.service.ProductAdminService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductAdminServiceImpl implements ProductAdminService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductSpecificationRepository productSpecificationRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Override
    @Transactional
    public AddProductResponse addProduct(AddProductRequest request) {
        // Validate brand exists
        if (!brandRepository.existsById(request.getBrandId())) {
            throw new ResourceNotFoundException("Brand not found with ID: " + request.getBrandId());
        }

        // Validate category exists
        if (!categoryRepository.existsById(request.getCategoryId())) {
            throw new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId());
        }

        // Generate slug if not provided
        String slug = request.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = generateSlug(request.getName());
        }

        // Check if slug already exists
        if (productRepository.existsBySlug(slug)) {
            throw new BadRequestException("Product with slug '" + slug + "' already exists");
        }

        // Check if product name already exists
        if (productRepository.existsByName(request.getName())) {
            throw new BadRequestException("Product with name '" + request.getName() + "' already exists");
        }

        // Validate variants SKU uniqueness
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            List<String> skus = request.getVariants().stream()
                    .map(ProductVariantRequest::getSku)
                    .toList();
            
            // Check for duplicate SKUs in request
            long distinctCount = skus.stream().distinct().count();
            if (distinctCount != skus.size()) {
                throw new BadRequestException("Duplicate SKU found in variants");
            }

            // Check if any SKU already exists in database
            for (String sku : skus) {
                if (productVariantRepository.existsBySku(sku)) {
                    throw new BadRequestException("Variant with SKU '" + sku + "' already exists");
                }
            }
        }

        // Create product
        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .shortDescription(request.getShortDescription())
                .fullDescription(request.getFullDescription())
                .brandId(request.getBrandId())
                .categoryId(request.getCategoryId())
                .modelNumber(request.getModelNumber())
                .releaseYear(request.getReleaseYear())
                .defaultPrice(request.getDefaultPrice())
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(null) // updatedAt is null when creating
                .build();

        product = productRepository.save(product);
        // Flush to ensure product is saved and productId is generated
        entityManager.flush();

        // Create variants
        List<ProductVariant> savedVariants = new ArrayList<>();
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariantRequest variantRequest : request.getVariants()) {
                try {
                    ProductVariant variant = ProductVariant.builder()
                            .productId(product.getProductId())
                            .sku(variantRequest.getSku())
                            .attributes(variantRequest.getAttributes())
                            .price(variantRequest.getPrice())
                            .stock(variantRequest.getStock() != null ? variantRequest.getStock() : 0)
                            .isActive(variantRequest.getIsActive() == null || variantRequest.getIsActive())
                            .build();
                    
                    ProductVariant savedVariant = productVariantRepository.save(variant);
                    entityManager.flush(); // Flush immediately to catch any constraint violations
                    savedVariants.add(savedVariant);
                    log.debug("Saved variant with SKU: {}", variantRequest.getSku());
                } catch (Exception e) {
                    log.error("Error saving variant with SKU: {}", variantRequest.getSku(), e);
                    throw new BadRequestException("Failed to save variant with SKU: " + variantRequest.getSku() + ". Error: " + e.getMessage());
                }
            }
        }

        // Create specifications
        List<ProductSpecification> savedSpecs = new ArrayList<>();
        if (request.getSpecifications() != null && !request.getSpecifications().isEmpty()) {
            for (ProductSpecificationRequest specRequest : request.getSpecifications()) {
                try {
                    if (specRequest.getSpecKey() == null || specRequest.getSpecKey().trim().isEmpty()) {
                        log.warn("Skipping specification with empty specKey");
                        continue;
                    }
                    
                    ProductSpecification spec = ProductSpecification.builder()
                            .productId(product.getProductId())
                            .specKey(specRequest.getSpecKey())
                            .specValue(specRequest.getSpecValue())
                            .build();
                    
                    ProductSpecification savedSpec = productSpecificationRepository.save(spec);
                    entityManager.flush(); // Flush immediately to catch any constraint violations
                    savedSpecs.add(savedSpec);
                    log.debug("Saved specification with key: {}", specRequest.getSpecKey());
                } catch (Exception e) {
                    log.error("Error saving specification with key: {}", specRequest.getSpecKey(), e);
                    throw new BadRequestException("Failed to save specification with key: " + specRequest.getSpecKey() + ". Error: " + e.getMessage());
                }
            }
        }

        // Create response
        return AddProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .slug(product.getSlug())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .variantCount(savedVariants.size())
                .specificationCount(savedSpecs.size())
                .createdAt(product.getCreatedAt())
                .message("Product created successfully")
                .build();
    }

    /**
     * Generate URL-friendly slug from product name
     */
    private String generateSlug(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new BadRequestException("Product name is required to generate slug");
        }

        String nowhitespace = WHITESPACE.matcher(name).replaceAll("-");
        String normalized = NON_LATIN.matcher(nowhitespace).replaceAll("");
        String slug = normalized.toLowerCase(Locale.ENGLISH);
        
        // Remove consecutive dashes
        slug = slug.replaceAll("-+", "-");
        
        // Remove leading and trailing dashes
        if (slug.startsWith("-")) {
            slug = slug.replaceFirst("^-+", "");
        }
        if (slug.endsWith("-")) {
            slug = slug.replaceFirst("-+$", "");
        }
        
        return slug;
    }
}

