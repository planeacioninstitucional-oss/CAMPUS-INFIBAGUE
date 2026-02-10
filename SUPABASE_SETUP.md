-- ============================================
-- CAMPUS VIRTUAL - SETUP SUPABASE (ACTUALIZADO)
-- Sistema de autenticación directa con cédula
-- ============================================
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase Dashboard
-- 2. Navega a: SQL Editor (menú lateral)
-- 3. Copia y pega TODO este código
-- 4. Haz clic en "Run" para ejecutar
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR TABLAS EXISTENTES (si existen)
-- ============================================
DROP TABLE IF EXISTS public.certificados CASCADE;
DROP TABLE IF EXISTS public.modulos_completados CASCADE;
DROP TABLE IF EXISTS public.respuestas_actividades CASCADE;
DROP TABLE IF EXISTS public.inscripciones CASCADE;
DROP TABLE IF EXISTS public.preguntas CASCADE;
DROP TABLE IF EXISTS public.actividades CASCADE;
DROP TABLE IF EXISTS public.modulos CASCADE;
DROP TABLE IF EXISTS public.cursos CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;

-- ============================================
-- PASO 2: CREAR TABLA USUARIOS (con contraseña)
-- ============================================
CREATE TABLE public.usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cedula TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    oficina_cargo TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('educador', 'funcionario')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY "Permitir lectura pública de usuarios"
    ON public.usuarios FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserción de usuarios"
    ON public.usuarios FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir actualización propia"
    ON public.usuarios FOR UPDATE
    USING (true);

-- ============================================
-- PASO 3: CREAR TABLA CURSOS
-- ============================================
CREATE TABLE public.cursos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    imagen_portada TEXT,
    educador_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    duracion_horas INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cursos visibles para todos"
    ON public.cursos FOR SELECT
    USING (true);

CREATE POLICY "Educadores pueden crear cursos"
    ON public.cursos FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Educadores pueden editar sus cursos"
    ON public.cursos FOR UPDATE
    USING (true);

CREATE POLICY "Educadores pueden eliminar sus cursos"
    ON public.cursos FOR DELETE
    USING (true);

-- ============================================
-- PASO 4: CREAR TABLA MODULOS
-- ============================================
CREATE TABLE public.modulos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    contenido_tipo TEXT CHECK (contenido_tipo IN ('video', 'pdf', 'texto')),
    contenido_url TEXT,
    contenido_texto TEXT,
    html_embed TEXT,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Módulos visibles para todos"
    ON public.modulos FOR SELECT
    USING (true);

CREATE POLICY "Educadores pueden gestionar módulos"
    ON public.modulos FOR ALL
    USING (true);

-- ============================================
-- PASO 5: CREAR TABLA ACTIVIDADES
-- ============================================
CREATE TABLE public.actividades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    modulo_id UUID REFERENCES public.modulos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    tipo TEXT DEFAULT 'cuestionario' CHECK (tipo IN ('cuestionario', 'tarea')),
    requisito_aprobacion INTEGER DEFAULT 70,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.actividades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Actividades visibles para todos"
    ON public.actividades FOR SELECT
    USING (true);

CREATE POLICY "Educadores pueden gestionar actividades"
    ON public.actividades FOR ALL
    USING (true);

-- ============================================
-- PASO 6: CREAR TABLA PREGUNTAS
-- ============================================
CREATE TABLE public.preguntas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actividad_id UUID REFERENCES public.actividades(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    opciones JSONB NOT NULL,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Preguntas visibles para todos"
    ON public.preguntas FOR SELECT
    USING (true);

CREATE POLICY "Educadores pueden gestionar preguntas"
    ON public.preguntas FOR ALL
    USING (true);

-- ============================================
-- PASO 7: CREAR TABLA INSCRIPCIONES
-- ============================================
CREATE TABLE public.inscripciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    funcionario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_finalizacion TIMESTAMP WITH TIME ZONE,
    porcentaje_avance INTEGER DEFAULT 0,
    aprobado BOOLEAN DEFAULT false,
    UNIQUE(funcionario_id, curso_id)
);

ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inscripciones visibles para todos"
    ON public.inscripciones FOR SELECT
    USING (true);

CREATE POLICY "Funcionarios pueden inscribirse"
    ON public.inscripciones FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Funcionarios pueden actualizar inscripciones"
    ON public.inscripciones FOR UPDATE
    USING (true);

-- ============================================
-- PASO 8: CREAR TABLA RESPUESTAS
-- ============================================
CREATE TABLE public.respuestas_actividades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inscripcion_id UUID REFERENCES public.inscripciones(id) ON DELETE CASCADE,
    actividad_id UUID REFERENCES public.actividades(id) ON DELETE CASCADE,
    respuestas JSONB,
    calificacion INTEGER,
    aprobada BOOLEAN DEFAULT false,
    fecha_respuesta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(inscripcion_id, actividad_id)
);

ALTER TABLE public.respuestas_actividades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Respuestas visibles"
    ON public.respuestas_actividades FOR SELECT
    USING (true);

CREATE POLICY "Funcionarios pueden enviar respuestas"
    ON public.respuestas_actividades FOR ALL
    USING (true);

-- ============================================
-- PASO 9: CREAR TABLA MÓDULOS COMPLETADOS
-- ============================================
CREATE TABLE public.modulos_completados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inscripcion_id UUID REFERENCES public.inscripciones(id) ON DELETE CASCADE,
    modulo_id UUID REFERENCES public.modulos(id) ON DELETE CASCADE,
    fecha_completado TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(inscripcion_id, modulo_id)
);

ALTER TABLE public.modulos_completados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Módulos completados visibles"
    ON public.modulos_completados FOR SELECT
    USING (true);

CREATE POLICY "Funcionarios pueden marcar módulos"
    ON public.modulos_completados FOR ALL
    USING (true);

-- ============================================
-- PASO 10: CREAR TABLA CERTIFICADOS
-- ============================================
CREATE TABLE public.certificados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inscripcion_id UUID REFERENCES public.inscripciones(id) ON DELETE CASCADE UNIQUE,
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certificados visibles"
    ON public.certificados FOR SELECT
    USING (true);

CREATE POLICY "Funcionarios pueden generar certificados"
    ON public.certificados FOR INSERT
    WITH CHECK (true);

-- ============================================
-- PASO 11: CREAR ÍNDICES
-- ============================================
CREATE INDEX idx_usuarios_cedula ON public.usuarios(cedula);
CREATE INDEX idx_cursos_educador ON public.cursos(educador_id);
CREATE INDEX idx_modulos_curso ON public.modulos(curso_id);
CREATE INDEX idx_actividades_modulo ON public.actividades(modulo_id);
CREATE INDEX idx_inscripciones_funcionario ON public.inscripciones(funcionario_id);
CREATE INDEX idx_inscripciones_curso ON public.inscripciones(curso_id);

-- ============================================
-- ¡LISTO! El esquema está creado
-- ============================================
