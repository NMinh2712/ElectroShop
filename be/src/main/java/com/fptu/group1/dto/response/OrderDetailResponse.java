package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Detailed order information")
public class OrderDetailResponse {
    
    @Schema(description = "Order ID")
    private Long orderId;
    
    @Schema(description = "User ID")
    private Long userId;
    
    @Schema(description = "Total price")
    private BigDecimal totalPrice;
    
    @Schema(description = "Shipping address")
    private String shippingAddress;
    
    @Schema(description = "Status ID")
    private Long statusId;
    
    @Schema(description = "Status name")
    private String statusName;
    
    @Schema(description = "Note")
    private String note;
    
    @Schema(description = "Voucher ID")
    private Long voucherId;
    
    @Schema(description = "Order items")
    @Builder.Default
    private List<OrderItemResponse> items = new ArrayList<>();
    
    @Schema(description = "Created at")
    private LocalDateTime createdAt;
}

