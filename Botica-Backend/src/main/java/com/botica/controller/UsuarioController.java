package com.botica.controller;

import com.botica.entity.Role;
import com.botica.entity.Usuario;
import com.botica.repository.RoleRepository;
import com.botica.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * UsuarioController - Gestión de usuarios (solo ADMIN)
 * Endpoints:
 * - GET /api/usuarios: Listar todos los usuarios
 * - POST /api/usuarios: Crear nuevo usuario
 * - PUT /api/usuarios/{id}/bloquear: Bloquear usuario
 * - PUT /api/usuarios/{id}/activar: Activar usuario
 */
@Slf4j
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Listar todos los usuarios (sin passwords)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> listarUsuarios() {
        log.debug("listando todos los usuarios");
        List<Map<String, Object>> usuarios = usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Crear nuevo usuario
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearUsuario(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        String roleName = (String) body.getOrDefault("role", "USER");

        log.info("creando nuevo usuario: {}", username);

        // Validaciones
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username es requerido"));
        }
        if (password == null || password.length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password debe tener mínimo 4 caracteres"));
        }
        if (usuarioRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El username ya existe"));
        }

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setBloqueado(false);

        // Asignar rol
        Set<Role> roles = new HashSet<>();
        Role.ERole targetRole = roleName.equalsIgnoreCase("ADMIN") ? Role.ERole.ROLE_ADMIN : Role.ERole.ROLE_USER;
        roleRepository.findByName(targetRole).ifPresent(roles::add);
        if (roles.isEmpty()) {
            roleRepository.findByName(Role.ERole.ROLE_USER).ifPresent(roles::add);
        }
        usuario.setRoles(roles);

        usuarioRepository.save(usuario);
        log.info("usuario {} creado exitosamente", username);

        return ResponseEntity.ok(Map.of("message", "Usuario creado exitosamente", "id", usuario.getId()));
    }

    /**
     * Bloquear usuario por falta de pago
     */
    @PutMapping("/{id}/bloquear")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bloquearUsuario(@PathVariable Long id, @RequestBody Map<String, String> body) {
        log.info("bloqueando usuario con id: {}", id);
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setBloqueado(true);
                    usuario.setMotivoBloqueo(body.getOrDefault("motivo", "Falta de pago o atraso"));
                    usuarioRepository.save(usuario);
                    log.info("usuario {} bloqueado exitosamente", usuario.getUsername());
                    return ResponseEntity.ok(Map.of("message", "Usuario bloqueado exitosamente"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Activar/desbloquear usuario
     */
    @PutMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activarUsuario(@PathVariable Long id) {
        log.info("activando usuario con id: {}", id);
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setBloqueado(false);
                    usuario.setMotivoBloqueo(null);
                    usuarioRepository.save(usuario);
                    log.info("usuario {} activado exitosamente", usuario.getUsername());
                    return ResponseEntity.ok(Map.of("message", "Usuario activado exitosamente"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Eliminar usuario
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        log.info("eliminando usuario con id: {}", id);
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuarioRepository.delete(usuario);
                    log.info("usuario {} eliminado exitosamente", usuario.getUsername());
                    return ResponseEntity.ok(Map.of("message", "Usuario eliminado exitosamente"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Convertir Usuario a DTO (sin password)
     */
    private Map<String, Object> convertirADTO(Usuario usuario) {
        return Map.of(
                "id", usuario.getId(),
                "username", usuario.getUsername(),
                "email", usuario.getEmail() != null ? usuario.getEmail() : "",
                "roles", usuario.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()),
                "bloqueado", usuario.getBloqueado() != null ? usuario.getBloqueado() : false,
                "motivoBloqueo", usuario.getMotivoBloqueo() != null ? usuario.getMotivoBloqueo() : "");
    }
}
