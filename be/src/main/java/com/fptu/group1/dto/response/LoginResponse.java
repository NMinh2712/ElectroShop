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
@Schema(description = "Response object for successful user login")
public class LoginResponse {
    @Schema(description = "JWT authentication token")
    private String token;
    
    @Schema(description = "User's unique identifier")
    private Long userId;
    
    @Schema(description = "User's username")
    private String username;
    
    @Schema(description = "User's email address")
    private String email;
    
    @Schema(description = "User's role ID")
    private Long roleId;
}

