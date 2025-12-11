package com.botica.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "username no puede estar vacio")
    private String username;

    @NotBlank(message = "password no puede estar vacio")
    private String password;
}
