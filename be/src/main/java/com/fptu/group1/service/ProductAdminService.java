package com.fptu.group1.service;

import org.springframework.stereotype.Service;

import com.fptu.group1.dto.request.AddProductRequest;
import com.fptu.group1.dto.response.AddProductResponse;

@Service
public interface ProductAdminService {
    AddProductResponse addProduct(AddProductRequest request);
}

