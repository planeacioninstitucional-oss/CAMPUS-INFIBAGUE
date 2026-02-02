// ============================================
// CAMPUS VIRTUAL - Sistema de Progreso con Supabase
// ============================================

/**
 * Calcula la calificación de una actividad
 * @param {string} actividadId - ID de la actividad
 * @param {Object} respuestas - Respuestas del usuario {preguntaId: opcionIndex}
 * @returns {Promise<Object>} Resultado con calificación
 */
async function calcularCalificacion(actividadId, respuestas) {
    const supabase = getSupabase();

    try {
        // Obtener preguntas de la actividad
        const { data: preguntas, error } = await supabase
            .from('preguntas')
            .select('*')
            .eq('actividad_id', actividadId);

        if (error) throw error;

        if (!preguntas || preguntas.length === 0) {
            throw new Error('No se encontraron preguntas para esta actividad');
        }

        let correctas = 0;
        const totalPreguntas = preguntas.length;

        preguntas.forEach(pregunta => {
            const respuestaUsuario = respuestas[pregunta.id];

            if (respuestaUsuario !== undefined && pregunta.opciones[respuestaUsuario]) {
                if (pregunta.opciones[respuestaUsuario].correcta) {
                    correctas++;
                }
            }
        });

        const porcentaje = (correctas / totalPreguntas) * 100;

        return {
            success: true,
            calificacion: Math.round(porcentaje),
            correctas: correctas,
            total: totalPreguntas
        };

    } catch (error) {
        console.error('Error al calcular calificación:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Envía las respuestas de una actividad y califica
 * @param {string} actividadId - ID de la actividad
 * @param {Object} respuestas - Respuestas del usuario
 * @param {string} inscripcionId - ID de la inscripción
 * @returns {Promise<Object>} Resultado con calificación
 */
async function enviarRespuestasActividad(actividadId, respuestas, inscripcionId) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        return {
            success: false,
            message: 'Debes iniciar sesión'
        };
    }

    try {
        // Calcular calificación
        const resultado = await calcularCalificacion(actividadId, respuestas);

        if (!resultado.success) {
            throw new Error(resultado.error);
        }

        // Obtener datos de la actividad
        const { data: actividad, error: actError } = await supabase
            .from('actividades')
            .select('requisito_aprobacion, modulo_id')
            .eq('id', actividadId)
            .single();

        if (actError) throw actError;

        const aprobado = resultado.calificacion >= actividad.requisito_aprobacion;

        // Guardar respuesta (upsert para sobrescribir intentos anteriores)
        const { error: respError } = await supabase
            .from('respuestas_actividades')
            .upsert({
                inscripcion_id: inscripcionId,
                actividad_id: actividadId,
                respuestas: respuestas,
                calificacion: resultado.calificacion,
                aprobada: aprobado
            }, { onConflict: 'inscripcion_id,actividad_id' });

        if (respError) throw respError;

        // Si aprobó, marcar el módulo como completado
        if (aprobado) {
            await marcarModuloCompletado(actividad.modulo_id, inscripcionId);
        }

        return {
            success: true,
            calificacion: resultado.calificacion,
            aprobada: aprobado,
            correctas: resultado.correctas,
            total: resultado.total,
            message: aprobado ? '¡Felicitaciones! Has aprobado la actividad' : 'No has alcanzado la nota mínima'
        };

    } catch (error) {
        console.error('Error al enviar respuestas:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al enviar respuestas'
        };
    }
}

/**
 * Marca un módulo como completado
 * @param {string} moduloId - ID del módulo
 * @param {string} inscripcionId - ID de la inscripción
 * @returns {Promise<Object>} Resultado
 */
async function marcarModuloCompletado(moduloId, inscripcionId) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        return {
            success: false,
            message: 'Debes iniciar sesión'
        };
    }

    try {
        // Verificar si ya está completado
        const { data: existente } = await supabase
            .from('modulos_completados')
            .select('id')
            .eq('inscripcion_id', inscripcionId)
            .eq('modulo_id', moduloId)
            .single();

        if (existente) {
            return {
                success: true,
                message: 'El módulo ya estaba completado'
            };
        }

        // Marcar como completado
        const { error } = await supabase
            .from('modulos_completados')
            .insert({
                inscripcion_id: inscripcionId,
                modulo_id: moduloId
            });

        if (error) throw error;

        // Actualizar progreso del curso
        await actualizarProgreso(inscripcionId);

        return {
            success: true,
            message: 'Módulo completado'
        };

    } catch (error) {
        console.error('Error al marcar módulo completado:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al marcar módulo completado'
        };
    }
}

/**
 * Actualiza el progreso de una inscripción
 * @param {string} inscripcionId - ID de la inscripción
 * @returns {Promise<Object>} Resultado
 */
async function actualizarProgreso(inscripcionId) {
    const supabase = getSupabase();

    try {
        // Obtener inscripción
        const { data: inscripcion, error: inscError } = await supabase
            .from('inscripciones')
            .select('curso_id')
            .eq('id', inscripcionId)
            .single();

        if (inscError) throw new Error('Inscripción no encontrada');

        // Obtener todos los módulos del curso
        const { data: modulos, error: modError } = await supabase
            .from('modulos')
            .select('id')
            .eq('curso_id', inscripcion.curso_id);

        if (modError) throw modError;

        const totalModulos = modulos?.length || 0;

        // Obtener módulos completados
        const { data: completados, error: compError } = await supabase
            .from('modulos_completados')
            .select('id')
            .eq('inscripcion_id', inscripcionId);

        if (compError) throw compError;

        const modulosCompletados = completados?.length || 0;
        const porcentaje = totalModulos > 0 ? Math.round((modulosCompletados / totalModulos) * 100) : 0;
        const cursoAprobado = porcentaje >= 100;

        // Actualizar inscripción
        const updateData = {
            porcentaje_avance: porcentaje,
            aprobado: cursoAprobado
        };

        if (cursoAprobado) {
            updateData.fecha_finalizacion = new Date().toISOString();
        }

        const { error: updateError } = await supabase
            .from('inscripciones')
            .update(updateData)
            .eq('id', inscripcionId);

        if (updateError) throw updateError;

        return {
            success: true,
            porcentaje: porcentaje
        };

    } catch (error) {
        console.error('Error al actualizar progreso:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Obtiene el estado de progreso detallado de un curso
 * @param {string} inscripcionId - ID de la inscripción
 * @returns {Promise<Object>} Estado detallado
 */
async function obtenerProgresoDetallado(inscripcionId) {
    const supabase = getSupabase();

    try {
        // Obtener inscripción con curso
        const { data: inscripcion, error: inscError } = await supabase
            .from('inscripciones')
            .select(`
                *,
                curso:cursos(*)
            `)
            .eq('id', inscripcionId)
            .single();

        if (inscError) throw new Error('Inscripción no encontrada');

        // Obtener módulos del curso
        const { data: modulos, error: modError } = await supabase
            .from('modulos')
            .select('*')
            .eq('curso_id', inscripcion.curso_id)
            .order('orden', { ascending: true });

        if (modError) throw modError;

        // Obtener módulos completados
        const { data: completados, error: compError } = await supabase
            .from('modulos_completados')
            .select('modulo_id')
            .eq('inscripcion_id', inscripcionId);

        if (compError) throw compError;

        const completadosSet = new Set((completados || []).map(c => c.modulo_id));

        const modulosConEstado = (modulos || []).map(modulo => ({
            ...modulo,
            completado: completadosSet.has(modulo.id)
        }));

        return {
            success: true,
            inscripcion: inscripcion,
            curso: inscripcion.curso,
            modulos: modulosConEstado,
            porcentaje_avance: inscripcion.porcentaje_avance || 0
        };

    } catch (error) {
        console.error('Error al obtener progreso detallado:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
