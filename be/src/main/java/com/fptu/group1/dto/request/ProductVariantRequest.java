package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for product variant")
public class ProductVariantRequest {
    
    @NotBlank(message = "SKU is required")
    @Schema(description = "Stock Keeping Unit (SKU) for the variant", example = "LAPTOP-ASUS-001-RED")
    private String sku;
    
    @Schema(description = "Attributes of the variant", example = "Color: Red, Storage: 512GB SSD")
    private String attributes;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Schema(description = "Price of this variant", example = "25000000")
    private BigDecimal price;
    
    @NotNull(message = "Stock is required")
    @PositiveOrZero(message = "Stock must be zero or positive")
    @Schema(description = "Current stock quantity", example = "50")
    private Integer stock;
    
    @Schema(description = "Whether the variant is active", example = "true")
    private Boolean isActive;
}

