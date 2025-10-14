# 🧪 Cómo Probar el Endpoint `delete-pallets-and-boxes`

## ✅ Estado del Endpoint

El endpoint **EXISTE** en el Lambda pero es un **PLACEHOLDER** (solo retorna mensaje, no elimina nada).

**Backend:** `LambdaLomasAltas/src/interface-adapters/controllers/AdminController.js` (líneas 149-154)  
**Frontend:** Ahora disponible en `adminApi.bulk.deletePalletsAndBoxes()`

---

## 🚀 Opción 1: Probar desde la Consola del Navegador (RÁPIDO)

1. Abre tu app en el navegador: `npm run dev`
2. Abre DevTools → **Console**
3. Pega este código:

\`\`\`javascript
// Importar el API client
import { adminApi } from './src/api/consolidatedClient';

// Probar el endpoint
adminApi.bulk.deletePalletsAndBoxes({})
  .then(response => {
    console.log('✅ SUCCESS:', response);
  })
  .catch(error => {
    console.error('❌ ERROR:', error);
  });
\`\`\`

**Respuesta esperada (si funciona):**
\`\`\`javascript
{
  success: true,
  data: {
    message: "Bulk delete initiated for all pallets and assigned boxes",
    async: true
  },
  message: "Bulk delete initiated for all pallets and assigned boxes"
}
\`\`\`

---

## 🔍 Opción 2: Desde el Network Tab (DevTools)

1. Abre DevTools → **Network**
2. Filtra por: `admin`
3. Desde la consola ejecuta:
\`\`\`javascript
import { adminApi } from './src/api/consolidatedClient';
adminApi.bulk.deletePalletsAndBoxes({});
\`\`\`
4. Busca la llamada `POST /admin`
5. Revisa:
   - **Status:** `200 OK` ✅
   - **Request Payload:**
     \`\`\`json
     {
       "resource": "bulk",
       "action": "delete-pallets-and-boxes",
       "params": {}
     }
     \`\`\`
   - **Response:**
     \`\`\`json
     {
       "status": "success",
       "data": {
         "message": "Bulk delete initiated for all pallets and assigned boxes",
         "async": true
       }
     }
     \`\`\`

---

## 🧪 Opción 3: Con cURL (desde Terminal)

\`\`\`bash
# Reemplaza YOUR_API_URL con tu endpoint real
curl -X POST https://YOUR_API_URL/admin \\
  -H "Content-Type: application/json" \\
  -d '{
    "resource": "bulk",
    "action": "delete-pallets-and-boxes",
    "params": {}
  }'
\`\`\`

---

## 📊 Cómo Interpretar los Resultados

### ✅ **Funciona** (Status 200)
\`\`\`json
{
  "status": "success",
  "data": {
    "message": "Bulk delete initiated...",
    "async": true
  }
}
\`\`\`
➜ El endpoint existe y responde ✅  
➜ **PERO NO elimina nada** (solo placeholder) ⚠️

---

### ❌ **No Funciona**

#### Error 404 - Not Found
\`\`\`json
{
  "status": "error",
  "message": "Route not found: POST /admin"
}
\`\`\`
**Causa:** El Lambda no tiene configurado el endpoint `/admin`  
**Solución:** Verificar deployment del Lambda

---

#### Error 400 - Unknown resource
\`\`\`json
{
  "status": "error",
  "message": "Unknown resource: bulk"
}
\`\`\`
**Causa:** El código del Lambda está desactualizado  
**Solución:** Hacer redeploy del Lambda

---

#### Error 400 - Unknown bulk action
\`\`\`json
{
  "status": "error",
  "message": "Unknown bulk action: delete-pallets-and-boxes"
}
\`\`\`
**Causa:** Falta el case en el switch del AdminController  
**Solución:** Actualizar `AdminController.js`

---

## 🛠️ Próximos Pasos

### Si el endpoint funciona (retorna 200):
✅ El Lambda está correctamente configurado  
⚠️ Pero NO ejecuta eliminación real  
📝 Ver: `/LambdaLomasAltas/docs/TEST_BULK_DELETE.md` para implementar la lógica real

### Si el endpoint NO funciona:
1. Verificar logs de CloudWatch
2. Verificar API Gateway tiene la ruta `/admin`
3. Hacer redeploy del Lambda
4. Verificar CORS en API Gateway

---

## ⚠️ ADVERTENCIA

Este endpoint (cuando se implemente) es **IRREVERSIBLE** y **PELIGROSO**.

**Recomendaciones antes de implementar:**
- ✅ Agregar confirmación explícita (\`confirmDelete: true\`)
- ✅ Limitar por ubicación (ej. solo \`PACKING\`)
- ✅ Agregar logging de auditoría
- ✅ Requerir permisos de admin
- ✅ Implementar soft delete (marcar como eliminado vs eliminar físicamente)

---

## 📝 Código de Referencia

### Backend (Lambda)
\`\`\`javascript
// src/interface-adapters/controllers/AdminController.js (línea 149)
case 'delete-pallets-and-boxes':
  // Delete all pallets and their assigned boxes
  return {
    message: 'Bulk delete initiated for all pallets and assigned boxes',
    async: true
  };
\`\`\`

### Frontend (React)
\`\`\`typescript
// src/api/consolidatedClient.ts
import { adminApi } from '@/api';

// Llamar al endpoint
const response = await adminApi.bulk.deletePalletsAndBoxes({});
console.log(response);
\`\`\`

---

**Última actualización:** $(date +"%Y-%m-%d")
