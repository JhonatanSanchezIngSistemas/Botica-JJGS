# 💊 ENCAPBOT - Sistema de Gestión de Boticas

![Estado del Proyecto](https://img.shields.io/badge/ESTADO-PRODUCCIÓN_v1.0.1-green?style=for-the-badge&logo=github)
![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)

**ENCAPBOT** es una solución tecnológica integral diseñada para la administración eficiente de farmacias y boticas. El sistema centraliza el control de inventarios, gestión de ventas, facturación y seguridad, garantizando la trazabilidad de medicamentos y el cumplimiento de normativas sanitarias (alertas de vencimiento y stock crítico).

---

## 🚀 Características Principales

### 📦 Gestión de Inventario (Core)

* **Control de Lotes y Vencimientos:** Alertas automáticas para medicamentos próximos a vencer.
* **Semáforo de Stock:** Indicadores visuales de stock crítico, bajo y óptimo.
* **Kardex Digital:** Registro de entradas y salidas de productos.

### 🔐 Seguridad y Auditoría

* **Autenticación JWT:** Sistema seguro de Login mediante *JSON Web Tokens*.
* **Control de Roles (RBAC):**
  * `ADMIN`: Acceso total (Gestión de usuarios, reportes, configuración).
  * `USER`: Acceso limitado a Caja y Ventas.
* **Protección de Rutas:** Middleware en Frontend para bloquear accesos no autorizados.

### 📊 Dashboard Inteligente

* Métricas en tiempo real de ventas y rotación de productos.
* Gráficos de rendimiento por hora y categoría.

---

## 🛠️ Stack Tecnológico

El proyecto utiliza una **Arquitectura Monolítica Desacoplada**:

### Backend (API REST)

* **Lenguaje:** Java 17
* **Framework:** Spring Boot 3 (Spring Security, Spring Data JPA)
* **Base de Datos:** MySQL 8
* **Herramientas:** Maven, Lombok

### Frontend (SPA)

* **Librería:** React 18
* **Estilos:** CSS Modules / Material UI (en implementación)
* **Cliente HTTP:** Axios (con interceptores para JWT)
* **Ruteo:** React Router DOM

---

## ⚙️ Guía de Instalación y Despliegue

Sigue estos pasos para levantar el entorno de desarrollo local.

### 1. Prerrequisitos

Asegúrate de tener instalado:

* [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
* [Node.js 18+ y NPM](https://nodejs.org/)
* [MySQL Server](https://dev.mysql.com/downloads/installer/)

### 2. Configuración de Base de Datos

1. Crea una base de datos vacía en MySQL llamada `botica_db`.
2. Ejecuta el script de inicialización ubicado en la raíz:

   ```bash
   mysql -u root -p botica_db < botica-backend-init.sql
   ```

*(Esto creará las tablas `usuarios`, `roles`, `productos` e insertará el usuario Admin por defecto).*

### 3. Levantar el Backend (Servidor)

Navega a la carpeta del servidor e inicia Spring Boot:

```bash
cd Botica-Backend
./mvnw spring-boot:run
```

> El servidor iniciará en: `http://localhost:8080`

### 4. Levantar el Frontend (Cliente)

En una nueva terminal, navega a la carpeta del cliente:

```bash
cd botica-frontend
npm install
npm start
```

> La aplicación abrirá en: `http://localhost:3000`

---

## 🔑 Credenciales de Acceso (Demo)

Para pruebas iniciales, utiliza las credenciales generadas por el script SQL:

| Rol | Usuario | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` |
| **Cajero** | `cajero` | `cajero123` |

---

## 🤝 Contribución y Flujo de Trabajo

Este proyecto sigue la metodología **Git Flow** para el control de versiones:

1. **Main:** Código estable y productivo (Versiones etiquetadas v1.0, v1.1).
2. **Develop:** Rama de integración principal.
3. **Feature/*:** Ramas para nuevas funcionalidades (ej. `feature/reporte-pdf`).

---

## 📄 Licencia

Este proyecto es de uso académico y privado para la gestión de farmacias ENCAPBOT.
