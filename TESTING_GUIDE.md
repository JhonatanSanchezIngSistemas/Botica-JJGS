# 🏥 ENCAPBOT - Guía de Ejecución y Testing

## ✅ Estado Actual

### Backend ✓
- **Compilación**: `mvn clean compile` - ✅ SUCCESS
- **Tests**: `mvn clean test` - ✅ 4/4 PASSING
- **Validaciones**: @NotBlank, @NotNull, @Min, @Email - ✅ Implementadas
- **Seguridad**: DTOs sin passwords, CORS configurado, JWT activo - ✅ 
- **Manejo de Errores**: GlobalExceptionHandler - ✅
- **Variables de Entorno**: Configuradas - ✅

### Frontend ✓
- **Compilación**: `npm run build` - ✅ SUCCESS
- **Navbar Funcional**: 
  - ✅ Links a secciones (Características, Precios, Contacto)
  - ✅ Scroll suave a secciones
  - ✅ Menú responsive (hamburger en móvil)
  - ✅ Links de autenticación (Iniciar Sesión/Dashboard/Cerrar Sesión)
- **Landing Page**: 
  - ✅ Hero section con CTA
  - ✅ Sección Características
  - ✅ Sección Precios (3 planes)
  - ✅ Sección Contacto
  - ✅ Footer completo
- **Login Page**: ✅ Funcional
- **Dashboard**: ✅ Protegido con ProtectedRoute

---

## 🚀 Instrucciones de Ejecución

### Requisitos Previos
1. **MySQL Server** en `localhost:3306`
   ```sql
   CREATE DATABASE botica_db;
   ```

2. **Java 21** instalado
3. **Node.js 18+** instalado

### Paso 1: Iniciar Backend
```bash
cd "Botica-JJGS\Botica-Backend"
mvn spring-boot:run
```
**Esperado**: Servidor Tomcat en `http://localhost:8080`

### Paso 2: Iniciar Frontend
```bash
cd "Botica-JJGS\botica-frontend"
npm start
```
**Esperado**: React dev server en `http://localhost:3000`

---

## 📋 Plan de Testing Manual

### 1. Landing Page (http://localhost:3000)

#### Test de Navbar
- [ ] **Logo "ENCAPBOT"** está visible en la parte superior izquierda
- [ ] **Menu items** muestran: Características | Precios | Contacto | Iniciar Sesión
- [ ] **Click en "Características"** → scroll suave a sección con 3 cards
- [ ] **Click en "Precios"** → scroll suave a sección con 3 planes
- [ ] **Click en "Contacto"** → scroll suave a sección con teléfono, email, ubicación
- [ ] **Click en "Iniciar Sesión"** → redirige a /login
- [ ] **Responsive en móvil** (resize <768px) → hamburger menu visible

#### Test de Hero Section
- [ ] Título: "Sistema de Gestión Farmacéutica Profesional" visible
- [ ] Subtítulo con descripción visible
- [ ] Botón "Empezar Ahora" funciona → redirige a /login

#### Test de Secciones
- [ ] **Características**: Muestra 3 cards (IA, Gestión Rápida, DIGEMID)
- [ ] **Precios**: Muestra 3 planes (Starter $99, Professional $299 -destacado-, Enterprise $699)
- [ ] **Contacto**: Muestra 3 tarjetas (Teléfono, Email, Ubicación) con datos correctos
- [ ] **Footer**: Visible al final con links funcionales

#### Test de Animaciones
- [ ] Elementos se animan al entrar en viewport
- [ ] Hover effects en cards funcionan
- [ ] Transiciones suaves

---

### 2. Login Page (http://localhost:3000/login)

- [ ] Formulario visible con campos: Usuario y Contraseña
- [ ] Ingresar credenciales: `admin` / `123456`
- [ ] Click "Entrar"
- [ ] **Esperado**: Redirige a `/dashboard` (si backend está activo)
- [ ] Si hay error de conexión (backend no está corriendo):
  - [ ] Muestra mensaje de error clara
  - [ ] Usuario puede intentar nuevamente

---

### 3. Dashboard (http://localhost:3000/dashboard) - *Si Backend está activo*

- [ ] **Header**: Muestra bienvenida con nombre de usuario
- [ ] **Sidebar**: Opciones visibles (Dashboard, Inventario, Ventas, Reportes, Configuración)
- [ ] **KPI Cards**: Muestran datos (Ventas, Pedidos, Stock Crítico)
- [ ] **Gráficos**: Charts visibles
- [ ] **Botón Cerrar Sesión**: Vuelve a /login
- [ ] **Responsive**: Sidebar colapsable en móvil

---

### 4. Test de Navegación General

- [ ] Desde /login → Click logo → vuelve a /
- [ ] Desde / → Click "Iniciar Sesión" → va a /login
- [ ] Desde / → Click sección → scroll suave funciona
- [ ] Sin login → Intentar acceder a /dashboard → redirige a /login
- [ ] Con login → /dashboard visible y accesible

---

## 🎨 Casos de Uso Específicos

### Caso 1: Usuario No Autenticado
1. Abre http://localhost:3000
2. Navega por landing page
3. Intenta acceder a /dashboard (escribiendo en URL)
4. **Esperado**: Redirige a /login automáticamente

### Caso 2: Usuario Autentica
1. Va a /login
2. Ingresa admin / 123456
3. Click "Entrar"
4. **Esperado**: Redirige a /dashboard con datos del usuario

### Caso 3: Responsive Design
1. Abre http://localhost:3000
2. Resize a 480px ancho (móvil)
3. **Esperado**: 
   - Navbar collapse a hamburger
   - Menu items ocultos hasta click en hamburger
   - Todos los elementos legibles y funcionales

---

## 🔧 Variables de Entorno (Backend)

### Archivo: `application.properties`
```properties
# Base de datos
DB_URL=jdbc:mysql://localhost:3306/botica_db?useSSL=false&serverTimezone=UTC
DB_USER=root
DB_PASS=123456

# JWT
JWT_SECRET=3ncApB0t!2025#JWT$SecureAuth@K3y*M3d1c4l&Ph4rM4CyS0ft_W4r3^R4nD0m&H1ghEntr0py!BoticaJJGS
```

### Para producción, configura variables de entorno:
```bash
export DB_URL=...
export DB_USER=...
export DB_PASS=...
export JWT_SECRET=...
```

---

## ⚠️ Troubleshooting

### Backend no inicia
```
Error: Connection refused localhost:3306
```
**Solución**: Verificar que MySQL esté corriendo
```bash
mysql -u root -p
CREATE DATABASE botica_db;
```

### Frontend no compila
```
Error: Module not found
```
**Solución**:
```bash
cd botica-frontend
npm install
npm start
```

### Login no funciona (error 500)
- Verificar que backend esté corriendo en puerto 8080
- Revisar logs: `mvn spring-boot:run` debería mostrar mensajes
- Verificar MySQL tiene la base de datos creada

### CORS errors
- Backend tiene CORS configurado en `SecurityConfig.java`
- Frontend hace requests a `http://localhost:8080`
- Verificar que ambos puertos sean los correctos

---

## 📊 Checklist Final

- [ ] Backend compila sin errores
- [ ] Backend tests pasan (4/4)
- [ ] Frontend compila sin errores críticos
- [ ] Navbar tiene funcionalidad completa
- [ ] Landing page scroll funciona
- [ ] Login funciona
- [ ] Dashboard protegido
- [ ] Responsive design funciona en móvil
- [ ] Variables de entorno configuradas
- [ ] MySQL database existe y es accesible

---

## 🎯 Próximos Pasos

1. **Completar integración API**:
   - Productos (GET, POST, PUT, DELETE)
   - Usuarios (GET, PUT)
   - Ventas (GET, POST)

2. **Agregar funcionalidad al Dashboard**:
   - Tabla de productos funcional
   - Gráficos con datos reales
   - Filtros y búsqueda

3. **Testing de producción**:
   - Build final: `mvn clean package` y `npm run build`
   - Deploy en servidor

4. **Mejorar UX**:
   - Agregar notificaciones
   - Implementar loading states
   - Mejorar error handling

---

**Fecha de creación**: 11 de diciembre de 2025
**Estado**: Listo para testing manual
**Desarrollador**: Jhonatan Sánchez JJGS
