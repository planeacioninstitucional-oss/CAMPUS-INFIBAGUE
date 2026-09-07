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

// ============================================
// SISTEMA DE AUDITORÍA Y BYPASS SUPERADMINISTRADOR
// ============================================
// Permite a Camila Andrea Portela Cortés, directivos y educadores
// saltar diapositivas, omitir evaluaciones y auditar cualquier contenido sin bloqueos.

function esSuperAdminAuditor() {
    try {
        const rolOriginal = localStorage.getItem('rol_original');
        if (rolOriginal === 'educador') return true;
        const uStr = localStorage.getItem('usuario');
        if (!uStr) return false;
        const u = JSON.parse(uStr);
        const nom = (u.nombre_completo || '').toUpperCase();
        return u.rol === 'educador' || 
               u.rol === 'admin' ||
               u.cedula === '28556963' || 
               nom.includes('PORTELA') || 
               nom.includes('JAROL');
    } catch (e) {
        return false;
    }
}

// Función global para saltar al siguiente paso/diapositiva
window.bypassNextStep = function() {
    console.log('⚡ Ejecutando bypass de siguiente paso/diapositiva...');

    // 1. Gestión Humana (React Component)
    if (typeof window.reactNextGestionHumana === 'function') {
        window.reactNextGestionHumana();
        return;
    }

    // 2. Seguridad y Salud en el Trabajo (SST)
    if (typeof window.sstNextLevel === 'function') {
        window.sstNextLevel();
        return;
    }

    // 3. Atención al Ciudadano
    if (typeof visitedLinks !== 'undefined' && visitedLinks.add) {
        visitedLinks.add('rueda');
        visitedLinks.add('panoptico');
        visitedLinks.add('luminito');
        visitedLinks.add('infibague');
        visitedLinks.add('link-rueda');
        visitedLinks.add('link-panoptico');
        visitedLinks.add('link-luminito');
        visitedLinks.add('link-infibague');
    }

    if (typeof currentPath !== 'undefined' && typeof currentIndex !== 'undefined' && typeof showSlide === 'function') {
        if (currentIndex < currentPath.length - 1) {
            currentIndex++;
            showSlide(currentPath[currentIndex]);
            return;
        } else if (typeof finishModule === 'function') {
            if (typeof totalQuestions !== 'undefined') window.quizScore = totalQuestions;
            finishModule();
            return;
        }
    }

    // 4. Planeación Estratégica
    if (typeof currentSlide !== 'undefined' && typeof updateSlide === 'function') {
        if (typeof slides !== 'undefined' && currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlide();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    }

    // 5. Fallback en SST por elementos DOM
    const sstSections = ['screen-start', 'level-1', 'level-2', 'level-3', 'level-4', 'screen-end'];
    for (let i = 0; i < sstSections.length; i++) {
        const el = document.getElementById(sstSections[i]);
        if (el && !el.classList.contains('hidden-section')) {
            if (i < sstSections.length - 1 && typeof switchSection === 'function') {
                switchSection(sstSections[i], sstSections[i + 1]);
                return;
            }
        }
    }

    // 6. Búsqueda y activación de cualquier botón "Siguiente" o "Continuar" visible o bloqueado
    const candidateSelectors = [
        '.btn-next',
        '#btnNext',
        '#nextBtn',
        '#btn-next-module',
        '.nav-btn.next',
        '[onclick*="nextSlide"]',
        '#btn-continuar',
        '#btn-marcar-hecho',
        '.btn-primary'
    ];

    for (const sel of candidateSelectors) {
        const elements = document.querySelectorAll(sel);
        for (const el of elements) {
            el.disabled = false;
            el.classList.remove('hidden', 'hidden-section', 'disabled');
            if (el.style.display === 'none') el.style.display = 'inline-flex';
            if (el.offsetParent !== null) { // Está visible
                el.click();
                return;
            }
        }
    }

    // 7. Fallback a funciones de siguiente módulo si existen
    if (typeof nextSlide === 'function') {
        try { nextSlide(); return; } catch (e) {}
    }
    if (typeof nextModule === 'function') {
        try { nextModule(); return; } catch (e) {}
    }
};

// Función global para saltar y aprobar la evaluación
window.bypassEvaluation = function() {
    console.log('⚡ Ejecutando bypass de evaluación...');

    // 1. Gestión Humana (React)
    if (typeof window.reactFinishGestionHumana === 'function') {
        window.reactFinishGestionHumana();
        setTimeout(() => {
            const btnHecho = document.getElementById('btn-marcar-hecho');
            if (btnHecho) btnHecho.click();
        }, 300);
        return;
    }

    // 2. SST
    if (typeof window.sstFinishModule === 'function') {
        window.sstFinishModule();
        return;
    }

    // 3. Atención al Ciudadano
    if (typeof finishModule === 'function') {
        if (typeof totalQuestions !== 'undefined') {
            window.quizScore = totalQuestions;
        }
        finishModule();
        return;
    }

    // 4. Planeación
    if (typeof finishModule === 'function') {
        finishModule();
        return;
    }

    // 5. Notificar al padre directamente
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'MODULO_INDUCCION_COMPLETADO',
            data: { aprobado: true, score: 100, total: 100, percentage: 100 }
        }, '*');
    }
};

// Escuchar mensajes del Dashboard padre
window.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'FORCE_NEXT_SLIDE') {
        window.bypassNextStep();
    } else if (event.data.type === 'BYPASS_EVALUATION') {
        window.bypassEvaluation();
    }
});

// Inyectar barra flotante de auditoría si el usuario es Superadministrador / Educador
document.addEventListener('DOMContentLoaded', () => {
    if (!esSuperAdminAuditor()) return;

    if (document.getElementById('superadmin-quick-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'superadmin-quick-bar';
    bar.style.cssText = 'position: fixed; bottom: 18px; right: 18px; z-index: 999999; display: flex; align-items: center; gap: 8px; background: rgba(15, 23, 42, 0.94); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 9999px; box-shadow: 0 10px 25px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.25); font-family: system-ui, -apple-system, sans-serif;';

    bar.innerHTML = `
        <span style="color: #fbbf24; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 4px;">
            🛡️ Auditor
        </span>
        <button type="button" onclick="window.bypassNextStep()" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(37,99,235,0.4); transition: transform 0.15s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Saltar Diapositiva ⏩
        </button>
        <button type="button" onclick="window.bypassEvaluation()" style="background: #059669; color: white; border: none; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(5,150,105,0.4); transition: transform 0.15s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Aprobar Evaluación ⚡
        </button>
    `;

    document.body.appendChild(bar);
});

