import api from './api';
import logger from '../utils/logger';

/**
 * Servicio de Autenticación
 * Maneja login, logout y validación de sesión
 */

const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            // Guardar token
            localStorage.setItem('token', response.data.token);
            // Guardar usuario completo (id, username, email, roles, botica)
            const userData = {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                roles: response.data.roles || [],
                botica: response.data.botica || null
            };
            localStorage.setItem('user', JSON.stringify(userData));
            logger.log('✅ Login exitoso');
        }
        return response.data;
    } catch (error) {
        logger.error('❌ Error en login:', error.message);
        throw new Error(error.response?.data?.message || 'Credenciales inválidas');
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const AuthService = {
    login,
    logout,
    getCurrentUser,
    isAuthenticated
};

export default AuthService;
