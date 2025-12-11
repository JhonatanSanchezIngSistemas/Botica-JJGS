import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button/Button';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(credentials.username, credentials.password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Usuario o contraseña incorrectos');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <motion.div
                className={styles.loginBox}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.brandIcon}>
                    <FiLock size={32} />
                </div>

                <h2>Acceso Seguro</h2>
                <p className={styles.subtitle}>Identifícate para entrar al sistema</p>

                {error && (
                    <motion.div
                        className={styles.errorBox}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <FiAlertCircle />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Usuario</label>
                        <div className={styles.inputWrapper}>
                            <FiUser className={styles.inputIcon} />
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                placeholder="Ingresa tu usuario"
                                className={styles.input}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Contraseña</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.inputIcon} />
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="••••••••"
                                className={styles.input}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        glow
                        type="submit"
                        style={{ width: '100%', marginTop: '16px' }}
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Ingresar al Dashboard'}
                    </Button>
                </form>

                <div className={styles.loginFooter}>
                    <p className={styles.hint}>
                        💡 Credenciales de prueba: <br />
                        <strong>admin</strong> / <strong>123456</strong>
                    </p>
                </div>

                <button
                    className={styles.backButton}
                    onClick={() => navigate('/')}
                    disabled={loading}
                >
                    ← Volver al inicio
                </button>
            </motion.div>
        </div>
    );
};

export default LoginPage;
