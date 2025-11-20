# 🏥 Sistema de Gestión Botica JJGS (v1.0)

Plataforma integral para la administración de farmacias, inventarios y ventas. Desarrollada bajo estándares de arquitectura moderna y DevOps.

![Estado CI](https://github.com/JhonatanSanchezIngSistemas/Botica-JJGS/actions/workflows/maven.yml/badge.svg)

## 🚀 Funcionalidades (Release v1.0)
* **Seguridad:** Autenticación JWT con roles (Admin/User) y protección de rutas.
* **Inventario:** CRUD completo de productos con validación.
* **UX/UI:** Interfaz moderna en React + Bootstrap, Landing Page corporativa.
* **Calidad:** Integración Continua (CI) y ESLint configurado.

## 🛠️ Stack Tecnológico
* **Backend:** Java 21, Spring Boot 3.3.0, MySQL, JPA, Spring Security.
* **Frontend:** React 18, Axios, Bootstrap 5, SweetAlert2.
* **DevOps:** GitHub Actions (CI/CD), Docker Ready.

## ⚙️ Instalación y Ejecución

### 1. Base de Datos
Ejecutar en MySQL:
```sql
CREATE DATABASE botica_db;
```

### 2. Backend
```bash
cd Botica-Backend
mvn spring-boot:run
```

**Credenciales Admin:** `admin` / `admin123`  
**Credenciales User:** `user` / `user123`

### 3. Frontend
```bash
cd botica-frontend
npm install
npm start
```

**URL:** http://localhost:3000

## 📋 Estructura del Proyecto

```
Botica-JJGS/
├── Botica-Backend/          # Spring Boot API
│   ├── src/main/java/
│   │   └── com/botica/
│   │       ├── entity/      # Entidades JPA
│   │       ├── repository/  # Repositorios
│   │       ├── service/     # Lógica de negocio
│   │       ├── controller/  # REST Controllers
│   │       ├── security/    # JWT & Spring Security
│   │       └── config/      # Configuraciones
│   └── src/test/           # Tests unitarios
├── botica-frontend/        # React SPA
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   └── services/       # API clients
└── .github/workflows/      # CI/CD pipelines
```

## 🔐 Seguridad
- Autenticación basada en JWT (JSON Web Tokens)
- Passwords encriptados con BCrypt
- Rutas protegidas con Spring Security
- CORS configurado para localhost:3000

## 🧪 Testing
```bash
# Backend
cd Botica-Backend
mvn test

# Frontend
cd botica-frontend
npm test
```

## 🐳 Despliegue con Docker
```bash
cd Botica-Backend
docker build -t botica-backend .
docker run -p 8080:8080 botica-backend
```

## 📚 Documentación Adicional
- [ESLint Configuration](./ESLINT.md) - Gestión de calidad de código
- [API Documentation](./Botica-Backend/README.md) - Endpoints y ejemplos

## 👥 Equipo
**Desarrollador:** Jhonatan Sanchez  
**Universidad:** U22232808  
**Curso:** Herramientas de Desarrollo - Ciclo 7

## 📄 Licencia
Este proyecto es de uso académico para el curso de Herramientas de Desarrollo.
