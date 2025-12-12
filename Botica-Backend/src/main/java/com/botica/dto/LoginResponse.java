package com.botica.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;

    @Builder.Default
    private String type = "Bearer";

    private Long id;
    private String username;
    private String email;
    private List<String> roles;

    // Datos de la botica del usuario
    private BoticaInfo botica;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BoticaInfo {
        private Long id;
        private String nombreComercial;
    }
}
