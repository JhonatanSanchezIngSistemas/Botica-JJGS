import api from './api';
import logger from '../utils/logger';

/**
 * Servicio de Autenticación
 * Maneja login, logout y validación de sesión
 * 
 * MODO DEMO: Si el backend no responde, usa datos mock
 */

// Datos mock para testing sin backend
const MOCK_USERS = {
    'admin': {
        id: 1,
        username: 'admin',
        email: 'admin@botica.com',
        roles: [{ id: 1, name: 'ADMIN' }],
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwMjMyMDAwMH0.mock_token_admin'
    },
    'user': {
        id: 2,
        username: 'user',
        email: 'user@botica.com',
        roles: [{ id: 2, name: 'USER' }],
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNzAyMzIwMDAwfQ.mock_token_user'
    }
};

const login = async (username, password) => {
    try {
        // Intentar usar el backend real
        try {
            const response = await api.post('/auth/login', { username, password });

            if (response.data.token) {
                // Guardar token
                localStorage.setItem('token', response.data.token);

                // Guardar usuario completo (id, username, email, roles)
                const userData = {
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                    roles: response.data.roles || []
                };
                localStorage.setItem('user', JSON.stringify(userData));


            }

            return response.data;
        } catch (backendError) {
            // Si el backend falla, usar modo DEMO
            
            if (username === 'admin' && password === '123456') {
                const mockUser = MOCK_USERS.admin;
                localStorage.setItem('token', mockUser.token);
                localStorage.setItem('user', JSON.stringify({
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email,
                    roles: mockUser.roles
                }));
                

                
                return {
                    token: mockUser.token,
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email,
                    roles: mockUser.roles
                };
            } else if (username === 'user' && password === '123456') {
                const mockUser = MOCK_USERS.user;
                localStorage.setItem('token', mockUser.token);
                localStorage.setItem('user', JSON.stringify({
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email,
                    roles: mockUser.roles
                }));
                
                logger.log('✅ Login exitoso (MODO DEMO - User)');
                logger.log('👤 Usuario:', mockUser.username);
                
                return {
                    token: mockUser.token,
                    id: mockUser.id,
                    username: mockUser.username,
                    email: mockUser.email,
                    roles: mockUser.roles
                };
            } else {
                throw new Error('Credenciales inválidas. Prueba: admin/123456 o user/123456');
            }
        }
    } catch (error) {
        console.error('❌ Error en login:', error.message);
        throw error;
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
