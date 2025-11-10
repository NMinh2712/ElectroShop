package com.fptu.group1.service;

import org.springframework.stereotype.Service;

import com.fptu.group1.dto.request.ChangePasswordRequest;
import com.fptu.group1.dto.request.UpdateProfileRequest;
import com.fptu.group1.dto.response.ProfileResponse;

@Service
public interface UserProfileService {
    ProfileResponse getProfile(Long userId);
    ProfileResponse updateProfile(Long userId, UpdateProfileRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
}

