# 🎯 SISTEMA DE PROGRESO CON SUPABASE - INSTRUCCIONES

## ✅ LO QUE SE IMPLEMENTÓ

### **1. Barra de Progreso Compacta**
- Círculos pequeños (16px) integrados en el header
- Tooltips con nombres de slides
- Click para navegar a slides visitados
- Estados visuales: Gris (no visitado), Verde (visitado), Azul (actual)

### **2. Persistencia en Supabase (Nube)**
- ✅ Funciona en **cualquier dispositivo** (PC, celular, tablet)
- ✅ Funciona en **cualquier navegador**
- ✅ **Se sincroniza automáticamente**
- ✅ El progreso **persiste** aunque borre el caché

---

## 📋 PASOS PARA ACTIVAR

### **PASO 1: Crear la Tabla en Supabase**

1. **Abre tu proyecto en Supabase**: https://supabase.com/dashboard
2. **Ve a SQL Editor** (menú lateral izquierdo)
3. **Copia y pega** el contenido del archivo: `AGREGAR_TABLA_PROGRESO_DETALLADO.sql`
4. **Haz clic en "Run"** para ejecutar el SQL
5. **Verifica** que la tabla se creó correctamente

### **PASO 2: Verificar la Configuración**

El archivo `js/config.js` ya tiene la configuración de Supabase:
```javascript
const SUPABASE_URL = 'https://bsonmzabqkkeoqnlgthe.supabase.co';
const SUPABASE_ANON_KEY = 'tu-key-aqui';
```

✅ **Ya está configurado**, no necesitas hacer nada aquí.

---

## 🔍 CÓMO FUNCIONA

### **Cuando el Funcionario Entra al Módulo:**

1. **Selecciona su rol** (Administrativo u Operativo)
2. El sistema **carga automáticamente** su progreso desde Supabase
3. Si tiene progreso guardado:
   - ✅ Lo lleva al último slide donde quedó
   - ✅ Muestra todos los slides visitados en verde
   - ✅ Puede hacer clic en cualquier verde para navegar
4. Si NO tiene progreso guardado:
   - Comienza desde el slide 1

### **Mientras Navega:**

- Cada vez que avanza a un nuevo slide → **Se guarda en Supabase**
- Cada vez que hace clic en un círculo → **Se guarda en Supabase**
- El puntaje de la evaluación → **Se guarda en Supabase**

### **Cuando Sale y Vuelve:**

1. Entra desde **cualquier dispositivo** (PC, celular, tablet)
2. Selecciona el mismo rol
3. **Automáticamente** continúa donde quedó
4. Todos los círculos visitados están en verde

---

## 📊 DATOS QUE SE GUARDAN

En la tabla `progreso_modulo_detallado`:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `usuario_id` | ID del funcionario | `uuid-del-usuario` |
| `modulo_nombre` | Nombre del módulo | `'atencion_ciudadano'` |
| `rol_seleccionado` | Rol elegido | `'admin'` o `'operative'` |
| `slides_visitados` | Array de slides visitados | `['slide-admin-1', 'slide-admin-2', ...]` |
| `indice_actual` | Último slide donde quedó | `5` |
| `puntaje_evaluacion` | Puntaje de la evaluación | `4` |
| `total_preguntas` | Total de preguntas | `5` |
| `fecha_actualizacion` | Última actualización | `2026-02-07T19:10:00Z` |

---

## 🧪 CÓMO PROBAR

### **Prueba 1: Mismo Dispositivo**
1. Entra al módulo "Atención al Ciudadano"
2. Selecciona un rol (Admin u Operativo)
3. Navega por 5-6 slides
4. **Sal del módulo** (ve a otro módulo o cierra)
5. **Vuelve** a "Atención al Ciudadano"
6. Selecciona el **mismo rol**
7. ✅ **Deberías** continuar donde quedaste

### **Prueba 2: Diferentes Dispositivos**
1. Entra desde tu **PC**
2. Navega por varios slides
3. Sal del módulo
4. Entra desde tu **celular** con el mismo usuario
5. ✅ **Deberías** ver el mismo progreso

### **Prueba 3: Diferentes Navegadores**
1. Entra desde **Chrome**
2. Navega por varios slides
3. Abre **Firefox** o **Edge**
4. Entra con el mismo usuario
5. ✅ **Deberías** ver el mismo progreso

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### **Problema: No se guarda el progreso**

**Verifica en la consola del navegador (F12):**
- ✅ Debe aparecer: `"✅ Progreso guardado en Supabase"`
- ❌ Si aparece error, revisa:
  1. ¿Creaste la tabla en Supabase?
  2. ¿El usuario está logueado? (debe tener `usuario.id`)
  3. ¿Las políticas RLS están activas?

### **Problema: No carga el progreso al volver**

**Verifica:**
1. ¿Seleccionaste el **mismo rol** que la primera vez?
2. ¿Estás logueado con el **mismo usuario**?
3. Abre la consola (F12) y busca: `"✅ Progreso cargado desde Supabase"`

### **Problema: Error de permisos en Supabase**

**Solución:**
1. Ve a Supabase → Authentication → Policies
2. Verifica que las políticas de `progreso_modulo_detallado` estén activas
3. Si no están, ejecuta de nuevo el SQL del PASO 1

---

## 📝 NOTAS IMPORTANTES

1. **El usuario DEBE estar logueado** para que funcione
   - El sistema usa `localStorage.getItem('usuario')` para obtener el ID
   - Si no hay usuario, no se guarda ni carga progreso

2. **Cada módulo tiene su propio progreso**
   - `atencion_ciudadano`
   - `gestion_humana`
   - `gestion_ambiental`
   - `sst`
   - `planeacion`

3. **El progreso es por ROL**
   - Si haces el módulo como "Admin" y luego como "Operativo"
   - Son dos progresos diferentes (porque las rutas son diferentes)

---

## ✨ PRÓXIMOS PASOS

Para aplicar esto a los otros módulos:

1. Copia las funciones `loadProgress()` y `saveProgress()`
2. Cambia `modulo_nombre` de `'atencion_ciudadano'` a:
   - `'gestion_humana'`
   - `'gestion_ambiental'`
   - `'sst'`
   - `'planeacion'`

---

## 📞 SOPORTE

Si tienes problemas:
1. Abre la consola del navegador (F12)
2. Busca mensajes de error en rojo
3. Copia el error completo
4. Comparte el error para ayudarte

---

**¡Listo! Ahora el progreso se guarda en la nube y funciona en cualquier dispositivo.** 🎉
