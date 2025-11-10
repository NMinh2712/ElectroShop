package com.fptu.group1.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User profile information")
public class ProfileResponse {
    
    @Schema(description = "User ID")
    private Long userId;
    
    @Schema(description = "Username")
    private String username;
    
    @Schema(description = "Email address")
    private String email;
    
    @Schema(description = "Full name")
    private String name;
    
    @Schema(description = "Phone number")
    private String phone;
    
    @Schema(description = "Shipping address")
    private String shippingAddress;
    
    @Schema(description = "Avatar URL")
    private String avatarUrl;
    
    @Schema(description = "Role ID")
    private Long roleId;
}

