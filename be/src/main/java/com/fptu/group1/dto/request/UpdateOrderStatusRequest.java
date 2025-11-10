package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for updating order status")
public class UpdateOrderStatusRequest {
    
    @NotNull(message = "Status ID is required")
    @Positive(message = "Status ID must be positive")
    @Schema(description = "Order status ID", example = "2")
    private Long statusId;
}

