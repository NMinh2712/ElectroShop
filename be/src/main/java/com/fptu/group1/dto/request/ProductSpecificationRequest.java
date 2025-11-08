package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for product specification")
public class ProductSpecificationRequest {
    
    @NotBlank(message = "Specification key is required")
    @Schema(description = "The specification key", example = "Screen Size")
    private String specKey;
    
    @Schema(description = "The specification value", example = "15.6 inches")
    private String specValue;
}

