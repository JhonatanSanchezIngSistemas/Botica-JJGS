package com.botica.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Configuration
@EnableRetry
public class DatabaseConfig {

    @Autowired
    private Environment env;

    @Bean
    @Retryable(value = {SQLException.class}, maxAttempts = 10, backoff = @org.springframework.retry.annotation.Backoff(delay = 5000))
    public DataSource dataSource(DataSource dataSource) throws SQLException {
        // Test the connection on startup
        try (Connection connection = dataSource.getConnection()) {
            if (connection != null) {
                System.out.println("Database connection established successfully.");
            }
        }
        return dataSource;
    }
}
