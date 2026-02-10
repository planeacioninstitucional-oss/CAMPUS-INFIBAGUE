# 🚀 GUÍA DE IMPLEMENTACIÓN - ESTADO GLOBAL CON ZUSTAND

## ✅ CONFIGURACIÓN COMPLETADA

Ya has completado estos pasos:

- ✅ **Paso 1**: Cliente Supabase configurado (`src/lib/supabase.js`)
- ✅ **Paso 2**: Variables de entorno creadas (`.env`)
- ✅ **Paso 3**: Store de progreso con Zustand (`src/store/useProgresoStore.js`)
- ✅ **Paso 4**: Store de autenticación (`src/store/useAuthStore.js`)
- ✅ **Paso 5**: Bridge para HTML tradicional (`src/global.js`)
- ✅ **Paso 6**: Vite configurado para desarrollo

---

## 🔧 CÓMO USAR EL SISTEMA

### Opción 1: Usar con Vite (Recomendado)

Para usar el sistema moderno con módulos ES6, necesitas correr tu aplicación con Vite:

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo en `http://localhost:3000`

### Opción 2: Integración en HTML Tradicional

Si prefieres seguir usando archivos HTML sin Vite, necesitas incluir los scripts como módulos:

```html
<!-- En tu archivo HTML (ej: dashboard.html) -->
<head>
  <!-- ... tus otros scripts ... -->
  
  <!-- Supabase CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  
  <!-- Zustand CDN -->
  <script src="https://cdn.jsdelivr.net/npm/zustand@5.0.11/index.umd.js"></script>
  
  <!-- Sistema Global (debe ir como module type) -->
  <script type="module" src="../src/global.js"></script>
</head>
```

**IMPORTANTE**: Para que funcione en HTML tradicional sin Vite, necesitamos modificar ligeramente el approach.

---

## 📦 OPCIÓN 3: Build para Producción 

Si quieres compilar una versión para producción que funcione sin servidor:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

---

## 💡 EJEMPLOS DE USO

### Ejemplo 1: Login (Reemplazando auth.js)

En tu archivo `login.html`, puedes usar el nuevo sistema así:

```html
<script type="module">
  import { useAuthStore } from './src/store/useAuthStore.js'

  const authStore = useAuthStore()

  // Manejar el login
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const cedula = document.getElementById('cedula').value
    const password = document.getElementById('password').value
    
    const result = await authStore.getState().iniciarSesion(cedula, password)
    
    if (result.success) {
      // Redirigir según el rol
      const usuario = result.usuario
      if (usuario.rol === 'educador') {
        window.location.href = './educador/dashboard.html'
      } else {
        window.location.href = './funcionario/dashboard.html'
      }
    } else {
      alert(result.message)
    }
  })
</script>
```

### Ejemplo 2: Dashboard con Progreso

En tu `dashboard.html`:

```html
<script type="module">
  import { useProgresoStore } from './src/store/useProgresoStore.js'
  import { useAuthStore } from './src/store/useAuthStore.js'

  const progresoStore = useProgresoStore()
  const authStore = useAuthStore()

  // Al cargar la página
  document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    authStore.getState().inicializarSesion()
    
    if (!authStore.getState().estaAutenticado) {
      window.location.href = '../login.html'
      return
    }

    // Cargar progreso del usuario
    await progresoStore.getState().cargarProgreso()

    // Mostrar inscripciones
    const inscripciones = progresoStore.getState().inscripciones
    console.log('Mis cursos:', inscripciones)

    // Renderizar UI con el progreso
    renderCursos(inscripciones)
  })

  function renderCursos(inscripciones) {
    const container = document.getElementById('cursos-container')
    
    inscripciones.forEach(inscripcion => {
      const div = document.createElement('div')
      div.className = 'curso-card'
      div.innerHTML = `
        <h3>${inscripcion.curso.titulo}</h3>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${inscripcion.porcentaje_avance}%"></div>
        </div>
        <span>${inscripcion.porcentaje_avance}% completado</span>
      `
      container.appendChild(div)
    })
  }
</script>
```

### Ejemplo 3: Guardar Progreso al Completar un Módulo

```html
<script type="module">
  import { useProgresoStore } from './src/store/useProgresoStore.js'

  const progresoStore = useProgresoStore()

  async function marcarModuloCompletado(inscripcionId, moduloId) {
    // Guardar progreso como 100% completado
    await progresoStore.getState().guardarProgreso(inscripcionId, moduloId, 100)
    
    console.log('✅ Módulo completado y guardado en Supabase')
    
    // Opcional: Mostrar mensaje de éxito
    mostrarNotificacion('¡Módulo completado!')
  }

  // Suscribirse a cambios en el progreso
  progresoStore.subscribe(
    (state) => state.modulosCompletados,
    (modulosCompletados) => {
      console.log('Módulos completados actualizados:', modulosCompletados)
      // Actualizar UI
      actualizarUI()
    }
  )
</script>
```

### Ejemplo 4: Inscribirse en un Curso

```html
<script type="module">
  import { useProgresoStore } from './src/store/useProgresoStore.js'

  const progresoStore = useProgresoStore()

  async function inscribirseEnCurso(cursoId) {
    const result = await progresoStore.getState().inscribirEnCurso(cursoId)
    
    if (result.success) {
      console.log('✅ Inscripción exitosa!')
      console.log('Inscripción:', result.inscripcion)
    } else {
      console.error('❌ Error:', result.error)
    }
  }

  // Ejemplo: Inscribirse al hacer clic en un botón
  document.getElementById('btn-inscribir').addEventListener('click', () => {
    const cursoId = document.getElementById('curso-id').value
    inscribirseEnCurso(cursoId)
  })
</script>
```

---

## 🔌 VERIFICAR CONEXIÓN CON SUPABASE

Puedes verificar que todo funciona correctamente ejecutando este código en la consola del navegador (después de cargar la página con el sistema):

```javascript
// Verificar cliente Supabase
console.log('Supabase Client:', window.supabaseClient)

// Verificar stores
console.log('Auth Store:', window.useAuthStore.getState())
console.log('Progreso Store:', window.useProgresoStore.getState())

// Probar autenticación
await window.Auth.login('1234567890', 'password123')

// Cargar progreso
await window.Progreso.load()

// Ver inscripciones
console.log('Mis inscripciones:', window.Progreso.getEnrollments())
```

---

## 🎯 VENTAJAS DEL NUEVO SISTEMA

### ❌ Antes (con localStorage)
- ✗ Datos solo en el navegador
- ✗ Se pierden al limpiar cache
- ✗ No sincroniza entre dispositivos
- ✗ No hay multiusuario real
- ✗ Difícil de escalar

### ✅ Ahora (con Supabase + Zustand)
- ✓ **Persistencia real** en base de datos
- ✓ **Sincronización** entre dispositivos
- ✓ **Multiusuario** verdadero
- ✓ **Estado global** reactivo
- ✓ **Escalable** y profesional
- ✓ **Tiempo real** (con Supabase Realtime)

---

## 📊 ESTRUCTURA DE DATOS

### Store de Autenticación (useAuthStore)

```javascript
{
  usuario: {
    id: 'uuid',
    nombre_completo: 'Juan Pérez',
    cedula: '1234567890',
    oficina_cargo: 'Contador',
    rol: 'funcionario' // o 'educador'
  },
  loading: false,
  error: null,
  estaAutenticado: true
}
```

### Store de Progreso (useProgresoStore)

```javascript
{
  inscripciones: [
    {
      id: 'uuid',
      funcionario_id: 'uuid',
      curso_id: 'uuid',
      porcentaje_avance: 75,
      aprobado: false,
      curso: {
        titulo: 'Inducción 2026',
        descripcion: '...'
      }
    }
  ],
  modulosCompletados: [
    {
      id: 'uuid',
      inscripcion_id: 'uuid',
      modulo_id: 'uuid',
      fecha_completado: '2026-02-10T00:00:00Z'
    }
  ],
  loading: false,
  error: null
}
```

---

## 🚨 PRÓXIMOS PASOS

1. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Probar la conexión**:
   - Abre `http://localhost:3000`
   - Abre la consola del navegador
   - Verifica que no haya errores

3. **Migrar gradualmente**:
   - Empieza por el login
   - Luego el dashboard
   - Finalmente los módulos

4. **Verificar en Supabase**:
   - Ve a tu proyecto en Supabase Dashboard
   - Revisa las tablas para ver los datos guardados

---

## 📚 RECURSOS

- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev/)

---

## ❓ TROUBLESHOOTING

### Error: "import.meta.env is undefined"
**Solución**: Debes usar Vite (`npm run dev`) o cambiar a variables globales

### Error: "Cannot use import statement outside a module"
**Solución**: Asegúrate de usar `<script type="module">` en tus HTML

### Error: "Supabase client failed"
**Solución**: Verifica que el archivo `.env` tenga las credenciales correctas

---

¿Necesitas ayuda con alguna implementación específica? ¡Pregúntame! 🚀
