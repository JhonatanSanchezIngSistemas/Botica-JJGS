package com.botica.controller;

import com.botica.dto.ChartDataDTO;
import com.botica.dto.DashboardStatsDTO;
import com.botica.entity.Producto;
import com.botica.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * DashboardController - Estadísticas y datos para el dashboard
 * Endpoints:
 * - GET /api/dashboard/stats: KPIs generales
 * - GET /api/dashboard/charts/ventas: Datos gráfico de ventas
 * - GET /api/dashboard/charts/categorias: Datos gráfico de categorías
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Obtener estadísticas generales del dashboard
     * 
     * @return KPIs: ventas, pedidos, productos, stock crítico
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        try {
            // Total de productos
            long productosTotal = productoRepository.count();

            // Stock crítico (productos con stock < 10)
            long stockCritico = productoRepository.findAll().stream()
                    .filter(p -> p.getStock() < 10)
                    .count();

            // Simular ventas del día (en Release 3.0 se conectará con tabla Ventas)
            BigDecimal ventasHoy = new BigDecimal("1250.50");
            Integer pedidosHoy = 15;
            Double crecimiento = 12.5;

            DashboardStatsDTO stats = new DashboardStatsDTO(
                    ventasHoy,
                    pedidosHoy,
                    (int) productosTotal,
                    (int) stockCritico,
                    crecimiento);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Datos para gráfico de ventas (últimos 7 días)
     * 
     * @return ChartDataDTO con labels y data
     */
    @GetMapping("/charts/ventas")
    public ResponseEntity<ChartDataDTO> getVentasChartData() {
        try {
            // Últimos 7 días
            List<String> labels = Arrays.asList("Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom");

            // Datos simulados (en Release 3.0 se calculará desde tabla Ventas)
            List<Number> data = Arrays.asList(120, 190, 300, 250, 400, 350, 280);

            ChartDataDTO chartData = new ChartDataDTO(labels, data, "line");

            return ResponseEntity.ok(chartData);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Datos para gráfico de categorías (distribución de productos)
     * 
     * @return ChartDataDTO con categorías y cantidades
     */
    @GetMapping("/charts/categorias")
    public ResponseEntity<ChartDataDTO> getCategoriasChartData() {
        try {
            // Agrupar productos por categoría
            List<Producto> productos = productoRepository.findAll();

            Map<String, Long> categoriaCount = productos.stream()
                    .collect(Collectors.groupingBy(
                            p -> p.getCategoria() != null ? p.getCategoria() : "Sin categoría",
                            Collectors.counting()));

            List<String> labels = new ArrayList<>(categoriaCount.keySet());
            List<Number> data = new ArrayList<>(categoriaCount.values());

            ChartDataDTO chartData = new ChartDataDTO(labels, data, "doughnut");

            return ResponseEntity.ok(chartData);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener productos recientes (últimos 5)
     * 
     * @return Lista de productos ordenados por fecha de creación
     */
    @GetMapping("/productos/recientes")
    public ResponseEntity<List<Producto>> getProductosRecientes() {
        try {
            List<Producto> productos = productoRepository.findAll();

            // Ordenar por ID descendente (los más recientes primero)
            productos.sort((p1, p2) -> p2.getId().compareTo(p1.getId()));

            // Tomar los primeros 5
            List<Producto> recientes = productos.stream()
                    .limit(5)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(recientes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
