package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for checkout")
public class CheckoutRequest {
    
    @NotBlank(message = "Shipping address is required")
    @Size(max = 500, message = "Shipping address must not exceed 500 characters")
    @Schema(description = "Shipping address", example = "123 Main Street, Ho Chi Minh City")
    private String shippingAddress;
    
    @Size(max = 1000, message = "Note must not exceed 1000 characters")
    @Schema(description = "Order note", example = "Please deliver in the morning")
    private String note;
    
    @Schema(description = "Voucher ID (optional)", example = "1")
    private Long voucherId;
    
    @NotBlank(message = "Payment method is required")
    @Schema(description = "Payment method", example = "CREDIT_CARD")
    private String paymentMethod;
}

