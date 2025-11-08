package com.fptu.group1.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fptu.group1.dto.request.RegisterRequest;
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

    private static final String DEFAULT_AVATAR_URL = "https://example.com/default-avatar.png";

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        // Validate password confirmation
        if (request.getConfirmPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
            throw new com.fptu.group1.common.exception.BadRequestException("Password and confirm password do not match");
        }

        // Use email as username (ensures uniqueness)
        String usernameToUse = request.getEmail();
        
        // Check if email/username already exists (since username = email, one check is sufficient)
        if (userRepository.existsByEmail(request.getEmail()) || userRepository.existsByUsername(usernameToUse)) {
            throw new DuplicateException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .username(usernameToUse)
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
}
