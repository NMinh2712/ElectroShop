package com.fptu.group1.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fptu.group1.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsByName(String name);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false")
    Page<Product> findAllActive(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND p.productId = :id")
    Optional<Product> findActiveById(@Param("id") Long id);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND (p.name LIKE %:keyword% OR p.slug LIKE %:keyword%)")
    Page<Product> searchActiveProducts(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND (:categoryId IS NULL OR p.categoryId = :categoryId) AND (:brandId IS NULL OR p.brandId = :brandId)")
    Page<Product> findActiveByCategoryAndBrand(@Param("categoryId") Long categoryId, @Param("brandId") Long brandId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND (p.name LIKE %:keyword% OR p.slug LIKE %:keyword%) AND (:categoryId IS NULL OR p.categoryId = :categoryId) AND (:brandId IS NULL OR p.brandId = :brandId)")
    Page<Product> searchActiveProductsWithFilters(@Param("keyword") String keyword, @Param("categoryId") Long categoryId, @Param("brandId") Long brandId, Pageable pageable);
}

