package com.botica.config;

import com.botica.entity.Role;
import com.botica.entity.Usuario;
import com.botica.entity.Producto;
import com.botica.repository.RoleRepository;
import com.botica.repository.UsuarioRepository;
import com.botica.repository.ProductoRepository;
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
    private ProductoRepository productoRepository;

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
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setEmail("admin@botica.com");

            Set<Role> roles = new HashSet<>();
            roles.add(roleAdmin);
            admin.setRoles(roles);

            usuarioRepository.save(admin);
            System.out.println("Usuario admin creado: username=admin, password=123456");
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

        // Inicializar productos de prueba
        if (productoRepository.count() == 0) {
            Producto[] productos = {
                crearProducto("Paracetamol 500mg", "Analgésico y antipirético", 5.50, 50, "Farmacia"),
                crearProducto("Ibuprofeno 400mg", "Antiinflamatorio no esteroideo", 8.75, 35, "Farmacia"),
                crearProducto("Amoxicilina 500mg", "Antibiótico de amplio espectro", 12.00, 25, "Farmacia"),
                crearProducto("Vitamina C 1000mg", "Suplemento vitamínico", 15.50, 100, "Vitaminas"),
                crearProducto("Omeprazol 20mg", "Inhibidor de bomba de protones", 18.90, 40, "Farmacia"),
                crearProducto("Loratadina 10mg", "Antihistamínico", 7.25, 60, "Farmacia"),
                crearProducto("Jabón Antibacterial 200ml", "Higiene personal", 4.50, 80, "Cuidado Personal"),
                crearProducto("Shampoo Neutro 250ml", "Cuidado del cabello", 9.99, 45, "Cuidado Personal"),
                crearProducto("Crema Facial Anti-Edad 50ml", "Cuidado facial", 35.00, 8, "Cuidado Personal"),
                crearProducto("Pañales Recién Nacido x 20", "Cuidado de bebé", 25.50, 5, "Bebés"),
                crearProducto("Fórmula Infantil 800g", "Nutrición para bebés", 42.00, 15, "Bebés"),
                crearProducto("Toallitas Húmedas x 80", "Higiene de bebé", 12.00, 30, "Bebés"),
                crearProducto("Multivitamínico Completo", "Suplemento integral", 28.50, 22, "Vitaminas"),
                crearProducto("Complejo B Inyectable", "Vitaminas del complejo B", 45.00, 10, "Vitaminas"),
                crearProducto("Probióticos Probio+", "Salud digestiva", 32.00, 18, "Vitaminas")
            };

            for (Producto producto : productos) {
                productoRepository.save(producto);
            }

            System.out.println("✅ " + productos.length + " productos iniciales creados en la BD");
        }
    }

    private Producto crearProducto(String nombre, String descripcion, double precio, int stock, String categoria) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setCategoria(categoria);
        return producto;
    }
}
