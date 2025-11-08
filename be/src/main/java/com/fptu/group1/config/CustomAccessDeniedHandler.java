package com.fptu.group1.config;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fptu.group1.common.constant.MessageConst;
import com.fptu.group1.dto.response.ErrorResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException ex) throws IOException {


        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");

        ErrorResponseBody error = ErrorResponseBody.builder()
                .code(MessageConst.ERROR_ACCESS_DENIED)
                .message("Access Denied: You do not have permission.")
                .originMessage(ex.getMessage())
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(error));
    }
}
