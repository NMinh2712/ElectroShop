package com.fptu.group1.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorResponseBody {
    private String code;
    private String message;
    private String originMessage;
}
