package com.botica.controller;

import com.botica.dto.LoginRequest;
import com.botica.dto.LoginResponse;
import com.botica.dto.UsuarioDTO;
import com.botica.entity.Usuario;
import com.botica.repository.UsuarioRepository;
import com.botica.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

/**
 * AuthController - Maneja autenticación con JWT
 * Endpoints:
 * - POST /auth/login: Login con username/password
 * - GET /auth/me: Obtener usuario actual
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Login endpoint
     * 
     * @param loginRequest username y password
     * @return JWT token y datos del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("intento de login para usuario: {}", loginRequest.getUsername());
        
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generar JWT token
        String jwt = jwtUtil.generateJwtToken(authentication);

        // Obtener datos del usuario
        Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> {
                    log.error("usuario no encontrado despues de autenticacion: {}", loginRequest.getUsername());
                    return new RuntimeException("usuario no encontrado");
                });

        // Extraer roles
        java.util.List<String> roles = usuario.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        // Crear respuesta con DTO sin password
        LoginResponse response = LoginResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(usuario.getId())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .roles(roles)
                .build();

        log.info("login exitoso para usuario: {}", loginRequest.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener usuario actual desde el token
     * 
     * @return Datos del usuario autenticado
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        log.debug("obteniendo datos de usuario actual: {}", username);

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("usuario autenticado no encontrado en base de datos: {}", username);
                    return new RuntimeException("usuario no encontrado");
                });

        java.util.List<String> roles = usuario.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        // Retornar DTO sin password
        UsuarioDTO usuarioDTO = UsuarioDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .roles(roles)
                .build();

        return ResponseEntity.ok(usuarioDTO);
    }
}
