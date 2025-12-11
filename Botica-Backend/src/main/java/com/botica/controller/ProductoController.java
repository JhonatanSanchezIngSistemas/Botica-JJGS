package com.botica.controller;

import com.botica.dto.ProductoDTO;
import com.botica.dto.ProductoRequestDTO;
import com.botica.entity.Producto;
import com.botica.service.ProductoService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductoController - CRUD completo de productos
 * Endpoints:
 * - GET /api/productos: Listar todos
 * - GET /api/productos/search: Búsqueda por nombre
 * - GET /api/productos/stock/bajo: Stock crítico
 * - GET /api/productos/{id}: Obtener por ID
 * - POST /api/productos: Crear (ADMIN)
 * - PUT /api/productos/{id}: Actualizar (ADMIN)
 * - DELETE /api/productos/{id}: Eliminar (ADMIN)
 */
@Slf4j
@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    /**
     * Listar todos los productos
     */
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listarTodos() {
        log.debug("listando todos los productos");
        List<ProductoDTO> productos = productoService.listarTodos().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    /**
     * Buscar productos por nombre
     * 
     * @param q Query de búsqueda
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductoDTO>> buscarPorNombre(@RequestParam String q) {
        log.debug("buscando productos con query: {}", q);
        List<ProductoDTO> filtrados = productoService.listarTodos().stream()
                .filter(p -> p.getNombre() != null && 
                           p.getNombre().toLowerCase().contains(q.toLowerCase()))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(filtrados);
    }

    /**
     * Obtener productos con stock bajo (< 10)
     */
    @GetMapping("/stock/bajo")
    public ResponseEntity<List<ProductoDTO>> stockBajo() {
        log.debug("obteniendo productos con stock bajo");
        List<ProductoDTO> stockCritico = productoService.listarTodos().stream()
                .filter(p -> p.getStock() != null && p.getStock() < 10)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(stockCritico);
    }

    /**
     * Obtener producto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        log.debug("obteniendo producto con id: {}", id);
        return productoService.obtenerPorId(id)
                .map(p -> ResponseEntity.ok(convertirADTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crear nuevo producto (solo ADMIN)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody ProductoRequestDTO productoRequest) {
        log.info("creando nuevo producto: {}", productoRequest.getNombre());
        
        Producto producto = new Producto();
        producto.setNombre(productoRequest.getNombre());
        producto.setPrecio(productoRequest.getPrecio());
        producto.setStock(productoRequest.getStock());
        producto.setDescripcion(productoRequest.getDescripcion());
        
        Producto nuevo = productoService.guardar(producto);
        log.info("producto creado exitosamente con id: {}", nuevo.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertirADTO(nuevo));
    }

    /**
     * Actualizar producto existente (solo ADMIN)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDTO> actualizar(@PathVariable Long id, 
                                                   @Valid @RequestBody ProductoRequestDTO productoRequest) {
        log.info("actualizando producto con id: {}", id);
        
        return productoService.obtenerPorId(id)
                .map(existente -> {
                    existente.setNombre(productoRequest.getNombre());
                    existente.setPrecio(productoRequest.getPrecio());
                    existente.setStock(productoRequest.getStock());
                    existente.setDescripcion(productoRequest.getDescripcion());
                    
                    Producto actualizado = productoService.guardar(existente);
                    log.info("producto actualizado exitosamente: {}", id);
                    
                    return ResponseEntity.ok(convertirADTO(actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Eliminar producto (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        log.info("eliminando producto con id: {}", id);
        
        if (productoService.obtenerPorId(id).isPresent()) {
            productoService.eliminar(id);
            log.info("producto eliminado exitosamente: {}", id);
            return ResponseEntity.noContent().build();
        }
        
        log.warn("intento de eliminar producto no existente: {}", id);
        return ResponseEntity.notFound().build();
    }

    /**
     * Convertir Producto a ProductoDTO
     */
    private ProductoDTO convertirADTO(Producto producto) {
        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .descripcion(producto.getDescripcion())
                .build();
    }
}
