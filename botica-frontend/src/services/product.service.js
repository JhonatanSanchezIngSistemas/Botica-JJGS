import api from './api';

/**
 * Product Service
 * Maneja todas las operaciones CRUD de productos
 */

/**
 * Obtener todos los productos
 */
const getProductos = async () => {
    try {
        const response = await api.get('/api/productos');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        throw error;
    }
};

/**
 * Obtener un producto por ID
 */
const getProducto = async (id) => {
    try {
        const response = await api.get(`/api/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        throw error;
    }
};

/**
 * Buscar productos por nombre
 */
const searchProductos = async (query) => {
    try {
        const response = await api.get(`/api/productos/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error buscando productos:', error);
        throw error;
    }
};

/**
 * Obtener productos con stock crítico
 */
const getStockBajo = async () => {
    try {
        const response = await api.get('/api/productos/stock/bajo');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo stock bajo:', error);
        throw error;
    }
};

/**
 * Crear un nuevo producto (ADMIN only)
 */
const createProducto = async (producto) => {
    try {
        const response = await api.post('/api/productos', producto);
        return response.data;
    } catch (error) {
        console.error('Error creando producto:', error);
        throw error;
    }
};

/**
 * Actualizar un producto existente (ADMIN only)
 */
const updateProducto = async (id, producto) => {
    try {
        const response = await api.put(`/api/productos/${id}`, producto);
        return response.data;
    } catch (error) {
        console.error('Error actualizando producto:', error);
        throw error;
    }
};

/**
 * Eliminar un producto (ADMIN only)
 */
const deleteProducto = async (id) => {
    try {
        await api.delete(`/api/productos/${id}`);
    } catch (error) {
        console.error('Error eliminando producto:', error);
        throw error;
    }
};

const ProductoService = {
    getProductos,
    getProducto,
    searchProductos,
    getStockBajo,
    createProducto,
    updateProducto,
    deleteProducto
};

export default ProductoService;
