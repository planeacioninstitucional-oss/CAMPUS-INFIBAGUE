-- ==========================================================
-- CAMPUS INFIBAGUE - ESQUEMA DE CERTIFICADOS Y PROGRESO CLOUD
-- Ejecutar este script en el SQL Editor de Supabase
-- ==========================================================

-- 1. Tabla de Certificados Emitidos
CREATE TABLE IF NOT EXISTS public.certificados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    cedula TEXT NOT NULL,
    nombre_funcionario TEXT NOT NULL,
    tipo_certificado TEXT NOT NULL, -- 'INDUCCION_GENERAL' o 'SST'
    codigo_verificacion TEXT UNIQUE NOT NULL,
    inscripcion_id UUID REFERENCES public.inscripciones(id) ON DELETE SET NULL,
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadatos JSONB DEFAULT '{}'::jsonb
);

-- Si la tabla ya existía con menos columnas, agregamos las que falten
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificados' AND column_name = 'cedula') THEN
        ALTER TABLE public.certificados ADD COLUMN cedula TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificados' AND column_name = 'nombre_funcionario') THEN
        ALTER TABLE public.certificados ADD COLUMN nombre_funcionario TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificados' AND column_name = 'tipo_certificado') THEN
        ALTER TABLE public.certificados ADD COLUMN tipo_certificado TEXT DEFAULT 'INDUCCION_GENERAL';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificados' AND column_name = 'codigo_verificacion') THEN
        ALTER TABLE public.certificados ADD COLUMN codigo_verificacion TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificados' AND column_name = 'usuario_id') THEN
        ALTER TABLE public.certificados ADD COLUMN usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificados' AND column_name = 'metadatos') THEN
        ALTER TABLE public.certificados ADD COLUMN metadatos JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_certificados_cedula ON public.certificados(cedula);
CREATE INDEX IF NOT EXISTS idx_certificados_usuario ON public.certificados(usuario_id);
CREATE INDEX IF NOT EXISTS idx_certificados_codigo ON public.certificados(codigo_verificacion);
CREATE INDEX IF NOT EXISTS idx_certificados_tipo ON public.certificados(tipo_certificado);

-- Habilitar RLS y Políticas
ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Certificados visibles para todos" ON public.certificados;
CREATE POLICY "Certificados visibles para todos"
    ON public.certificados FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Funcionarios pueden generar certificados" ON public.certificados;
CREATE POLICY "Funcionarios pueden generar certificados"
    ON public.certificados FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion de certificados" ON public.certificados;
CREATE POLICY "Permitir actualizacion de certificados"
    ON public.certificados FOR UPDATE
    USING (true);


-- 2. Tabla de Progreso Modular por Usuario (user_module_progress)
CREATE TABLE IF NOT EXISTS public.user_module_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_step INTEGER DEFAULT 0,
    steps_completed JSONB DEFAULT '[]'::jsonb,
    attempts INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, module_name)
);

CREATE INDEX IF NOT EXISTS idx_user_module_progress_user ON public.user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_status ON public.user_module_progress(status);

ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir gestion completa de progreso" ON public.user_module_progress;
CREATE POLICY "Permitir gestion completa de progreso"
    ON public.user_module_progress FOR ALL
    USING (true);

-- Notificación de éxito
COMMENT ON TABLE public.certificados IS 'Almacena todos los certificados generados en el Campus Virtual INFIBAGUE';
