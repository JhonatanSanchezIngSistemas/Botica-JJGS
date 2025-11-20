import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = ({ transparent }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar Sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate('/login');
            }
        });
    };

    const navClass = transparent
        ? "navbar navbar-expand-lg navbar-dark fixed-top"
        : "navbar navbar-expand-lg navbar-dark bg-primary";

    const bgStyle = transparent
        ? { backgroundColor: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(5px)' }
        : {};

    return (
        <nav className={navClass} style={bgStyle}>
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">💊 Botica JJGS</Link>

                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav align-items-center">
                        {token ? (
                            <>
                                <li className="nav-item me-3">
                                    <span className="text-white fw-bold">Hola, {user ? user.replace(/"/g, '') : 'Usuario'}</span>
                                </li>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-danger btn-sm fw-bold">Cerrar Sesión</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-outline-light btn-sm fw-bold" to="/login">Iniciar Sesión</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
