package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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
@Schema(description = "Request object for adding a new product")
public class AddProductRequest {
    
    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    @Schema(description = "Product name", example = "ASUS ZenBook 14 OLED")
    private String name;
    
    @Schema(description = "URL-friendly slug for the product", example = "asus-zenbook-14-oled")
    private String slug;
    
    @Size(max = 512, message = "Short description must not exceed 512 characters")
    @Schema(description = "Short description of the product", example = "Ultra-thin laptop with OLED display")
    private String shortDescription;
    
    @Schema(description = "Detailed description of the product", 
            example = "The ASUS ZenBook 14 OLED features a stunning 14-inch OLED display, Intel Core i7 processor, 16GB RAM, and 512GB SSD storage.")
    private String fullDescription;
    
    @NotNull(message = "Brand ID is required")
    @Positive(message = "Brand ID must be positive")
    @Schema(description = "Brand ID", example = "1")
    private Long brandId;
    
    @NotNull(message = "Category ID is required")
    @Positive(message = "Category ID must be positive")
    @Schema(description = "Category ID", example = "1")
    private Long categoryId;
    
    @Schema(description = "Model number of the product", example = "UX3402ZA-KM241W")
    private String modelNumber;
    
    @Schema(description = "Year the product was released", example = "2024")
    private Integer releaseYear;
    
    @Positive(message = "Default price must be positive")
    @Schema(description = "Default price of the product", example = "25000000")
    private BigDecimal defaultPrice;
    
    @Valid
    @Schema(description = "List of product variants")
    @Builder.Default
    private List<ProductVariantRequest> variants = new ArrayList<>();
    
    @Valid
    @Schema(description = "List of product specifications")
    @Builder.Default
    private List<ProductSpecificationRequest> specifications = new ArrayList<>();
}

