package com.fptu.group1.controller.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fptu.group1.common.constant.AuthorityConst;
import com.fptu.group1.common.constant.RouteConst;
import com.fptu.group1.dto.ApiResponse;
import com.fptu.group1.dto.request.CheckoutRequest;
import com.fptu.group1.dto.response.CheckoutResponse;
import com.fptu.group1.security.CustomUserDetails;
import com.fptu.group1.service.CheckoutService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(RouteConst.API_BASE + "/user/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_ALL_USERS)
    public ResponseEntity<ApiResponse<CheckoutResponse>> checkout(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequest request) {

        Long userId = getUserIdFromAuthentication(authentication);
        CheckoutResponse response = checkoutService.checkout(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", response));
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getAccountId().longValue();
        }
        throw new RuntimeException("Unable to get user ID from authentication");
    }
}

