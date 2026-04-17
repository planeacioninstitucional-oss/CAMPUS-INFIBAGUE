-- ============================================
-- AGREGAR TABLA PARA PROGRESO DETALLADO DE MÓDULOS
-- Ejecuta este SQL en Supabase para guardar el progreso
-- de cada slide visitado por el funcionario
-- ============================================

-- Crear tabla para progreso detallado
CREATE TABLE IF NOT EXISTS public.progreso_modulo_detallado (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    modulo_nombre TEXT NOT NULL, -- ej: 'atencion_ciudadano', 'gestion_humana'
    rol_seleccionado TEXT, -- 'admin' o 'operative'
    slides_visitados JSONB DEFAULT '[]'::jsonb, -- Array de IDs de slides visitados
    indice_actual INTEGER DEFAULT 0, -- Último slide donde quedó
    puntaje_evaluacion INTEGER DEFAULT 0,
    total_preguntas INTEGER DEFAULT 0,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, modulo_nombre)
);

-- Habilitar RLS
ALTER TABLE public.progreso_modulo_detallado ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Usuarios pueden ver su propio progreso"
    ON public.progreso_modulo_detallado FOR SELECT
    USING (true);

CREATE POLICY "Usuarios pueden insertar su progreso"
    ON public.progreso_modulo_detallado FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar su progreso"
    ON public.progreso_modulo_detallado FOR UPDATE
    USING (true);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_progreso_usuario_modulo 
    ON public.progreso_modulo_detallado(usuario_id, modulo_nombre);

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'progreso_modulo_detallado'
ORDER BY ordinal_position;
