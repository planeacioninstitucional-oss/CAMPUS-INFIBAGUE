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
        // Obtener usuario actual (por ahora demo, luego integrar con sistema de login)
        const usuario = "demo@infibague.com"; // TODO: conectar con sistema de autenticación real

        const { data, error } = await supabase
            .from("progreso_modulos")
            .upsert([
                {
                    usuario,
                    modulo,
                    porcentaje,
                    aprobado,
                    actualizado_en: new Date()
                }
            ]);

        if (error) {
            console.error("❌ Error guardando progreso:", error);
            return { success: false, error };
        } else {
            console.log("✅ Progreso guardado:", data);
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
