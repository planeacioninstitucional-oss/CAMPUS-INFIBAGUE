// ============================================
// CLIENTE LEGACY SUPABASE - usado por guardarProgreso()
// ============================================
// NOTA: no se llama "supabase" - ese nombre ya lo usa el global que crea
// el propio SDK CDN (@supabase/supabase-js), y un const con el mismo
// nombre en otro <script> revienta TODA la página con
// "SyntaxError: Identifier 'supabase' has already been declared".
// Reutiliza las credenciales de config.js si ya está cargado (mismo
// proyecto Supabase) para no redeclarar SUPABASE_URL/SUPABASE_ANON_KEY.
const supabaseClientLegacy = window.supabase.createClient(
    typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : "https://bsonmzabqkkeoqnlgthe.supabase.co",
    typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzb25temFicWtrZW9xbmxndGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTA4OTEsImV4cCI6MjA4NTI2Njg5MX0.Utt46LUI20nuT3NZDnS_jgyhgBcr3llgFBRCVdJRIgs"
);

// ============================================
// FUNCIÓN GLOBAL PARA GUARDAR PROGRESO
// ============================================
async function guardarProgreso(modulo, porcentaje, aprobado) {
    try {
        // 1. Intentar obtener usuario desde Auth de Supabase (si se usa Auth nativo)
        const { data: authData } = await supabaseClientLegacy.auth.getUser();
        const user = authData?.user;
        
        // 2. Fallback: Obtener desde localStorage (nuestro sistema de auth personalizado)
        const localData = JSON.parse(localStorage.getItem('usuario') || '{}');
        const usuarioId = user ? user.id : (localData.id || null);
        const cedula = user ? user.email : (localData.cedula || "demo_invitado");

        const { data, error } = await supabaseClientLegacy
            .from("progreso_modulos")
            .upsert([
                {
                    usuario: cedula,
                    user_id: usuarioId,
                    modulo: modulo,
                    porcentaje: porcentaje,
                    aprobado: aprobado,
                    completado: porcentaje === 100,
                    periodo: typeof getPeriodoActual === 'function' ? getPeriodoActual() : null,
                    actualizado_en: new Date()
                }
            ], { onConflict: 'usuario, modulo, periodo' });

        if (error) {
            console.error("❌ Error guardando progreso:", error);
            return { success: false, error };
        } else {
            console.log("✅ Progreso guardado:", modulo);
            return { success: true, data };
        }
    } catch (err) {
        console.error("❌ Error inesperado guardando progreso:", err);
        return { success: false, error: err };
    }
}

// Exportar para uso global
// NOTA: no reasignar window.supabase aquí - lo usa config.js/getSupabase()
// como referencia al SDK de @supabase/supabase-js para crear su propio cliente.
if (typeof window !== 'undefined') {
    window.guardarProgreso = guardarProgreso;
}
