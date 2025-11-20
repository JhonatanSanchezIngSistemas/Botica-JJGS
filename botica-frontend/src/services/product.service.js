import api from './api';

const getAll = () => api.get('/api/productos');
const create = (data) => api.post('/api/productos', data);
const remove = (id) => api.delete(`/api/productos/${id}`);

export default { getAll, create, remove };
