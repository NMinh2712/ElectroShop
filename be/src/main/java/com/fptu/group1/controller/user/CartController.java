package com.fptu.group1.controller.user;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
import com.fptu.group1.dto.request.AddToCartRequest;
import com.fptu.group1.dto.request.UpdateCartQuantityRequest;
import com.fptu.group1.dto.response.CartResponse;
import com.fptu.group1.security.CustomUserDetails;
import com.fptu.group1.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(RouteConst.API_BASE + "/user/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ALL_USERS)
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request) {

        Long userId = getUserIdFromAuthentication(authentication);
        CartResponse response = cartService.addToCart(userId, request);

        return ResponseEntity.ok(ApiResponse.success("Product added to cart successfully", response));
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ALL_USERS)
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        CartResponse response = cartService.getCart(userId);

        return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully", response));
    }

    @PutMapping(value = "/{variantId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ALL_USERS)
    public ResponseEntity<ApiResponse<CartResponse>> updateCartQuantity(
            Authentication authentication,
            @PathVariable("variantId") Long variantId,
            @Valid @RequestBody UpdateCartQuantityRequest request) {

        Long userId = getUserIdFromAuthentication(authentication);
        CartResponse response = cartService.updateCartQuantity(userId, variantId, request);

        return ResponseEntity.ok(ApiResponse.success("Cart quantity updated successfully", response));
    }

    @DeleteMapping(value = "/{variantId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ALL_USERS)
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            Authentication authentication,
            @PathVariable("variantId") Long variantId) {

        Long userId = getUserIdFromAuthentication(authentication);
        cartService.removeFromCart(userId, variantId);

        return ResponseEntity.ok(ApiResponse.success("Product removed from cart successfully", null));
    }

    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ALL_USERS)
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        cartService.clearCart(userId);

        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully", null));
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getAccountId().longValue();
        }
        throw new RuntimeException("Unable to get user ID from authentication");
    }
}

