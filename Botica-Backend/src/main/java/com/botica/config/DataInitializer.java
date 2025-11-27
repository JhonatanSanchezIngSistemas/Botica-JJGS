package com.botica.config;

import com.botica.entity.Role;
import com.botica.entity.Usuario;
import com.botica.repository.RoleRepository;
import com.botica.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Role roleAdmin = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(Role.ERole.ROLE_ADMIN);
                    return roleRepository.save(newRole);
                });

        Role roleUser = roleRepository.findByName(Role.ERole.ROLE_USER)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(Role.ERole.ROLE_USER);
                    return roleRepository.save(newRole);
                });

        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@botica.com");

            Set<Role> roles = new HashSet<>();
            roles.add(roleAdmin);
            admin.setRoles(roles);

            usuarioRepository.save(admin);
            System.out.println("Usuario admin creado: username=admin, password=admin123");
        }

        if (!usuarioRepository.existsByUsername("user")) {
            Usuario user = new Usuario();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@botica.com");

            Set<Role> roles = new HashSet<>();
            roles.add(roleUser);
            user.setRoles(roles);

            usuarioRepository.save(user);
            System.out.println("Usuario user creado: username=user, password=user123");
        }
    }
}
