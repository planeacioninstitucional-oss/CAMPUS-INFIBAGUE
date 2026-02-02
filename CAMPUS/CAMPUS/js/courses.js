// ============================================
// CAMPUS VIRTUAL - Gestión de Cursos con Supabase
// ============================================

/**
 * Obtiene todos los cursos activos con filtros opcionales
 * @param {Object} filtros - Filtros de búsqueda (oficina_tema, titulo)
 * @returns {Promise<Object>} Lista de cursos
 */
async function obtenerCursos(filtros = {}) {
    const supabase = getSupabase();

    try {
        let query = supabase
            .from('cursos')
            .select(`
                *,
                educador:usuarios!educador_id(nombre_completo, oficina_cargo)
            `)
            .eq('activo', true)
            .order('created_at', { ascending: false });

        const { data: cursos, error } = await query;

        if (error) throw error;

        let cursosData = cursos || [];

        // Aplicar filtros locales
        if (filtros.oficina_tema) {
            cursosData = cursosData.filter(c =>
                c.oficina_tema && c.oficina_tema.toLowerCase().includes(filtros.oficina_tema.toLowerCase())
            );
        }

        if (filtros.titulo) {
            cursosData = cursosData.filter(c =>
                c.titulo && c.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())
            );
        }

        return {
            success: true,
            cursos: cursosData
        };

    } catch (error) {
        console.error('Error al obtener cursos:', error);
        return {
            success: false,
            error: error.message,
            cursos: []
        };
    }
}

/**
 * Obtiene un curso por ID con sus módulos
 * @param {string} cursoId - ID del curso
 * @returns {Promise<Object>} Datos del curso
 */
async function obtenerCursoPorId(cursoId) {
    const supabase = getSupabase();

    try {
        // Obtener curso con educador
        const { data: curso, error: cursoError } = await supabase
            .from('cursos')
            .select(`
                *,
                educador:usuarios!educador_id(nombre_completo, oficina_cargo)
            `)
            .eq('id', cursoId)
            .single();

        if (cursoError) throw cursoError;

        // Obtener módulos
        const { data: modulos, error: modulosError } = await supabase
            .from('modulos')
            .select('*')
            .eq('curso_id', cursoId)
            .order('orden', { ascending: true });

        if (modulosError) throw modulosError;

        // Para cada módulo, obtener actividades
        for (const modulo of modulos || []) {
            const { data: actividades, error: actError } = await supabase
                .from('actividades')
                .select('*')
                .eq('modulo_id', modulo.id);

            if (!actError) {
                modulo.actividades = actividades || [];

                // Obtener preguntas para cada actividad
                for (const actividad of modulo.actividades) {
                    const { data: preguntas } = await supabase
                        .from('preguntas')
                        .select('*')
                        .eq('actividad_id', actividad.id)
                        .order('orden', { ascending: true });

                    actividad.preguntas = preguntas || [];
                }
            }
        }

        curso.modulos = modulos || [];

        return {
            success: true,
            curso: curso
        };

    } catch (error) {
        console.error('Error al obtener curso:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Crea un nuevo curso (solo educadores)
 * @param {Object} datos - Datos del curso
 * @returns {Promise<Object>} Curso creado
 */
async function crearCurso(datos) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== ROLES.EDUCADOR) {
        return {
            success: false,
            message: 'Solo los educadores pueden crear cursos'
        };
    }

    try {
        const cursoData = {
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            imagen_portada: datos.imagen_url || datos.imagen_portada || null,
            educador_id: usuario.id,
            duracion_horas: datos.duracion_horas || 0,
            activo: true
        };

        const { data: curso, error } = await supabase
            .from('cursos')
            .insert(cursoData)
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            curso: curso,
            message: 'Curso creado exitosamente'
        };

    } catch (error) {
        console.error('Error al crear curso:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al crear curso'
        };
    }
}

/**
 * Actualiza un curso existente
 * @param {string} cursoId - ID del curso
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<Object>} Curso actualizado
 */
async function actualizarCurso(cursoId, datos) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== ROLES.EDUCADOR) {
        return {
            success: false,
            message: 'No tienes permisos para editar cursos'
        };
    }

    try {
        // Verificar propiedad del curso
        const { data: cursoExistente, error: checkError } = await supabase
            .from('cursos')
            .select('educador_id')
            .eq('id', cursoId)
            .single();

        if (checkError) throw new Error('Curso no encontrado');

        if (cursoExistente.educador_id !== usuario.id) {
            throw new Error('Solo puedes editar tus propios cursos');
        }

        const { data: curso, error } = await supabase
            .from('cursos')
            .update(datos)
            .eq('id', cursoId)
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            curso: curso,
            message: 'Curso actualizado exitosamente'
        };

    } catch (error) {
        console.error('Error al actualizar curso:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al actualizar curso'
        };
    }
}

/**
 * Elimina (desactiva) un curso
 * @param {string} cursoId - ID del curso
 * @returns {Promise<Object>} Resultado
 */
async function eliminarCurso(cursoId) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== ROLES.EDUCADOR) {
        return {
            success: false,
            message: 'No tienes permisos para eliminar cursos'
        };
    }

    try {
        const { error } = await supabase
            .from('cursos')
            .update({ activo: false })
            .eq('id', cursoId)
            .eq('educador_id', usuario.id);

        if (error) throw error;

        return {
            success: true,
            message: 'Curso eliminado exitosamente'
        };

    } catch (error) {
        console.error('Error al eliminar curso:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al eliminar curso'
        };
    }
}

/**
 * Obtiene los módulos de un curso ordenados
 * @param {string} cursoId - ID del curso
 * @returns {Promise<Object>} Lista de módulos
 */
async function obtenerModulosCurso(cursoId) {
    const supabase = getSupabase();

    try {
        const { data: modulos, error } = await supabase
            .from('modulos')
            .select('*')
            .eq('curso_id', cursoId)
            .order('orden', { ascending: true });

        if (error) throw error;

        // Para cada módulo, obtener actividades
        for (const modulo of modulos || []) {
            const { data: actividades } = await supabase
                .from('actividades')
                .select('id, titulo, tipo, requisito_aprobacion')
                .eq('modulo_id', modulo.id);

            modulo.actividades = actividades || [];
        }

        return {
            success: true,
            modulos: modulos || []
        };

    } catch (error) {
        console.error('Error al obtener módulos:', error);
        return {
            success: false,
            error: error.message,
            modulos: []
        };
    }
}

/**
 * Crea un nuevo módulo en un curso
 * @param {Object} datos - Datos del módulo
 * @returns {Promise<Object>} Módulo creado
 */
async function crearModulo(datos) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== ROLES.EDUCADOR) {
        return {
            success: false,
            message: 'No tienes permisos para crear módulos'
        };
    }

    try {
        // Determinar tipo de contenido
        let contenidoTipo = 'texto';
        let contenidoUrl = null;

        if (datos.url_video) {
            contenidoTipo = 'video';
            contenidoUrl = datos.url_video;
        } else if (datos.url_pdf) {
            contenidoTipo = 'pdf';
            contenidoUrl = datos.url_pdf;
        } else if (datos.contenido_url) {
            contenidoUrl = datos.contenido_url;
            contenidoTipo = datos.contenido_tipo || 'texto';
        }

        const moduloData = {
            curso_id: datos.curso_id,
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            orden: datos.orden || 0,
            contenido_texto: datos.contenido_texto || null,
            contenido_tipo: contenidoTipo,
            contenido_url: contenidoUrl,
            html_embed: datos.html_embed || null
        };

        const { data: modulo, error } = await supabase
            .from('modulos')
            .insert(moduloData)
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            modulo: modulo,
            message: 'Módulo creado exitosamente'
        };

    } catch (error) {
        console.error('Error al crear módulo:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al crear módulo'
        };
    }
}

/**
 * Actualiza un módulo existente
 * @param {string} moduloId - ID del módulo
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<Object>} Módulo actualizado
 */
async function actualizarModulo(moduloId, datos) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== ROLES.EDUCADOR) {
        return {
            success: false,
            message: 'No tienes permisos para editar módulos'
        };
    }

    try {
        // Filtrar solo campos válidos de la tabla modulos
        const camposValidos = ['titulo', 'descripcion', 'orden', 'contenido_texto', 'contenido_tipo', 'contenido_url', 'html_embed'];
        const datosLimpios = {};

        for (const campo of camposValidos) {
            if (datos[campo] !== undefined) {
                datosLimpios[campo] = datos[campo];
            }
        }

        // Convertir campos antiguos a nuevos si existen
        if (datos.url_video) {
            datosLimpios.contenido_tipo = 'video';
            datosLimpios.contenido_url = datos.url_video;
        } else if (datos.url_pdf) {
            datosLimpios.contenido_tipo = 'pdf';
            datosLimpios.contenido_url = datos.url_pdf;
        }

        const { data: modulo, error } = await supabase
            .from('modulos')
            .update(datosLimpios)
            .eq('id', moduloId)
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            modulo: modulo,
            message: 'Módulo actualizado exitosamente'
        };

    } catch (error) {
        console.error('Error al actualizar módulo:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al actualizar módulo'
        };
    }
}

/**
 * Crea una actividad/quiz en un módulo
 * @param {string} moduloId - ID del módulo
 * @param {Object} datos - Datos de la actividad
 * @returns {Promise<Object>} Actividad creada
 */
async function crearActividad(moduloId, datos) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== ROLES.EDUCADOR) {
        return {
            success: false,
            message: 'No tienes permisos para crear actividades'
        };
    }

    try {
        const actividadData = {
            modulo_id: moduloId,
            titulo: datos.titulo,
            tipo: datos.tipo || TIPOS_ACTIVIDAD.QUIZ,
            requisito_aprobacion: datos.requisito_aprobacion || APP_CONFIG.PORCENTAJE_MINIMO_APROBACION
        };

        const { data: actividad, error } = await supabase
            .from('actividades')
            .insert(actividadData)
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            actividad: actividad,
            message: 'Actividad creada exitosamente'
        };

    } catch (error) {
        console.error('Error al crear actividad:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al crear actividad'
        };
    }
}

/**
 * Crea una pregunta para una actividad
 * @param {string} actividadId - ID de la actividad
 * @param {Object} datos - Datos de la pregunta
 * @returns {Promise<Object>} Pregunta creada
 */
async function crearPregunta(actividadId, datos) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== ROLES.EDUCADOR) {
        return {
            success: false,
            message: 'No tienes permisos para crear preguntas'
        };
    }

    try {
        const preguntaData = {
            actividad_id: actividadId,
            pregunta: datos.pregunta,
            opciones: datos.opciones, // Array de objetos {texto, correcta}
            orden: datos.orden
        };

        const { data: pregunta, error } = await supabase
            .from('preguntas')
            .insert(preguntaData)
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            pregunta: pregunta,
            message: 'Pregunta creada exitosamente'
        };

    } catch (error) {
        console.error('Error al crear pregunta:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al crear pregunta'
        };
    }
}

/**
 * Obtiene las preguntas de una actividad
 * @param {string} actividadId - ID de la actividad
 * @returns {Promise<Object>} Lista de preguntas
 */
async function obtenerPreguntasActividad(actividadId) {
    const supabase = getSupabase();

    try {
        const { data: preguntas, error } = await supabase
            .from('preguntas')
            .select('*')
            .eq('actividad_id', actividadId)
            .order('orden', { ascending: true });

        if (error) throw error;

        return {
            success: true,
            preguntas: preguntas || []
        };

    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        return {
            success: false,
            error: error.message,
            preguntas: []
        };
    }
}

/**
 * Inscribe a un funcionario en un curso
 * @param {string} cursoId - ID del curso
 * @param {string} funcionarioId - ID del funcionario (opcional, usa el actual)
 * @returns {Promise<Object>} Inscripción creada
 */
async function inscribirseCurso(cursoId, funcionarioId = null) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        return {
            success: false,
            message: 'Debes iniciar sesión'
        };
    }

    const idFuncionario = funcionarioId || usuario.id;

    try {
        // Verificar si ya está inscrito
        const { data: existente } = await supabase
            .from('inscripciones')
            .select('id')
            .eq('funcionario_id', idFuncionario)
            .eq('curso_id', cursoId)
            .single();

        if (existente) {
            return {
                success: false,
                message: 'Ya estás inscrito en este curso'
            };
        }

        const inscripcionData = {
            funcionario_id: idFuncionario,
            curso_id: cursoId,
            porcentaje_avance: 0,
            aprobado: false
        };

        const { data: inscripcion, error } = await supabase
            .from('inscripciones')
            .insert(inscripcionData)
            .select()
            .single();

        if (error) throw error;

        return {
            success: true,
            inscripcion: inscripcion,
            message: 'Inscripción exitosa'
        };

    } catch (error) {
        console.error('Error al inscribirse:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al inscribirse en el curso'
        };
    }
}

/**
 * Obtiene los cursos en los que un funcionario está inscrito
 * @param {string} funcionarioId - ID del funcionario (opcional)
 * @returns {Promise<Object>} Lista de inscripciones
 */
async function obtenerCursosInscritos(funcionarioId = null) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        return {
            success: false,
            message: 'Debes iniciar sesión',
            inscripciones: []
        };
    }

    const idFuncionario = funcionarioId || usuario.id;

    try {
        const { data: inscripciones, error } = await supabase
            .from('inscripciones')
            .select(`
                *,
                curso:cursos(
                    *,
                    educador:usuarios!educador_id(nombre_completo)
                )
            `)
            .eq('funcionario_id', idFuncionario)
            .order('fecha_inscripcion', { ascending: false });

        if (error) throw error;

        return {
            success: true,
            inscripciones: inscripciones || []
        };

    } catch (error) {
        console.error('Error al obtener cursos inscritos:', error);
        return {
            success: false,
            error: error.message,
            inscripciones: []
        };
    }
}

/**
 * Obtiene todos los cursos creados por un educador
 * @param {string} educadorId - ID del educador (opcional)
 * @returns {Promise<Object>} Lista de cursos
 */
async function obtenerCursosEducador(educadorId = null) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        return {
            success: false,
            message: 'Debes iniciar sesión',
            cursos: []
        };
    }

    const idEducador = educadorId || usuario.id;

    try {
        const { data: cursos, error } = await supabase
            .from('cursos')
            .select('*')
            .eq('educador_id', idEducador)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return {
            success: true,
            cursos: cursos || []
        };

    } catch (error) {
        console.error('Error al obtener cursos del educador:', error);
        return {
            success: false,
            error: error.message,
            cursos: []
        };
    }
}

/**
 * Envía las respuestas de una actividad y genera calificación
 * @param {string} actividadId - ID de la actividad
 * @param {Object} respuestas - Objeto {preguntaId: indiceOpcion}
 * @param {string} inscripcionId - ID de la inscripción
 */
async function enviarRespuestasActividad(actividadId, respuestas, inscripcionId) {
    const supabase = getSupabase();

    try {
        // 1. Obtener la actividad y sus preguntas con respuestas correctas
        const { data: actividad, error: errorAct } = await supabase
            .from('actividades')
            .select(`
                *,
                preguntas (*)
            `)
            .eq('id', actividadId)
            .single();

        if (errorAct) throw errorAct;

        // 2. Calcular calificación
        let preguntasCorrectas = 0;
        const totalPreguntas = actividad.preguntas.length;

        actividad.preguntas.forEach(pregunta => {
            const respuestaUsuario = respuestas[pregunta.id];
            const opciones = pregunta.opciones;

            // Encontrar índice de la opción correcta
            const indiceCorrecto = opciones.findIndex(op => op.correcta === true);

            if (respuestaUsuario === indiceCorrecto) {
                preguntasCorrectas++;
            }
        });

        const calificacion = Math.round((preguntasCorrectas / totalPreguntas) * 100);
        const aprobada = calificacion >= actividad.requisito_aprobacion;

        // 3. Guardar respuesta
        const respuestaData = {
            inscripcion_id: inscripcionId,
            actividad_id: actividadId,
            respuestas: respuestas,
            calificacion: calificacion,
            aprobada: aprobada,
            fecha_respuesta: new Date()
        };

        const { error: errorResp } = await supabase
            .from('respuestas_actividades')
            .upsert(respuestaData); // Upsert para permitir reintentos

        if (errorResp) throw errorResp;

        // 4. Si aprobó, marcar módulo como completado
        if (aprobada) {
            await marcarModuloCompletado(inscripcionId, actividad.modulo_id);
            await verificarProgresoCurso(inscripcionId);
        }

        return {
            success: true,
            calificacion: calificacion,
            aprobada: aprobada,
            message: aprobada ?
                `¡Felicitaciones! Aprobaste con ${calificacion}%` :
                `Obtuviste ${calificacion}%. Necesitas ${actividad.requisito_aprobacion}% para aprobar. Inténtalo de nuevo.`
        };

    } catch (error) {
        console.error('Error al enviar respuestas:', error);
        return {
            success: false,
            message: 'Error al enviar respuestas: ' + error.message
        };
    }
}

/**
 * Marca un módulo como completado
 */
async function marcarModuloCompletado(inscripcionId, moduloId) {
    const supabase = getSupabase();

    try {
        await supabase
            .from('modulos_completados')
            .upsert({
                inscripcion_id: inscripcionId,
                modulo_id: moduloId,
                fecha_completado: new Date()
            }, { onConflict: 'inscripcion_id, modulo_id' });
    } catch (error) {
        console.error('Error al marcar módulo:', error);
    }
}

/**
 * Verifica el progreso del curso y genera certificado si corresponde
 */
async function verificarProgresoCurso(inscripcionId) {
    const supabase = getSupabase();

    try {
        // 1. Obtener inscripción y curso
        const { data: inscripcion } = await supabase
            .from('inscripciones')
            .select('*, curso:cursos(*, modulos(id))')
            .eq('id', inscripcionId)
            .single();

        if (!inscripcion) return;

        const totalModulos = inscripcion.curso.modulos.length;

        // 2. Contar módulos completados
        const { count, error } = await supabase
            .from('modulos_completados')
            .select('*', { count: 'exact', head: true })
            .eq('inscripcion_id', inscripcionId);

        if (error) throw error;

        // 3. Calcular porcentaje
        const porcentaje = totalModulos > 0 ? Math.round((count / totalModulos) * 100) : 0;
        const aprobado = porcentaje === 100;

        // 4. Actualizar inscripción
        await supabase
            .from('inscripciones')
            .update({
                porcentaje_avance: porcentaje,
                aprobado: aprobado,
                fecha_finalizacion: aprobado ? new Date() : null
            })
            .eq('id', inscripcionId);

        // 5. Generar certificado si aprobó
        if (aprobado) {
            await generarCertificado(inscripcionId);
        }

    } catch (error) {
        console.error('Error al verificar progreso:', error);
    }
}

/**
 * Genera el certificado para una inscripción aprobada
 */
async function generarCertificado(inscripcionId) {
    const supabase = getSupabase();

    try {
        // Verificar si ya existe
        const { data: existente } = await supabase
            .from('certificados')
            .select('id')
            .eq('inscripcion_id', inscripcionId)
            .single();

        if (existente) return; // Ya existe

        // Crear certificado
        await supabase
            .from('certificados')
            .insert({
                inscripcion_id: inscripcionId,
                fecha_generacion: new Date()
            });

    } catch (error) {
        console.error('Error al generar certificado:', error);
    }
}
/**
 * Obtiene los estudiantes inscritos en un curso
 * @param {string} cursoId - ID del curso
 * @returns {Promise<Object>} Lista de inscripciones con datos de usuario
 */
async function obtenerEstudiantesCurso(cursoId) {
    const supabase = getSupabase();

    try {
        const { data: inscripciones, error } = await supabase
            .from('inscripciones')
            .select(`
                *,
                funcionario:usuarios!funcionario_id(*)
            `)
            .eq('curso_id', cursoId)
            .order('fecha_inscripcion', { ascending: false });

        if (error) throw error;

        return {
            success: true,
            inscripciones: inscripciones || []
        };

    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        return {
            success: false,
            error: error.message,
            inscripciones: []
        };
    }
}
