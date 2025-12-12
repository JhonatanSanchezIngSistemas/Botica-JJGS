package com.botica.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private Double precio;
    private Integer stock;
    private String descripcion;
    private String categoria; // Categoría del producto (Farmacia, Cuidado Personal, etc.)
    private Long boticaId; // ID de la botica para multi-tenant
}
