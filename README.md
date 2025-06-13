# TuMandadoMarket 🛒

Una aplicación web completa de marketplace con Node.js, React y Supabase.

## 🚀 Características

### Para Administradores:
- ✅ Login seguro con autenticación
- ✅ CRUD completo de productos
- ✅ Gestión de categorías
- ✅ Panel de administración
- ✅ Gestión de órdenes

### Para Clientes:
- ✅ Registro y login
- ✅ Navegación por categorías
- ✅ Búsqueda y filtros
- ✅ Carrito de compras
- ✅ Proceso de compra
- ✅ Historial de pedidos

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Estilos**: CSS Modules / Tailwind CSS

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd TuMandadoMarket
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run dev
```

## 🔧 Variables de Entorno

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=3001
```

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

## 🗄️ Base de Datos

La base de datos incluye las siguientes tablas:
- `user_profiles` - Perfiles de usuario con roles
- `categories` - Categorías de productos
- `products` - Productos del marketplace
- `orders` - Órdenes de compra
- `order_items` - Items de cada orden
- `cart_items` - Carrito temporal

## 🚀 Deployment

### Frontend (Vercel)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Backend (Railway)
1. Conectar repositorio a Railway
2. Configurar variables de entorno
3. Deploy automático

## 👥 Usuarios por Defecto

Crear un usuario admin manualmente en Supabase:
1. Registrar usuario normal
2. Actualizar `user_profiles.role = 'admin'`

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Carrito
- `GET /api/cart` - Ver carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar del carrito

### Órdenes
- `GET /api/orders` - Historial de órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/:id` - Ver orden específica

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
