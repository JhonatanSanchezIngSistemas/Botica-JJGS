import React from 'react';
import { FiAlertTriangle, FiMail, FiPhone } from 'react-icons/fi';
import styles from './BlockedPage.module.css';

/**
 * Página que se muestra cuando un usuario bloqueado intenta iniciar sesión
 */
const BlockedPage = ({ motivo, onLogout }) => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <FiAlertTriangle className={styles.icon} />
                </div>

                <h1 className={styles.title}>Cuenta Bloqueada</h1>

                <p className={styles.message}>
                    {motivo || 'Su cuenta ha sido bloqueada por falta de pago o atraso en sus pagos.'}
                </p>

                <div className={styles.info}>
                    <p>Para reactivar su cuenta, por favor comuníquese con nuestro equipo de soporte:</p>

                    <div className={styles.contactList}>
                        <div className={styles.contactItem}>
                            <FiMail />
                            <span>soporte@botica.com</span>
                        </div>
                        <div className={styles.contactItem}>
                            <FiPhone />
                            <span>+51 999 999 999</span>
                        </div>
                    </div>
                </div>

                <button className={styles.btnLogout} onClick={onLogout}>
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};

export default BlockedPage;
