package com.fptu.group1.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fptu.group1.common.constant.AuthorityConst;
import com.fptu.group1.common.constant.RouteConst;
import com.fptu.group1.dto.ApiResponse;
import com.fptu.group1.dto.request.CreateCategoryRequest;
import com.fptu.group1.dto.request.UpdateCategoryRequest;
import com.fptu.group1.dto.response.CategoryResponse;
import com.fptu.group1.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(RouteConst.API_BASE + "/admin/category")
public class CategoryAdminController {

    private final CategoryService categoryService;

    public CategoryAdminController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request) {

        CategoryResponse response = categoryService.createCategory(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", response));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable("id") Long categoryId,
            @Valid @RequestBody UpdateCategoryRequest request) {

        CategoryResponse response = categoryService.updateCategory(categoryId, request);

        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", response));
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {

        List<CategoryResponse> response = categoryService.getAllCategories();

        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", response));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
            @PathVariable("id") Long categoryId) {

        CategoryResponse response = categoryService.getCategoryById(categoryId);

        return ResponseEntity.ok(ApiResponse.success("Category retrieved successfully", response));
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ADMIN)
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable("id") Long categoryId) {

        categoryService.deleteCategory(categoryId);

        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}

