-- ============================================
-- INSTRUCCIONES PARA CREAR EL CURSO DE INDUCCIÓN EN SUPABASE
-- ============================================

-- PASO 1: Crear el curso
-- ⚠️ NOTA: Reemplaza 'TU_EDUCADOR_ID' con el ID real de un educador en tu base de datos

INSERT INTO cursos (
  titulo, 
  descripcion, 
  oficina_tema, 
  educador_id,
  activo
) VALUES (
  'Inducción y Reinducción INFIBAGUÉ 2026',
  'Programa completo de inducción institucional que cubre Atención al Ciudadano, Gestión Humana, Gestión Ambiental, Seguridad y Salud en el Trabajo, y Planeación Estratégica. El certificado se genera al completar los 5 módulos.',
  'Gestión Humana',
  'TU_EDUCADOR_ID',  -- ⚠️ CAMBIAR ESTO
  true
);

-- PASO 2: Obtener el ID del curso recién creado
-- Ejecuta esta consulta para copiar el ID:
SELECT id, titulo FROM cursos WHERE titulo LIKE '%Inducción%' ORDER BY created_at DESC LIMIT 1;

-- ⚠️ COPIA EL ID DEL CURSO Y REEMPLAZA 'ID_DEL_CURSO' EN LOS SIGUIENTES COMANDOS

-- PASO 3: Crear los 5 módulos

-- Módulo 1: Atención al Ciudadano (CON CONTENIDO COMPLETO)
INSERT INTO modulos (curso_id, titulo, contenido, orden, tipo_contenido, descripcion)
VALUES (
  'ID_DEL_CURSO',  -- ⚠️ CAMBIAR ESTO
  'Atención al Ciudadano',
  '../cursos/induccion-atencion-ciudadano.html',
  1,
  'embed',
  'Aprende los fundamentos de la atención al ciudadano, manejo de PQRSD, canales de comunicación y protocolos institucionales.'
);

-- Módulo 2: Gestión Humana (PLACEHOLDER)
INSERT INTO modulos (curso_id, titulo, contenido, orden, tipo_contenido, descripcion)
VALUES (
  'ID_DEL_CURSO',  -- ⚠️ CAMBIAR ESTO
  'Gestión Humana',
  '../cursos/induccion-gestion-humana.html',
  2,
  'embed',
  'Políticas de gestión del talento humano, evaluación de desempeño, derechos y deberes del servidor público.'
);

-- Módulo 3: Gestión Ambiental (PLACEHOLDER)
INSERT INTO modulos (curso_id, titulo, contenido, orden, tipo_contenido, descripcion)
VALUES (
  'ID_DEL_CURSO',  -- ⚠️ CAMBIAR ESTO
  'Gestión Ambiental',
  '../cursos/induccion-gestion-ambiental.html',
  3,
  'embed',
  'Políticas ambientales de INFIBAGUÉ, manejo de residuos, uso eficiente de recursos y responsabilidad ecológica.'
);

-- Módulo 4: Seguridad y Salud en el Trabajo (PLACEHOLDER)
INSERT INTO modulos (curso_id, titulo, contenido, orden, tipo_contenido, descripcion)
VALUES (
  'ID_DEL_CURSO',  -- ⚠️ CAMBIAR ESTO
  'Seguridad y Salud en el Trabajo',
  '../cursos/induccion-sst.html',
  4,
  'embed',
  'Normas de seguridad laboral, prevención de riesgos, uso de EPP, protocolos de emergencia y autocuidado.'
);

-- Módulo 5: Planeación Estratégica (PLACEHOLDER - ÚLTIMO MÓDULO)
INSERT INTO modulos (curso_id, titulo, contenido, orden, tipo_contenido, descripcion)
VALUES (
  'ID_DEL_CURSO',  -- ⚠️ CAMBIAR ESTO
  'Planeación Estratégica',
  '../cursos/induccion-planeacion.html',
  5,
  'embed',
  'Introducción a la planeación estratégica institucional, objetivos, metas, indicadores y alineación con la misión.'
);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que el curso y módulos se crearon correctamente:
SELECT 
  c.titulo as curso,
  m.orden,
  m.titulo as modulo,
  m.tipo_contenido
FROM cursos c
LEFT JOIN modulos m ON c.id = m.curso_id
WHERE c.titulo LIKE '%Inducción%'
ORDER BY m.orden;

-- Deberías ver 5 módulos en orden del 1 al 5

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. El certificado NO se genera al completar módulos individuales
2. El certificado se genera SOLO al completar los 5 módulos
3. Los módulos 2-5 son placeholders que aprueban automáticamente
4. Cuando agregues contenido a los módulos 2-5, reemplaza los archivos HTML

FLUJO DEL ESTUDIANTE:
- Se inscribe en el curso "Inducción y Reinducción INFIBAGUÉ 2026"
- Completa Módulo 1 (Atención al Ciudadano) con evaluación
- Completa Módulos 2-5 (hacen clic en "Continuar")
- Al completar el módulo 5, puede descargar el certificado

SISTEMA DE CERTIFICACIÓN:
- El curso está integrado con el sistema de certificados existente
- El certificado se descarga desde: funcionario/certificados.html
- Usa la plantilla: assets/plantilla-certificado.jpg
*/

-- ============================================
-- FIN DE INSTRUCCIONES
-- ============================================
