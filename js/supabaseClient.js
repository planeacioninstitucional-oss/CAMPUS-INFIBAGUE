// ============================================
// CONFIGURACIÓN GLOBAL SUPABASE - INFIBAGUÉ
// ============================================
const SUPABASE_URL = "https://bsonmzabqkkeoqnlgthe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzb25temFicWtrZW9xbmxndGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTA4OTEsImV4cCI6MjA4NTI2Njg5MX0.Utt46LUI20nuT3NZDnS_jgyhgBcr3llgFBRCVdJRIgs";

// Cliente Supabase global
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ============================================
// FUNCIÓN GLOBAL PARA GUARDAR PROGRESO
// ============================================
async function guardarProgreso(modulo, porcentaje, aprobado) {
    try {
        // 1. Intentar obtener usuario desde Auth de Supabase (si se usa Auth nativo)
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        
        // 2. Fallback: Obtener desde localStorage (nuestro sistema de auth personalizado)
        const localData = JSON.parse(localStorage.getItem('usuario') || '{}');
        const usuarioId = user ? user.id : (localData.id || null);
        const cedula = user ? user.email : (localData.cedula || "demo_invitado");

        const { data, error } = await supabase
            .from("progreso_modulos")
            .upsert([
                {
                    usuario: cedula,
                    user_id: usuarioId,
                    modulo: modulo,
                    porcentaje: porcentaje,
                    aprobado: aprobado,
                    completado: porcentaje === 100,
                    actualizado_en: new Date()
                }
            ], { onConflict: 'usuario, modulo' });

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
if (typeof window !== 'undefined') {
    window.supabase = supabase;
    window.guardarProgreso = guardarProgreso;
}
