import React from 'react';

const ProductTable = ({ productos, handleDelete }) => {
    return (
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
                            <th>Categoría</th>
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
                                <td>{producto.categoria}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(producto.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;
