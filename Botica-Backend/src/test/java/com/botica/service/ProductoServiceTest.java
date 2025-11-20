package com.botica.service;

import com.botica.entity.Producto;
import com.botica.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void testListarTodos() {
        // Arrange
        Producto p1 = new Producto();
        p1.setId(1L);
        p1.setNombre("Paracetamol");
        p1.setPrecio(5.50);
        p1.setStock(100);

        Producto p2 = new Producto();
        p2.setId(2L);
        p2.setNombre("Ibuprofeno");
        p2.setPrecio(8.00);
        p2.setStock(50);

        when(productoRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        // Act
        List<Producto> productos = productoService.listarTodos();

        // Assert
        assertNotNull(productos);
        assertEquals(2, productos.size());
        assertEquals("Paracetamol", productos.get(0).getNombre());
        verify(productoRepository, times(1)).findAll();
    }

    @Test
    void testGuardar() {
        // Arrange
        Producto producto = new Producto();
        producto.setNombre("Aspirina");
        producto.setPrecio(6.00);
        producto.setStock(75);

        when(productoRepository.save(producto)).thenReturn(producto);

        // Act
        Producto resultado = productoService.guardar(producto);

        // Assert
        assertNotNull(resultado);
        assertEquals("Aspirina", resultado.getNombre());
        verify(productoRepository, times(1)).save(producto);
    }

    @Test
    void testObtenerPorId() {
        // Arrange
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Paracetamol");

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        // Act
        Optional<Producto> resultado = productoService.obtenerPorId(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("Paracetamol", resultado.get().getNombre());
        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    void testEliminar() {
        // Arrange
        Long id = 1L;
        doNothing().when(productoRepository).deleteById(id);

        // Act
        productoService.eliminar(id);

        // Assert
        verify(productoRepository, times(1)).deleteById(id);
    }
}
