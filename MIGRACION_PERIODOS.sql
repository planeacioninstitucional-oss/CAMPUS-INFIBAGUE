-- ============================================
-- MIGRACIÓN: Separar progreso y certificados por periodo (2026-1 / 2026-2)
-- Ejecutar en SQL Editor de Supabase
-- ============================================
-- Objetivo: que la inducción/reinducción de cada semestre quede registrada
-- por separado (no se sobrescribe al iniciar el siguiente periodo), sin
-- mover ni renombrar ningún archivo del sitio ya desplegado.

-- 1. user_module_progress (Architecture C - módulos de inducción actuales)
ALTER TABLE public.user_module_progress
    ADD COLUMN IF NOT EXISTS periodo TEXT NOT NULL DEFAULT '2026-2';

ALTER TABLE public.user_module_progress
    DROP CONSTRAINT IF EXISTS user_module_progress_user_id_module_name_key;
ALTER TABLE public.user_module_progress
    ADD CONSTRAINT user_module_progress_user_id_module_name_periodo_key
    UNIQUE (user_id, module_name, periodo);

-- 2. progreso_modulos (legacy, aún escrito por guardarProgreso())
ALTER TABLE public.progreso_modulos
    ADD COLUMN IF NOT EXISTS periodo TEXT NOT NULL DEFAULT '2026-2';

ALTER TABLE public.progreso_modulos
    DROP CONSTRAINT IF EXISTS progreso_modulos_usuario_modulo_key;
ALTER TABLE public.progreso_modulos
    ADD CONSTRAINT progreso_modulos_usuario_modulo_periodo_key
    UNIQUE (usuario, modulo, periodo);

-- 3. certificados (ya tiene user_id/tipo de la migración anterior)
ALTER TABLE public.certificados
    ADD COLUMN IF NOT EXISTS periodo TEXT NOT NULL DEFAULT '2026-2';

ALTER TABLE public.certificados
    DROP CONSTRAINT IF EXISTS certificados_user_tipo_key;
ALTER TABLE public.certificados
    ADD CONSTRAINT certificados_user_tipo_periodo_key
    UNIQUE (user_id, tipo, periodo);

-- Índice de apoyo para filtrar/reportar por periodo
CREATE INDEX IF NOT EXISTS idx_user_module_progress_periodo ON public.user_module_progress(periodo);
CREATE INDEX IF NOT EXISTS idx_certificados_periodo ON public.certificados(periodo);
