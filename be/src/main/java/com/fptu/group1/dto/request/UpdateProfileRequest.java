package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request object for updating user profile")
public class UpdateProfileRequest {
    
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Schema(description = "User's full name", example = "Nguyen Van A")
    private String name;
    
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    @Schema(description = "User's phone number", example = "0901234567")
    private String phone;
    
    @Size(max = 255, message = "Shipping address must not exceed 255 characters")
    @Schema(description = "User's shipping address", example = "123 Đường Láng, Hà Nội")
    private String shippingAddress;
    
    @Size(max = 255, message = "Avatar URL must not exceed 255 characters")
    @Schema(description = "User's avatar URL", example = "/uploads/avatar.jpg")
    private String avatarUrl;
}

