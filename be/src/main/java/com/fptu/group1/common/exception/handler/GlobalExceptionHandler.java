package com.fptu.group1.common.exception.handler;

import com.fptu.group1.common.exception.BadRequestException;
import com.fptu.group1.common.exception.ResourceNotFoundException;
import com.fptu.group1.common.exception.dto.ErrorResponseBody;
import com.fptu.group1.exception.DuplicateException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseBody> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponseBody body = ErrorResponseBody.builder()
                .code("E0400")
                .message("Validation failed")
                .errors(errors)
                .build();

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseBody> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorResponseBody body = ErrorResponseBody.builder()
                .code("E0404")
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponseBody> handleBadRequestException(BadRequestException ex) {
        ErrorResponseBody body = ErrorResponseBody.builder()
                .code("E0400")
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<ErrorResponseBody> handleDuplicateException(DuplicateException ex) {
        ErrorResponseBody body = ErrorResponseBody.builder()
                .code("E0409")
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponseBody> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException ex) {
        ErrorResponseBody body = ErrorResponseBody.builder()
                .code("E0415")
                .message("Content-Type not supported. Please use 'application/json'")
                .originMessage(ex.getMessage())
                .build();

        return new ResponseEntity<>(body, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseBody> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        ErrorResponseBody body = ErrorResponseBody.builder()
                .code("E0400")
                .message("Invalid request body. Please check your JSON format.")
                .originMessage(ex.getMessage())
                .build();

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseBody> handleAllExceptions(Exception ex) {
        log.error("Unexpected error", ex);
        
        ErrorResponseBody body = ErrorResponseBody.builder()
                .code("E0500")
                .message("An unexpected error occurred")
                .originMessage(ex.getMessage())
                .build();

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}