# TODO: Implementar Multi-Tenant y Mostrar Todos los Campos en ProductTable

## Pasos a Realizar

- [ ] Agregar columna "Categoría" a ProductTable.jsx para mostrar todos los campos del producto
- [ ] Agregar campo botica_id a la entidad Producto
- [ ] Agregar campo botica_id a la entidad Usuario
- [ ] Modificar ProductoRepository para incluir métodos que filtren por botica_id
- [ ] Actualizar ProductoController para extraer botica_id del JWT y filtrar consultas de productos
- [ ] Actualizar JwtUtil para incluir botica_id en el JWT (si es necesario)
- [ ] Actualizar esquema de base de datos para incluir columnas botica_id
- [ ] Probar filtrado multi-tenant y visualización en frontend
