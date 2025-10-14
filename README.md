# Lector Códigos Mobile - Frontend

Aplicación web móvil para gestión de inventario de producción mediante escaneo de códigos QR/barras.

## 🚀 Características

- **Escaneo de Códigos**: Soporte para cajas (16 dígitos) y pallets (13 dígitos)
- **Gestión de Pallets**: Crear, cerrar, mover y consultar pallets
- **Gestión de Cajas**: Registrar, asignar y rastrear cajas
- **Trazabilidad Completa**: Historial de movimientos y ubicaciones
- **Modo Offline**: Funcionalidad con datos mock para desarrollo
- **API Consolidada**: Soporte para nueva arquitectura Clean del backend

## 📋 Requisitos

- Node.js 22.x o superior
- npm o yarn
- Backend API configurado (ver repositorio LambdaLomasAltas)

## 🛠️ Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd Lector-Codigos-Mobile

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# Iniciar servidor de desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# URL del backend API
VITE_API_URL=https://your-api-url.amazonaws.com/prod

# Usar nueva API consolidada (Clean Architecture)
VITE_USE_CONSOLIDATED_API=true

# Modo desarrollo con datos mock
VITE_USE_MOCK_API=false
```

Ver [Guía de Configuración](./docs/ENVIRONMENT_CONFIGURATION.md) para más detalles.

## 📖 Documentación

- **[Guía de Migración](./docs/MIGRATION_GUIDE.md)** - Migración a nueva arquitectura del backend
- **[Guía de Uso de API](./docs/API_USAGE_GUIDE.md)** - Cómo usar el cliente API
- **[Configuración de Entorno](./docs/ENVIRONMENT_CONFIGURATION.md)** - Variables de entorno
- **[Integración de API](./docs/API_INTEGRATION.md)** - Documentación técnica de integración

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── api/                    # Capa de comunicación con backend
│   ├── consolidatedClient.ts   # Cliente API nueva arquitectura
│   ├── endpointsAdapter.ts     # Adaptador retrocompatible
│   ├── apiClient.ts            # Cliente HTTP base
│   └── types.ts                # Tipos TypeScript
├── components/             # Componentes reutilizables
│   ├── Layout/
│   ├── Footer/
│   └── ReportIssueModal/
├── context/               # React Context (estado global)
│   ├── ThemeContext.tsx
│   ├── ScanContext.tsx
│   └── ScannedCodeContext.tsx
├── hooks/                 # Custom React Hooks
├── routes/                # Configuración de rutas
├── utils/                 # Utilidades y validadores
├── views/                 # Páginas principales
│   ├── Dashboard
│   ├── Configuracion
│   └── Scanning/
└── styles/               # Estilos globales
```

### API Client

El proyecto incluye dos formas de consumir el backend:

1. **Funciones Retrocompatibles** (recomendado durante migración):
```typescript
import { getInfoFromScannedCode, createPallet } from '@/api';
```

2. **API Consolidada** (nueva arquitectura):
```typescript
import { consolidatedApi } from '@/api';

await consolidatedApi.inventory.pallet.create({
  codigo: '12345678901',
  maxBoxes: 100,
});
```

## 🔄 Migración a Clean Architecture

El backend ha migrado a una arquitectura limpia con endpoints consolidados. El frontend soporta ambas versiones mediante un adaptador.

### Estado Actual
- ✅ Adaptador retrocompatible implementado
- ✅ Nueva API consolidada disponible
- ✅ Migración gradual soportada
- 🔄 Testing en progreso

### Habilitar Nueva API

```bash
# En .env
VITE_USE_CONSOLIDATED_API=true
```

Ver [Guía de Migración](./docs/MIGRATION_GUIDE.md) para más información.

## 🧪 Scripts

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Build
npm run build           # Build de producción
npm run preview         # Vista previa del build

# Linting y formato
npm run lint            # Ejecutar linter
npm run lint:fix        # Corregir errores de linting automáticamente
npm run format          # Formatear código con Prettier
npm run format:check    # Verificar formato sin cambios
```

## 🎨 Stack Tecnológico

- **React 19** - Librería UI
- **TypeScript 5** - Tipado estático
- **Vite 6** - Build tool y dev server
- **React Router 7** - Enrutamiento
- **DayJS** - Manipulación de fechas
- **ESLint + Prettier** - Code quality

## 📱 Vistas Principales

### Dashboard
Panel principal con acceso rápido a todas las funcionalidades

### Consultar Código
Búsqueda y consulta de información de cajas y pallets

### Registrar Caja Nueva
Registro manual de nuevas cajas en el sistema

### Crear Pallet
Creación de nuevos pallets con código base de 11 dígitos

### Crear Caja Custom
Registro de cajas con información personalizada

### Enviar Pallet a Tránsito
Movimiento de pallets entre ubicaciones

### Pallets Activos
Listado paginado de pallets abiertos por ubicación

## 🔍 Validaciones

El sistema valida automáticamente:
- **Cajas**: 16 dígitos
- **Pallets**: 13 dígitos (14 para consultas)
- **Código Base Pallet**: 11 dígitos

## 🐛 Debugging

### Modo Mock
Útil para desarrollo frontend sin backend:

```bash
VITE_USE_MOCK_API=true
npm run dev
```

### Verificar Configuración
```bash
# En la consola del navegador
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_USE_CONSOLIDATED_API);
```

## 🚦 Estados de la Aplicación

- **Loading**: Operaciones en curso
- **Success**: Operación exitosa con feedback visual
- **Error**: Manejo de errores con mensajes claros
- **Empty**: Estados vacíos con instrucciones

## 🔐 Seguridad

- HTTPS obligatorio en producción
- Validación client-side antes de envío
- Sanitización de inputs
- Manejo seguro de tokens de paginación

## 🌐 Ambientes

### Desarrollo
```bash
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK_API=true
```

### Staging
```bash
VITE_API_URL=https://staging-api.yourdomain.com/dev
VITE_USE_CONSOLIDATED_API=true
```

### Producción
```bash
VITE_API_URL=https://api.yourdomain.com/prod
VITE_USE_CONSOLIDATED_API=true
```

## 📊 Monitoreo

- Request IDs para trazabilidad
- Logs de errores con contexto
- Métricas de performance

## 🤝 Contribución

1. Seguir principios de Clean Code
2. Mantener diseño modular
3. Usar TypeScript con tipos estrictos
4. Documentar cambios importantes
5. Probar antes de commit

## 📄 Licencia

Propiedad de Lomas Altas

## 🔗 Enlaces

- **Backend**: `../LambdaLomasAltas/`
- **API Docs**: `../LambdaLomasAltas/API_GATEWAY_ENDPOINTS.md`
- **Field Reference**: `../LambdaLomasAltas/FIELD_VALUES_REFERENCE.md`
