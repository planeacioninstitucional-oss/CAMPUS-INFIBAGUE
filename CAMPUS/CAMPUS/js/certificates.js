// ============================================
// CAMPUS VIRTUAL - Sistema de Certificados con Supabase
// ============================================

/**
 * Genera un certificado para un curso completado
 * @param {string} inscripcionId - ID de la inscripción
 * @returns {Promise<Object>} Certificado generado
 */
async function generarCertificado(inscripcionId) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        return {
            success: false,
            message: 'Debes iniciar sesión'
        };
    }

    try {
        // Obtener inscripción con curso
        const { data: inscripcion, error: inscError } = await supabase
            .from('inscripciones')
            .select(`
                *,
                curso:cursos(titulo)
            `)
            .eq('id', inscripcionId)
            .single();

        if (inscError) throw new Error('Inscripción no encontrada');

        // Verificar que el curso esté completado
        if (!inscripcion.aprobado || inscripcion.porcentaje_avance < 100) {
            return {
                success: false,
                message: 'Debes completar el curso para obtener el certificado'
            };
        }

        // Verificar si ya existe un certificado
        const { data: existente } = await supabase
            .from('certificados')
            .select('*')
            .eq('inscripcion_id', inscripcionId)
            .single();

        if (existente) {
            return {
                success: true,
                certificado: existente,
                message: 'Certificado ya generado'
            };
        }

        // Generar código único del certificado
        const codigo = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Crear certificado
        const { data: certificado, error: certError } = await supabase
            .from('certificados')
            .insert({
                inscripcion_id: inscripcionId
            })
            .select()
            .single();

        if (certError) throw certError;

        return {
            success: true,
            certificado: certificado,
            message: 'Certificado generado exitosamente'
        };

    } catch (error) {
        console.error('Error al generar certificado:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al generar certificado'
        };
    }
}

/**
 * Obtiene un certificado por ID
 * @param {string} certificadoId - ID del certificado
 * @returns {Promise<Object>} Certificado
 */
async function obtenerCertificado(certificadoId) {
    const supabase = getSupabase();

    try {
        const { data: certificado, error } = await supabase
            .from('certificados')
            .select(`
                *,
                inscripcion:inscripciones(
                    *,
                    funcionario:usuarios(nombre_completo, cedula),
                    curso:cursos(titulo)
                )
            `)
            .eq('id', certificadoId)
            .single();

        if (error) throw new Error('Certificado no encontrado');

        return {
            success: true,
            certificado: certificado
        };

    } catch (error) {
        console.error('Error al obtener certificado:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Obtiene todos los certificados de un funcionario
 * @param {string} funcionarioId - ID del funcionario (opcional)
 * @returns {Promise<Object>} Lista de certificados
 */
async function obtenerCertificadosFuncionario(funcionarioId = null) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        return {
            success: false,
            message: 'Debes iniciar sesión',
            certificados: []
        };
    }

    const idFuncionario = funcionarioId || usuario.id;

    try {
        const { data: certificados, error } = await supabase
            .from('certificados')
            .select(`
                *,
                inscripcion:inscripciones!inner(
                    funcionario_id,
                    curso:cursos(titulo)
                )
            `)
            .eq('inscripcion.funcionario_id', idFuncionario)
            .order('fecha_generacion', { ascending: false });

        if (error) throw error;

        return {
            success: true,
            certificados: certificados || []
        };

    } catch (error) {
        console.error('Error al obtener certificados:', error);
        return {
            success: false,
            error: error.message,
            certificados: []
        };
    }
}

/**
 * Verifica un certificado por código
 * @param {string} codigo - Código del certificado
 * @returns {Promise<Object>} Datos del certificado
 */
async function verificarCertificado(codigo) {
    const supabase = getSupabase();

    try {
        const { data: certificado, error } = await supabase
            .from('certificados')
            .select(`
                *,
                inscripcion:inscripciones(
                    funcionario:usuarios(nombre_completo, cedula),
                    curso:cursos(titulo)
                )
            `)
            .eq('id', codigo)
            .single();

        if (error || !certificado) {
            return {
                success: false,
                message: 'Certificado no encontrado'
            };
        }

        return {
            success: true,
            valido: true,
            certificado: certificado,
            message: 'Certificado válido'
        };

    } catch (error) {
        console.error('Error al verificar certificado:', error);
        return {
            success: false,
            error: error.message,
            message: 'Error al verificar certificado'
        };
    }
}

/**
 * Descarga un certificado en formato PDF
 * @param {string} inscripcionId - ID de la inscripción
 * @param {string} nombreArchivo - Nombre del archivo PDF
 */
async function descargarCertificado(inscripcionId, nombreArchivo = 'Certificado.pdf') {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    try {
        // Obtener datos de la inscripción con curso
        const { data: inscripcion, error } = await supabase
            .from('inscripciones')
            .select(`
                *,
                curso:cursos(titulo),
                certificado:certificados(*)
            `)
            .eq('id', inscripcionId)
            .single();

        if (error) throw error;

        // Usar jsPDF si está disponible
        if (typeof jspdf !== 'undefined' && jspdf.jsPDF) {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('landscape', 'mm', 'a4');

            // Configurar el certificado
            doc.setFillColor(30, 58, 138);
            doc.rect(10, 10, 277, 190, 'S');
            doc.rect(15, 15, 267, 180, 'S');

            doc.setFontSize(32);
            doc.setTextColor(30, 58, 138);
            doc.text('CERTIFICADO DE FINALIZACIÓN', 148.5, 50, { align: 'center' });

            doc.setFontSize(16);
            doc.setTextColor(60, 60, 60);
            doc.text('Se otorga el presente certificado a:', 148.5, 70, { align: 'center' });

            doc.setFontSize(28);
            doc.setTextColor(0, 0, 0);
            doc.text(usuario.nombre_completo, 148.5, 90, { align: 'center' });

            doc.setFontSize(16);
            doc.setTextColor(60, 60, 60);
            doc.text('Por haber completado satisfactoriamente el curso:', 148.5, 110, { align: 'center' });

            doc.setFontSize(22);
            doc.setTextColor(5, 150, 105);
            doc.text(inscripcion.curso?.titulo || 'Curso', 148.5, 130, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            const fechaEmision = inscripcion.fecha_finalizacion
                ? new Date(inscripcion.fecha_finalizacion).toLocaleDateString('es-ES')
                : new Date().toLocaleDateString('es-ES');
            doc.text(`Fecha de emisión: ${fechaEmision}`, 148.5, 160, { align: 'center' });

            doc.setFontSize(10);
            doc.text(`Código de verificación: ${inscripcionId}`, 148.5, 175, { align: 'center' });

            doc.save(nombreArchivo);
            mostrarNotificacion('Certificado descargado exitosamente', 'success');
        } else {
            // Fallback: mostrar en ventana nueva
            previsualizarCertificado(inscripcionId);
        }

    } catch (error) {
        console.error('Error al descargar certificado:', error);
        mostrarNotificacion('Error al descargar certificado', 'error');
    }
}

/**
 * Previsualiza un certificado en una ventana nueva
 * @param {string} inscripcionId - ID de la inscripción
 */
async function previsualizarCertificado(inscripcionId) {
    const supabase = getSupabase();
    const usuario = obtenerUsuarioActual();

    try {
        const { data: inscripcion, error } = await supabase
            .from('inscripciones')
            .select(`
                *,
                curso:cursos(titulo)
            `)
            .eq('id', inscripcionId)
            .single();

        if (error) throw error;

        const fechaEmision = inscripcion.fecha_finalizacion
            ? new Date(inscripcion.fecha_finalizacion).toLocaleDateString('es-ES')
            : new Date().toLocaleDateString('es-ES');

        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <html>
            <head>
                <title>Certificado - ${inscripcion.curso?.titulo || 'Curso'}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        text-align: center;
                        background: #f5f5f5;
                    }
                    .certificado {
                        border: 5px double #1e3a8a;
                        padding: 60px;
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                    }
                    h1 { color: #1e3a8a; margin-bottom: 30px; font-size: 2.5rem; }
                    .nombre { font-size: 2rem; font-weight: bold; margin: 30px 0; }
                    .curso { font-size: 1.5rem; color: #059669; margin: 30px 0; }
                    .codigo { font-size: 0.9rem; color: #666; margin-top: 40px; }
                    .fecha { margin-top: 30px; color: #666; }
                    @media print {
                        body { background: white; padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="certificado">
                    <h1>CERTIFICADO DE FINALIZACIÓN</h1>
                    <p>Se otorga el presente certificado a:</p>
                    <div class="nombre">${usuario.nombre_completo}</div>
                    <p>C.C. ${usuario.cedula || ''}</p>
                    <p>Por haber completado satisfactoriamente el curso:</p>
                    <div class="curso">${inscripcion.curso?.titulo || 'Curso'}</div>
                    <div class="fecha">Fecha de emisión: ${fechaEmision}</div>
                    <div class="codigo">Código de verificación: ${inscripcionId}</div>
                </div>
                <div class="no-print" style="margin-top: 20px;">
                    <button onclick="window.print()" style="padding: 10px 30px; font-size: 1rem; cursor: pointer;">
                        🖨️ Imprimir
                    </button>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Error al previsualizar certificado:', error);
        mostrarNotificacion('Error al previsualizar certificado', 'error');
    }
}
