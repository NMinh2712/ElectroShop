package com.fptu.group1.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
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
@Schema(description = "Request object for user registration")
public class RegisterRequest {
    
    @NotBlank(message = "Name is required")
    @Schema(description = "User's full name", example = "Nguyen Van A")
    private String name;
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 255, message = "Password must be at least 6 characters")
    @Schema(description = "User's password", example = "password123")
    private String password;

    @NotBlank(message = "Confirm password is required")
    @Size(min = 6, max = 255, message = "Confirm password must be at least 6 characters")
    @Schema(description = "Confirm password", example = "password123")
    private String confirmPassword;
    
    @Schema(description = "User's phone number", example = "0901234567")
    private String phone;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "User's email address", example = "nguyenvana@gmail.com")
    private String email;
    
    @Schema(description = "User's shipping address", example = "123 Đường Láng, Hà Nội")
    private String shippingAddress;
}
