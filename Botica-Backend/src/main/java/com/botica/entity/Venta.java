package com.botica.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "sales")
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double total;
    private String metodoPago;
    private String fecha;

    // Datos del cliente (sin relación, campos simples)
    private String clienteNombre;
    private String clienteDni;
    private String clienteSintomas;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToMany
    @JoinTable(name = "sale_products", joinColumns = @JoinColumn(name = "sale_id"), inverseJoinColumns = @JoinColumn(name = "producto_id"))
    private List<Producto> productos;
}
