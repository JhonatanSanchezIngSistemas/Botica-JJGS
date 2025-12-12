import React, { useState, useEffect } from 'react';
import VentaService from '../services/venta.service';
import ProductoService from '../services/product.service';
import ClienteService from '../services/cliente.service';
import styles from './VentasPage.module.css';

const VentasPage = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [dniSearch, setDniSearch] = useState('');
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [cliente, setCliente] = useState({ nombre: '', dni: '', sintomas: '', medicamento: '', metodoPago: '' });
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVentas();
    loadProductos();
  }, []);

  const loadVentas = async () => {
    try {
      const response = await VentaService.getVentas();
      setVentas(response.data);
      setFilteredVentas(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const loadProductos = async () => {
    try {
      const response = await ProductoService.getProductos();
      setProductos(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (dniSearch.length >= 3) {
      setFilteredVentas(ventas.filter(v => v.cliente && v.cliente.dni && v.cliente.dni.includes(dniSearch)));
    } else {
      setFilteredVentas(ventas);
    }
  }, [dniSearch, ventas]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  };

  const quitarDelCarrito = (index) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const handleClienteChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleRegistrarVenta = async () => {
    const venta = {
      cliente,
      productos: carrito,
      total: carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0),
      fecha: new Date().toISOString()
    };
    try {
      const response = await VentaService.registrarVenta(venta);
      setVoucher(response.data);
      setCarrito([]);
      setCliente({ nombre: '', dni: '', sintomas: '', medicamento: '', metodoPago: '' });
      loadVentas();
    } catch (error) {
      alert('Error al registrar venta');
    }
  };

  return (
    <div className={styles.ventasPage}>
      <h2>Ventas</h2>
      <div className={styles.dniSearchBar}>
        <input
          type="text"
          placeholder="Buscar venta por DNI..."
          value={dniSearch}
          onChange={e => setDniSearch(e.target.value)}
        />
      </div>
      <h3>Agregar productos al carrito</h3>
      <div className={styles.productosList}>
        {productos.map(producto => (
          <button key={producto.id} onClick={() => agregarAlCarrito(producto)}>
            {producto.nombre} (S/ {producto.precio})
          </button>
        ))}
      </div>
      <h3>Carrito</h3>
      <ul>
        {carrito.map((item, idx) => (
          <li key={idx}>
            {item.nombre} x {item.cantidad} - S/ {item.precio}
            <button onClick={() => quitarDelCarrito(idx)}>Quitar</button>
          </li>
        ))}
      </ul>
      <h3>Registrar Cliente y Venta</h3>
      <form onSubmit={e => { e.preventDefault(); handleRegistrarVenta(); }}>
        <input name="nombre" value={cliente.nombre} onChange={handleClienteChange} placeholder="Nombre cliente" required />
        <input name="dni" value={cliente.dni} onChange={handleClienteChange} placeholder="DNI" required />
        <input name="sintomas" value={cliente.sintomas} onChange={handleClienteChange} placeholder="Síntomas (opcional)" />
        <input name="medicamento" value={cliente.medicamento} onChange={handleClienteChange} placeholder="Medicamento (opcional)" />
        <select name="metodoPago" value={cliente.metodoPago} onChange={handleClienteChange} required>
          <option value="">Método de pago</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="yape">Yape/Plin</option>
        </select>
        <button type="submit">Registrar Venta</button>
      </form>
      {voucher && (
        <div className={styles.voucher}>
          <h4>Voucher de Venta</h4>
          <pre>{JSON.stringify(voucher, null, 2)}</pre>
        </div>
      )}
      <h3>Historial de Ventas</h3>
      {loading ? <p>Cargando...</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>DNI</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentas.map((venta, idx) => (
              <tr key={idx}>
                <td>{new Date(venta.fecha).toLocaleString()}</td>
                <td>{venta.cliente?.nombre}</td>
                <td>{venta.cliente?.dni}</td>
                <td>S/ {venta.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VentasPage;
