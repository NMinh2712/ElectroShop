package com.fptu.group1.service;

import org.springframework.stereotype.Service;

import com.fptu.group1.dto.request.LoginRequest;
import com.fptu.group1.dto.request.RegisterRequest;
import com.fptu.group1.dto.response.LoginResponse;
import com.fptu.group1.dto.response.RegisterResponse;

@Service
public interface AuthService {
    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
