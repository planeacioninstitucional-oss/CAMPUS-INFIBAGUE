// ============================================
// CAMPUS VIRTUAL - Configuración de Supabase
// ============================================

/**
 * Configuración de Supabase
 * Credenciales del proyecto
 */
const SUPABASE_URL = 'https://bsonmzabqkkeoqnlgthe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzb25temFicWtrZW9xbmxndGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTA4OTEsImV4cCI6MjA4NTI2Njg5MX0.Utt46LUI20nuT3NZDnS_jgyhgBcr3llgFBRCVdJRIgs';

// Variables globales de Supabase
let supabaseClient = null;

/**
 * Inicializa el cliente de Supabase
 * Requiere que la librería de Supabase esté cargada
 */
function inicializarSupabase() {
  if (typeof supabase === 'undefined') {
    console.error('La librería de Supabase no está cargada. Asegúrate de incluir el script en el HTML.');
    return null;
  }

  if (!supabaseClient) {
    try {
      // Inicializar cliente de Supabase
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      console.log('Supabase inicializado correctamente');
      console.log('- URL:', SUPABASE_URL);
      console.log('- Cliente:', supabaseClient ? '✓' : '✗');

    } catch (error) {
      console.error('Error al inicializar Supabase:', error);
      return null;
    }
  }

  return supabaseClient;
}

/**
 * Obtiene el cliente de Supabase
 * @returns {object} Cliente de Supabase
 */
function getSupabase() {
  if (!supabaseClient) {
    inicializarSupabase();
  }
  return supabaseClient;
}

/**
 * Obtiene la instancia de Auth de Supabase
 * @returns {object} Instancia de Auth
 */
function getAuth() {
  const client = getSupabase();
  return client ? client.auth : null;
}

/**
 * Obtiene el usuario actual
 * @returns {Promise<object|null>} Usuario actual o null
 */
async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;
  
  const { data: { user } } = await client.auth.getUser();
  return user;
}

/**
 * Obtiene los datos del perfil del usuario actual
 * @returns {Promise<object|null>} Datos del perfil o null
 */
async function getCurrentUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const client = getSupabase();
  const { data, error } = await client
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error al obtener perfil:', error);
    return null;
  }

  return data;
}

/**
 * Verifica si hay una sesión activa
 * @returns {Promise<boolean>}
 */
async function isAuthenticated() {
  const client = getSupabase();
  if (!client) return false;
  
  const { data: { session } } = await client.auth.getSession();
  return !!session;
}

/**
 * Cierra la sesión del usuario
 * @returns {Promise<void>}
 */
async function logout() {
  const client = getSupabase();
  if (client) {
    await client.auth.signOut();
  }
  window.location.href = '/login.html';
}

// Nombres de las tablas en Supabase
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

// Mantener compatibilidad con código que use COLECCIONES
const COLECCIONES = TABLAS;

// Roles de usuario
const ROLES = {
  EDUCADOR: 'educador',
  FUNCIONARIO: 'funcionario'
};

// Estados de inscripción
const ESTADOS_INSCRIPCION = {
  EN_PROGRESO: 'en_progreso',
  APROBADO: 'aprobado',
  NO_APROBADO: 'no_aprobado'
};

// Tipos de actividad
const TIPOS_ACTIVIDAD = {
  QUIZ: 'quiz',
  TAREA: 'tarea'
};

// Configuración de la aplicación
const APP_CONFIG = {
  PORCENTAJE_MINIMO_APROBACION: 70, // Porcentaje mínimo para aprobar una actividad
  RUTA_LOGO: './assets/logo-entidad.png',
  NOMBRE_ENTIDAD: 'Entidad Pública', // Cambiar por el nombre real
  ITEMS_POR_PAGINA: 12
};

// Buckets de Storage
const STORAGE_BUCKETS = {
  IMAGENES_CURSOS: 'imagenes-cursos',
  MATERIALES_CURSO: 'materiales-curso'
};

/**
 * Sube un archivo al storage de Supabase
 * @param {string} bucket - Nombre del bucket
 * @param {string} path - Ruta del archivo
 * @param {File} file - Archivo a subir
 * @returns {Promise<string|null>} URL pública del archivo o null
 */
async function uploadFile(bucket, path, file) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error al subir archivo:', error);
    return null;
  }

  // Obtener URL pública
  const { data: { publicUrl } } = client.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

/**
 * Elimina un archivo del storage
 * @param {string} bucket - Nombre del bucket
 * @param {string} path - Ruta del archivo
 * @returns {Promise<boolean>}
 */
async function deleteFile(bucket, path) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Error al eliminar archivo:', error);
    return false;
  }

  return true;
}

// Exportar para uso global (para compatibilidad con módulos)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    TABLAS,
    COLECCIONES,
    ROLES,
    ESTADOS_INSCRIPCION,
    TIPOS_ACTIVIDAD,
    APP_CONFIG,
    STORAGE_BUCKETS,
    inicializarSupabase,
    getSupabase,
    getAuth,
    getCurrentUser,
    getCurrentUserProfile,
    isAuthenticated,
    logout,
    uploadFile,
    deleteFile
  };
}
