package com.fptu.group1.service;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fptu.group1.dto.request.UpdateOrderStatusRequest;
import com.fptu.group1.dto.response.OrderDetailResponse;
import com.fptu.group1.dto.response.OrderPageResponse;

@Service
public interface OrderService {
    OrderPageResponse getAllOrders(Pageable pageable, Long statusId);
    OrderDetailResponse getOrderById(Long orderId);
    OrderDetailResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
}

