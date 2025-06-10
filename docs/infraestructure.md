# 🏗️ Infraestructura del Proyecto NutriTrack Pro

## 📋 Resumen General

NutriTrack Pro está desplegado utilizando una arquitectura moderna y escalable que aprovecha servicios en la nube para garantizar alta disponibilidad, despliegue automático y facilidad de mantenimiento.

## 🌐 Arquitectura del Sistema

La aplicación está distribuida en tres componentes principales:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Base de       │
│   (Netlify)     │◄──►│   (Render)      │◄──►│   Datos         │
│                 │    │                 │    │   (Render)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🎨 Frontend - Netlify

### Plataforma
- **Servicio**: [Netlify](https://netlify.com)
- **Tipo**: Static Site Hosting
- **Tecnología**: React + TypeScript + Vite

### Configuración de Despliegue

#### 🔄 Despliegue Automático
- **Repositorio**: Conectado directamente a GitHub
- **Rama de producción**: `master`
- **Trigger**: Cada commit a la rama `master` desencadena un despliegue automático
- **Tiempo de build**: ~2-3 minutos

#### ⚙️ Configuración de Build
```bash
# Comando de build
npm run build

# Directorio de salida
dist/

# Variables de entorno
VITE_API_BASE_URL=https://[tu-api-url].onrender.com/api
```

#### 🌍 Características
- **CDN Global**: Distribución de contenido a nivel mundial
- **HTTPS**: Certificado SSL automático
- **Dominio personalizado**: Posibilidad de usar dominio propio
- **Preview builds**: Builds automáticos para pull requests

---

## 🖥️ Backend API - Render

### Plataforma
- **Servicio**: [Render](https://render.com)
- **Tipo**: Web Service
- **Tecnología**: Node.js + Express + TypeScript

### Configuración de Despliegue

#### 🔄 Despliegue Automático
- **Repositorio**: Conectado a GitHub
- **Rama de producción**: `master`
- **Trigger**: Cada commit a `master` despliega automáticamente
- **Tiempo de build**: ~3-5 minutos

#### ⚙️ Configuración del Servicio
```bash
# Comando de build
npm run build

# Comando de inicio
npm start

# Puerto
$PORT (asignado automáticamente por Render)
```

#### 🔧 Variables de Entorno
```env
NODE_ENV=production
PORT=$PORT
DATABASE_URL=$DATABASE_URL
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://your-frontend-url.netlify.app
```

#### 🌐 Características
- **Auto-scaling**: Escalado automático según demanda
- **Health checks**: Monitoreo automático de salud del servicio
- **Logs en tiempo real**: Acceso completo a logs de aplicación
- **HTTPS**: SSL/TLS automático
- **Zero-downtime deployments**: Despliegues sin interrupciones

---

## 🗄️ Base de Datos - PostgreSQL en Render

### Plataforma
- **Servicio**: Render PostgreSQL
- **Versión**: PostgreSQL 14+
- **Tipo**: Base de datos gestionada

### Configuración

#### 🔧 Especificaciones
- **Almacenamiento**: SSD de alta velocidad
- **Backups**: Automáticos diarios
- **Conexiones**: Pool de conexiones optimizado
- **Ubicación**: Misma región que el backend para baja latencia

#### 🔐 Seguridad
- **Conexión cifrada**: SSL/TLS obligatorio
- **Acceso restringido**: Solo desde servicios autorizados
- **Variables de entorno**: Credenciales gestionadas automáticamente

#### 📊 Monitoreo
- **Métricas incluidas**:
  - CPU y memoria
  - Conexiones activas
  - Tamaño de base de datos
  - Rendimiento de consultas

---

## 🔄 Flujo de Despliegue

### Proceso Completo
1. **Desarrollo**: Código en rama de desarrollo
2. **Pull Request**: Revisión de código
3. **Merge a master**: Aprobación e integración
4. **Trigger automático**: GitHub webhook activa builds
5. **Build paralelo**:
   - Netlify construye el frontend
   - Render construye y despliega el backend
6. **Despliegue**: Aplicación actualizada en producción

### ⏱️ Tiempos Estimados
- **Frontend (Netlify)**: ~2-3 minutos
- **Backend (Render)**: ~3-5 minutos
- **Total**: ~5-8 minutos desde commit hasta producción

---

## 🔍 Monitoreo y Observabilidad

### Frontend
- **Netlify Analytics**: Métricas de tráfico y rendimiento
- **Deploy notifications**: Notificaciones de estado de despliegue
- **Error tracking**: Logs de errores de build

### Backend
- **Render Dashboard**: CPU, memoria, requests por segundo
- **Application logs**: Logs centralizados en tiempo real
- **Uptime monitoring**: Monitoreo de disponibilidad 24/7

### Base de Datos
- **Database metrics**: Conexiones, queries, storage
- **Automated backups**: Respaldos automáticos diarios
- **Connection pooling**: Optimización automática de conexiones

---

## 🚀 Ventajas de esta Arquitectura

### ✅ Beneficios
- **Cero configuración de servidor**: Servicios completamente gestionados
- **Escalabilidad automática**: Se adapta a la carga de trabajo
- **Alta disponibilidad**: Redundancia incorporada
- **Despliegue continuo**: Pipeline CI/CD integrado
- **Seguridad**: SSL, backups y actualizaciones automáticas
- **Costo-efectivo**: Pago por uso, escalado según necesidad

### 📈 Escalabilidad
- **Frontend**: CDN global con caching inteligente
- **Backend**: Auto-scaling horizontal según demanda
- **Base de datos**: Posibilidad de upgrade a instancias más potentes

---

## 🛠️ Comandos Útiles para Desarrollo

### Variables de Entorno Locales
```bash
# Frontend (.env.local)
VITE_API_BASE_URL=http://localhost:3000/api

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/nutritrack
JWT_SECRET=your-local-jwt-secret
CORS_ORIGIN=http://localhost:5173
```

### Scripts de Desarrollo
```bash
# Instalar dependencias
npm install

# Desarrollo frontend
npm run dev

# Desarrollo backend
npm run dev

# Build de producción
npm run build

# Tests
npm test
```

---

## 📞 Soporte y Mantenimiento

### Contactos de Plataformas
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Render**: [render.com/docs](https://render.com/docs)

### Consideraciones de Costos
- **Netlify**: Plan gratuito para proyectos pequeños
- **Render**: Plan gratuito con limitaciones, planes pagos escalables
- **Base de datos**: Incluida en el plan de Render

---

*Documentación mantenida por el equipo de desarrollo de NutriTrack Pro* 