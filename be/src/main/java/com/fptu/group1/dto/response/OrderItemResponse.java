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
@Schema(description = "Order item information")
public class OrderItemResponse {
    
    @Schema(description = "Order detail ID")
    private Long orderDetailId;
    
    @Schema(description = "Variant ID")
    private Long variantId;
    
    @Schema(description = "Product ID")
    private Long productId;
    
    @Schema(description = "Product name")
    private String productName;
    
    @Schema(description = "Variant SKU")
    private String sku;
    
    @Schema(description = "Variant attributes")
    private String attributes;
    
    @Schema(description = "Quantity")
    private Integer quantity;
    
    @Schema(description = "Unit price")
    private BigDecimal unitPrice;
    
    @Schema(description = "Warranty months")
    private Integer warrantyMonths;
}

