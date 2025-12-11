import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ProductService from '../services/product.service';
import styles from './ProductModal.module.css';

const ProductModal = ({ isOpen, onClose, onRefresh }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadProductos();
        }
    }, [isOpen]);

    const loadProductos = async () => {
        setLoading(true);
        try {
            const response = await ProductService.getProductos();
            setProductos(response.data);
            setError('');
        } catch (err) {
            setError('Error cargando productos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validación
        if (!formData.nombre || !formData.precio || !formData.stock) {
            setError('Por favor completa los campos requeridos');
            return;
        }

        try {
            if (editingId) {
                // Actualizar
                await ProductService.updateProducto(editingId, {
                    ...formData,
                    precio: parseFloat(formData.precio),
                    stock: parseInt(formData.stock)
                });
                setSuccess('Producto actualizado exitosamente');
            } else {
                // Crear
                await ProductService.createProducto({
                    ...formData,
                    precio: parseFloat(formData.precio),
                    stock: parseInt(formData.stock)
                });
                setSuccess('Producto creado exitosamente');
            }

            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                categoria: ''
            });
            setShowForm(false);
            setEditingId(null);
            loadProductos();
            if (onRefresh) onRefresh();
        } catch (err) {
            setError('Error al guardar: ' + err.message);
        }
    };

    const handleEdit = (producto) => {
        setEditingId(producto.id);
        setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio.toString(),
            stock: producto.stock.toString(),
            categoria: producto.categoria || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este producto?')) return;

        try {
            await ProductService.deleteProducto(id);
            setSuccess('Producto eliminado');
            loadProductos();
            if (onRefresh) onRefresh();
        } catch (err) {
            setError('Error al eliminar: ' + err.message);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            categoria: ''
        });
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Gestión de Productos</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                {error && <div className={styles.alert} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>{error}</div>}
                {success && <div className={styles.alert} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>{success}</div>}

                {!showForm ? (
                    <>
                        <button className={styles.btnNew} onClick={() => setShowForm(true)}>
                            <FiPlus /> Nuevo Producto
                        </button>

                        {loading ? (
                            <div className={styles.loading}>Cargando...</div>
                        ) : (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map(producto => (
                                            <tr key={producto.id}>
                                                <td>{producto.nombre}</td>
                                                <td>S/ {producto.precio.toFixed(2)}</td>
                                                <td>{producto.stock}</td>
                                                <td className={styles.actions}>
                                                    <button 
                                                        className={styles.btnEdit}
                                                        onClick={() => handleEdit(producto)}
                                                        title="Editar"
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                    <button 
                                                        className={styles.btnDelete}
                                                        onClick={() => handleDelete(producto.id)}
                                                        title="Eliminar"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Nombre *</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                placeholder="Ej: Paracetamol 500mg"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                placeholder="Descripción del producto"
                                rows="3"
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Precio (S/) *</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Stock *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Categoría</label>
                            <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
                                <option value="">Seleccionar categoría</option>
                                <option value="Farmacia">Farmacia</option>
                                <option value="Cuidado Personal">Cuidado Personal</option>
                                <option value="Bebés">Bebés</option>
                                <option value="Vitaminas">Vitaminas</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>

                        <div className={styles.formActions}>
                            <button type="submit" className={styles.btnSave}>
                                {editingId ? 'Actualizar' : 'Crear'} Producto
                            </button>
                            <button type="button" className={styles.btnCancel} onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductModal;
