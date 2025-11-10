package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Product specification information")
public class ProductSpecificationResponse {
    
    @Schema(description = "Specification ID")
    private Long specId;
    
    @Schema(description = "Specification key")
    private String specKey;
    
    @Schema(description = "Specification value")
    private String specValue;
}

