// ============================================
// CAMPUS VIRTUAL - Configuración de Supabase
// ============================================

const SUPABASE_URL = 'https://bsonmzabqkkeoqnlgthe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzb25temFicWtrZW9xbmxndGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTA4OTEsImV4cCI6MjA4NTI2Njg5MX0.Utt46LUI20nuT3NZDnS_jgyhgBcr3llgFBRCVdJRIgs';

// Cliente global
let supabaseClient = null;

/**
 * Inicializa el cliente de Supabase
 */
window.inicializarSupabase = function () {
  if (supabaseClient) return supabaseClient;

  if (typeof supabase === 'undefined') {
    console.error('⚠️ Supabase no está cargado. Asegúrate de incluir el script CDN.');
    return null;
  }

  supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log('✅ Supabase inicializado correctamente');
  console.log('📍 URL:', SUPABASE_URL);
  return supabaseClient;
};

/**
 * Obtiene el cliente de Supabase
 */
function getSupabase() {
  if (!supabaseClient) {
    inicializarSupabase();
  }
  return supabaseClient;
}

/**
 * Auth helpers (para compatibilidad)
 */
function getAuth() {
  const client = getSupabase();
  return client ? client.auth : null;
}

async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;

  const { data } = await client.auth.getUser();
  return data.user;
}

async function isAuthenticated() {
  const client = getSupabase();
  if (!client) return false;

  const { data } = await client.auth.getSession();
  return !!data.session;
}

/**
 * Constantes de la aplicación
 */
const TABLAS = {
  USUARIOS: 'usuarios',
  CURSOS: 'cursos',
  MODULOS: 'modulos',
  ACTIVIDADES: 'actividades',
  PREGUNTAS: 'preguntas',
  INSCRIPCIONES: 'inscripciones',
  RESPUESTAS_ACTIVIDADES: 'respuestas_actividades',
  MODULOS_COMPLETADOS: 'modulos_completados',
  CERTIFICADOS: 'certificados'
};

// Mantener compatibilidad
const COLECCIONES = TABLAS;

const ROLES = {
  EDUCADOR: 'educador',
  FUNCIONARIO: 'funcionario'
};

const ESTADOS_INSCRIPCION = {
  EN_PROGRESO: 'en_progreso',
  APROBADO: 'aprobado',
  NO_APROBADO: 'no_aprobado'
};

const TIPOS_ACTIVIDAD = {
  QUIZ: 'quiz',
  TAREA: 'tarea'
};

const APP_CONFIG = {
  PORCENTAJE_MINIMO_APROBACION: 70,
  RUTA_LOGO: './assets/logo-entidad.png',
  NOMBRE_ENTIDAD: 'INFIBAGUÉ',
  ITEMS_POR_PAGINA: 12
};

const STORAGE_BUCKETS = {
  IMAGENES_CURSOS: 'imagenes-cursos',
  MATERIALES_CURSO: 'materiales-curso'
};
