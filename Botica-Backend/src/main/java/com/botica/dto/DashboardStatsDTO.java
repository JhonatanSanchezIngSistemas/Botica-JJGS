package com.botica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private BigDecimal ventasHoy;
    private Integer pedidosHoy;
    private Integer productosTotal;
    private Integer stockCritico;
    private Double crecimiento; // Porcentaje de crecimiento
}
