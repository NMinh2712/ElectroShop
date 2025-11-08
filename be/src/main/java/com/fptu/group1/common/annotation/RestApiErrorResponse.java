package com.fptu.group1.common.annotation;

import org.springframework.http.HttpStatus;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface RestApiErrorResponse {
    HttpStatus status() default HttpStatus.INTERNAL_SERVER_ERROR; // Default to Internal Server Error

    String message() default "An error occurred"; // Default error message

    String code() default "E0001"; // Optional error code for more specific identification

    Exception on();

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.ANNOTATION_TYPE)
    @interface Exception {
        Class<? extends java.lang.Exception> value(); // The exception class that this error response corresponds to
    }
}
