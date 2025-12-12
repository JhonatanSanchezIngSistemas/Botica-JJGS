import React from 'react';

const ProductForm = ({ nuevoProducto, handleChange, handleSubmit }) => {
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header bg-success text-white">
                <h5 className="mb-0">Agregar Nuevo Producto</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            placeholder="Nombre"
                            value={nuevoProducto.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            name="precio"
                            placeholder="Precio"
                            value={nuevoProducto.precio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            name="stock"
                            placeholder="Stock"
                            value={nuevoProducto.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="descripcion"
                            placeholder="Descripción"
                            value={nuevoProducto.descripcion}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="unidad"
                            placeholder="Unidad (ej: tabletas, ml, g)"
                            value={nuevoProducto.unidad || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            name="gramos"
                            placeholder="Gramos/Miligramos"
                            value={nuevoProducto.gramos || ''}
                            onChange={handleChange}
                            step="0.01"
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">Agregar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
