package com.fptu.group1.service;

import org.springframework.stereotype.Service;

import com.fptu.group1.dto.request.AddToCartRequest;
import com.fptu.group1.dto.request.UpdateCartQuantityRequest;
import com.fptu.group1.dto.response.CartResponse;

@Service
public interface CartService {
    CartResponse addToCart(Long userId, AddToCartRequest request);
    CartResponse getCart(Long userId);
    CartResponse updateCartQuantity(Long userId, Long variantId, UpdateCartQuantityRequest request);
    void removeFromCart(Long userId, Long variantId);
    void clearCart(Long userId);
}

