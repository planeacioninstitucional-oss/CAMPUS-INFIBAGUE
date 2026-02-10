// ============================================
// STORE GLOBAL DE AUTENTICACIÓN - Zustand
// ============================================
import { create } from 'zustand'
import { supabase } from '../lib/supabase'

/**
 * Genera hash de contraseña (mismo método que auth.js)
 */
async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'campus_salt_2024')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Store global para gestión de autenticación
 */
export const useAuthStore = create((set, get) => ({
    // ============================================
    // ESTADO
    // ============================================
    usuario: null,
    loading: false,
    error: null,
    estaAutenticado: false,

    // ============================================
    // ACCIONES
    // ============================================

    /**
     * Inicializa la sesión desde localStorage
     */
    inicializarSesion: () => {
        try {
            const usuarioStr = localStorage.getItem('usuario')
            if (usuarioStr) {
                const usuario = JSON.parse(usuarioStr)
                set({
                    usuario,
                    estaAutenticado: true
                })
                console.log('✅ Sesión restaurada:', usuario.nombre_completo)
            }
        } catch (error) {
            console.error('❌ Error inicializando sesión:', error)
            localStorage.removeItem('usuario')
        }
    },

    /**
     * Inicia sesión con cédula y contraseña
     */
    iniciarSesion: async (cedula, password) => {
        set({ loading: true, error: null })

        try {
            // Buscar usuario por cédula
            const { data: usuario, error: errorUsuario } = await supabase
                .from('usuarios')
                .select('*')
                .eq('cedula', cedula)
                .single()

            if (errorUsuario || !usuario) {
                throw new Error('Cédula no encontrada en el sistema')
            }

            // Verificar contraseña
            const passwordHash = await hashPassword(password)

            if (usuario.password_hash !== passwordHash) {
                throw new Error('Contraseña incorrecta')
            }

            // Preparar datos del usuario (sin contraseña)
            const usuarioData = {
                id: usuario.id,
                nombre_completo: usuario.nombre_completo,
                cedula: usuario.cedula,
                oficina_cargo: usuario.oficina_cargo,
                rol: usuario.rol
            }

            // Guardar en localStorage
            localStorage.setItem('usuario', JSON.stringify(usuarioData))

            set({
                usuario: usuarioData,
                estaAutenticado: true,
                loading: false
            })

            console.log('✅ Sesión iniciada:', usuarioData.nombre_completo)

            return {
                success: true,
                usuario: usuarioData,
                message: '¡Bienvenido!'
            }

        } catch (error) {
            console.error('❌ Error en login:', error)
            set({
                error: error.message,
                loading: false
            })

            return {
                success: false,
                message: error.message
            }
        }
    },

    /**
     * Registra un nuevo usuario
     */
    registrarUsuario: async (datos) => {
        set({ loading: true, error: null })

        try {
            // Verificar si la cédula ya existe
            const { data: existente } = await supabase
                .from('usuarios')
                .select('id')
                .eq('cedula', datos.cedula)
                .single()

            if (existente) {
                throw new Error('Esta cédula ya está registrada en el sistema')
            }

            // Hashear la contraseña
            const passwordHash = await hashPassword(datos.password)

            // Insertar usuario
            const { data: nuevoUsuario, error: errorRegistro } = await supabase
                .from('usuarios')
                .insert({
                    cedula: datos.cedula,
                    password_hash: passwordHash,
                    nombre_completo: datos.nombre_completo,
                    oficina_cargo: datos.oficina_cargo,
                    rol: datos.rol
                })
                .select()
                .single()

            if (errorRegistro) throw errorRegistro

            // Preparar datos del usuario
            const usuarioData = {
                id: nuevoUsuario.id,
                nombre_completo: nuevoUsuario.nombre_completo,
                cedula: nuevoUsuario.cedula,
                oficina_cargo: nuevoUsuario.oficina_cargo,
                rol: nuevoUsuario.rol
            }

            // Guardar en localStorage
            localStorage.setItem('usuario', JSON.stringify(usuarioData))

            set({
                usuario: usuarioData,
                estaAutenticado: true,
                loading: false
            })

            console.log('✅ Registro exitoso:', usuarioData.nombre_completo)

            return {
                success: true,
                usuario: nuevoUsuario,
                message: '¡Registro exitoso!'
            }

        } catch (error) {
            console.error('❌ Error en registro:', error)
            set({
                error: error.message,
                loading: false
            })

            return {
                success: false,
                message: error.message
            }
        }
    },

    /**
     * Cierra la sesión del usuario
     */
    cerrarSesion: () => {
        localStorage.removeItem('usuario')
        localStorage.removeItem('rol_original')

        set({
            usuario: null,
            estaAutenticado: false
        })

        console.log('✅ Sesión cerrada')

        // Redirigir a login
        const path = window.location.pathname
        if (path.includes('/educador/') || path.includes('/funcionario/')) {
            window.location.href = '../login.html'
        } else {
            window.location.href = './login.html'
        }
    },

    /**
     * Obtiene el usuario actual
     */
    obtenerUsuario: () => {
        return get().usuario
    },

    /**
     * Verifica si el usuario tiene un rol específico
     */
    tieneRol: (rol) => {
        const { usuario } = get()
        return usuario?.rol === rol
    },

    /**
     * Cambia la vista del educador a funcionario temporalmente
     */
    cambiarVistaAFuncionario: () => {
        const { usuario } = get()

        if (!usuario || usuario.rol !== 'educador') {
            console.error('Solo los educadores pueden cambiar de vista')
            return
        }

        // Guardar rol original
        localStorage.setItem('rol_original', usuario.rol)

        // Cambiar rol temporalmente
        const usuarioModificado = { ...usuario, rol: 'funcionario' }
        localStorage.setItem('usuario', JSON.stringify(usuarioModificado))

        set({ usuario: usuarioModificado })

        console.log('🔄 Cambiando a vista de funcionario...')

        // Redirigir
        setTimeout(() => {
            window.location.href = '../funcionario/dashboard.html'
        }, 500)
    },

    /**
     * Vuelve a la vista original del educador
     */
    volverAVistaEducador: () => {
        const { usuario } = get()
        const rolOriginal = localStorage.getItem('rol_original')

        if (!rolOriginal) {
            console.error('No hay vista previa para restaurar')
            return
        }

        // Restaurar rol original
        const usuarioRestaurado = { ...usuario, rol: rolOriginal }
        localStorage.setItem('usuario', JSON.stringify(usuarioRestaurado))
        localStorage.removeItem('rol_original')

        set({ usuario: usuarioRestaurado })

        console.log('🔄 Volviendo a vista de educador...')

        // Redirigir
        setTimeout(() => {
            window.location.href = '../educador/dashboard.html'
        }, 500)
    },

    /**
     * Verifica si está en modo vista
     */
    estaEnModoVista: () => {
        return localStorage.getItem('rol_original') !== null
    }
}))
