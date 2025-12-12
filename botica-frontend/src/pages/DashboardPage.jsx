import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import {
    FiHome,
    FiPackage,
    FiShoppingCart,
    FiBarChart2,
    FiSettings,
    FiLogOut,
    FiDollarSign,
    FiTrendingUp,
    FiAlertTriangle,
    FiSearch,
    FiBell,
    FiUser,
    FiPlus,
    FiUserPlus,
    FiUsers
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ProductoService from '../services/product.service';
import DashboardService from '../services/dashboard.service';
import VentaService from '../services/venta.service';
import UsuarioService from '../services/usuario.service';
import ProductModal from '../components/ProductModal';
import logger from '../utils/logger';
import styles from './DashboardPage.module.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    // Determinar si el usuario es admin (soporta múltiples formatos de roles)
    const isAdmin = user?.roles?.some(r =>
        r === 'ADMIN' ||
        r === 'ROLE_ADMIN' ||
        r === 'SUPER_ADMIN' ||
        r === 'ROLE_SUPER_ADMIN' ||
        r?.name === 'ADMIN' ||
        r?.authority === 'ROLE_ADMIN'
    ) || user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';
    // Obtener nombre de la botica si existe
    const boticaName = user?.botica?.nombreComercial || user?.botica?.nombre || 'ENCAPBOT';

    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [productos, setProductos] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [stats, setStats] = useState({
        ventasHoy: 0,
        pedidos: 0,
        stockCritico: 0,
        totalProductos: 0
    });
    const [search, setSearch] = useState('');
    const [dniSearch, setDniSearch] = useState('');
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [filteredVentas, setFilteredVentas] = useState([]);

    // Estados para gestión de usuarios (Admin)
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosLoading, setUsuariosLoading] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({ username: '', email: '', password: '', role: 'USER' });

    // Estados para módulo de ventas
    const [carrito, setCarrito] = useState([]);
    const [ventaSearch, setVentaSearch] = useState('');
    const [productosVenta, setProductosVenta] = useState([]);
    const [clienteVenta, setClienteVenta] = useState({ nombre: '', dni: '', sintomas: '' });

    useEffect(() => {
        loadProductos();
        loadStats();
        loadVentas();
        if (isAdmin) {
            loadUsuarios();
        }
    }, [isAdmin]);

    const loadStats = async () => {
        try {
            const data = await DashboardService.getStats();
            setStats({
                ventasHoy: data.ventasHoy || 0,
                pedidos: data.pedidosHoy || 0,
                stockCritico: data.stockCritico || 0,
                totalProductos: data.totalProductos || 0
            });
        } catch (error) {
            logger.error('Error loading stats:', error);
        }
    };

    const loadProductos = async () => {
        try {
            const response = await ProductoService.getProductos();
            const data = Array.isArray(response?.data) ? response.data : [];
            setProductos(data);
            setFilteredProductos(data);
            const critical = data.filter(p => p.stock < 10).length;
            setStats(prev => ({ ...prev, stockCritico: critical, totalProductos: data.length }));
            setLoading(false);
        } catch (error) {
            logger.error('Error loading productos:', error);
            setProductos([]);
            setFilteredProductos([]);
            setLoading(false);
        }
    };

    const loadVentas = async () => {
        try {
            const response = await VentaService.getVentas();
            const data = Array.isArray(response?.data) ? response.data : [];
            setVentas(data);
            setFilteredVentas(data);
        } catch (error) {
            logger.error('Error loading ventas:', error);
            setVentas([]);
            setFilteredVentas([]);
        }
    };

    // Cargar usuarios (solo Admin)
    const loadUsuarios = async () => {
        setUsuariosLoading(true);
        try {
            const response = await UsuarioService.getUsuarios();
            const data = Array.isArray(response?.data) ? response.data : [];
            setUsuarios(data);
        } catch (error) {
            logger.error('Error loading usuarios:', error);
            setUsuarios([]);
        } finally {
            setUsuariosLoading(false);
        }
    };

    // Bloquear usuario
    const handleBloquearUsuario = async (id) => {
        if (!window.confirm('¿Estás seguro de bloquear este usuario?')) return;
        try {
            await UsuarioService.bloquearUsuario(id, 'Falta de pago o atraso');
            loadUsuarios();
        } catch (error) {
            logger.error('Error bloqueando usuario:', error);
        }
    };

    // Activar usuario
    const handleActivarUsuario = async (id) => {
        try {
            await UsuarioService.activarUsuario(id);
            loadUsuarios();
        } catch (error) {
            logger.error('Error activando usuario:', error);
        }
    };

    // Crear nuevo usuario
    const handleCrearUsuario = async (e) => {
        e.preventDefault();
        if (!nuevoUsuario.username || !nuevoUsuario.password) {
            alert('Username y password son requeridos');
            return;
        }
        if (nuevoUsuario.password.length < 4) {
            alert('La contraseña debe tener al menos 4 caracteres');
            return;
        }
        try {
            await UsuarioService.crearUsuario(nuevoUsuario);
            alert('Usuario creado exitosamente');
            setNuevoUsuario({ username: '', email: '', password: '', role: 'USER' });
            loadUsuarios();
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Error creando usuario';
            alert(errorMsg);
            logger.error('Error creando usuario:', error);
        }
    };

    // Eliminar usuario
    const handleEliminarUsuario = async (id, username) => {
        if (!window.confirm(`¿Seguro que deseas eliminar al usuario "${username}"? Esta acción no se puede deshacer.`)) {
            return;
        }
        try {
            await UsuarioService.eliminarUsuario(id);
            alert('Usuario eliminado exitosamente');
            loadUsuarios();
        } catch (error) {
            alert('Error eliminando usuario');
            logger.error('Error eliminando usuario:', error);
        }
    };

    // Buscar productos en ventas (solo al presionar Enter)
    const handleVentaSearchKeyDown = (e) => {
        if (e.key === 'Enter' && ventaSearch.length >= 2) {
            const results = productos.filter(p =>
                p.nombre?.toLowerCase().includes(ventaSearch.toLowerCase())
            );
            setProductosVenta(results);
        }
    };

    // Agregar producto al carrito
    const agregarAlCarrito = (producto) => {
        const existente = carrito.find(item => item.id === producto.id);
        if (existente) {
            setCarrito(carrito.map(item =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    // Remover del carrito
    const removerDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    // Registrar venta
    const registrarVenta = async () => {
        if (carrito.length === 0) {
            alert('Agrega productos al carrito');
            return;
        }

        // Validar DNI (8 dígitos)
        if (clienteVenta.dni && !/^\d{8}$/.test(clienteVenta.dni)) {
            alert('El DNI debe tener exactamente 8 dígitos');
            return;
        }

        try {
            // Calcular total
            const totalCalculado = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

            // Formatear venta para el backend (con datos del cliente como campos simples)
            const venta = {
                total: totalCalculado,
                metodoPago: 'Efectivo',
                fecha: new Date().toISOString(),
                clienteNombre: clienteVenta.nombre || null,
                clienteDni: clienteVenta.dni || null,
                clienteSintomas: clienteVenta.sintomas || null,
                // Los productos se envían como array de entidades simplificadas
                productos: carrito.map(item => ({ id: item.id }))
            };

            await VentaService.registrarVenta(venta);

            setCarrito([]);
            setClienteVenta({ nombre: '', dni: '', sintomas: '' });
            setProductosVenta([]);
            loadVentas();
            loadStats();
            alert('¡Venta registrada exitosamente!');
        } catch (error) {
            alert('Error al registrar la venta: ' + (error.message || 'Error desconocido'));
        }
    };

    // Filtrar productos por nombre cuando search cambia
    useEffect(() => {
        if (search.length >= 3) {
            setFilteredProductos(productos.filter(p => p.nombre && p.nombre.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredProductos(productos);
        }
    }, [search, productos]);

    // Filtrar ventas por DNI
    useEffect(() => {
        if (dniSearch.length >= 3) {
            setFilteredVentas(ventas.filter(v => v.cliente?.dni?.includes(dniSearch)));
        } else {
            setFilteredVentas(ventas);
        }
    }, [dniSearch, ventas]);

    // ========================================
    // GRÁFICOS CON DATOS REALES
    // ========================================

    // Calcular productos por categoría para gráfico de dona
    const categoriasCount = productos.reduce((acc, producto) => {
        const cat = producto.categoria || 'Sin categoría';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const categoriasLabels = Object.keys(categoriasCount);
    const categoriasData = Object.values(categoriasCount);
    const coloresCategoria = ['#06b6d4', '#0891b2', '#f472b6', '#8b5cf6', '#22c55e', '#eab308', '#ef4444'];

    // Datos dinámicos para gráfico de categorías
    const categoryChartData = {
        labels: categoriasLabels.length > 0 ? categoriasLabels : ['Sin datos'],
        datasets: [{
            data: categoriasData.length > 0 ? categoriasData : [1],
            backgroundColor: coloresCategoria.slice(0, categoriasLabels.length || 1),
            borderWidth: 0
        }]
    };

    // Calcular ventas por hora (si hay ventas)
    const ventasPorHora = ventas.reduce((acc, venta) => {
        if (venta.fecha) {
            const hora = new Date(venta.fecha).getHours();
            const horaLabel = `${hora}:00`;
            acc[horaLabel] = (acc[horaLabel] || 0) + (venta.total || 0);
        }
        return acc;
    }, {});

    const horasLabels = Object.keys(ventasPorHora).length > 0 ? Object.keys(ventasPorHora) : ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    const ventasDataReal = Object.values(ventasPorHora).length > 0 ? Object.values(ventasPorHora) : [0, 0, 0, 0, 0, 0];

    // Datos dinámicos para gráfico de ventas
    const salesChartData = {
        labels: horasLabels,
        datasets: [{
            label: 'Ventas (S/)',
            data: ventasDataReal,
            borderColor: '#22d3ee',
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
            tension: 0.4,
            fill: true,
        }]
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        // No abrir el modal automáticamente, el usuario debe hacer clic en "Nuevo Producto"
    };

    const handleRefreshProducts = () => {
        loadProductos();
        loadStats();
    };

    // Renderizar contenido según el menú activo
    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return renderDashboard();
            case 'inventory':
                return renderInventory();
            case 'sales':
                return renderSales();
            case 'reports':
                return renderReports();
            case 'settings':
                return isAdmin ? renderSettings() : null;
            default:
                return renderDashboard();
        }
    };

    // Vista del Dashboard principal
    const renderDashboard = () => (
        <>
            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
                <KPICard
                    icon={<FiDollarSign />}
                    title="Ventas Hoy"
                    value={`S/ ${stats.ventasHoy?.toLocaleString() || '0'}`}
                    trend={`${stats.pedidos || 0} ventas`}
                    trendUp={stats.ventasHoy > 0}
                    iconBg="var(--primary)"
                />
                <KPICard
                    icon={<FiShoppingCart />}
                    title="Pedidos Hoy"
                    value={stats.pedidos || 0}
                    trend={stats.pedidos > 0 ? 'Hay ventas' : 'Sin ventas'}
                    trendUp={stats.pedidos > 0}
                    iconBg="var(--accent)"
                />
                <KPICard
                    icon={<FiPackage />}
                    title="Productos"
                    value={loading ? '...' : (productos.length || stats.totalProductos || 0)}
                    trend={`${productos.length || stats.totalProductos || 0} en inventario`}
                    iconBg="var(--accent)"
                    onClick={() => setActiveMenu('inventory')}
                />
                <KPICard
                    icon={<FiAlertTriangle />}
                    title="Stock Crítico"
                    value={stats.stockCritico || 0}
                    trend={stats.stockCritico > 0 ? 'Acción req.' : 'Todo bien'}
                    iconBg="#ef4444"
                />
            </div>

            {/* Charts */}
            <div className={styles.chartsContainer}>
                <div className={styles.chartBox}>
                    <h3>Flujo de Ventas (Tiempo Real)</h3>
                    <Line data={salesChartData} options={chartOptions} />
                </div>

                <div className={styles.chartBox}>
                    <h3>Top Categorías</h3>
                    <Doughnut data={categoryChartData} options={doughnutOptions} />
                </div>
            </div>

            {/* Recent Products Table */}
            {!loading && filteredProductos.length > 0 && (
                <div className={styles.tableBox}>
                    <div className={styles.tableHeader}>
                        <h3>Productos en Stock</h3>
                        <button className={styles.btnSmall} onClick={loadProductos}>
                            Actualizar
                        </button>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProductos.slice(0, 5).map(producto => (
                                    <tr key={producto.id}>
                                        <td>#{producto.id}</td>
                                        <td>{producto.nombre}</td>
                                        <td>S/ {producto.precio?.toFixed(2)}</td>
                                        <td>{producto.stock}</td>
                                        <td>
                                            <span className={`${styles.badge} ${producto.stock < 10 ? styles.badgeDanger : styles.badgeSuccess}`}>
                                                {producto.stock < 10 ? 'Crítico' : 'Normal'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );

    // Vista de Inventario/Productos
    const renderInventory = () => (
        <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
                <h2>Gestión de Productos</h2>
                <button className={styles.btnPrimary} onClick={() => setShowProductModal(true)}>
                    <FiPlus /> Nuevo Producto
                </button>
            </div>

            <div className={styles.searchBarLarge}>
                <FiSearch />
                <input
                    type="text"
                    placeholder="Buscar producto (mínimo 3 caracteres)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className={styles.productGrid}>
                {filteredProductos.map(producto => (
                    <div key={producto.id} className={styles.productCard}>
                        <div className={styles.productImage}>
                            <FiPackage size={48} />
                        </div>
                        <div className={styles.productInfo}>
                            <h4>{producto.nombre}</h4>
                            <p className={styles.productPrice}>S/ {producto.precio?.toFixed(2)}</p>
                            <p className={styles.productStock}>
                                Stock: <span className={producto.stock < 10 ? styles.stockLow : styles.stockOk}>{producto.stock}</span>
                            </p>
                            {producto.categoria && <span className={styles.productCategory}>{producto.categoria}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {filteredProductos.length === 0 && (
                <div className={styles.emptyState}>
                    <FiPackage size={64} />
                    <h3>No hay productos</h3>
                    <p>Agrega productos para comenzar</p>
                </div>
            )}
        </div>
    );

    // Vista de Ventas
    const renderSales = () => (
        <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
                <h2>Registrar Nueva Venta</h2>
            </div>

            <div className={styles.salesModule}>
                {/* Sección izquierda: Buscar productos */}
                <div className={styles.salesSearch}>
                    <h3><FiSearch style={{ marginRight: '8px' }} /> Buscar Productos</h3>
                    <div className={styles.searchBarLarge}>
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Buscar producto (Enter para buscar)..."
                            value={ventaSearch}
                            onChange={e => setVentaSearch(e.target.value)}
                            onKeyDown={handleVentaSearchKeyDown}
                        />
                    </div>

                    {/* Resultados de búsqueda */}
                    <div className={styles.searchResults}>
                        {productosVenta.map(producto => (
                            <div key={producto.id} className={styles.searchResultItem}>
                                <div>
                                    <strong>{producto.nombre}</strong>
                                    <span> - S/ {producto.precio?.toFixed(2)}</span>
                                    <small> (Stock: {producto.stock})</small>
                                </div>
                                <button
                                    className={styles.btnSmall}
                                    onClick={() => agregarAlCarrito(producto)}
                                    disabled={producto.stock <= 0}
                                >
                                    <FiPlus /> Agregar
                                </button>
                            </div>
                        ))}
                        {productosVenta.length === 0 && ventaSearch.length >= 2 && (
                            <p style={{ color: 'var(--text-muted)' }}>
                                No se encontraron productos. Presiona Enter para buscar.
                            </p>
                        )}
                    </div>
                </div>

                {/* Sección derecha: Carrito y datos cliente */}
                <div className={styles.salesCart}>
                    <h3><FiShoppingCart style={{ marginRight: '8px' }} /> Carrito ({carrito.length})</h3>

                    {/* Productos en carrito */}
                    <div className={styles.cartItems}>
                        {carrito.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <div>
                                    <strong>{item.nombre}</strong>
                                    <span> x {item.cantidad}</span>
                                </div>
                                <div>
                                    <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                                    <button
                                        className={styles.btnDanger}
                                        onClick={() => removerDelCarrito(item.id)}
                                        style={{ marginLeft: '10px', padding: '5px 10px' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                        {carrito.length === 0 && (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                                Carrito vacío
                            </p>
                        )}
                    </div>

                    {/* Total */}
                    <div className={styles.cartTotal}>
                        <strong>Total: S/ {carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2)}</strong>
                    </div>

                    {/* Datos del cliente */}
                    <div className={styles.clienteForm}>
                        <h4>Datos del Cliente</h4>
                        <input
                            type="text"
                            placeholder="Nombre del cliente"
                            value={clienteVenta.nombre}
                            onChange={e => setClienteVenta({ ...clienteVenta, nombre: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="DNI"
                            value={clienteVenta.dni}
                            onChange={e => setClienteVenta({ ...clienteVenta, dni: e.target.value })}
                        />
                        <textarea
                            placeholder="Síntomas / Descripción"
                            value={clienteVenta.sintomas}
                            onChange={e => setClienteVenta({ ...clienteVenta, sintomas: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {/* Botón registrar */}
                    <button
                        className={styles.btnPrimary}
                        onClick={registrarVenta}
                        style={{ width: '100%', marginTop: '15px' }}
                    >
                        Registrar Venta
                    </button>
                </div>
            </div>

            {/* Historial de ventas */}
            <div className={styles.tableBox} style={{ marginTop: '30px' }}>
                <div className={styles.tableHeader}>
                    <h3>Historial de Ventas</h3>
                </div>
                <div className={styles.searchBarLarge}>
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Buscar por DNI..."
                        value={dniSearch}
                        onChange={e => setDniSearch(e.target.value)}
                    />
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>DNI</th>
                                <th>Productos</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVentas.slice(0, 10).map((venta, idx) => (
                                <tr key={idx}>
                                    <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                                    <td>{venta.clienteNombre || venta.cliente?.nombre || '-'}</td>
                                    <td>{venta.clienteDni || venta.cliente?.dni || '-'}</td>
                                    <td>{venta.productos?.map(p => p.nombre).join(', ') || '-'}</td>
                                    <td>S/ {venta.total?.toFixed(2)}</td>
                                </tr>
                            ))}
                            {filteredVentas.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No hay ventas registradas
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Vista de Reportes
    const renderReports = () => {
        const stockData = {
            labels: productos.slice(0, 8).map(p => p.nombre?.substring(0, 15) || 'Producto'),
            datasets: [{
                label: 'Stock actual',
                data: productos.slice(0, 8).map(p => p.stock),
                backgroundColor: productos.slice(0, 8).map(p => p.stock < 10 ? '#ef4444' : '#22d3ee'),
            }]
        };

        return (
            <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <h2>Reportes y Estadísticas</h2>
                </div>

                <div className={styles.kpiGrid}>
                    <KPICard
                        icon={<FiDollarSign />}
                        title="Ventas Hoy"
                        value={`S/ ${stats.ventasHoy.toLocaleString()}`}
                        trend="Actualizado"
                        trendUp
                        iconBg="var(--primary)"
                    />
                    <KPICard
                        icon={<FiPackage />}
                        title="Total Productos"
                        value={stats.totalProductos}
                        iconBg="var(--accent)"
                    />
                    <KPICard
                        icon={<FiAlertTriangle />}
                        title="Stock Crítico"
                        value={stats.stockCritico}
                        trend={stats.stockCritico > 0 ? 'Requiere atención' : 'Óptimo'}
                        iconBg="#ef4444"
                    />
                    <KPICard
                        icon={<FiShoppingCart />}
                        title="Ventas Totales"
                        value={ventas.length}
                        iconBg="var(--accent)"
                    />
                </div>

                <div className={styles.chartsContainer}>
                    <div className={styles.chartBox}>
                        <h3>Stock por Producto</h3>
                        <Bar data={stockData} options={barOptions} />
                    </div>

                    <div className={styles.chartBox}>
                        <h3>Categorías más Vendidas</h3>
                        <Doughnut data={categoryChartData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Productos con stock crítico */}
                <div className={styles.tableBox}>
                    <div className={styles.tableHeader}>
                        <h3>Productos con Stock Crítico (&lt;10)</h3>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Stock Actual</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.filter(p => p.stock < 10).map(producto => (
                                    <tr key={producto.id}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.stock}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles.badgeDanger}`}>
                                                Crítico
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {productos.filter(p => p.stock < 10).length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No hay productos con stock crítico
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // Vista de Configuración (solo Admin)
    const renderSettings = () => (
        <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
                <h2>Configuración de Administrador</h2>
            </div>

            {/* Formulario Crear Nuevo Usuario */}
            <div className={styles.tableBox} style={{ marginBottom: '30px' }}>
                <div className={styles.tableHeader}>
                    <h3><FiUserPlus style={{ marginRight: '10px' }} /> Crear Nuevo Usuario</h3>
                </div>
                <form onSubmit={handleCrearUsuario} style={{ padding: '20px' }}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Username *</label>
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={nuevoUsuario.username}
                                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="email@ejemplo.com"
                                value={nuevoUsuario.email}
                                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Contraseña *</label>
                            <input
                                type="password"
                                placeholder="Mínimo 4 caracteres"
                                value={nuevoUsuario.password}
                                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                                required
                                minLength={4}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Rol</label>
                            <select
                                value={nuevoUsuario.role}
                                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
                            >
                                <option value="USER">Usuario</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className={styles.btnPrimary} style={{ marginTop: '15px' }}>
                        Crear Usuario
                    </button>
                </form>
            </div>

            {/* Panel de Gestión de Usuarios */}
            <div className={styles.tableBox} style={{ marginBottom: '30px' }}>
                <div className={styles.tableHeader}>
                    <h3><FiUsers style={{ marginRight: '10px' }} /> Gestión de Usuarios</h3>
                    <button className={styles.btnSmall} onClick={loadUsuarios}>
                        Actualizar
                    </button>
                </div>

                {usuariosLoading ? (
                    <div className={styles.loading}>Cargando usuarios...</div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Roles</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(usuario => (
                                    <tr key={usuario.id}>
                                        <td>#{usuario.id}</td>
                                        <td>{usuario.username}</td>
                                        <td>{usuario.email || '-'}</td>
                                        <td>{(usuario.roles || []).join(', ')}</td>
                                        <td>
                                            <span className={`${styles.badge} ${usuario.bloqueado ? styles.badgeDanger : styles.badgeSuccess}`}>
                                                {usuario.bloqueado ? 'Bloqueado' : 'Activo'}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '8px' }}>
                                            {usuario.bloqueado ? (
                                                <button
                                                    className={styles.btnSuccess}
                                                    onClick={() => handleActivarUsuario(usuario.id)}
                                                >
                                                    Activar
                                                </button>
                                            ) : (
                                                <button
                                                    className={styles.btnDanger}
                                                    onClick={() => handleBloquearUsuario(usuario.id)}
                                                >
                                                    Bloquear
                                                </button>
                                            )}
                                            <button
                                                className={styles.btnSmall}
                                                style={{ backgroundColor: '#ef4444', color: 'white' }}
                                                onClick={() => handleEliminarUsuario(usuario.id, usuario.username)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {usuarios.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className={styles.settingsGrid}>
                <div className={styles.settingsCard}>
                    <FiUsers size={32} />
                    <h3>Gestión de Clientes</h3>
                    <p>Agregar y administrar boticas/clientes</p>
                    <button className={styles.btnPrimary}>
                        Administrar Clientes
                    </button>
                </div>

                <div className={styles.settingsCard}>
                    <FiSettings size={32} />
                    <h3>Configuración General</h3>
                    <p>Ajustes del sistema y preferencias</p>
                    <button className={styles.btnSecondary}>
                        Ver Configuración
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <img
                        src="/logo-encapbot.png"
                        alt="Encapbot"
                        className={styles.brandLogo}
                    />
                    <span className={styles.brandText}>{boticaName}</span>
                </div>

                <nav className={styles.menu}>
                    <MenuItem
                        icon={<FiHome />}
                        text="Dashboard"
                        active={activeMenu === 'dashboard'}
                        onClick={() => handleMenuClick('dashboard')}
                    />
                    <MenuItem
                        icon={<FiPackage />}
                        text="Productos"
                        active={activeMenu === 'inventory'}
                        onClick={() => handleMenuClick('inventory')}
                    />
                    <MenuItem
                        icon={<FiShoppingCart />}
                        text="Ventas"
                        active={activeMenu === 'sales'}
                        onClick={() => handleMenuClick('sales')}
                    />
                    <MenuItem
                        icon={<FiBarChart2 />}
                        text="Reportes"
                        active={activeMenu === 'reports'}
                        onClick={() => handleMenuClick('reports')}
                    />
                    {isAdmin && (
                        <MenuItem
                            icon={<FiSettings />}
                            text="Configuración"
                            active={activeMenu === 'settings'}
                            onClick={() => handleMenuClick('settings')}
                        />
                    )}
                    <div style={{ marginTop: 'auto' }}>
                        <MenuItem
                            icon={<FiLogOut />}
                            text="Cerrar Sesión"
                            danger
                            onClick={handleLogout}
                        />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Header */}
                <header className={styles.header}>
                    <div>
                        <h1>{boticaName}</h1>
                        <p>Bienvenido, {user?.username || 'Usuario'}</p>
                    </div>

                    <div className={styles.headerActions}>
                        <div className={styles.searchBar}>
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Buscar medicamento..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: 8, color: 'var(--text-primary)', width: '100%' }}
                            />
                        </div>
                        <FiBell className={styles.iconButton} />
                        <div className={styles.avatar}>
                            <FiUser />
                        </div>
                    </div>
                </header>

                {/* Content based on active menu */}
                {renderContent()}
            </main>

            {/* Product Modal */}
            <ProductModal
                isOpen={showProductModal}
                onClose={() => setShowProductModal(false)}
                onRefresh={handleRefreshProducts}
            />
        </div>
    );
};

// Menu Item Component
const MenuItem = ({ icon, text, active, danger, onClick }) => (
    <div
        className={`${styles.menuItem} ${active ? styles.active : ''} ${danger ? styles.danger : ''}`}
        onClick={onClick}
    >
        {icon}
        <span>{text}</span>
    </div>
);

// KPI Card Component
const KPICard = ({ icon, title, value, trend, trendUp, iconBg, onClick }) => (
    <div className={styles.kpiCard} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className={styles.kpiHeader}>
            <div className={styles.kpiIcon} style={{ background: `rgba(${iconBg === 'var(--primary)' ? '6, 182, 212' : iconBg === 'var(--accent)' ? '8, 145, 178' : '239, 68, 68'}, 0.1)`, color: iconBg }}>
                {icon}
            </div>
            <span className={styles.kpiTitle}>{title}</span>
        </div>
        <div className={styles.kpiValue}>{value}</div>
        {trend && (
            <div className={`${styles.kpiTrend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
                <FiTrendingUp />
                {trend}
            </div>
        )}
    </div>
);

// Chart Options (solo opciones, no datos)
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
        }
    }
};

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', maxRotation: 45, minRotation: 45 }
        }
    }
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { color: '#94a3b8' }
        }
    },
    cutout: '75%'
};

export default DashboardPage;

