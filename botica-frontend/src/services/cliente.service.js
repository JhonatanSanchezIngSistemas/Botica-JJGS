import api from './api';

const getClientes = async () => {
  return api.get('/clientes');
};

const ClienteService = {
  getClientes
};

export default ClienteService;
