package com.fptu.group1.controller.staff;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fptu.group1.common.constant.AuthorityConst;
import com.fptu.group1.common.constant.RouteConst;
import com.fptu.group1.dto.ApiResponse;
import com.fptu.group1.dto.request.UpdateOrderStatusRequest;
import com.fptu.group1.dto.response.OrderDetailResponse;
import com.fptu.group1.dto.response.OrderPageResponse;
import com.fptu.group1.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(RouteConst.API_BASE + "/staff/order")
public class StaffOrderController {

    private final OrderService orderService;

    public StaffOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_STAFF_OR_ADMIN)
    public ResponseEntity<ApiResponse<OrderPageResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) Integer statusId) {

        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        OrderPageResponse response = orderService.getAllOrders(pageable, statusId != null ? statusId.longValue() : null);

        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", response));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_STAFF_OR_ADMIN)
    public ResponseEntity<ApiResponse<OrderDetailResponse>> getOrderById(
            @PathVariable("id") Long orderId) {

        OrderDetailResponse response = orderService.getOrderById(orderId);

        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", response));
    }

    @PutMapping(value = "/{id}/status", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_STAFF_OR_ADMIN)
    public ResponseEntity<ApiResponse<OrderDetailResponse>> updateOrderStatus(
            @PathVariable("id") Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        OrderDetailResponse response = orderService.updateOrderStatus(orderId, request);

        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", response));
    }
}

