package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Public product information for list view")
public class PublicProductListResponse {
    
    @Schema(description = "Product ID")
    private Long productId;
    
    @Schema(description = "Product name")
    private String name;
    
    @Schema(description = "Product slug")
    private String slug;
    
    @Schema(description = "Short description")
    private String shortDescription;
    
    @Schema(description = "Brand ID")
    private Long brandId;
    
    @Schema(description = "Brand name")
    private String brandName;
    
    @Schema(description = "Category ID")
    private Long categoryId;
    
    @Schema(description = "Category name")
    private String categoryName;
    
    @Schema(description = "Default price")
    private BigDecimal defaultPrice;
    
    @Schema(description = "Main image URL")
    private String imageUrl;
    
    @Schema(description = "Minimum variant price")
    private BigDecimal minPrice;
    
    @Schema(description = "Maximum variant price")
    private BigDecimal maxPrice;
}

