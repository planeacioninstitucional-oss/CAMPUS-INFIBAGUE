import { supabase } from '@/lib/supabase';

// Nombre del curso (debe coincidir con la base de datos)
const COURSE_NAME = 'Inducción Institucional';
const MODULE_NAME = 'Gestión Humana';

/**
 * Guarda el progreso final del módulo en la base de datos de Supabase.
 * @param {number} calificacion - Calificación obtenida (0-100)
 * @returns {Promise<boolean>} Retorna true si guardó exitosamente.
 */
export const saveModuleProgress = async (calificacion) => {
    try {
        console.log('⏳ Guardando progreso del módulo...', { calificacion });

        // 1. Obtener usuario actual
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('❌ Usuario no autenticado:', authError);
            return false;
        }

        // 2. Obtener ID del curso por nombre
        const { data: curso, error: cursoError } = await supabase
            .from('cursos')
            .select('id')
            .eq('titulo', COURSE_NAME)
            .single();

        if (cursoError || !curso) {
            // Intentar buscar "Inducción" genérico si falla
            console.warn(`Curso '${COURSE_NAME}' no encontrado, buscando 'Inducción'...`);
            const { data: cursoAlt } = await supabase
                .from('cursos')
                .select('id')
                .ilike('titulo', '%Inducción%')
                .limit(1)
                .single();

            if (!cursoAlt) {
                console.error('❌ Curso no encontrado en la base de datos.');
                return false;
            }
            curso = cursoAlt;
        }

        const cursoId = curso.id;

        // 3. Obtener ID del módulo por nombre
        const { data: modulo, error: modError } = await supabase
            .from('modulos')
            .select('id')
            .eq('curso_id', cursoId)
            .ilike('titulo', `%${MODULE_NAME}%`)
            .single();

        if (modError || !modulo) {
            console.error(`❌ Módulo '${MODULE_NAME}' no encontrado para el curso ${cursoId}.`, modError);
            // Si no existe, podríamos intentar crearlo o fallar.
            // Aquí asumimos que EXISTE en la BD.
            return false;
        }

        const moduloId = modulo.id;

        // 4. Obtener o crear inscripción del usuario
        let { data: inscripcion, error: inscError } = await supabase
            .from('inscripciones')
            .select('id, porcentaje_avance')
            .eq('funcionario_id', user.id)
            .eq('curso_id', cursoId)
            .single();

        if (!inscripcion) {
            console.log('⚠️ Inscripción no encontrada, creando nueva...');
            const { data: newInsc, error: createError } = await supabase
                .from('inscripciones')
                .insert({
                    funcionario_id: user.id,
                    curso_id: cursoId,
                    fecha_inscripcion: new Date().toISOString(),
                    porcentaje_avance: 0
                })
                .select('id')
                .single();

            if (createError) {
                console.error('❌ Error creando inscripción:', createError);
                return false;
            }
            inscripcion = newInsc;
        }

        const inscripcionId = inscripcion.id;

        // 5. Registrar módulo completado
        const { error: completeError } = await supabase
            .from('modulos_completados')
            .upsert({
                inscripcion_id: inscripcionId,
                modulo_id: moduloId,
                fecha_completado: new Date().toISOString()
            }, { onConflict: 'inscripcion_id, modulo_id' });

        if (completeError) {
            console.error('❌ Error marcando módulo completado:', completeError);
            return false;
        }

        // 6. Actualizar progreso general del curso
        // Calculamos cuántos módulos tiene el curso y cuántos completó el usuario
        const { count: totalModulos } = await supabase
            .from('modulos')
            .select('*', { count: 'exact', head: true })
            .eq('curso_id', cursoId);

        const { count: completados } = await supabase
            .from('modulos_completados')
            .select('*', { count: 'exact', head: true })
            .eq('inscripcion_id', inscripcionId);

        const nuevoAvance = totalModulos > 0 ? Math.round((completados / totalModulos) * 100) : 0;
        const aprobado = nuevoAvance >= 100;

        await supabase
            .from('inscripciones')
            .update({
                porcentaje_avance: nuevoAvance,
                aprobado: aprobado,
                fecha_finalizacion: aprobado ? new Date().toISOString() : null
            })
            .eq('id', inscripcionId);

        // 7. Generar Certificado si completó el curso (100%)
        if (aprobado) {
            console.log('🎓 Curso completado! Generando certificado...');
            await supabase
                .from('certificados')
                .upsert({
                    inscripcion_id: inscripcionId,
                    fecha_generacion: new Date().toISOString()
                }, { onConflict: 'inscripcion_id' });
        }

        console.log('✅ Progreso guardado exitosamente.');
        return true;

    } catch (error) {
        console.error('❌ Error inesperado guardando progreso:', error);
        return false;
    }
};
