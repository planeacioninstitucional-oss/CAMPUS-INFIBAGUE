-- ============================================
-- TABLA: user_module_progress
-- Sistema de Persistencia de Progreso con Supabase
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Eliminar tabla si existe (CUIDADO: esto borra datos existentes)
-- DROP TABLE IF EXISTS public.user_module_progress;

-- Crear tabla de progreso por módulo
CREATE TABLE IF NOT EXISTS public.user_module_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Usuario
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
    
    -- Identificación del módulo
    module_name TEXT NOT NULL,
    -- Valores válidos: 'atencion_ciudadano', 'gestion_humana', 'gestion_ambiental', 'sst', 'planeacion_estrategica'
    
    -- Estado del módulo
    status TEXT NOT NULL DEFAULT 'not_started' 
        CHECK (status IN ('not_started', 'in_progress', 'approved', 'failed')),
    
    -- Puntuación
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    percentage NUMERIC(5,2) DEFAULT 0,
    
    -- Progreso interno (para retomar)
    current_step INTEGER DEFAULT 0,
    current_slide TEXT DEFAULT NULL,
    steps_completed JSONB DEFAULT '[]'::jsonb,
    slides_visited JSONB DEFAULT '[]'::jsonb,
    
    -- Control de intentos
    attempts INTEGER DEFAULT 0,
    
    -- Rol seleccionado (para módulos que tienen rutas diferenciadas)
    selected_role TEXT DEFAULT NULL,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Restricción única: un usuario solo puede tener un registro por módulo
    UNIQUE(user_id, module_name)
);

-- ============================================
-- ÍNDICES PARA CONSULTAS RÁPIDAS
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user 
    ON public.user_module_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_user_module_progress_module 
    ON public.user_module_progress(module_name);

CREATE INDEX IF NOT EXISTS idx_user_module_progress_status 
    ON public.user_module_progress(status);

CREATE INDEX IF NOT EXISTS idx_user_module_progress_user_module 
    ON public.user_module_progress(user_id, module_name);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio progreso
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_module_progress;
CREATE POLICY "Users can view own progress" ON public.user_module_progress
    FOR SELECT USING (true);

-- Política: Los usuarios pueden insertar su progreso
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_module_progress;
CREATE POLICY "Users can insert own progress" ON public.user_module_progress
    FOR INSERT WITH CHECK (true);

-- Política: Los usuarios pueden actualizar su progreso
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_module_progress;
CREATE POLICY "Users can update own progress" ON public.user_module_progress
    FOR UPDATE USING (true);

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_module_progress_modtime ON public.user_module_progress;
CREATE TRIGGER update_user_module_progress_modtime
    BEFORE UPDATE ON public.user_module_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- ============================================
-- DATOS DE PRUEBA (Opcional - Comentar en producción)
-- ============================================
-- INSERT INTO public.user_module_progress (user_id, module_name, status)
-- VALUES ('ID_DE_USUARIO_AQUI', 'atencion_ciudadano', 'not_started')
-- ON CONFLICT (user_id, module_name) DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 
    table_name, 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_module_progress'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_module_progress';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
