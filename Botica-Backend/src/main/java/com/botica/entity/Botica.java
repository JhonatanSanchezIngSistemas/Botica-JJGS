package com.botica.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "boticas")
public class Botica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_comercial")
    private String nombreComercial;

    private String ruc;
    private String direccion;
    private String telefono;

    @Column(columnDefinition = "boolean default true")
    private Boolean activo = true;
}
