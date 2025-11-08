package com.fptu.group1.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface RestApiErrorResponses {
    RestApiErrorResponse[] responses() default {};

    String defaultMessage() default "An error occurred";
}
