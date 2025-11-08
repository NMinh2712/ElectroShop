package com.fptu.group1.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "frontend")
@Getter
@Setter
public class AppProperties {
    private String url;
}
