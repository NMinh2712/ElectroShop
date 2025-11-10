package com.fptu.group1.common.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


@Slf4j
@Aspect
@Component
public class ApiLoggingInterceptor {

    @Around("execution(public * *(..)) && within(@org.springframework.web.bind.annotation.RestController *)")
    private Object logging(ProceedingJoinPoint pjp) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .getRequest();

        long startTime = System.currentTimeMillis();
        Object result = pjp.proceed();
        long endTime = System.currentTimeMillis();
        
        long duration = endTime - startTime;
        log.debug("API call: {} {} - Duration: {}ms", 
                request.getMethod(), 
                request.getRequestURI(), 
                duration);

        return result;
    }
}
