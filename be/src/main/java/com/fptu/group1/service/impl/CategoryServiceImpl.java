package com.fptu.group1.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fptu.group1.common.exception.BadRequestException;
import com.fptu.group1.common.exception.ResourceNotFoundException;
import com.fptu.group1.dto.request.CreateCategoryRequest;
import com.fptu.group1.dto.request.UpdateCategoryRequest;
import com.fptu.group1.dto.response.CategoryResponse;
import com.fptu.group1.model.Category;
import com.fptu.group1.repository.CategoryRepository;
import com.fptu.group1.service.CategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        // Check if category name already exists (with same parent)
        if (categoryRepository.existsByName(request.getName())) {
            // Check if it's the same parent
            categoryRepository.findByName(request.getName()).ifPresent(existing -> {
                if (existing.getParentId() == null && request.getParentId() == null) {
                    throw new BadRequestException("Category with name '" + request.getName() + "' already exists");
                } else if (existing.getParentId() != null && existing.getParentId().equals(request.getParentId())) {
                    throw new BadRequestException("Category with name '" + request.getName() + "' already exists under the same parent");
                }
            });
        }

        // Validate parent category if provided
        if (request.getParentId() != null) {
            if (!categoryRepository.existsById(request.getParentId())) {
                throw new ResourceNotFoundException("Parent category not found with ID: " + request.getParentId());
            }
        }

        // Create category
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .parentId(request.getParentId())
                .build();

        category = categoryRepository.save(category);

        return buildCategoryResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long categoryId, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        // Check if name already exists (excluding current category)
        if (request.getName() != null && !request.getName().equals(category.getName())) {
            if (categoryRepository.existsByName(request.getName())) {
                categoryRepository.findByName(request.getName()).ifPresent(existing -> {
                    if (!existing.getCategoryId().equals(categoryId)) {
                        // Check if same parent
                        if (existing.getParentId() == null && request.getParentId() == null) {
                            throw new BadRequestException("Category with name '" + request.getName() + "' already exists");
                        } else if (existing.getParentId() != null && existing.getParentId().equals(request.getParentId())) {
                            throw new BadRequestException("Category with name '" + request.getName() + "' already exists under the same parent");
                        }
                    }
                });
            }
        }

        // Validate parent category if provided
        if (request.getParentId() != null) {
            if (!categoryRepository.existsById(request.getParentId())) {
                throw new ResourceNotFoundException("Parent category not found with ID: " + request.getParentId());
            }
            // Prevent circular reference
            if (request.getParentId().equals(categoryId)) {
                throw new BadRequestException("Category cannot be its own parent");
            }
        }

        // Update category fields
        if (request.getName() != null) category.setName(request.getName());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getParentId() != null) category.setParentId(request.getParentId());

        category = categoryRepository.save(category);

        return buildCategoryResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::buildCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        return buildCategoryResponse(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        // Check if category has children
        List<Category> children = categoryRepository.findAll().stream()
                .filter(c -> categoryId.equals(c.getParentId()))
                .collect(Collectors.toList());
        
        if (!children.isEmpty()) {
            throw new BadRequestException("Cannot delete category with ID " + categoryId + " because it has " + children.size() + " child category(ies)");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse buildCategoryResponse(Category category) {
        // Load children
        List<Category> children = categoryRepository.findAll().stream()
                .filter(c -> category.getCategoryId().equals(c.getParentId()))
                .collect(Collectors.toList());

        List<CategoryResponse> childResponses = children.stream()
                .map(this::buildCategoryResponse)
                .collect(Collectors.toList());

        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .parentId(category.getParentId())
                .children(childResponses)
                .build();
    }
}

