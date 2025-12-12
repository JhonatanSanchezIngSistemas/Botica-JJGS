package com.botica.controller;

import com.botica.entity.Venta;
import com.botica.repository.VentaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaRepository repo;

    public VentaController(VentaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Venta> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Venta save(@RequestBody Venta venta) {
        // Log para depurar
        System.out.println("=== VENTA RECIBIDA ===");
        System.out.println("ClienteNombre: " + venta.getClienteNombre());
        System.out.println("ClienteDni: " + venta.getClienteDni());
        System.out.println("ClienteSintomas: " + venta.getClienteSintomas());
        System.out.println("Total: " + venta.getTotal());

        // Asignar fecha actual si no viene
        if (venta.getFecha() == null || venta.getFecha().isEmpty()) {
            venta.setFecha(java.time.LocalDateTime.now().toString());
        }
        return repo.save(venta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> update(@PathVariable Long id, @RequestBody Venta venta) {
        return repo.findById(id)
                .map(existing -> {
                    venta.setId(id);
                    return ResponseEntity.ok(repo.save(venta));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
