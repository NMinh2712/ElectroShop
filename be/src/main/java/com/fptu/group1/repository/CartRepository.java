package com.fptu.group1.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fptu.group1.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
    
    Optional<Cart> findByUserIdAndVariantId(Long userId, Long variantId);
    
    void deleteByUserIdAndVariantId(Long userId, Long variantId);
    
    void deleteByUserId(Long userId);
}

