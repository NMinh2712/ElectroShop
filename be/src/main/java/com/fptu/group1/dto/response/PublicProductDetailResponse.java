package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Public detailed product information")
public class PublicProductDetailResponse {
    
    @Schema(description = "Product ID")
    private Long productId;
    
    @Schema(description = "Product name")
    private String name;
    
    @Schema(description = "Product slug")
    private String slug;
    
    @Schema(description = "Short description")
    private String shortDescription;
    
    @Schema(description = "Full description")
    private String fullDescription;
    
    @Schema(description = "Brand ID")
    private Long brandId;
    
    @Schema(description = "Brand name")
    private String brandName;
    
    @Schema(description = "Category ID")
    private Long categoryId;
    
    @Schema(description = "Category name")
    private String categoryName;
    
    @Schema(description = "Model number")
    private String modelNumber;
    
    @Schema(description = "Release year")
    private Integer releaseYear;
    
    @Schema(description = "Default price")
    private BigDecimal defaultPrice;
    
    @Schema(description = "Main image URL")
    private String imageUrl;
    
    @Schema(description = "Available product variants")
    @Builder.Default
    private List<PublicProductVariantResponse> variants = new ArrayList<>();
    
    @Schema(description = "Product specifications")
    @Builder.Default
    private List<ProductSpecificationResponse> specifications = new ArrayList<>();
}

