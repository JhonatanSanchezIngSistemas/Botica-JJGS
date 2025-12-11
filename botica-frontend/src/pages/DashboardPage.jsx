import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    FiUser
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ProductoService from '../services/product.service';
import DashboardService from '../services/dashboard.service';
import ProductModal from '../components/ProductModal';
import styles from './DashboardPage.module.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [stats, setStats] = useState({
        ventasHoy: 0,
        pedidos: 0,
        stockCritico: 0,
        totalProductos: 0
    });

    useEffect(() => {
        loadProductos();
        loadStats();
    }, []);

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
            console.error('Error loading stats:', error);
        }
    };

    const loadProductos = async () => {
        try {
            const response = await ProductoService.getProductos();
            const data = response.data;
            setProductos(data);

            // Calcular stock crítico (productos con menos de 10 unidades)
            const critical = data.filter(p => p.stock < 10).length;
            setStats(prev => ({ ...prev, stockCritico: critical, totalProductos: data.length }));

            setLoading(false);
        } catch (error) {
            console.error('Error loading productos:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        if (menu === 'inventory') {
            setShowProductModal(true);
        }
    };

    const handleRefreshProducts = () => {
        loadProductos();
        loadStats();
    };

    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.brandIcon}>
                        <FiPackage />
                    </div>
                    <span className={styles.brandText}>ENCAPBOT</span>
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
                        text="Inventario IA" 
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
                    <MenuItem 
                        icon={<FiSettings />} 
                        text="Configuración" 
                        active={activeMenu === 'settings'} 
                        onClick={() => handleMenuClick('settings')} 
                    />

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
                        <h1>Panel de Control</h1>
                        <p>Bienvenido, {user?.username || 'Usuario'}</p>
                    </div>

                    <div className={styles.headerActions}>
                        <div className={styles.searchBar}>
                            <FiSearch />
                            <span>Buscar medicamento...</span>
                        </div>
                        <FiBell className={styles.iconButton} />
                        <div className={styles.avatar}>
                            <FiUser />
                        </div>
                    </div>
                </header>

                {/* Content based on active menu */}
                {activeMenu === 'dashboard' ? (
                    <>
                        {/* KPI Cards */}
                        <div className={styles.kpiGrid}>
                            <KPICard
                                icon={<FiDollarSign />}
                                title="Ventas Hoy"
                                value={`S/ ${stats.ventasHoy.toLocaleString()}`}
                                trend="+15%"
                                trendUp
                                iconBg="var(--primary)"
                            />
                            <KPICard
                                icon={<FiShoppingCart />}
                                title="Pedidos"
                                value={stats.pedidos}
                                trend="+5%"
                                trendUp
                                iconBg="var(--accent)"
                            />
                            <KPICard
                                icon={<FiPackage />}
                                title="Productos"
                                value={loading ? '...' : stats.totalProductos}
                                trend={`${stats.totalProductos} en stock`}
                                iconBg="var(--accent)"
                                onClick={() => setShowProductModal(true)}
                            />
                            <KPICard
                                icon={<FiAlertTriangle />}
                                title="Stock Crítico"
                                value={stats.stockCritico}
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
                        {!loading && productos.length > 0 && (
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
                                            {productos.slice(0, 5).map(producto => (
                                                <tr key={producto.id}>
                                                    <td>#{producto.id}</td>
                                                    <td>{producto.nombre}</td>
                                                    <td>S/ {producto.precio.toFixed(2)}</td>
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
                ) : (
                    <div className={styles.emptyState}>
                        <h2>
                            {activeMenu === 'inventory' && 'Inventario'}
                            {activeMenu === 'sales' && 'Ventas'}
                            {activeMenu === 'reports' && 'Reportes'}
                            {activeMenu === 'settings' && 'Configuración'}
                        </h2>
                        <p>Módulo en desarrollo</p>
                    </div>
                )}
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
        <div className={`${styles.kpiTrend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
            <FiTrendingUp />
            {trend}
        </div>
    </div>
);

// Chart Data
const salesChartData = {
    labels: ['10am', '11am', '12pm', '1pm', '2pm', '3pm'],
    datasets: [{
        label: 'Ventas (S/)',
        data: [1200, 1900, 3000, 2500, 2000, 3500],
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        tension: 0.4,
        fill: true,
    }]
};

const categoryChartData = {
    labels: ['Farmacia', 'Cuidado Personal', 'Bebés'],
    datasets: [{
        data: [55, 30, 15],
        backgroundColor: ['#06b6d4', '#06b6d4', '#f472b6'],
        borderWidth: 0
    }]
};

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
