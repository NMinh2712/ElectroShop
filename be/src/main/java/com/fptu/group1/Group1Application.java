package com.fptu.group1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.fptu.group1"})
public class Group1Application {

	public static void main(String[] args) {
		SpringApplication.run(Group1Application.class, args);
	}

}
