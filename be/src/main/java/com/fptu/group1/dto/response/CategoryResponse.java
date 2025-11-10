package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Category information")
public class CategoryResponse {
    
    @Schema(description = "Category ID")
    private Long categoryId;
    
    @Schema(description = "Category name")
    private String name;
    
    @Schema(description = "Category description")
    private String description;
    
    @Schema(description = "Parent category ID")
    private Long parentId;
    
    @Schema(description = "Child categories")
    @Builder.Default
    private List<CategoryResponse> children = new ArrayList<>();
}

