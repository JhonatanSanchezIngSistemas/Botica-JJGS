import api from './api';
import logger from '../utils/logger';

/**
 * Usuario Service - Gestión de usuarios (solo ADMIN)
 */

const getUsuarios = async () => {
    try {
        const response = await api.get('/api/usuarios');
        return response;
    } catch (error) {
        logger.error('Error obteniendo usuarios:', error);
        throw error;
    }
};

const bloquearUsuario = async (id, motivo = 'Falta de pago') => {
    try {
        const response = await api.put(`/api/usuarios/${id}/bloquear`, { motivo });
        return response;
    } catch (error) {
        logger.error('Error bloqueando usuario:', error);
        throw error;
    }
};

const activarUsuario = async (id) => {
    try {
        const response = await api.put(`/api/usuarios/${id}/activar`);
        return response;
    } catch (error) {
        logger.error('Error activando usuario:', error);
        throw error;
    }
};

const crearUsuario = async (userData) => {
    try {
        const response = await api.post('/api/usuarios', userData);
        return response;
    } catch (error) {
        logger.error('Error creando usuario:', error);
        throw error;
    }
};

const eliminarUsuario = async (id) => {
    try {
        const response = await api.delete(`/api/usuarios/${id}`);
        return response;
    } catch (error) {
        logger.error('Error eliminando usuario:', error);
        throw error;
    }
};

const UsuarioService = {
    getUsuarios,
    bloquearUsuario,
    activarUsuario,
    crearUsuario,
    eliminarUsuario
};

export default UsuarioService;
