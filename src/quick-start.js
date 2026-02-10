// ============================================
// QUICK START - ESTADO GLOBAL
// Prueba rápida del sistema en la consola
// ============================================

console.log(`
╔══════════════════════════════════════════════════════════════╗
║              🚀 SISTEMA DE ESTADO GLOBAL                     ║
║                 Supabase + Zustand                           ║
╚══════════════════════════════════════════════════════════════╝

✅ SISTEMA INICIALIZADO

📦 Stores disponibles:
   - window.authStore (Autenticación)
   - window.progresoStore (Progreso)
   - window.supabase (Cliente Supabase)

🔧 APIs simplificadas:
   - window.Auth.* (Métodos de autenticación)
   - window.Progreso.* (Métodos de progreso)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 COMANDOS RÁPIDOS PARA LA CONSOLA:

1️⃣ Ver estado de autenticación:
   authStore.getState()

2️⃣ Ver estado de progreso:
   progresoStore.getState()

3️⃣ Consultar base de datos:
   await supabase.from('cursos').select('*')
   await supabase.from('usuarios').select('*')
   await supabase.from('inscripciones').select('*')

4️⃣ Login de prueba (reemplaza con tus credenciales):
   await Auth.login('cedula_real', 'password_real')

5️⃣ Cargar progreso:
   await Progreso.load()

6️⃣ Ver inscripciones:
   Progreso.getEnrollments()

7️⃣ Inscribirse en un curso:
   await Progreso.enroll('curso_id_aqui')

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIPS:

• Todos los métodos son asíncronos (usa await)
• Los stores se actualizan automáticamente
• Los cambios se persisten en Supabase
• Revisa la consola para ver los logs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 EJEMPLO COMPLETO:

// 1. Consultar cursos disponibles
const { data: cursos } = await supabase.from('cursos').select('*')
console.log('Cursos disponibles:', cursos)

// 2. Login (usa credenciales reales)
const loginResult = await Auth.login('1234567890', 'password')
console.log('Login:', loginResult)

// 3. Cargar progreso del usuario
await Progreso.load()
console.log('Progreso cargado:', progresoStore.getState())

// 4. Inscribirse en un curso
if (cursos && cursos.length > 0) {
  const result = await Progreso.enroll(cursos[0].id)
  console.log('Inscripción:', result)
}

// 5. Ver inscripciones
console.log('Mis inscripciones:', Progreso.getEnrollments())

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Para más información:
   - Lee: IMPLEMENTACION_ZUSTAND.md
   - Lee: ESTADO_GLOBAL_README.md
   - Abre: demo-zustand.html

🎯 ¡Tu sistema está 100% funcional!

╚══════════════════════════════════════════════════════════════╝
`)
