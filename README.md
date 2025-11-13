# 🏥 Sistema de Gestión de Botica JJGS

Sistema completo de administración para farmacias y boticas, desarrollado con Spring Boot (backend) y React (frontend).

## 📋 Descripción del Proyecto

Este proyecto es un sistema integral de gestión farmacéutica que permite:
- Autenticación y autorización de usuarios con roles (ADMIN, USER)
- Gestión completa de productos (CRUD)
- Control de inventario
- Seguridad mediante JWT (JSON Web Tokens)
- Interfaz web moderna y responsive

## 🚀 Tecnologías Utilizadas

### Backend
- **Java 21** - Lenguaje de programación
- **Spring Boot 3.5.6** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **Hibernate** - ORM (Object-Relational Mapping)
- **MySQL 8.0** - Base de datos relacional
- **JWT (JSON Web Tokens)** - Autenticación stateless
- **Lombok** - Reducción de código boilerplate
- **Maven** - Gestión de dependencias

### Frontend
- **React 18.2.0** - Librería de interfaces
- **JavaScript (JSX)** - Lenguaje de programación
- **Axios** - Cliente HTTP para consumir APIs
- **CSS3** - Estilos y diseño responsive

### Herramientas de Desarrollo
- **Git** - Control de versiones
- **GitHub** - Repositorio remoto y colaboración
- **GitHub Projects** - Gestión de tareas
- **GitHub Issues** - Seguimiento de incidencias
- **VS Code** - Editor de código
- **Discord** - Comunicación del equipo

## 📁 Estructura del Proyecto
Botica-JJGS/
├── Backend/                    # Carpeta vacía (temporal)
├── Frontend/                   # Carpeta vacía (temporal)
├── Botica-Backend/            # Backend Spring Boot (próximamente)
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/botica/
│   │       │       ├── entity/      # Entidades JPA
│   │       │       ├── repository/  # Repositorios
│   │       │       ├── service/     # Lógica de negocio
│   │       │       ├── controller/  # Endpoints REST
│   │       │       ├── config/      # Configuraciones
│   │       │       └── security/    # Seguridad JWT
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── botica-frontend/           # Frontend React (próximamente)
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── services/          # Servicios API
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .gitignore
└── README.md


## 🔧 Instalación y Configuración

### Prerrequisitos

- Java JDK 21 o superior
- Maven 3.6+
- Node.js 16+ y npm
- MySQL 8.0+
- Git

### Backend - Spring Boot

```bash
# 1. Clonar el repositorio
git clone https://github.com/JhonatanSanchezIngSistemas/Botica-JJGS.git
cd Botica-JJGS

# 2. Configurar base de datos MySQL
# Crear base de datos 'botica_db'
mysql -u root -p
CREATE DATABASE botica_db;
exit;

# 3. Configurar credenciales en application.properties
# Editar: Botica-Backend/src/main/resources/application.properties
# Cambiar usuario y contraseña de MySQL

# 4. Compilar y ejecutar
cd Botica-Backend
mvn clean install
mvn spring-boot:run

# El backend estará disponible en: http://localhost:8080
```

### Frontend - React

```bash
# 1. Ir a la carpeta del frontend
cd botica-frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start

# El frontend estará disponible en: http://localhost:3000
```

## 🌿 Estrategia de Branching (Git Flow)

Este proyecto utiliza Feature Branch Workflow:

### Ramas Principales

  - **main** - Rama de producción (código estable y probado)
  - **develop** - Rama de desarrollo (integración de features)

### Ramas de Trabajo

  - **feature/nombre-funcionalidad** - Nuevas características
  - **bugfix/nombre-bug** - Corrección de errores
  - **hotfix/nombre-urgente** - Correcciones urgentes en producción

### Flujo de Trabajo

1.  Crear Issue en GitHub
2.  Mover Issue a "En Progreso" en Projects
3.  Crear rama: `git checkout -b feature/nombre`
4.  Desarrollar y hacer commits
5.  Push: `git push origin feature/nombre`
6.  Crear Pull Request a `develop`
7.  Code Review y aprobación
8.  Merge a `develop`
9.  Cerrar Issue y mover a "Completado"

### Convención de Commits

Seguimos Conventional Commits:

  - `feat(modulo): descripción breve`      # Nueva funcionalidad
  - `fix(modulo): descripción breve`       # Corrección de bug
  - `docs: descripción breve`              # Cambios en documentación
  - `style: descripción breve`             # Formato, espacios, etc.
  - `refactor(modulo): descripción breve`  # Refactorización de código
  - `test: descripción breve`              # Agregar o modificar tests
  - `chore: descripción breve`             # Tareas de mantenimiento

## 👥 Colaboración y Comunicación

### GitHub Projects

Utilizamos un tablero Kanban para gestión de tareas:

  - 📋 Backlog - Tareas pendientes
  - 🔄 En Progreso - Tareas en desarrollo
  - 👀 En Revisión - Pull Requests creados
  - ✅ Completado - Tareas finalizadas

### GitHub Issues

Sistema de seguimiento de incidencias con categorías:

  - `bug` - Errores del sistema
  - `feature` - Nuevas funcionalidades
  - `improvement` - Mejoras de código existente
  - `documentation` - Documentación

### Discord

Canal de comunicación del equipo:

  - **\#general** - Conversaciones generales
  - **\#desarrollo** - Discusiones técnicas
  - **\#pull-requests** - Notificaciones de PRs
  - **\#commits** - Feed automático de GitHub

## 📊 Sprints y Roadmap

### Sprint 1: Estructura Base ✅

  - [x] Configuración de repositorio
  - [x] Archivo .gitignore
  - [x] README.md profesional
  - [ ] Estructura Backend Spring Boot
  - [ ] Estructura Frontend React

### Sprint 2: Funcionalidad Core (En progreso)

  - [ ] Entidades JPA (Usuario, Producto, Role)
  - [ ] Autenticación JWT
  - [ ] CRUD de Productos (Backend)
  - [ ] Componentes React (Login, Dashboard)
  - [ ] Integración Backend-Frontend

### Sprint 3: Calidad y Automatización (Pendiente)

  - [ ] ESLint en Frontend
  - [ ] Pruebas unitarias Backend (JUnit)
  - [ ] Pruebas unitarias Frontend (Jest)
  - [ ] GitHub Actions CI/CD
  - [ ] Documentación de API

## 🔐 Seguridad

  - Autenticación basada en JWT
  - Contraseñas encriptadas con BCrypt
  - Roles y permisos (ADMIN, USER)
  - CORS configurado para orígenes específicos
  - Endpoints protegidos con Spring Security

## 📝 Endpoints API (Próximamente)

### Autenticación

  - `POST /api/auth/register` - Registrar usuario
  - `POST /api/auth/login` - Iniciar sesión

### Productos

  - `GET /api/productos` - Listar productos
  - `GET /api/productos/{id}` - Obtener producto
  - `POST /api/productos` - Crear producto (ADMIN)
  - `PUT /api/productos/{id}` - Actualizar producto (ADMIN)
  - `DELETE /api/productos/{id}` - Eliminar producto (ADMIN)

## 🤝 Contribuir

1.  Fork del proyecto
2.  Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3.  Commit de cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4.  Push a la rama (`git push origin feature/nueva-funcionalidad`)
5.  Crear Pull Request

## 📄 Licencia

Este proyecto es de uso académico para la Universidad Tecnológica del Perú (UTP).

## 👨‍💻 Autor

**Jhonatan Sanchez**

  - GitHub: @JhonatanSanchezIngSistemas
  - Proyecto: Herramientas de Desarrollo - UTP

⭐ *Si te gusta este proyecto, dale una estrella en GitHub!*
