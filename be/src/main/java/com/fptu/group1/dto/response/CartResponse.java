package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Shopping cart information")
public class CartResponse {
    
    @Schema(description = "Cart items")
    @Builder.Default
    private List<CartItemResponse> items = new ArrayList<>();
    
    @Schema(description = "Total items count")
    private Integer totalItems;
    
    @Schema(description = "Total price")
    private BigDecimal totalPrice;
}

