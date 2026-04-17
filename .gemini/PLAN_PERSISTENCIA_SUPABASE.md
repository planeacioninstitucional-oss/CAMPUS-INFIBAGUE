# 📋 PLAN DE IMPLEMENTACIÓN: Persistencia de Progreso con Supabase

## ✅ ESTADO: EN PROGRESO

### Archivos Creados/Modificados:
- ✅ `cursos/CREAR_TABLA_PROGRESO_MODULOS.sql` - Script SQL para crear tabla
- ✅ `js/supabase-progress.js` - Sistema centralizado de progreso
- ✅ `cursos/induccion-atencion-ciudadano.html` - Integrado con Supabase
- ✅ `cursos/induccion-gestion-humana.html` - Integrado con Supabase
- ✅ `cursos/induccion-gestion-ambiental.html` - Integrado con Supabase
- ✅ `cursos/induccion-sst.html` - Integrado con Supabase
- ✅ `cursos/induccion-planeacion.html` - Integrado con Supabase (último módulo)

### Próximos Pasos:
1. ⏳ **Ejecutar el SQL** en Supabase para crear la tabla `user_module_progress`
2. ⏳ Probar el flujo completo de módulos
3. ⏳ Verificar persistencia en diferentes navegadores

---

## 🎯 OBJETIVO
Migrar todo el sistema de progreso del usuario desde `localStorage` a **Supabase (MCP)**, asegurando:
- Persistencia multi-dispositivo
- Independencia de almacenamiento local
- Control de acceso secuencial a módulos
- Recuperación del progreso al recargar/cerrar sesión

---

## 📊 RESUMEN DE CAMBIOS

### Archivos que YA usan Supabase para progreso:

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `cursos/induccion-atencion-ciudadano.html` | ✅ Migrado | Primer módulo, siempre accesible |
| `cursos/induccion-gestion-humana.html` | ✅ Migrado | Requiere atencion_ciudadano aprobado |
| `cursos/induccion-gestion-ambiental.html` | ✅ Migrado | Requiere gestion_humana aprobado |
| `cursos/induccion-sst.html` | ✅ Migrado | Requiere gestion_ambiental aprobado |
| `cursos/induccion-planeacion.html` | ✅ Migrado | Último módulo, requiere sst aprobado |

---

## 1️⃣ ESTRUCTURA DE TABLA ACTUALIZADA

### Tabla: `user_module_progress`

```sql
-- Ejecutar en Supabase SQL Editor (archivo: cursos/CREAR_TABLA_PROGRESO_MODULOS.sql)
CREATE TABLE IF NOT EXISTS public.user_module_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
    module_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'approved', 'failed')),
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    current_step INTEGER DEFAULT 0,
    steps_completed JSONB DEFAULT '[]'::jsonb,
    attempts INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, module_name)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user ON public.user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_status ON public.user_module_progress(status);

-- RLS (Row Level Security)
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_module_progress;
CREATE POLICY "Users can view own progress" ON public.user_module_progress
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_module_progress;
CREATE POLICY "Users can insert own progress" ON public.user_module_progress
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_module_progress;
CREATE POLICY "Users can update own progress" ON public.user_module_progress
    FOR UPDATE USING (true);
```

### Módulos Definidos (module_name):
1. `atencion_ciudadano`
2. `gestion_humana`
3. `gestion_ambiental`
4. `sst` (Seguridad y Salud en el Trabajo)
5. `planeacion_estrategica`

---

## 2️⃣ SCRIPT CENTRALIZADO: `js/supabase-progress.js`

Este archivo contendrá todas las funciones de gestión de progreso con Supabase.

### Funciones Principales:

```javascript
// Constantes de módulos
const MODULOS_ORDEN = [
    'atencion_ciudadano',
    'gestion_humana',
    'gestion_ambiental',
    'sst',
    'planeacion_estrategica'
];

// Obtener progreso del usuario para un módulo
async function getModuleProgress(moduleName)

// Obtener todo el progreso del usuario
async function getAllUserProgress()

// Guardar/Actualizar progreso
async function saveModuleProgress(moduleName, data)

// Marcar módulo como aprobado
async function approveModule(moduleName, score, totalQuestions)

// Marcar módulo como en progreso
async function startModule(moduleName)

// Verificar si puede acceder al módulo
async function canAccessModule(moduleName)

// Obtener siguiente módulo disponible
async function getNextModule(currentModule)

// Guardar paso actual (para retomar)
async function saveCurrentStep(moduleName, step, stepsCompleted)
```

---

## 3️⃣ FLUJO DE NAVEGACIÓN

### Al Cargar un Módulo:
```
1. Obtener user_id de localStorage('usuario')
2. Consultar Supabase: getModuleProgress(moduleName)
3. Verificar canAccessModule(moduleName):
   - Si NO puede acceder → Redirigir al módulo correcto
   - Si SÍ puede acceder:
     - status === 'approved' → Mostrar mensaje y redirigir
     - status === 'in_progress' → Retomar desde current_step
     - status === 'not_started' → Comenzar desde el inicio
```

### Al Navegar (Siguiente/Atrás):
```
1. Guardar paso actual en Supabase
2. Actualizar last_activity
3. Permitir navegación
```

### Al Completar Evaluación:
```
1. Calcular score y percentage
2. Si percentage >= 80%:
   - approveModule(moduleName, score, totalQuestions)
   - Habilitar botón "Ir a Siguiente Módulo"
3. Si percentage < 80%:
   - saveModuleProgress con status = 'failed'
   - Mostrar opción de reintentar
```

### Al Hacer Clic en "Ir a Siguiente Módulo":
```
1. Verificar módulo actual está 'approved' en Supabase
2. Si está aprobado:
   - Redirigir al siguiente módulo
3. Si NO está aprobado:
   - Mostrar alerta
   - No redirigir
```

---

## 4️⃣ MODIFICACIONES POR ARCHIVO

### A. `js/supabase-progress.js` (CREAR NUEVO)
- [ ] Crear archivo con todas las funciones de progreso

### B. `cursos/induccion-atencion-ciudadano.html`
- [ ] Agregar script `supabase-progress.js`
- [ ] Reemplazar llamadas a localStorage por funciones de Supabase
- [ ] Modificar `finishModule()` para usar `approveModule()`
- [ ] Agregar validación en `startPath()` para verificar acceso

### C. `cursos/induccion-gestion-humana.html`
- [ ] Agregar script `supabase-progress.js`
- [ ] Reemplazar `finishHumanaAndGoToAmbiental()` para usar Supabase
- [ ] Verificar acceso al cargar (requiere 'atencion_ciudadano' aprobado)

### D. `cursos/induccion-gestion-ambiental.html`
- [ ] Agregar script `supabase-progress.js`
- [ ] Implementar guardado en Supabase
- [ ] Verificar acceso (requiere 'gestion_humana' aprobado)

### E. `cursos/induccion-sst.html`
- [ ] Agregar script `supabase-progress.js`
- [ ] Implementar guardado en Supabase
- [ ] Verificar acceso (requiere 'gestion_ambiental' aprobado)

### F. `cursos/induccion-planeacion.html`
- [ ] Agregar script `supabase-progress.js`
- [ ] Implementar guardado en Supabase
- [ ] Verificar acceso (requiere 'sst' aprobado)
- [ ] Marcar inducción como COMPLETADA al aprobar

### G. `funcionario/dashboard.html`
- [ ] Usar Supabase para mostrar progreso
- [ ] Actualizar visualización de módulos desbloqueados

### H. `js/utils.js`
- [ ] Deprecar funciones de localStorage para progreso
- [ ] Agregar wrapper a funciones de Supabase

---

## 5️⃣ ROUTE GUARDS (Validación de Rutas)

### Implementar en cada módulo:
```javascript
// Al inicio del script de cada módulo
(async function validateAccess() {
    const canAccess = await canAccessModule('NOMBRE_MODULO');
    if (!canAccess.allowed) {
        alert(canAccess.message);
        window.location.href = canAccess.redirectTo;
    }
})();
```

### Mapeo de Requisitos:
| Módulo | Requisito de Acceso |
|--------|---------------------|
| atencion_ciudadano | Ninguno (siempre accesible) |
| gestion_humana | atencion_ciudadano === 'approved' |
| gestion_ambiental | gestion_humana === 'approved' |
| sst | gestion_ambiental === 'approved' |
| planeacion_estrategica | sst === 'approved' |

---

## 6️⃣ PRUEBAS REQUERIDAS

### QA Checklist:
- [ ] Usuario cierra sesión y vuelve → progreso intacto
- [ ] Usuario cambia de navegador → progreso intacto
- [ ] Usuario recarga página → progreso intacto
- [ ] Usuario intenta saltar módulo → bloqueado
- [ ] Usuario completa evaluación con <80% → no puede avanzar
- [ ] Usuario completa evaluación con ≥80% → puede avanzar
- [ ] Flujo completo de inicio a fin sin errores
- [ ] Verificar datos en tabla de Supabase

---

## 7️⃣ ORDEN DE IMPLEMENTACIÓN

1. **Paso 1**: Crear tabla SQL en Supabase
2. **Paso 2**: Crear `js/supabase-progress.js`
3. **Paso 3**: Modificar `induccion-atencion-ciudadano.html`
4. **Paso 4**: Probar módulo de Atención al Ciudadano
5. **Paso 5**: Modificar `induccion-gestion-humana.html`
6. **Paso 6**: Modificar `induccion-gestion-ambiental.html`
7. **Paso 7**: Modificar `induccion-sst.html`
8. **Paso 8**: Modificar `induccion-planeacion.html`
9. **Paso 9**: Actualizar Dashboard
10. **Paso 10**: Pruebas finales

---

## 📝 NOTAS IMPORTANTES

1. **localStorage para sesión**: Se mantiene `localStorage.getItem('usuario')` SOLO para datos de sesión, NO para progreso.

2. **Fallback**: Si Supabase falla, mostrar mensaje de error pero NO guardar en localStorage como backup.

3. **Usuario invitado**: Si no hay usuario logueado, redirigir a login.

4. **Sincronización**: El progreso se guarda en tiempo real (cada cambio de slide/paso).

---

## 🚀 PRÓXIMO PASO

Proceder con la implementación comenzando por:
1. Ejecutar el SQL en Supabase
2. Crear el archivo `js/supabase-progress.js`
3. Modificar el primer módulo (Atención al Ciudadano)

¿Desea que proceda con la implementación?
