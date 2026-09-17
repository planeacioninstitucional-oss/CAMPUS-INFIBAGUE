-- ============================================
-- MIGRACIÓN: Certificados en Supabase Storage
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- 1. Agregar columnas nuevas a la tabla certificados existente
ALTER TABLE public.certificados
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS tipo TEXT, -- 'sst' | 'induccion_completa'
    ADD COLUMN IF NOT EXISTS archivo_url TEXT;

-- 2. Constraint para que el upsert (user_id, tipo) funcione (1 certificado vigente por tipo/usuario)
ALTER TABLE public.certificados
    DROP CONSTRAINT IF EXISTS certificados_user_tipo_key;
ALTER TABLE public.certificados
    ADD CONSTRAINT certificados_user_tipo_key UNIQUE (user_id, tipo);

-- 3. Crear el bucket de Storage para certificados (privado por defecto, con policies abajo)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificados', 'certificados', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Policies del bucket: cada usuario sube/lee solo su propia carpeta (path = user_id/...)
CREATE POLICY "Certificados: lectura pública"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'certificados');

CREATE POLICY "Certificados: usuario sube el suyo"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'certificados');

CREATE POLICY "Certificados: usuario actualiza el suyo"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'certificados');
