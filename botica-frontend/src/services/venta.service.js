import api from './api';

const getVentas = async () => {
  return api.get('/api/ventas');
};

const registrarVenta = async (venta) => {
  return api.post('/api/ventas', venta);
};

const VentaService = {
  getVentas,
  registrarVenta
};

export default VentaService;
