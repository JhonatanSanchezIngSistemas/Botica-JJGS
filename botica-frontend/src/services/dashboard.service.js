import api from './api';

/**
 * Dashboard Service
 * Obtiene estadísticas y datos para gráficos desde el backend
 */

/**
 * Obtener estadísticas generales del dashboard
 * @returns {Promise} Stats object con KPIs
 */
const getStats = async () => {
    try {
        const response = await api.get('/api/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo stats:', error);
        throw error;
    }
};

/**
 * Obtener datos para gráfico de ventas
 * @returns {Promise} Chart data con labels y data
 */
const getVentasChart = async () => {
    try {
        const response = await api.get('/api/dashboard/charts/ventas');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo chart ventas:', error);
        throw error;
    }
};

/**
 * Obtener datos para gráfico de categorías
 * @returns {Promise} Chart data con labels y data
 */
const getCategoriasChart = async () => {
    try {
        const response = await api.get('/api/dashboard/charts/categorias');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo chart categorías:', error);
        throw error;
    }
};

/**
 * Obtener productos recientes
 * @returns {Promise} Array de productos
 */
const getProductosRecientes = async () => {
    try {
        const response = await api.get('/api/dashboard/productos/recientes');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo productos recientes:', error);
        throw error;
    }
};

const DashboardService = {
    getStats,
    getVentasChart,
    getCategoriasChart,
    getProductosRecientes
};

export default DashboardService;
