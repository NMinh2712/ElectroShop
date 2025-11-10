package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Order information for list view")
public class OrderListResponse {
    
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
    
    @Schema(description = "Created at")
    private LocalDateTime createdAt;
}

