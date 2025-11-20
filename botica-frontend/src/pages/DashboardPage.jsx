import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductService from '../services/product.service';
import Swal from 'sweetalert2';

const DashboardPage = () => {
    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', stock: '' });

    const cargarProductos = async () => {
        try {
            const res = await ProductService.getAll();
            setProductos(res.data);
        } catch (error) {
            console.error("Error cargando productos");
        }
    };

    useEffect(() => { cargarProductos(); }, []);

    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            await ProductService.create(nuevoProducto);
            Swal.fire('Guardado', 'Producto agregado correctamente', 'success');
            setNuevoProducto({ nombre: '', precio: '', stock: '' });
            cargarProductos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
    };

    const handleEliminar = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await ProductService.remove(id);
                cargarProductos();
                Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            }
        });
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-5">
                <h2 className="mb-4 text-primary">Gestión de Inventario</h2>

                {/* Formulario Simple */}
                <div className="card mb-4 p-3 shadow-sm">
                    <h5>Agregar Nuevo Producto</h5>
                    <form onSubmit={handleGuardar} className="row g-3">
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="Nombre Producto"
                                value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} required />
                        </div>
                        <div className="col-md-3">
                            <input type="number" className="form-control" placeholder="Precio"
                                value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} required />
                        </div>
                        <div className="col-md-3">
                            <input type="number" className="form-control" placeholder="Stock"
                                value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })} required />
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-success w-100">Agregar</button>
                        </div>
                    </form>
                </div>

                {/* Tabla de Productos */}
                <div className="table-responsive shadow-sm">
                    <table className="table table-hover table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.id}</td>
                                    <td>{prod.nombre}</td>
                                    <td>S/. {prod.precio}</td>
                                    <td>{prod.stock}</td>
                                    <td>
                                        <button onClick={() => handleEliminar(prod.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
