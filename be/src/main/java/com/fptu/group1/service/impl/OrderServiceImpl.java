package com.fptu.group1.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fptu.group1.common.exception.ResourceNotFoundException;
import com.fptu.group1.dto.request.UpdateOrderStatusRequest;
import com.fptu.group1.dto.response.OrderDetailResponse;
import com.fptu.group1.dto.response.OrderItemResponse;
import com.fptu.group1.dto.response.OrderListResponse;
import com.fptu.group1.dto.response.OrderPageResponse;
import com.fptu.group1.model.Order;
import com.fptu.group1.model.OrderDetail;
import com.fptu.group1.model.OrderStatus;
import com.fptu.group1.model.Product;
import com.fptu.group1.model.ProductVariant;
import com.fptu.group1.repository.OrderDetailRepository;
import com.fptu.group1.repository.OrderRepository;
import com.fptu.group1.repository.OrderStatusRepository;
import com.fptu.group1.repository.ProductRepository;
import com.fptu.group1.repository.ProductVariantRepository;
import com.fptu.group1.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional(readOnly = true)
    public OrderPageResponse getAllOrders(Pageable pageable, Long statusId) {
        Page<Order> orderPage;
        
        if (statusId != null) {
            orderPage = orderRepository.findByStatusId(statusId, pageable);
        } else {
            orderPage = orderRepository.findAllOrders(pageable);
        }

        List<OrderListResponse> orders = orderPage.getContent().stream()
                .map(this::buildOrderListResponse)
                .collect(Collectors.toList());

        return OrderPageResponse.builder()
                .orders(orders)
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .first(orderPage.isFirst())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        return buildOrderDetailResponse(order);
    }

    @Override
    @Transactional
    public OrderDetailResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        OrderStatus status = orderStatusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Order status not found with ID: " + request.getStatusId()));

        order.setStatusId(status.getStatusId());
        order = orderRepository.save(order);

        return buildOrderDetailResponse(order);
    }

    private OrderListResponse buildOrderListResponse(Order order) {
        String statusName = order.getStatus() != null ? order.getStatus().getStatusName().name() : "UNKNOWN";
        
        return OrderListResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUserId())
                .totalPrice(order.getTotalPrice())
                .shippingAddress(order.getShippingAddress())
                .statusId(order.getStatusId())
                .statusName(statusName)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private OrderDetailResponse buildOrderDetailResponse(Order order) {
        String statusName = order.getStatus() != null ? order.getStatus().getStatusName().name() : "UNKNOWN";
        
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getOrderId());
        List<OrderItemResponse> items = orderDetails.stream()
                .map(this::buildOrderItemResponse)
                .collect(Collectors.toList());

        return OrderDetailResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUserId())
                .totalPrice(order.getTotalPrice())
                .shippingAddress(order.getShippingAddress())
                .statusId(order.getStatusId())
                .statusName(statusName)
                .note(order.getNote())
                .voucherId(order.getVoucherId())
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private OrderItemResponse buildOrderItemResponse(OrderDetail orderDetail) {
        ProductVariant variant = productVariantRepository.findById(orderDetail.getVariantId())
                .orElse(null);
        
        Product product = null;
        String productName = "Unknown Product";
        
        if (variant != null) {
            product = productRepository.findById(variant.getProductId())
                    .orElse(null);
            if (product != null) {
                productName = product.getName();
            }
        }

        return OrderItemResponse.builder()
                .orderDetailId(orderDetail.getOrderDetailId())
                .variantId(orderDetail.getVariantId())
                .productId(variant != null ? variant.getProductId() : null)
                .productName(productName)
                .sku(variant != null ? variant.getSku() : null)
                .attributes(variant != null ? variant.getAttributes() : null)
                .quantity(orderDetail.getQuantity())
                .unitPrice(orderDetail.getUnitPrice())
                .warrantyMonths(orderDetail.getWarrantyMonths())
                .build();
    }
}

