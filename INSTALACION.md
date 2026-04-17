# Guía de Instalación - Campus Virtual

## Paso 1: Configurar Supabase

### Crear cuenta y proyecto

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Haz clic en "New Project"
3. Elige tu organización o crea una nueva
4. Ingresa el nombre del proyecto: "campus-virtual"
5. Elige una contraseña para la base de datos
6. Selecciona la región más cercana a tus usuarios
7. Haz clic en "Create new project"

### Configurar la Base de Datos

1. En tu proyecto de Supabase, ve al menú lateral y selecciona "SQL Editor"
2. Ejecuta todo el código SQL del archivo `SUPABASE_SETUP.md` para crear las tablas

### Desactivar Confirmación de Email (Desarrollo)

1. Ve a **Authentication > Settings**
2. Desactiva **"Enable email confirmations"** 
3. Esto permite registrar usuarios sin verificar email (útil para desarrollo)

---

## Paso 2: Obtener las Credenciales

1. Ve a **Settings > API** (en el menú lateral)
2. Copia los siguientes valores:
   - **Project URL**: Es la URL de tu proyecto (ejemplo: `https://xxxxx.supabase.co`)
   - **anon public key**: Es la clave anónima pública

---

## Paso 3: Configurar el Proyecto

### Editar el archivo de configuración

1. Abre el archivo `js/config.js`
2. Reemplaza los valores con tus credenciales:

```javascript
const SUPABASE_URL = 'TU_URL_DE_SUPABASE';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';
```

**Ejemplo:**
```javascript
const SUPABASE_URL = 'https://bsonmzabqkkeoqnlgthe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Paso 4: Ejecutar Localmente

### Opción A: Usar Live Server (Recomendado)

1. Instala Node.js si no lo tienes: https://nodejs.org
2. Instala las dependencias:
```bash
cd CAMPUS
npm install
```
3. Ejecuta el servidor:
```bash
npm start
```
4. Abre tu navegador en `http://localhost:3000`

### Opción B: Usar extensión de VS Code

1. Instala la extensión "Live Server" en VS Code
2. Clic derecho en `index.html` > "Open with Live Server"

### Opción C: Abrir directamente

Simplemente abre `index.html` con tu navegador.

---

## Paso 5: Verificar la Instalación

### Crear un usuario de prueba

1. Abre el Campus Virtual en tu navegador
2. Haz clic en "Registrarse"
3. Completa el formulario:
   - Nombre: "Educador Prueba"
   - Cédula: "12345678"
   - Correo: cualquier correo válido
   - Contraseña: mínimo 6 caracteres
   - Rol: "Educador"
4. Si el registro es exitoso, ¡la instalación está completa!

### Verificar en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Table Editor > usuarios**
3. Deberías ver el usuario que acabas de crear

---

## Estructura de Archivos

```
CAMPUS/
├── index.html              # Página principal
├── login.html              # Página de inicio de sesión
├── registro.html           # Página de registro
├── catalogo.html           # Catálogo de cursos
├── curso-detalle.html      # Vista de un curso
├── js/
│   ├── config.js           # Configuración de Supabase
│   ├── auth.js             # Funciones de autenticación
│   ├── courses.js          # Gestión de cursos
│   ├── progress.js         # Sistema de progreso
│   ├── certificates.js     # Generación de certificados
│   └── utils.js            # Utilidades generales
├── css/
│   ├── main.css            # Estilos principales
│   └── components.css      # Componentes reutilizables
├── educador/
│   ├── dashboard.html      # Panel del educador
│   ├── crear-curso.html    # Crear nuevo curso
│   └── editar-curso.html   # Editar curso existente
├── funcionario/
│   ├── dashboard.html      # Panel del funcionario
│   └── certificados.html   # Ver certificados
└── assets/
    └── logo-entidad.png    # Logo de la entidad
```

---

## Configuración Adicional de Supabase

### Storage (Archivos)

Los buckets ya deberían estar creados con el script SQL. Verifica en:
1. **Storage** en el menú lateral
2. Deberías ver:
   - `imagenes-cursos` - Para imágenes de cursos
   - `materiales-curso` - Para PDFs y materiales

### Políticas de Seguridad (RLS)

Las políticas RLS ya están configuradas con el script SQL. Para verificar:
1. Ve a **Table Editor**
2. Selecciona una tabla
3. Haz clic en el candado 🔒 para ver las políticas

---

## Solución de Problemas

### "Usuario no autorizado" o errores de permisos

1. Verifica que las políticas RLS estén correctas en Supabase
2. Asegúrate de que el trigger `handle_new_user` esté activo
3. Revisa que la confirmación de email esté desactivada

### "Network Error" o problemas de conexión

1. Verifica que la URL de Supabase sea correcta
2. Asegúrate de que la clave anónima sea correcta
3. Revisa la consola del navegador (F12) para ver errores detallados

### El registro no funciona

1. Abre las herramientas de desarrollo (F12)
2. Ve a la pestaña "Console" para ver errores
3. Ve a la pestaña "Network" para ver las peticiones
4. Verifica que el trigger en auth.users esté funcionando

### Los archivos no se suben

1. Verifica que los buckets de Storage existan
2. Verifica las políticas de Storage
3. Revisa los límites de tamaño de archivos

---

## Próximos Pasos

Una vez configurado, puedes:

1. **Crear cursos** con el usuario educador
2. **Inscribir funcionarios** a los cursos
3. **Configurar** el logo y colores de tu entidad
4. **Desplegar** en un hosting como Vercel, Netlify o GitHub Pages

---

## Recursos

- **Documentación Supabase**: https://supabase.com/docs
- **Supabase JavaScript Client**: https://supabase.com/docs/reference/javascript
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Supabase Storage**: https://supabase.com/docs/guides/storage

---

¿Necesitas ayuda? Revisa la consola del navegador (F12) y el Dashboard de Supabase para ver mensajes de error detallados.
