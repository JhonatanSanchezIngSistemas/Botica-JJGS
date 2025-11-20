import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.username));

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Acceso',
                text: 'Usuario o contraseña incorrectos',
                confirmButtonColor: '#0056b3'
            });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100" style={{backgroundColor: '#f8f9fa'}}>
            <div className="card shadow-lg" style={{width: '400px', borderRadius: '15px'}}>
                <div className="card-header text-white text-center py-3" style={{backgroundColor: '#0056b3', borderTopLeftRadius: '15px', borderTopRightRadius: '15px'}}>
                    <h4 className="mb-0">Botica JJGS</h4>
                    <small>Acceso al Sistema</small>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label fw-bold" style={{color: '#0056b3'}}>Usuario</label>
                            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold" style={{color: '#0056b3'}}>Contraseña</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn w-100 text-white fw-bold" style={{backgroundColor: '#28a745'}}>INGRESAR</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
