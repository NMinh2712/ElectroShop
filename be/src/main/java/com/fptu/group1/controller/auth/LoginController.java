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
import com.fptu.group1.dto.request.LoginRequest;
import com.fptu.group1.dto.response.LoginResponse;
import com.fptu.group1.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(RouteConst.API_BASE + RouteConst.AUTH_ROUTE)
public class LoginController {

    private final AuthService authService;

    // Explicit constructor to satisfy IDEs that don't process Lombok annotations
    public LoginController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = RouteConst.LOGIN, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("Login successful", response));
    }
}

