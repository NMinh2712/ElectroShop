package com.fptu.group1.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fptu.group1.common.exception.UnauthorizedException;
import com.fptu.group1.common.helper.JwtTokenProvider;
import com.fptu.group1.dto.request.LoginRequest;
import com.fptu.group1.dto.request.RegisterRequest;
import com.fptu.group1.dto.response.LoginResponse;
import com.fptu.group1.dto.response.RegisterResponse;
import com.fptu.group1.exception.DuplicateException;
import com.fptu.group1.model.User;
import com.fptu.group1.repository.UserRepository;
import com.fptu.group1.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private static final String DEFAULT_AVATAR_URL = "https://example.com/default-avatar.png";

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        // Validate password confirmation
        if (request.getConfirmPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
            throw new com.fptu.group1.common.exception.BadRequestException("Password and confirm password do not match");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .shippingAddress(request.getShippingAddress())
                .avatarUrl(DEFAULT_AVATAR_URL)
                .roleId(3L) // Default role for customer (USER_ID = 3)
                .createdAt(LocalDateTime.now())
                .isBanned(false)
                .build();

        // Save user to database
        user = userRepository.save(user);

        // Create response
        return RegisterResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .message("User registered successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        // Check if user is banned
        if (Boolean.TRUE.equals(user.getIsBanned())) {
            throw new UnauthorizedException("Account is banned");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
                user.getUsername(),
                user.getUserId().intValue(), // Convert Long to int for accountId
                user.getRoleId()
        );

        // Create response
        return LoginResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roleId(user.getRoleId())
                .build();
    }
}
