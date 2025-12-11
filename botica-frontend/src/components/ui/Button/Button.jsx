import React from 'react';
import styles from './Button.module.css';

/**
 * Botón reutilizable con variantes del sistema Neo-Medical 2025
 * @param {string} variant - 'primary' | 'secondary' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} glow - Activa efecto de brillo
 * @param {ReactNode} children - Contenido del botón
 * @param {ReactNode} icon - Icono opcional
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    glow = false,
    icon,
    children,
    className = '',
    ...props
}) => {
    const classNames = [
        styles.btn,
        styles[variant],
        styles[size],
        glow && styles.glow,
        className
    ].filter(Boolean).join(' ');

    return (
        <button className={classNames} {...props}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
