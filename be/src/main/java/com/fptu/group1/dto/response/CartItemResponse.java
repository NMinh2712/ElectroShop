package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Cart item information")
public class CartItemResponse {
    
    @Schema(description = "Cart ID")
    private Long cartId;
    
    @Schema(description = "Variant ID")
    private Long variantId;
    
    @Schema(description = "Product ID")
    private Long productId;
    
    @Schema(description = "Product name")
    private String productName;
    
    @Schema(description = "Product image URL")
    private String productImageUrl;
    
    @Schema(description = "Variant SKU")
    private String sku;
    
    @Schema(description = "Variant attributes")
    private String attributes;
    
    @Schema(description = "Unit price")
    private BigDecimal unitPrice;
    
    @Schema(description = "Quantity")
    private Integer quantity;
    
    @Schema(description = "Subtotal (unitPrice * quantity)")
    private BigDecimal subtotal;
    
    @Schema(description = "Stock available")
    private Integer stock;
    
    @Schema(description = "Is variant active")
    private Boolean isActive;
    
    @Schema(description = "Added at")
    private LocalDateTime addedAt;
}

