// ============================================
// STORE GLOBAL DE PROGRESO - Zustand
// ============================================
import { create } from 'zustand'
import { supabase } from '../lib/supabase'

/**
 * Store global para gestión de progreso de módulos
 * Reemplaza localStorage con Supabase para persistencia real
 */
export const useProgresoStore = create((set, get) => ({
    // ============================================
    // ESTADO
    // ============================================
    progreso: [], // Array de progreso de módulos
    modulosCompletados: [], // Array de módulos completados
    inscripciones: [], // Inscripciones del usuario
    loading: false,
    error: null,

    // ============================================
    // ACCIONES - PROGRESO GENERAL
    // ============================================

    /**
     * Carga todo el progreso del usuario actual
     */
    cargarProgreso: async () => {
        set({ loading: true, error: null })

        try {
            // Obtener usuario actual desde localStorage (auth personalizada)
            const usuarioStr = localStorage.getItem('usuario')
            if (!usuarioStr) {
                throw new Error('No hay usuario autenticado')
            }

            const usuario = JSON.parse(usuarioStr)

            // Cargar inscripciones del usuario
            const { data: inscripciones, error: errorInscripciones } = await supabase
                .from('inscripciones')
                .select(`
          *,
          curso:cursos(*)
        `)
                .eq('funcionario_id', usuario.id)

            if (errorInscripciones) throw errorInscripciones

            // Cargar módulos completados
            const { data: modulosCompletados, error: errorModulos } = await supabase
                .from('modulos_completados')
                .select(`
          *,
          modulo:modulos(*),
          inscripcion:inscripciones(*)
        `)
                .in('inscripcion_id', (inscripciones || []).map(i => i.id))

            if (errorModulos) throw errorModulos

            set({
                inscripciones: inscripciones || [],
                modulosCompletados: modulosCompletados || [],
                loading: false
            })

            console.log('✅ Progreso cargado:', {
                inscripciones: inscripciones?.length || 0,
                modulosCompletados: modulosCompletados?.length || 0
            })

        } catch (error) {
            console.error('❌ Error cargando progreso:', error)
            set({ error: error.message, loading: false })
        }
    },

    /**
     * Guarda o actualiza el progreso de un módulo
     * @param {string} inscripcionId - ID de la inscripción
     * @param {string} moduloId - ID del módulo
     * @param {number} porcentaje - Porcentaje completado (0-100)
     */
    guardarProgreso: async (inscripcionId, moduloId, porcentaje) => {
        try {
            const completado = porcentaje === 100

            // Si está completado al 100%, marcar módulo como completado
            if (completado) {
                const { error: errorCompleto } = await supabase
                    .from('modulos_completados')
                    .upsert({
                        inscripcion_id: inscripcionId,
                        modulo_id: moduloId,
                        fecha_completado: new Date().toISOString()
                    }, {
                        onConflict: 'inscripcion_id,modulo_id'
                    })

                if (errorCompleto) throw errorCompleto

                // Actualizar estado local
                const { modulosCompletados } = get()
                const yaExiste = modulosCompletados.find(
                    m => m.inscripcion_id === inscripcionId && m.modulo_id === moduloId
                )

                if (!yaExiste) {
                    set({
                        modulosCompletados: [
                            ...modulosCompletados,
                            {
                                inscripcion_id: inscripcionId,
                                modulo_id: moduloId,
                                fecha_completado: new Date().toISOString()
                            }
                        ]
                    })
                }
            }

            // Actualizar porcentaje de avance en inscripción
            await get().actualizarPorcentajeInscripcion(inscripcionId)

            console.log('✅ Progreso guardado:', { moduloId, porcentaje, completado })

        } catch (error) {
            console.error('❌ Error guardando progreso:', error)
            set({ error: error.message })
        }
    },

    /**
     * Actualiza el porcentaje de avance de una inscripción
     * Calcula automáticamente basado en módulos completados
     */
    actualizarPorcentajeInscripcion: async (inscripcionId) => {
        try {
            // Obtener inscripción con sus módulos
            const { data: inscripcion } = await supabase
                .from('inscripciones')
                .select('*, curso:cursos(id)')
                .eq('id', inscripcionId)
                .single()

            if (!inscripcion) return

            // Contar módulos totales del curso
            const { count: totalModulos } = await supabase
                .from('modulos')
                .select('*', { count: 'exact', head: true })
                .eq('curso_id', inscripcion.curso.id)

            // Contar módulos completados
            const { count: modulosCompletados } = await supabase
                .from('modulos_completados')
                .select('*', { count: 'exact', head: true })
                .eq('inscripcion_id', inscripcionId)

            // Calcular porcentaje
            const porcentaje = totalModulos > 0
                ? Math.round((modulosCompletados / totalModulos) * 100)
                : 0

            const aprobado = porcentaje === 100

            // Actualizar inscripción
            const { error } = await supabase
                .from('inscripciones')
                .update({
                    porcentaje_avance: porcentaje,
                    aprobado,
                    fecha_finalizacion: aprobado ? new Date().toISOString() : null
                })
                .eq('id', inscripcionId)

            if (error) throw error

            // Actualizar estado local
            const { inscripciones } = get()
            set({
                inscripciones: inscripciones.map(i =>
                    i.id === inscripcionId
                        ? { ...i, porcentaje_avance: porcentaje, aprobado }
                        : i
                )
            })

            console.log('✅ Porcentaje actualizado:', { inscripcionId, porcentaje, aprobado })

        } catch (error) {
            console.error('❌ Error actualizando porcentaje:', error)
        }
    },

    /**
     * Inscribe a un usuario en un curso
     */
    inscribirEnCurso: async (cursoId) => {
        try {
            const usuarioStr = localStorage.getItem('usuario')
            if (!usuarioStr) throw new Error('No hay usuario autenticado')

            const usuario = JSON.parse(usuarioStr)

            // Verificar si ya está inscrito
            const { data: existente } = await supabase
                .from('inscripciones')
                .select('id')
                .eq('funcionario_id', usuario.id)
                .eq('curso_id', cursoId)
                .single()

            if (existente) {
                console.log('ℹ️ Ya estás inscrito en este curso')
                return { success: true, inscripcion: existente }
            }

            // Crear nueva inscripción
            const { data: nuevaInscripcion, error } = await supabase
                .from('inscripciones')
                .insert({
                    funcionario_id: usuario.id,
                    curso_id: cursoId,
                    porcentaje_avance: 0,
                    aprobado: false
                })
                .select('*, curso:cursos(*)')
                .single()

            if (error) throw error

            // Actualizar estado local
            const { inscripciones } = get()
            set({ inscripciones: [...inscripciones, nuevaInscripcion] })

            console.log('✅ Inscripción creada:', nuevaInscripcion)
            return { success: true, inscripcion: nuevaInscripcion }

        } catch (error) {
            console.error('❌ Error en inscripción:', error)
            return { success: false, error: error.message }
        }
    },

    /**
     * Obtiene el porcentaje de un curso específico
     */
    obtenerPorcentajeCurso: (cursoId) => {
        const { inscripciones } = get()
        const inscripcion = inscripciones.find(i => i.curso_id === cursoId)
        return inscripcion?.porcentaje_avance || 0
    },

    /**
     * Verifica si un módulo está completado
     */
    estaModuloCompletado: (moduloId) => {
        const { modulosCompletados } = get()
        return modulosCompletados.some(m => m.modulo_id === moduloId)
    },

    /**
     * Limpia el estado (útil para logout)
     */
    limpiarProgreso: () => {
        set({
            progreso: [],
            modulosCompletados: [],
            inscripciones: [],
            loading: false,
            error: null
        })
    }
}))
