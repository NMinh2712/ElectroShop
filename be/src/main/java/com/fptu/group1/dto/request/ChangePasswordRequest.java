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
@Schema(description = "Request object for changing password")
public class ChangePasswordRequest {
    
    @NotBlank(message = "Current password is required")
    @Schema(description = "Current password", example = "oldPassword123")
    private String currentPassword;
    
    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 255, message = "New password must be at least 6 characters")
    @Schema(description = "New password", example = "newPassword123")
    private String newPassword;
    
    @NotBlank(message = "Confirm password is required")
    @Size(min = 6, max = 255, message = "Confirm password must be at least 6 characters")
    @Schema(description = "Confirm new password", example = "newPassword123")
    private String confirmPassword;
}

