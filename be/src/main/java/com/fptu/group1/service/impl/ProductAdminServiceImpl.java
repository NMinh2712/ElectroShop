package com.fptu.group1.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fptu.group1.common.exception.BadRequestException;
import com.fptu.group1.common.exception.ResourceNotFoundException;
import com.fptu.group1.dto.request.AddProductRequest;
import com.fptu.group1.dto.request.ProductSpecificationRequest;
import com.fptu.group1.dto.request.ProductVariantRequest;
import com.fptu.group1.dto.request.UpdateProductRequest;
import com.fptu.group1.dto.response.AddProductResponse;
import com.fptu.group1.dto.response.ProductDetailResponse;
import com.fptu.group1.dto.response.ProductListResponse;
import com.fptu.group1.dto.response.ProductPageResponse;
import com.fptu.group1.dto.response.ProductSpecificationResponse;
import com.fptu.group1.dto.response.ProductVariantResponse;
import com.fptu.group1.model.Product;
import com.fptu.group1.model.ProductSpecification;
import com.fptu.group1.model.ProductVariant;
import com.fptu.group1.repository.BrandRepository;
import com.fptu.group1.repository.CategoryRepository;
import com.fptu.group1.repository.ProductRepository;
import com.fptu.group1.repository.ProductSpecificationRepository;
import com.fptu.group1.repository.ProductVariantRepository;
import com.fptu.group1.service.FileStorageService;
import com.fptu.group1.service.ProductAdminService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;

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
                .imageUrl(request.getImageUrl())
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
                .imageUrl(product.getImageUrl())
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

    @Override
    @Transactional
    public ProductDetailResponse updateProduct(Long productId, UpdateProductRequest request) {
        // Find product
        Product product = productRepository.findActiveById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        // Validate brand if provided
        if (request.getBrandId() != null && !brandRepository.existsById(request.getBrandId())) {
            throw new ResourceNotFoundException("Brand not found with ID: " + request.getBrandId());
        }

        // Validate category if provided
        if (request.getCategoryId() != null && !categoryRepository.existsById(request.getCategoryId())) {
            throw new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId());
        }

        // Update slug if name changed
        String slug = product.getSlug();
        if (request.getName() != null && !request.getName().equals(product.getName())) {
            if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
                slug = request.getSlug();
            } else {
                slug = generateSlug(request.getName());
            }
            
            // Check if new slug already exists (excluding current product)
            if (productRepository.existsBySlug(slug)) {
                Optional<Product> existingProduct = productRepository.findBySlug(slug);
                if (existingProduct.isPresent() && !existingProduct.get().getProductId().equals(productId)) {
                    throw new BadRequestException("Product with slug '" + slug + "' already exists");
                }
            }
        }

        // Update product fields
        if (request.getName() != null) product.setName(request.getName());
        if (slug != null) product.setSlug(slug);
        if (request.getShortDescription() != null) product.setShortDescription(request.getShortDescription());
        if (request.getFullDescription() != null) product.setFullDescription(request.getFullDescription());
        if (request.getBrandId() != null) product.setBrandId(request.getBrandId());
        if (request.getCategoryId() != null) product.setCategoryId(request.getCategoryId());
        if (request.getModelNumber() != null) product.setModelNumber(request.getModelNumber());
        if (request.getReleaseYear() != null) product.setReleaseYear(request.getReleaseYear());
        if (request.getDefaultPrice() != null) product.setDefaultPrice(request.getDefaultPrice());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        product.setUpdatedAt(LocalDateTime.now());

        product = productRepository.save(product);
        entityManager.flush();

        // Update variants if provided
        if (request.getVariants() != null) {
            // Delete existing variants
            List<ProductVariant> existingVariants = productVariantRepository.findByProductId(productId);
            productVariantRepository.deleteAll(existingVariants);

            // Create new variants
            for (ProductVariantRequest variantRequest : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .productId(product.getProductId())
                        .sku(variantRequest.getSku())
                        .attributes(variantRequest.getAttributes())
                        .price(variantRequest.getPrice())
                        .stock(variantRequest.getStock() != null ? variantRequest.getStock() : 0)
                        .isActive(variantRequest.getIsActive() == null || variantRequest.getIsActive())
                        .build();
                productVariantRepository.save(variant);
            }
            entityManager.flush();
        }

        // Update specifications if provided
        if (request.getSpecifications() != null) {
            // Delete existing specifications
            List<ProductSpecification> existingSpecs = productSpecificationRepository.findByProductId(productId);
            productSpecificationRepository.deleteAll(existingSpecs);

            // Create new specifications
            for (ProductSpecificationRequest specRequest : request.getSpecifications()) {
                if (specRequest.getSpecKey() != null && !specRequest.getSpecKey().trim().isEmpty()) {
                    ProductSpecification spec = ProductSpecification.builder()
                            .productId(product.getProductId())
                            .specKey(specRequest.getSpecKey())
                            .specValue(specRequest.getSpecValue())
                            .build();
                    productSpecificationRepository.save(spec);
                }
            }
            entityManager.flush();
        }

        return buildProductDetailResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductPageResponse getAllProducts(Pageable pageable, String keyword) {
        Page<Product> productPage;
        
        if (StringUtils.hasText(keyword)) {
            productPage = productRepository.searchActiveProducts(keyword, pageable);
        } else {
            productPage = productRepository.findAllActive(pageable);
        }

        List<ProductListResponse> products = productPage.getContent().stream()
                .map(this::buildProductListResponse)
                .collect(Collectors.toList());

        return ProductPageResponse.builder()
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
    public ProductDetailResponse getProductById(Long productId) {
        Product product = productRepository.findActiveById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        return buildProductDetailResponse(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findActiveById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        
        product.setIsDeleted(true);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    private ProductListResponse buildProductListResponse(Product product) {
        return ProductListResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .defaultPrice(product.getDefaultPrice())
                .imageUrl(product.getImageUrl())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private ProductDetailResponse buildProductDetailResponse(Product product) {
        // Load variants
        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getProductId());
        List<ProductVariantResponse> variantResponses = variants.stream()
                .map(v -> ProductVariantResponse.builder()
                        .variantId(v.getVariantId())
                        .sku(v.getSku())
                        .attributes(v.getAttributes())
                        .price(v.getPrice())
                        .stock(v.getStock())
                        .isActive(v.getIsActive())
                        .build())
                .collect(Collectors.toList());

        // Load specifications
        List<ProductSpecification> specifications = productSpecificationRepository.findByProductId(product.getProductId());
        List<ProductSpecificationResponse> specResponses = specifications.stream()
                .map(s -> ProductSpecificationResponse.builder()
                        .specId(s.getSpecId())
                        .specKey(s.getSpecKey())
                        .specValue(s.getSpecValue())
                        .build())
                .collect(Collectors.toList());

        return ProductDetailResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .fullDescription(product.getFullDescription())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .modelNumber(product.getModelNumber())
                .releaseYear(product.getReleaseYear())
                .defaultPrice(product.getDefaultPrice())
                .imageUrl(product.getImageUrl())
                .variants(variantResponses)
                .specifications(specResponses)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    @Override
    public String uploadProductImage(org.springframework.web.multipart.MultipartFile image) {
        if (image == null || image.isEmpty() || image.getSize() == 0) {
            throw new BadRequestException("Image file is required and cannot be empty");
        }
        
        try {
            fileStorageService.validateFile(image);
            String imageUrl = fileStorageService.storeFile(image);
            log.info("Product image uploaded successfully: {}", imageUrl);
            return imageUrl;
        } catch (IllegalArgumentException e) {
            log.error("Image validation failed: {}", e.getMessage());
            throw new BadRequestException("Image validation failed: " + e.getMessage());
        } catch (IOException e) {
            log.error("Error uploading product image", e);
            throw new BadRequestException("Failed to upload image: " + e.getMessage());
        }
    }

    @Override
    public AddProductRequest parseProductRequest(String productJson, String variantsJson, String specsJson) {
        if (productJson == null || productJson.trim().isEmpty()) {
            throw new BadRequestException("Product JSON is required");
        }

        try {
            // Parse main product JSON
            AddProductRequest request = objectMapper.readValue(productJson, AddProductRequest.class);

            // Parse variants JSON if provided
            if (variantsJson != null && !variantsJson.trim().isEmpty()) {
                try {
                    List<ProductVariantRequest> variants = objectMapper.readValue(
                            variantsJson, 
                            new TypeReference<List<ProductVariantRequest>>() {});
                    request.setVariants(variants);
                } catch (Exception e) {
                    log.error("Error parsing variants JSON", e);
                    throw new BadRequestException("Invalid variants JSON format: " + e.getMessage());
                }
            }

            // Parse specifications JSON if provided
            if (specsJson != null && !specsJson.trim().isEmpty()) {
                try {
                    List<ProductSpecificationRequest> specs = objectMapper.readValue(
                            specsJson, 
                            new TypeReference<List<ProductSpecificationRequest>>() {});
                    request.setSpecifications(specs);
                } catch (Exception e) {
                    log.error("Error parsing specifications JSON", e);
                    throw new BadRequestException("Invalid specifications JSON format: " + e.getMessage());
                }
            }

            return request;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error parsing product JSON", e);
            throw new BadRequestException("Invalid product JSON format: " + e.getMessage());
        }
    }
}

