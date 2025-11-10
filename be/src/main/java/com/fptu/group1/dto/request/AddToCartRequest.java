package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for adding product to cart")
public class AddToCartRequest {
    
    @NotNull(message = "Variant ID is required")
    @Positive(message = "Variant ID must be positive")
    @Schema(description = "Product variant ID", example = "1")
    private Long variantId;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    @Schema(description = "Quantity to add", example = "1")
    private Integer quantity;
}

