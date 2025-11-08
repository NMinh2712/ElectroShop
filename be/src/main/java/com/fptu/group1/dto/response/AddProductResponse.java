package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response object for successful product creation")
public class AddProductResponse {
    
    @Schema(description = "Product ID")
    private Long productId;
    
    @Schema(description = "Product name")
    private String name;
    
    @Schema(description = "Product slug")
    private String slug;
    
    @Schema(description = "Brand ID")
    private Long brandId;
    
    @Schema(description = "Category ID")
    private Long categoryId;
    
    @Schema(description = "Number of variants created")
    private Integer variantCount;
    
    @Schema(description = "Number of specifications created")
    private Integer specificationCount;
    
    @Schema(description = "Product creation timestamp")
    private LocalDateTime createdAt;
    
    @Schema(description = "Success message")
    private String message;
}

