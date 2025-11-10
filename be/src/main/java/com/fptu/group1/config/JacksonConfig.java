package com.fptu.group1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.DeserializationFeature;

@Configuration
public class JacksonConfig {

    /**
     * Configure ObjectMapper for JSON serialization/deserialization
     * This ensures LocalDateTime and other Java 8 time types are properly handled
     * 
     * Note: This ObjectMapper is used for manual JSON parsing (e.g., in ProductAdminServiceImpl)
     * Spring Boot automatically configures Jackson for HTTP message conversion based on
     * application.properties settings
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        // Use Spring Boot's builder which already includes JavaTimeModule by default
        // The application.properties settings will be applied automatically
        ObjectMapper mapper = builder.build();
        
        // Explicitly ensure JavaTimeModule is registered (should already be there)
        mapper.registerModule(new JavaTimeModule());
        
        // Disable writing dates as timestamps (use ISO-8601 format instead)
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // Don't fail on unknown properties
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        return mapper;
    }
}

