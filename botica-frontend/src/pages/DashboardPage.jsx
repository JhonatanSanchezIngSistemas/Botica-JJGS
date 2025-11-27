import React, { useEffect, useState } from 'react';
import ProductoService from '../services/product.service';
import Swal from 'sweetalert2';

const DashboardPage = () => {
    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', stock: '', descripcion: '' });

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const response = await ProductoService.getProductos();
            setProductos(response.data);
        } catch (error) {
            console.error('Error al cargar productos', error);
        }
    };

    const handleChange = (e) => {
        setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ProductoService.createProducto(nuevoProducto);
            Swal.fire('Éxito', 'Producto agregado correctamente', 'success');
            setNuevoProducto({ nombre: '', precio: '', stock: '', descripcion: '' });
            cargarProductos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar el producto', 'error');
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ProductoService.deleteProducto(id);
                    Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
                    cargarProductos();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
                }
            }
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-primary">Gestión de Inventario</h2>

            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Agregar Nuevo Producto</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-3">
                            <input type="text" className="form-control" name="nombre" placeholder="Nombre" value={nuevoProducto.nombre} onChange={handleChange} required />
                        </div>
                        <div className="col-md-2">
                            <input type="number" className="form-control" name="precio" placeholder="Precio" value={nuevoProducto.precio} onChange={handleChange} required />
                        </div>
                        <div className="col-md-2">
                            <input type="number" className="form-control" name="stock" placeholder="Stock" value={nuevoProducto.stock} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <input type="text" className="form-control" name="descripcion" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={handleChange} />
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Agregar</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Lista de Productos</h5>
                </div>
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.id}</td>
                                    <td>{producto.nombre}</td>
                                    <td>S/ {producto.precio}</td>
                                    <td>{producto.stock}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>
                                        <button onClick={() => handleDelete(producto.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
