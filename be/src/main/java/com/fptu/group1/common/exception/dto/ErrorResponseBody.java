package com.fptu.group1.common.exception.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseBody {
    private String message; // Error message describing the issue
    private String code; // Optional error code for more specific identification
    private String originMessage; // Original message from the exception, if available
    private Map<String, String> errors; // Field-level validation errors
}
