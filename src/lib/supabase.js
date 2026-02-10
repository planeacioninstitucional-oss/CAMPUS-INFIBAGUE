// ============================================
// CAMPUS VIRTUAL - Cliente Supabase Moderno
// ============================================
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase desde variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación de credenciales
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Faltan las credenciales de Supabase en el archivo .env')
  console.error('Asegúrate de definir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Exportar URL para uso en componentes
export const SUPABASE_URL = supabaseUrl

// Log de inicialización
console.log('✅ Supabase Client inicializado')
console.log('📍 URL:', supabaseUrl)
