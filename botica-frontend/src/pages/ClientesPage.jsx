import React, { useState, useEffect } from 'react';
import ClienteService from '../services/cliente.service';
import styles from './ClientesPage.module.css';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await ClienteService.getClientes();
      setClientes(response.data);
      setFilteredClientes(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.length >= 3) {
      setFilteredClientes(clientes.filter(c => c.nombre && c.nombre.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredClientes(clientes);
    }
  }, [search, clientes]);

  return (
    <div className={styles.clientesPage}>
      <h2>Clientes</h2>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar cliente por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : filteredClientes.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>DNI</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.dni}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron clientes.</p>
      )}
    </div>
  );
};

export default ClientesPage;
