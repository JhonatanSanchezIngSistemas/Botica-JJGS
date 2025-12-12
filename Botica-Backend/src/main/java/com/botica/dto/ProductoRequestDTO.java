package com.botica.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoRequestDTO {
    @NotBlank(message = "nombre no puede estar vacio")
    private String nombre;

    @NotNull(message = "precio no puede ser nulo")
    @Min(value = 0, message = "precio debe ser mayor a 0")
    private Double precio;

    @NotNull(message = "stock no puede ser nulo")
    @Min(value = 0, message = "stock no puede ser negativo")
    private Integer stock;

    private String descripcion;

    private String categoria;
}
