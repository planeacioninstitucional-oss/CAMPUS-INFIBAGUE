// ============================================
// PUENTE PARA USO EN HTML TRADICIONAL
// Expone los stores de Zustand globalmente
// ============================================

/**
 * Este archivo permite usar los stores de Zustand desde HTML/JS vanilla
 * Importa este archivo en tu HTML y usa las funciones globales
 */

import { useProgresoStore } from './store/useProgresoStore.js'
import { useAuthStore } from './store/useAuthStore.js'
import { supabase } from './lib/supabase.js'

// ============================================
// EXPORTAR STORES GLOBALMENTE
// ============================================
window.useProgresoStore = useProgresoStore
window.useAuthStore = useAuthStore
window.supabaseClient = supabase

// ============================================
// FUNCIONES DE CONVENIENCIA GLOBALES
// ============================================

/**
 * API simplificada para autenticación
 */
window.Auth = {
    // Inicializar sesión al cargar la página
    init: () => useAuthStore.getState().inicializarSesion(),

    // Login
    login: (cedula, password) => useAuthStore.getState().iniciarSesion(cedula, password),

    // Registro
    register: (datos) => useAuthStore.getState().registrarUsuario(datos),

    // Logout
    logout: () => useAuthStore.getState().cerrarSesion(),

    // Obtener usuario actual
    getUser: () => useAuthStore.getState().obtenerUsuario(),

    // Verificar autenticación
    isAuthenticated: () => useAuthStore.getState().estaAutenticado,

    // Verificar rol
    hasRole: (rol) => useAuthStore.getState().tieneRol(rol),

    // Cambiar vista
    switchToFuncionario: () => useAuthStore.getState().cambiarVistaAFuncionario(),
    switchToEducador: () => useAuthStore.getState().volverAVistaEducador(),
    isViewMode: () => useAuthStore.getState().estaEnModoVista()
}

/**
 * API simplificada para progreso
 */
window.Progreso = {
    // Cargar progreso del usuario
    load: () => useProgresoStore.getState().cargarProgreso(),

    // Guardar progreso de un módulo
    save: (inscripcionId, moduloId, porcentaje) =>
        useProgresoStore.getState().guardarProgreso(inscripcionId, moduloId, porcentaje),

    // Inscribirse en un curso
    enroll: (cursoId) => useProgresoStore.getState().inscribirEnCurso(cursoId),

    // Obtener porcentaje de un curso
    getCourseProgress: (cursoId) => useProgresoStore.getState().obtenerPorcentajeCurso(cursoId),

    // Verificar si módulo está completado
    isModuleComplete: (moduloId) => useProgresoStore.getState().estaModuloCompletado(moduloId),

    // Obtener todas las inscripciones
    getEnrollments: () => useProgresoStore.getState().inscripciones,

    // Obtener módulos completados
    getCompletedModules: () => useProgresoStore.getState().modulosCompletados,

    // Limpiar progreso
    clear: () => useProgresoStore.getState().limpiarProgreso()
}

/**
 * Suscribirse a cambios en el store de autenticación
 */
window.onAuthChange = (callback) => {
    return useAuthStore.subscribe(
        state => state.usuario,
        callback
    )
}

/**
 * Suscribirse a cambios en el store de progreso
 */
window.onProgressChange = (callback) => {
    return useProgresoStore.subscribe(
        state => state.inscripciones,
        callback
    )
}

// ============================================
// AUTO-INICIALIZACIÓN
// ============================================
console.log('🚀 Sistema de Estado Global inicializado')
console.log('📦 Stores disponibles:', {
    Auth: 'window.Auth',
    Progreso: 'window.Progreso',
    useAuthStore: 'window.useAuthStore',
    useProgresoStore: 'window.useProgresoStore',
    supabaseClient: 'window.supabaseClient'
})

// Inicializar sesión automáticamente
Auth.init()
