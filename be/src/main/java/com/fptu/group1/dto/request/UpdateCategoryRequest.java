package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for updating a category")
public class UpdateCategoryRequest {
    
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Schema(description = "Category name", example = "Laptops")
    private String name;
    
    @Size(max = 255, message = "Description must not exceed 255 characters")
    @Schema(description = "Category description", example = "Laptop computers and notebooks")
    private String description;
    
    @Schema(description = "Parent category ID (for hierarchical structure)", example = "1")
    private Long parentId;
}

