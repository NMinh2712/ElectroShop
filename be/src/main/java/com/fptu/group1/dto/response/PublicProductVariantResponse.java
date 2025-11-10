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
@Schema(description = "Public product variant information")
public class PublicProductVariantResponse {
    
    @Schema(description = "Variant ID")
    private Long variantId;
    
    @Schema(description = "SKU")
    private String sku;
    
    @Schema(description = "Attributes")
    private String attributes;
    
    @Schema(description = "Price")
    private BigDecimal price;
    
    @Schema(description = "Stock quantity")
    private Integer stock;
    
    @Schema(description = "Is active")
    private Boolean isActive;
}

