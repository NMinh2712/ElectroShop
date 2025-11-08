package com.fptu.group1.controller.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fptu.group1.common.constant.RouteConst;
import com.fptu.group1.dto.ApiResponse;
import com.fptu.group1.dto.request.RegisterRequest;
import com.fptu.group1.dto.response.RegisterResponse;
import com.fptu.group1.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(RouteConst.API_BASE + RouteConst.AUTH_ROUTE)
public class RegisterController {

    private final AuthService authService;

    // Explicit constructor to satisfy IDEs that don't process Lombok annotations
    public RegisterController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = RouteConst.REGISTER, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }
}
