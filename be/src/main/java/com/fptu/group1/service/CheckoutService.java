package com.fptu.group1.service;

import org.springframework.stereotype.Service;

import com.fptu.group1.dto.request.CheckoutRequest;
import com.fptu.group1.dto.response.CheckoutResponse;

@Service
public interface CheckoutService {
    CheckoutResponse checkout(Long userId, CheckoutRequest request);
}

