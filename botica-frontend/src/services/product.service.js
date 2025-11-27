import api from './api';

const getProductos = () => {
    return api.get('/api/productos');
};

const createProducto = (producto) => {
    return api.post('/api/productos', producto);
};

const deleteProducto = (id) => {
    return api.delete(`/api/productos/${id}`);
};

const ProductoService = {
    getProductos,
    createProducto,
    deleteProducto
};

export default ProductoService;
