# 📱 Manual del Operador - Sistema Lector Códigos

**Sistema de Gestión de Inventario para Producción de Huevos**

---

## 📋 Índice

1. [Inicio de Sesión](#1-inicio-de-sesión)
2. [Panel Principal (Dashboard)](#2-panel-principal-dashboard)
3. [Consultar Código](#3-consultar-código)
4. [Registrar Caja Nueva](#4-registrar-caja-nueva)
5. [Crear Pallet](#5-crear-pallet)
6. [Crear Caja Personalizada](#6-crear-caja-personalizada)
7. [Enviar Pallet a Tránsito](#7-enviar-pallet-a-tránsito)
8. [Ver Pallets Activos](#8-ver-pallets-activos)
9. [Reportar Problemas](#9-reportar-problemas)
10. [Consejos y Buenas Prácticas](#10-consejos-y-buenas-prácticas)

---

## 1. Inicio de Sesión

### ¿Qué necesito?
- Tablet o computadora con acceso al sistema
- Conexión a internet
- Escáner de códigos QR/barras (opcional pero recomendado)

### Pasos:
1. Abre el navegador web
2. Ingresa la dirección del sistema (proporcionada por tu supervisor)
3. La aplicación se cargará automáticamente
4. Verás el **Panel Principal** con todas las opciones disponibles

---

## 2. Panel Principal (Dashboard)

### ¿Qué veo aquí?
El Dashboard es tu punto de inicio. Aquí encontrarás acceso rápido a todas las funciones:

```
┌─────────────────────────────────────────┐
│     🏠 PANEL PRINCIPAL                  │
├─────────────────────────────────────────┤
│                                         │
│  🔍 Consultar Código                   │
│     Ver información de cajas/pallets    │
│                                         │
│  📦 Registrar Caja Nueva               │
│     Agregar nueva caja al sistema       │
│                                         │
│  🚛 Crear Pallet                       │
│     Crear un nuevo pallet vacío         │
│                                         │
│  📋 Crear Caja Personalizada           │
│     Registrar caja con conteo especial  │
│                                         │
│  ➡️  Enviar Pallet a Tránsito          │
│     Mover pallet a la siguiente área    │
│                                         │
│  📊 Ver Pallets Activos                │
│     Lista de pallets abiertos           │
│                                         │
│  ⚙️  Configuración                      │
│     Ajustes del sistema                 │
│                                         │
└─────────────────────────────────────────┘
```

### Navegación:
- **Toca** cualquier opción para acceder a esa función
- **Botón "← Volver"** en cada pantalla te regresa al Dashboard
- La app guarda tu trabajo automáticamente

---

## 3. Consultar Código

### ¿Para qué sirve?
Buscar información detallada de cualquier caja o pallet en el sistema.

### Flujo completo:

```
INICIO
  ↓
1. Toca "🔍 Consultar Código" en el Dashboard
  ↓
2. Verás una barra de búsqueda grande
  ↓
3. ESCANEA o ESCRIBE el código:
   • Caja: 16 dígitos (ejemplo: 1234567890123456)
   • Pallet: 13 dígitos (ejemplo: 1234567890123)
  ↓
4. Toca "🔍 Buscar" o presiona ENTER
  ↓
5. ESPERA mientras el sistema busca (aparece spinner)
  ↓
6. VES LA INFORMACIÓN:
   ┌─────────────────────────────┐
   │ Código: 1234567890123456    │
   │ Tipo: 📦 Caja / 🚛 Pallet  │
   │ Estado: ● Activo            │
   │ Operario: Juan Pérez        │
   │ Empacadora: Línea 1         │
   │ Formato: 30 Huevos          │
   │ Creado: hace 2 horas        │
   └─────────────────────────────┘
  ↓
7. ACCIONES DISPONIBLES:
   Si es CAJA:
   • 📦 Mover Caja
   • ℹ️ Ver Detalles
   • 🔄 Actualizar
   
   Si es PALLET:
   • 🚛 Mover Pallet
   • 📋 Ver Contenido
   • 🔒 Cerrar Pallet / 🔓 Abrir Pallet
   • 🔄 Actualizar
  ↓
FIN (o consulta otro código)
```

### ✅ Búsquedas Recientes
El sistema guarda tus últimas 5 búsquedas. Puedes tocarlas para ver la información nuevamente sin escanear.

### ⚠️ Errores comunes:
- **"Código inválido"**: Verifica que tenga 13 o 16 dígitos
- **"No se encontró"**: El código no existe en el sistema
- **"Error de conexión"**: Revisa tu conexión a internet

---

## 4. Registrar Caja Nueva

### ¿Para qué sirve?
Agregar una caja nueva al sistema cuando llega de producción.

### Flujo completo:

```
INICIO
  ↓
1. Toca "📦 Registrar Caja Nueva" en el Dashboard
  ↓
2. COMPLETA EL FORMULARIO:
   
   ┌────────────────────────────────┐
   │ Código de Caja: *              │
   │ [Escanea o escribe 16 dígitos] │
   │                                │
   │ Producto: *                    │
   │ [Ej: Huevos Frescos]          │
   │                                │
   │ Lote: (opcional)               │
   │ [Ej: LOTE-2024-001]           │
   │                                │
   │ Ubicación:                     │
   │ ○ PACKING (recomendado)       │
   │ ○ BODEGA                       │
   │                                │
   │ Observaciones: (opcional)      │
   │ [Notas adicionales]            │
   └────────────────────────────────┘
  ↓
3. Revisa que la información sea correcta
  ↓
4. Toca "✅ Registrar Caja"
  ↓
5. ESPERA confirmación:
   ✅ "Caja registrada exitosamente"
  ↓
6. La caja está ahora en el sistema
  ↓
FIN (o registra otra caja)
```

### 💡 Consejos:
- **Código correcto**: Debe tener exactamente 16 dígitos
- **Producto**: Usa nombres claros (Ej: "Huevos Blancos Especial")
- **Ubicación**: Normalmente es PACKING al registrar
- El formulario se limpia automáticamente después de registrar

### ⚠️ Errores comunes:
- **"Código debe tener 16 dígitos"**: Verifica el código escaneado
- **"Producto obligatorio"**: No olvides llenar este campo
- **"Caja ya existe"**: El código ya está en el sistema

---

## 5. Crear Pallet

### ¿Para qué sirve?
Crear un nuevo pallet vacío que recibirá cajas de producción.

### Flujo completo:

```
INICIO
  ↓
1. Toca "🚛 Crear Pallet" en el Dashboard
  ↓
2. ELIGE MODO DE CREACIÓN:
   
   ┌────────────────────────────────────┐
   │ ☐ Generar código automáticamente  │
   │ ☑ Ingresar código manualmente     │
   └────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ MODO AUTOMÁTICO (Recomendado)          │
├─────────────────────────────────────────┤
│                                         │
│ 3. COMPLETA LOS DATOS:                 │
│                                         │
│    Turno: *                            │
│    ○ Mañana                            │
│    ○ Tarde                             │
│                                         │
│    Calibre: *                          │
│    ○ 01 - ESPECIAL (Blanco)           │
│    ○ 02 - EXTRA (Blanco)              │
│    ○ 03 - ESPECIAL (Color)            │
│    [... más opciones ...]              │
│                                         │
│    Formato: *                          │
│    ○ 1 - 180 unidades                 │
│    ○ 2 - 100 JUMBO                    │
│    ○ 3 - Docena                       │
│                                         │
│    Empresa: *                          │
│    ○ 1 - Lomas Altas                  │
│    ○ 2 - Santa Marta                  │
│    [... más opciones ...]              │
│                                         │
│    Máximo de cajas: (opcional)         │
│    [Ej: 100]                           │
│                                         │
│ 4. VE EL CÓDIGO GENERADO:              │
│    📋 Código: 11234567890              │
│                                         │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│ MODO MANUAL (Avanzado)                 │
├─────────────────────────────────────────┤
│                                         │
│ 3. ESCRIBE EL CÓDIGO BASE:             │
│    [11 dígitos]                        │
│                                         │
│    Máximo de cajas: (opcional)         │
│    [Ej: 100]                           │
│                                         │
└─────────────────────────────────────────┘
  ↓
5. Toca "✅ Crear Pallet"
  ↓
6. ESPERA confirmación:
   ✅ "Pallet creado exitosamente"
   📋 Código completo: 1234567890123
  ↓
7. El pallet está listo para recibir cajas
  ↓
FIN
```

### 💡 Información importante:
- **Código base**: 11 dígitos que identifican el pallet
- **Código completo**: 13 dígitos (el sistema agrega 2 dígitos al final)
- **Máximo de cajas**: Límite de cajas que puede tener el pallet
- **Estado inicial**: El pallet se crea ABIERTO automáticamente

### 📊 ¿Qué significa cada parte del código?

```
Código base: 1 23 24 1 01 1 01
             │ │  │  │ │  │ └─ Empresa (2 dígitos)
             │ │  │  │ │  └─── Formato (1 dígito)
             │ │  │  │ └────── Calibre (2 dígitos)
             │ │  │  └───────── Turno (1 dígito)
             │ │  └──────────── Año (2 dígitos)
             │ └─────────────── Semana (2 dígitos)
             └───────────────── Día semana (1 dígito)
```

---

## 6. Crear Caja Personalizada

### ¿Para qué sirve?
Registrar cajas con conteos especiales de huevos (no estándar).

### Flujo completo:

```
INICIO
  ↓
1. Toca "📋 Crear Caja Personalizada" en el Dashboard
  ↓
2. MODO ESCANEO ACTIVADO
   ┌────────────────────────────────┐
   │ 🎯 ESCANEA O INGRESA:         │
   │                                │
   │ Código de caja: [16 dígitos]  │
   │                                │
   └────────────────────────────────┘
  ↓
3. Escanea el código de la caja
  ↓
4. INGRESA LA CANTIDAD:
   ┌────────────────────────────────┐
   │ Cantidad de huevos:            │
   │ [Ej: 150]                      │
   │                                │
   │ Toca "➕ Agregar"              │
   └────────────────────────────────┘
  ↓
5. La caja se agrega a la lista:
   ┌────────────────────────────────┐
   │ CAJAS ESCANEADAS:              │
   │                                │
   │ 1. 1234567890123456 - 150 🥚  │
   │ 2. 9876543210987654 - 142 🥚  │
   │                                │
   └────────────────────────────────┘
  ↓
6. REPITE pasos 3-5 para cada caja
  ↓
7. Cuando termines, toca "✅ Finalizar y Enviar"
  ↓
8. ESPERA confirmación:
   ✅ "2 cajas procesadas correctamente"
  ↓
FIN
```

### 💡 Casos de uso:
- Cajas con huevos trizado que tienen menos unidades
- Cajas de conteo manual especial
- Cajas con formatos no estándar

### 🔄 Funciones adicionales:
- **Eliminar caja**: Toca "🗑️" junto a la caja para quitarla
- **Editar cantidad**: Toca la caja para modificar el conteo
- **Cancelar todo**: Toca "❌ Cancelar" para empezar de nuevo

### ⚠️ Importante:
- Una vez enviadas, las cajas quedan registradas con esos conteos
- Revisa bien las cantidades antes de finalizar
- Si hay error, contacta a tu supervisor

---

## 7. Enviar Pallet a Tránsito

### ¿Para qué sirve?
Mover un pallet completo de PACKING a TRÁNSITO para su siguiente proceso.

### Flujo completo:

```
INICIO
  ↓
1. Toca "➡️ Enviar Pallet a Tránsito" en el Dashboard
  ↓
2. ESCANEA EL PALLET:
   ┌────────────────────────────────┐
   │ 🎯 Escanea el código del      │
   │    pallet a mover              │
   │                                │
   │ [13 dígitos]                   │
   │                                │
   └────────────────────────────────┘
  ↓
3. El sistema VERIFICA:
   ✓ Pallet existe
   ✓ Está en PACKING
   ✓ Tiene cajas asignadas
   ✓ Está cerrado (si aplica)
  ↓
4. VES LA INFORMACIÓN:
   ┌────────────────────────────────┐
   │ Pallet: 1234567890123          │
   │ Estado actual: PACKING         │
   │ Cajas: 45                      │
   │ Estado: Cerrado                │
   │                                │
   │ ⚠️ Se moverá a TRÁNSITO       │
   └────────────────────────────────┘
  ↓
5. Toca "✅ Confirmar Movimiento"
  ↓
6. ESPERA mientras el sistema:
   • Actualiza ubicación del pallet
   • Actualiza ubicación de todas las cajas
   • Registra el movimiento
  ↓
7. CONFIRMACIÓN:
   ✅ "Pallet movido a TRÁNSITO exitosamente"
   📊 45 cajas actualizadas
  ↓
FIN (o mueve otro pallet)
```

### 📍 Flujo de ubicaciones:

```
PACKING → TRÁNSITO → BODEGA → PREVENTA → VENTA
   ↑                                        ↓
   └────────── UNSUBSCRIBED ←──────────────┘
```

### 💡 Buenas prácticas:
- **Verifica el pallet** antes de mover
- **Cierra el pallet** antes de enviarlo (si aplica)
- **Cuenta las cajas** para asegurar que estén todas
- **Notifica** al siguiente turno que el pallet está en tránsito

### ⚠️ Errores comunes:
- **"Pallet no encontrado"**: Verifica el código escaneado
- **"Pallet no está en PACKING"**: Ya fue movido anteriormente
- **"Pallet vacío"**: No tiene cajas asignadas
- **"Pallet abierto"**: Algunos pallets deben cerrarse primero

---

## 8. Ver Pallets Activos

### ¿Para qué sirve?
Ver una lista de todos los pallets abiertos en una ubicación específica.

### Flujo completo:

```
INICIO
  ↓
1. Toca "📊 Ver Pallets Activos" en el Dashboard
  ↓
2. SELECCIONA UBICACIÓN:
   ┌────────────────────────────────┐
   │ Filtrar por ubicación:         │
   │                                │
   │ ○ PACKING                      │
   │ ● BODEGA                       │
   │ ○ PREVENTA                     │
   │ ○ VENTA                        │
   │                                │
   │ [Aplicar Filtro]               │
   └────────────────────────────────┘
  ↓
3. VES LA LISTA:
   ┌────────────────────────────────┐
   │ PALLETS ACTIVOS EN BODEGA      │
   │                                │
   │ 📦 1234567890123               │
   │    Estado: 🔓 Abierto          │
   │    Cajas: 45 / 100             │
   │    Creado: hace 3 horas        │
   │    [Ver] [Cerrar]              │
   │                                │
   │ 📦 9876543210987               │
   │    Estado: 🔓 Abierto          │
   │    Cajas: 78 / 100             │
   │    Creado: hace 1 hora         │
   │    [Ver] [Cerrar]              │
   │                                │
   │ ... más pallets ...            │
   │                                │
   │ [Cargar más]                   │
   └────────────────────────────────┘
  ↓
4. ACCIONES DISPONIBLES:
   
   Por cada pallet puedes:
   • Toca "[Ver]" → Información detallada
   • Toca "[Cerrar]" → Cerrar el pallet
  ↓
5. CERRAR UN PALLET:
   ┌────────────────────────────────┐
   │ ⚠️ ¿Cerrar pallet?             │
   │                                │
   │ Pallet: 1234567890123          │
   │ Cajas actuales: 45             │
   │                                │
   │ Una vez cerrado, NO podrás     │
   │ agregar más cajas.             │
   │                                │
   │ [Cancelar] [✅ Confirmar]      │
   └────────────────────────────────┘
  ↓
6. Si confirmas:
   ✅ "Pallet cerrado exitosamente"
   El pallet cambia a 🔒 Cerrado
  ↓
FIN
```

### 🔍 Información de cada pallet:

```
┌─────────────────────────────────────┐
│ 📦 Código del pallet                │
│ 🔓 Estado (Abierto/Cerrado)         │
│ 📊 Cajas actuales / Máximo          │
│ 🕐 Tiempo desde creación            │
│ 📍 Ubicación actual                 │
└─────────────────────────────────────┘
```

### 💡 Consejos:
- **Actualiza frecuentemente**: Toca "🔄 Actualizar" para ver cambios
- **Filtro por ubicación**: Muestra solo pallets relevantes para tu área
- **Paginación**: Si hay muchos pallets, usa "Cargar más"
- **Estado visual**: Los colores te ayudan a identificar rápidamente

### 📈 Interpretación:
- **🔓 Abierto**: Puedes agregar más cajas
- **🔒 Cerrado**: No acepta más cajas, listo para mover
- **Cajas 45/100**: Tiene 45 cajas de un máximo de 100
- **Cajas 100/100**: Pallet lleno, deberías cerrarlo

---

## 9. Reportar Problemas

### ¿Para qué sirve?
Informar al equipo técnico sobre cualquier problema con el sistema o equipos.

### Flujo completo:

```
INICIO
  ↓
1. En cualquier pantalla, toca el ícono "⚠️" 
   (usualmente en la esquina superior)
  ↓
2. SE ABRE EL FORMULARIO:
   ┌────────────────────────────────┐
   │ REPORTAR PROBLEMA              │
   │                                │
   │ Tipo de problema: *            │
   │ ○ Problema con Escáner 📱     │
   │ ○ Problema de Conexión 🌐     │
   │ ○ Problema de Pantalla 🖥️     │
   │ ○ Fallo de Hardware ⚙️         │
   │ ○ Error de Software 💻         │
   │ ○ Otro Problema ❓             │
   │                                │
   │ Prioridad: *                   │
   │ ○ Baja (puede esperar)        │
   │ ● Media (atender hoy)          │
   │ ○ Alta (urgente)               │
   │ ○ Crítica (parar trabajo)     │
   │                                │
   │ Descripción: *                 │
   │ [Explica el problema con      │
   │  el mayor detalle posible]     │
   │                                │
   │ Terminal: TRM-001              │
   │ Último código: (automático)    │
   │                                │
   └────────────────────────────────┘
  ↓
3. COMPLETA toda la información
  ↓
4. Toca "📤 Enviar Reporte"
  ↓
5. ESPERA confirmación:
   ✅ "Reporte enviado exitosamente"
   📋 Número de ticket: #12345
  ↓
6. IMPORTANTE: Anota el número de ticket
  ↓
7. El equipo técnico recibirá tu reporte
  ↓
FIN
```

### 📝 Ejemplos de descripciones claras:

**❌ Mal:**
```
"No funciona"
```

**✅ Bien:**
```
"El escáner no lee códigos de cajas. 
Probé con 3 cajas diferentes y ninguna 
se escanea. El LED del escáner está 
apagado. Terminal: TRM-003"
```

**✅ Muy bien:**
```
"Error al crear pallet: 
- Completé todos los campos
- Toqué 'Crear Pallet'
- Apareció mensaje: 'Error 500'
- No se creó el pallet
- Hora: 14:30
- Turno: Tarde
- Terminal: TRM-005"
```

### 🎯 Niveles de prioridad:

| Prioridad | Cuándo usar | Ejemplo |
|-----------|-------------|---------|
| **🟢 Baja** | Puede esperar al final del día | "Botón está descuadrado" |
| **🟡 Media** | Atender durante el día | "Escáner falla a veces" |
| **🟠 Alta** | Urgente, dificulta trabajo | "No puedo cerrar pallets" |
| **🔴 Crítica** | Sistema no funciona | "No puedo acceder al sistema" |

### 💡 Consejos:
- **Sé específico**: Incluye qué estabas haciendo cuando falló
- **Hora exacta**: Ayuda al equipo técnico a revisar logs
- **Pasos para reproducir**: ¿Qué hiciste antes del error?
- **Guarda el número**: Para dar seguimiento

---

## 10. Consejos y Buenas Prácticas

### 🎯 Uso del Escáner

**✅ Haz esto:**
- Mantén el escáner limpio y sin polvo
- Apunta directamente al código
- Mantén una distancia de 10-15 cm
- Espera el "beep" de confirmación
- Si no lee, escribe el código manualmente

**❌ Evita esto:**
- Escanear códigos sucios o dañados
- Mover muy rápido el escáner
- Escanear desde muy lejos o muy cerca
- Ignorar errores de lectura

### 📱 Cuidado del Equipo

**Tablet/Terminal:**
- Mantenla cargada (conecta al finalizar turno)
- Límpiala con paño suave y seco
- No la expongas a agua o líquidos
- Repórtala inmediatamente si se daña

**Escáner:**
- Guárdalo en su base cuando no lo uses
- No lo dejes caer
- Límpialo semanalmente
- Reporta si el LED no enciende

### 🔄 Flujo de Trabajo Recomendado

**Inicio de turno:**
1. Enciende el equipo
2. Verifica que todo funcione
3. Revisa pallets activos de tu área
4. Confirma conexión a internet

**Durante el turno:**
1. Escanea códigos con cuidado
2. Verifica información antes de confirmar
3. Cierra pallets cuando estén completos
4. Reporta problemas inmediatamente

**Fin de turno:**
1. Cierra pallets pendientes
2. Mueve pallets completos
3. Reporta trabajo pendiente al siguiente turno
4. Guarda equipos correctamente

### ⚡ Resolución Rápida de Problemas

**Problema: Sistema lento**
- Verifica conexión a internet
- Cierra y vuelve a abrir el navegador
- Reporta si persiste

**Problema: Escáner no lee**
- Limpia el código y el escáner
- Verifica que el LED esté encendido
- Prueba escribir el código manualmente
- Reporta si no funciona

**Problema: Error al guardar**
- Verifica conexión a internet
- Intenta nuevamente en 1 minuto
- Si persiste, toma nota y reporta

**Problema: No aparece información**
- Verifica que el código sea correcto
- Asegúrate de tener 13 o 16 dígitos
- Prueba con otro código conocido
- Reporta si ninguno funciona

### 📞 ¿A quién contactar?

**Problemas Técnicos:**
- Sistema no funciona: Supervisor inmediato
- Escáner roto: Mantenimiento
- Dudas de uso: Compañero experimentado

**Problemas Operativos:**
- Códigos incorrectos: Supervisor de turno
- Pallets con problemas: Jefe de producción
- Discrepancias de inventario: Control de calidad

### 📊 Resumen de Códigos

| Tipo | Dígitos | Ejemplo | Uso |
|------|---------|---------|-----|
| **Caja** | 16 | 1234567890123456 | Identificar una caja |
| **Pallet Completo** | 13 | 1234567890123 | Identificar un pallet |
| **Pallet Base** | 11 | 12345678901 | Crear nuevo pallet |

### ✅ Checklist Diario

**Al iniciar turno:**
- [ ] Equipo encendido y funcionando
- [ ] Escáner funcionando correctamente
- [ ] Conexión a internet verificada
- [ ] Pallets activos revisados

**Durante el turno:**
- [ ] Escanear con precisión
- [ ] Verificar información antes de confirmar
- [ ] Cerrar pallets completos
- [ ] Mantener área ordenada

**Al finalizar turno:**
- [ ] Pallets cerrados y movidos
- [ ] Equipos guardados correctamente
- [ ] Reporte de incidencias (si hubo)
- [ ] Handover al siguiente turno

---

## 📞 Información de Contacto

**Soporte Técnico:**
- Interno: Ext. XXXX
- Emergencias: XXXX-XXXX

**Supervisión:**
- Turno Mañana: [Nombre] - Ext. XXXX
- Turno Tarde: [Nombre] - Ext. XXXX

**Mantenimiento:**
- Equipos: Ext. XXXX

---

## 📄 Notas Finales

**Actualizaciones del Sistema:**
- Este manual corresponde a la versión actual del sistema
- Reporta cualquier función nueva que no esté documentada
- Sugerencias de mejora son bienvenidas

**Recordatorios Importantes:**
- ✅ Verifica siempre antes de confirmar
- ✅ Reporta problemas inmediatamente
- ✅ Cuida los equipos
- ✅ Mantén tu área limpia y organizada
- ✅ Comunícate con tu equipo

---

**Versión del Manual:** 1.0  
**Última actualización:** Octubre 2024  
**Sistema:** Lector Códigos Mobile - Gestión de Inventario

---

*Este manual ha sido diseñado para facilitar tu trabajo diario.  
Si tienes dudas o sugerencias, contacta a tu supervisor.*

**¡Gracias por tu trabajo y dedicación! 🙏**

