package com.fptu.group1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fptu.group1.dto.request.CreateCategoryRequest;
import com.fptu.group1.dto.request.UpdateCategoryRequest;
import com.fptu.group1.dto.response.CategoryResponse;

@Service
public interface CategoryService {
    CategoryResponse createCategory(CreateCategoryRequest request);
    CategoryResponse updateCategory(Long categoryId, UpdateCategoryRequest request);
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long categoryId);
    void deleteCategory(Long categoryId);
}

