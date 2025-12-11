package com.botica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class BoticaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BoticaApplication.class, args);
    }

}
