import React, { useEffect, useState } from 'react';
import ProductoService from '../services/product.service';
import Swal from 'sweetalert2';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

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

            <ProductForm
                nuevoProducto={nuevoProducto}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            <ProductTable
                productos={productos}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default DashboardPage;
