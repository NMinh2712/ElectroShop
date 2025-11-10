package com.fptu.group1.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fptu.group1.common.exception.BadRequestException;
import com.fptu.group1.common.exception.ResourceNotFoundException;
import com.fptu.group1.dto.request.AddToCartRequest;
import com.fptu.group1.dto.request.UpdateCartQuantityRequest;
import com.fptu.group1.dto.response.CartItemResponse;
import com.fptu.group1.dto.response.CartResponse;
import com.fptu.group1.model.Cart;
import com.fptu.group1.model.Product;
import com.fptu.group1.model.ProductVariant;
import com.fptu.group1.repository.CartRepository;
import com.fptu.group1.repository.ProductRepository;
import com.fptu.group1.repository.ProductVariantRepository;
import com.fptu.group1.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        // Validate variant exists and is active
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found with ID: " + request.getVariantId()));

        if (Boolean.FALSE.equals(variant.getIsActive())) {
            throw new BadRequestException("Product variant is not active");
        }

        // Check stock availability
        if (variant.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + variant.getStock() + ", Requested: " + request.getQuantity());
        }

        // Check if item already exists in cart
        Optional<Cart> existingCart = cartRepository.findByUserIdAndVariantId(userId, request.getVariantId());
        
        if (existingCart.isPresent()) {
            // Update quantity
            Cart cart = existingCart.get();
            int newQuantity = cart.getQuantity() + request.getQuantity();
            
            if (variant.getStock() < newQuantity) {
                throw new BadRequestException("Insufficient stock. Available: " + variant.getStock() + ", Requested: " + newQuantity);
            }
            
            cart.setQuantity(newQuantity);
            cartRepository.save(cart);
        } else {
            // Create new cart item
            Cart cart = Cart.builder()
                    .userId(userId)
                    .variantId(request.getVariantId())
                    .quantity(request.getQuantity())
                    .addedAt(LocalDateTime.now())
                    .build();
            cartRepository.save(cart);
        }

        return getCart(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        
        List<CartItemResponse> items = cartItems.stream()
                .map(this::buildCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal totalPrice = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .items(items)
                .totalItems(totalItems)
                .totalPrice(totalPrice)
                .build();
    }

    @Override
    @Transactional
    public CartResponse updateCartQuantity(Long userId, Long variantId, UpdateCartQuantityRequest request) {
        Cart cart = cartRepository.findByUserIdAndVariantId(userId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found with ID: " + variantId));

        if (Boolean.FALSE.equals(variant.getIsActive())) {
            throw new BadRequestException("Product variant is not active");
        }

        if (variant.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + variant.getStock() + ", Requested: " + request.getQuantity());
        }

        cart.setQuantity(request.getQuantity());
        cartRepository.save(cart);

        return getCart(userId);
    }

    @Override
    @Transactional
    public void removeFromCart(Long userId, Long variantId) {
        Cart cart = cartRepository.findByUserIdAndVariantId(userId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        cartRepository.delete(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    private CartItemResponse buildCartItemResponse(Cart cart) {
        ProductVariant variant = productVariantRepository.findById(cart.getVariantId())
                .orElse(null);
        
        Product product = null;
        String productName = "Unknown Product";
        String productImageUrl = null;
        
        if (variant != null) {
            product = productRepository.findById(variant.getProductId())
                    .orElse(null);
            if (product != null) {
                productName = product.getName();
                productImageUrl = product.getImageUrl();
            }
        }

        BigDecimal subtotal = variant != null 
                ? variant.getPrice().multiply(BigDecimal.valueOf(cart.getQuantity()))
                : BigDecimal.ZERO;

        return CartItemResponse.builder()
                .cartId(cart.getCartId())
                .variantId(cart.getVariantId())
                .productId(variant != null ? variant.getProductId() : null)
                .productName(productName)
                .productImageUrl(productImageUrl)
                .sku(variant != null ? variant.getSku() : null)
                .attributes(variant != null ? variant.getAttributes() : null)
                .unitPrice(variant != null ? variant.getPrice() : BigDecimal.ZERO)
                .quantity(cart.getQuantity())
                .subtotal(subtotal)
                .stock(variant != null ? variant.getStock() : 0)
                .isActive(variant != null ? variant.getIsActive() : false)
                .addedAt(cart.getAddedAt())
                .build();
    }
}

