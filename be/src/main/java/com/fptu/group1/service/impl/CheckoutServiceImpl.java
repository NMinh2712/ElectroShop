package com.fptu.group1.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fptu.group1.common.exception.BadRequestException;
import com.fptu.group1.common.exception.ResourceNotFoundException;
import com.fptu.group1.dto.request.CheckoutRequest;
import com.fptu.group1.dto.response.CheckoutResponse;
import com.fptu.group1.model.Cart;
import com.fptu.group1.model.Order;
import com.fptu.group1.model.OrderDetail;
import com.fptu.group1.model.OrderStatus;
import com.fptu.group1.model.Payment;
import com.fptu.group1.model.ProductVariant;
import com.fptu.group1.repository.CartRepository;
import com.fptu.group1.repository.OrderDetailRepository;
import com.fptu.group1.repository.OrderRepository;
import com.fptu.group1.repository.OrderStatusRepository;
import com.fptu.group1.repository.PaymentRepository;
import com.fptu.group1.repository.ProductVariantRepository;
import com.fptu.group1.service.CheckoutService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final PaymentRepository paymentRepository;
    private final ProductVariantRepository productVariantRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public CheckoutResponse checkout(Long userId, CheckoutRequest request) {
        // Get user's cart
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // Validate cart items and calculate total
        BigDecimal totalPrice = BigDecimal.ZERO;
        
        for (Cart cartItem : cartItems) {
            ProductVariant variant = productVariantRepository.findById(cartItem.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found with ID: " + cartItem.getVariantId()));

            if (Boolean.FALSE.equals(variant.getIsActive())) {
                throw new BadRequestException("Product variant " + variant.getSku() + " is not active");
            }

            if (variant.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for variant " + variant.getSku() + ". Available: " + variant.getStock() + ", Requested: " + cartItem.getQuantity());
            }

            totalPrice = totalPrice.add(variant.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        // Get default order status (PENDING)
        OrderStatus defaultStatus = orderStatusRepository.findByStatusName(OrderStatus.OrderStatusName.PENDING)
                .orElseThrow(() -> new ResourceNotFoundException("Default order status not found"));

        // Create order
        Order order = Order.builder()
                .userId(userId)
                .totalPrice(totalPrice)
                .shippingAddress(request.getShippingAddress())
                .statusId(defaultStatus.getStatusId())
                .note(request.getNote())
                .voucherId(request.getVoucherId())
                .createdAt(LocalDateTime.now())
                .build();

        order = orderRepository.save(order);
        entityManager.flush();

        // Create order details and update stock
        for (Cart cartItem : cartItems) {
            ProductVariant variant = productVariantRepository.findById(cartItem.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

            // Create order detail
            OrderDetail orderDetail = OrderDetail.builder()
                    .orderId(order.getOrderId())
                    .variantId(cartItem.getVariantId())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(variant.getPrice())
                    .warrantyMonths(0) // Default warranty
                    .build();
            orderDetailRepository.save(orderDetail);

            // Update stock
            variant.setStock(variant.getStock() - cartItem.getQuantity());
            productVariantRepository.save(variant);
        }

        // Create payment record
        Payment payment = Payment.builder()
                .orderId(order.getOrderId())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("PENDING")
                .amount(totalPrice)
                .build();
        paymentRepository.save(payment);

        // Clear cart
        cartRepository.deleteByUserId(userId);

        String statusName = order.getStatus() != null ? order.getStatus().getStatusName().name() : "PENDING";

        return CheckoutResponse.builder()
                .orderId(order.getOrderId())
                .totalPrice(order.getTotalPrice())
                .shippingAddress(order.getShippingAddress())
                .statusId(order.getStatusId())
                .statusName(statusName)
                .createdAt(order.getCreatedAt())
                .message("Order created successfully")
                .build();
    }
}

