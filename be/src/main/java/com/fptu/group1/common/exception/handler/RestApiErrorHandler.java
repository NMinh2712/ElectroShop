package com.fptu.group1.common.exception.handler;

import com.fptu.group1.common.annotation.RestApiErrorResponse;
import com.fptu.group1.common.annotation.RestApiErrorResponses;
import com.fptu.group1.common.exception.dto.ErrorResponseBody;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.lang.reflect.Method;

@Aspect
@Component
@Slf4j
public class RestApiErrorHandler extends ResponseEntityExceptionHandler {

    @Around("execution(public * *(..)) && within(@org.springframework.web.bind.annotation.RestController *)")
    private Object handleException(ProceedingJoinPoint pjp) throws Throwable {
        try {
            return pjp.proceed();
        } catch (Exception e) {
            String methodName = pjp.getSignature().getName();
            

            MethodSignature methodSignature = (MethodSignature) pjp.getSignature();
            Method method = methodSignature.getMethod();

            // Lấy tất cả annotation lỗi trên method
            RestApiErrorResponses wrapper = method.getAnnotation(RestApiErrorResponses.class);
            RestApiErrorResponse[] responses = method.getAnnotationsByType(RestApiErrorResponse.class);
            if (wrapper != null) {
                responses = ArrayUtils.addAll(responses, wrapper.responses());
            }

            // So khớp loại Exception được chỉ định trong annotation
            for (RestApiErrorResponse res : responses) {
                if (res.on().value().isAssignableFrom(e.getClass())) {
                    ErrorResponseBody body = ErrorResponseBody.builder()
                            .code(res.code())
                            .message(res.message())
                            .originMessage(e.getMessage())
                            .build();
                    return new ResponseEntity<>(body, res.status());
                }
            }

            // Không khớp loại nào → fallback lỗi mặc định
            ErrorResponseBody fallback = ErrorResponseBody.builder()
                    .code("E0001")
                    .message("An unexpected error occurred")
                    .originMessage(e.getMessage())
                    .build();

            return new ResponseEntity<>(fallback, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
