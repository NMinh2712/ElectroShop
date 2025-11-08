package com.fptu.group1.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response object for successful user registration")
public class RegisterResponse {
    @Schema(description = "User's unique identifier")
    private Long userId;
    
    @Schema(description = "User's username")
    private String username;
    
    @Schema(description = "User's email address")
    private String email;
    
    @Schema(description = "Account creation timestamp")
    private LocalDateTime createdAt;
    
    @Schema(description = "Response message")
    private String message;
}
