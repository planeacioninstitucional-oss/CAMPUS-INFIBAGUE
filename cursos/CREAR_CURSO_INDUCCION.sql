-- ============================================
-- CREAR CURSO DE INDUCCIÓN EN SUPABASE - AUTOMATIZADO
-- ============================================

-- Usamos una transacción anónima (DO block) para capturar el ID automáticamente
DO $$
DECLARE
    new_course_id UUID;
    educador_user_id UUID;
BEGIN
    -- 1. Obtener un ID de educador (cualquiera que exista)
    SELECT id INTO educador_user_id FROM public.usuarios WHERE rol = 'educador' LIMIT 1;
    
    -- Si no hay educador, usar NULL (o podrías lanzar un error)
    -- RAISE NOTICE 'Educador ID encontrado: %', educador_user_id;

    -- 2. Crear el curso y capturar su ID
    INSERT INTO public.cursos (
        titulo, 
        descripcion, 
        educador_id,
        duracion_horas,
        activo
    ) VALUES (
        'Inducción y Reinducción INFIBAGUÉ 2026',
        'Programa completo de inducción institucional que cubre Atención al Ciudadano, Gestión Humana, Gestión Ambiental, Seguridad y Salud en el Trabajo, y Planeación Estratégica. El certificado se genera al completar los 5 módulos.',
        educador_user_id,
        10,
        true
    ) RETURNING id INTO new_course_id;

    -- RAISE NOTICE 'Nuevo Curso ID generado: %', new_course_id;

    -- 3. Crear los 5 módulos usando el ID capturado
    INSERT INTO public.modulos (curso_id, titulo, descripcion, contenido_tipo, contenido_url, orden)
    VALUES 
    (new_course_id, 'Atención al Ciudadano', 'Aprende los fundamentos de la atención al ciudadano, manejo de PQRSD, canales de comunicación y protocolos institucionales.', 'pdf', '../cursos/induccion-atencion-ciudadano.html', 1),
    (new_course_id, 'Gestión Humana', 'Políticas de gestión del talento humano, evaluación de desempeño, derechos y deberes del servidor público.', 'pdf', '../cursos/induccion-gestion-humana.html', 2),
    (new_course_id, 'Gestión Ambiental', 'Políticas ambientales de INFIBAGUÉ, manejo de residuos, uso eficiente de recursos y responsabilidad ecológica.', 'pdf', '../cursos/induccion-gestion-ambiental.html', 3),
    (new_course_id, 'Seguridad y Salud en el Trabajo', 'Normas de seguridad laboral, prevención de riesgos, uso de EPP, protocolos de emergencia y autocuidado.', 'pdf', '../cursos/induccion-sst.html', 4),
    (new_course_id, 'Planeación Estratégica', 'Introducción a la planeación estratégica institucional, objetivos, metas, indicadores y alineación con la misión.', 'pdf', '../cursos/induccion-planeacion.html', 5);

END $$;

-- 4. Verificar resultados (Ejecutar esto DESPUÉS del bloque de arriba si se desea ver)
SELECT 
  c.titulo as curso,
  m.orden,
  m.titulo as modulo
FROM public.cursos c
JOIN public.modulos m ON c.id = m.curso_id
WHERE c.titulo = 'Inducción y Reinducción INFIBAGUÉ 2026'
ORDER BY m.orden;
