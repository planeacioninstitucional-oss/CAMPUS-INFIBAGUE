// ============================================
// CAMPUS VIRTUAL - Sistema de Progreso con Supabase (Persistencia Cloud)
// ============================================
// Este archivo maneja toda la persistencia de progreso
// de los módulos de inducción usando Supabase.
// ============================================

/**
 * Orden de los módulos de inducción
 * El acceso es secuencial: cada módulo requiere aprobar el anterior
 */
const MODULOS_ORDEN = [
    'atencion_ciudadano',
    'gestion_humana',
    'gestion_ambiental',
    'sst',
    'planeacion_estrategica'
];

/**
 * Mapeo de nombres de módulos a URLs
 */
const MODULOS_URLS = {
    'atencion_ciudadano': 'induccion-atencion-ciudadano.html',
    'gestion_humana': 'induccion-gestion-humana.html',
    'gestion_ambiental': 'induccion-gestion-ambiental.html',
    'sst': 'induccion-sst.html',
    'planeacion_estrategica': 'induccion-planeacion.html'
};

/**
 * Mapeo de nombres amigables
 */
const MODULOS_NOMBRES = {
    'atencion_ciudadano': 'Atención al Ciudadano',
    'gestion_humana': 'Gestión Humana',
    'gestion_ambiental': 'Gestión Ambiental',
    'sst': 'Seguridad y Salud en el Trabajo',
    'planeacion_estrategica': 'Planeación Estratégica'
};

/**
 * Porcentaje mínimo para aprobar
 */
const PORCENTAJE_APROBACION = 80;

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Obtiene el ID del usuario actual desde localStorage
 * Se usa localStorage para mantener la sesión, pero el ID debe ser UUID v4
 */
function getUserId() {
    try {
        const usuarioStr = localStorage.getItem('usuario');
        if (!usuarioStr) return null;
        const usuario = JSON.parse(usuarioStr);
        return usuario?.id || null;
    } catch (e) {
        console.error('Error obteniendo usuario:', e);
        return null;
    }
}

/**
 * Verifica si el usuario está autenticado
 */
function isUserAuthenticated() {
    return getUserId() !== null;
}

/**
 * Redirige al login si no hay usuario
 */
function requireAuth() {
    if (!isUserAuthenticated()) {
        console.warn('Usuario no autenticado. Redirigiendo a login...');
        window.location.href = '../login.html';
        return false;
    }
    return true;
}

// ============================================
// FUNCIONES DE SUPABASE - PROGRESO
// ============================================

/**
 * Obtiene todo el progreso del usuario desde Supabase
 */
async function getAllProgressFromSupabase() {
    const userId = getUserId();
    if (!userId) return {};

    const supabase = getSupabase();
    try {
        const { data, error } = await supabase
            .from('user_module_progress')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        // Convertir array a objeto indexado por module_name para compatibilidad
        const progressMap = {};
        data.forEach(item => {
            progressMap[item.module_name] = item;
        });

        return progressMap;
    } catch (error) {
        console.error('Error leyendo progreso de Supabase:', error);
        return {};
    }
}

/**
 * Obtiene el progreso de un módulo específico
 */
async function getModuleProgress(moduleName) {
    const userId = getUserId();
    if (!userId) return null;

    const supabase = getSupabase();
    try {
        const { data, error } = await supabase
            .from('user_module_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('module_name', moduleName)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No encontrado
            throw error;
        }

        console.log(`☁️ Progreso cargado desde Supabase para ${moduleName}:`, data);
        return data;
    } catch (error) {
        console.error(`Error obteniendo progreso de ${moduleName}:`, error);
        return null;
    }
}

/**
 * Obtiene todo el progreso del usuario como array
 */
async function getAllUserProgress() {
    const userId = getUserId();
    if (!userId) return [];

    const supabase = getSupabase();
    try {
        const { data, error } = await supabase
            .from('user_module_progress')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error obteniendo todo el progreso:', error);
        return [];
    }
}

/**
 * Guarda o actualiza el progreso de un módulo en Supabase
 */
async function saveModuleProgress(moduleName, progressData) {
    const userId = getUserId();
    if (!userId) {
        console.error('No se puede guardar progreso: Usuario no identificado');
        return false;
    }

    const supabase = getSupabase();

    // Preparar datos para upsert
    const dbData = {
        user_id: userId,
        module_name: moduleName,
        last_activity: new Date().toISOString(),
        ...progressData
    };

    // Mapear campos camelCase a snake_case si es necesario
    if (progressData.totalQuestions !== undefined) dbData.total_questions = progressData.totalQuestions;
    if (progressData.currentStep !== undefined) dbData.current_step = progressData.currentStep;
    if (progressData.slidesVisited !== undefined) dbData.steps_completed = progressData.slidesVisited; // Mapeo a steps_completed jsonb

    // Limpiar campos que no existen en la BD (opcional, pero buena práctica)
    delete dbData.totalQuestions;
    delete dbData.currentStep;
    delete dbData.slidesVisited;

    try {
        const { data, error } = await supabase
            .from('user_module_progress')
            .upsert(dbData, { onConflict: 'user_id, module_name' })
            .select();

        if (error) throw error;

        console.log(`☁️ Progreso guardado en Supabase para ${moduleName}:`, data[0]);
        return true;
    } catch (error) {
        console.error(`Error guardando progreso de ${moduleName}:`, error);
        return false;
    }
}

/**
 * Inicia un módulo (marca como in_progress)
 */
async function startModule(moduleName, selectedRole = null) {
    // Verificar estado actual primero
    const existing = await getModuleProgress(moduleName);

    // Si ya está aprobado, no sobrescribir
    if (existing && existing.status === 'approved') {
        console.log(`✅ Módulo ${moduleName} ya está aprobado en nube`);
        return true;
    }

    // Si ya está en progreso, solo actualizar actividad
    if (existing && existing.status === 'in_progress') {
        return await saveModuleProgress(moduleName, {
            last_activity: new Date().toISOString()
        });
    }

    // Nuevo registro
    const initialData = {
        status: 'in_progress',
        current_step: 0,
        steps_completed: [],
        attempts: (existing?.attempts || 0) + 1,
        started_at: new Date().toISOString()
    };

    // Si hay rol (opcional, no está en la tabla base definida pero se puede guardar en metadata si existiera)
    // Por ahora lo ignoramos o lo metemos en un campo JSONB si extendemos la tabla

    return await saveModuleProgress(moduleName, initialData);
}

/**
 * Actualiza el paso actual de un módulo
 */
async function saveCurrentStep(moduleName, step, slideId = null, slidesVisited = []) {
    return await saveModuleProgress(moduleName, {
        status: 'in_progress',
        current_step: step,
        steps_completed: slidesVisited
    });
}

/**
 * Marca un módulo como aprobado
 */
async function approveModule(moduleName, score, totalQuestions) {
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    if (percentage < PORCENTAJE_APROBACION) {
        console.warn(`Puntuación insuficiente: ${percentage}% (mínimo ${PORCENTAJE_APROBACION}%)`);
        return await saveModuleProgress(moduleName, {
            status: 'failed',
            score: score,
            total_questions: totalQuestions,
            // percentage no está en la tabla, se calcula o se agrega si es necesario
        });
    }

    return await saveModuleProgress(moduleName, {
        status: 'approved',
        score: score,
        total_questions: totalQuestions,
        completed_at: new Date().toISOString()
    });
}

/**
 * Incrementa el número de intentos de un módulo
 */
async function incrementAttempts(moduleName) {
    const progress = await getModuleProgress(moduleName);
    const currentAttempts = progress?.attempts || 0;

    return await saveModuleProgress(moduleName, {
        attempts: currentAttempts + 1,
        status: 'in_progress'
    });
}

// ============================================
// FUNCIONES DE VALIDACIÓN DE ACCESO
// ============================================

/**
 * Obtiene el rol del usuario actual desde localStorage
 */
function getUserRole() {
    try {
        const usuarioStr = localStorage.getItem('usuario');
        if (!usuarioStr) return null;
        const usuario = JSON.parse(usuarioStr);
        return usuario?.rol || null;
    } catch (e) {
        console.error('Error obteniendo rol:', e);
        return null;
    }
}

/**
 * Verifica si el usuario puede acceder a un módulo
 * @returns {Promise<{allowed: boolean, message: string, redirectTo: string}>}
 */
async function canAccessModule(moduleName) {
    // Verificar autenticación
    if (!isUserAuthenticated()) {
        return {
            allowed: false,
            message: 'Debe iniciar sesión para acceder a este módulo.',
            redirectTo: '../login.html'
        };
    }

    // PERMITIR ACCESO TOTAL A EDUCADORES
    const userRole = getUserRole();
    const rolOriginal = localStorage.getItem('rol_original');
    if (userRole === 'educador' || rolOriginal === 'educador') {
        return { allowed: true, message: '', redirectTo: '' };
    }

    // El primer módulo siempre es accesible
    const moduleIndex = MODULOS_ORDEN.indexOf(moduleName);
    if (moduleIndex === 0) {
        return { allowed: true, message: '', redirectTo: '' };
    }

    // Si el módulo no existe en la lista, denegar acceso
    if (moduleIndex === -1) {
        return {
            allowed: false,
            message: 'Módulo no reconocido.',
            redirectTo: MODULOS_URLS[MODULOS_ORDEN[0]]
        };
    }

    // Verificar que el módulo anterior esté aprobado
    const previousModule = MODULOS_ORDEN[moduleIndex - 1];
    const previousProgress = await getModuleProgress(previousModule);

    if (!previousProgress || previousProgress.status !== 'approved') {
        const previousName = MODULOS_NOMBRES[previousModule];
        const redirectUrl = MODULOS_URLS[previousModule] || '../funcionario/dashboard.html';

        return {
            allowed: false,
            message: `Debe completar y aprobar el módulo de "${previousName}" antes de acceder a este módulo.`,
            redirectTo: redirectUrl
        };
    }

    return { allowed: true, message: '', redirectTo: '' };
}

/**
 * Valida el acceso al módulo actual y redirige si es necesario
 */
async function validateModuleAccess(moduleName) {
    console.log(`🔒 Validando acceso para: ${moduleName}`);

    const access = await canAccessModule(moduleName);

    if (!access.allowed) {
        console.warn(`⛔ Acceso denegado a ${moduleName}: ${access.message}`);

        // Protección robusta contra redirecciones undefined
        let targetUrl = access.redirectTo;
        if (!targetUrl || targetUrl === 'undefined') {
            console.error('⚠️ Redirección inválida detectada. Usando fallback al dashboard.');
            targetUrl = '../funcionario/dashboard.html';
        }

        alert(access.message);
        window.location.href = targetUrl;
        return false;
    }

    console.log(`✅ Acceso permitido a ${moduleName}`);
    return true;
}

/**
 * Obtiene el siguiente módulo disponible después del actual
 */
function getNextModule(currentModule) {
    const currentIndex = MODULOS_ORDEN.indexOf(currentModule);

    if (currentIndex === -1 || currentIndex >= MODULOS_ORDEN.length - 1) {
        return null;
    }

    const nextModuleName = MODULOS_ORDEN[currentIndex + 1];
    return {
        name: nextModuleName,
        url: MODULOS_URLS[nextModuleName],
        displayName: MODULOS_NOMBRES[nextModuleName]
    };
}

/**
 * Obtiene el primer módulo no aprobado (para retomar)
 */
async function getModuleToResume() {
    const allProgress = await getAllProgressFromSupabase();

    for (const moduleName of MODULOS_ORDEN) {
        const modProgress = allProgress[moduleName];
        if (!modProgress || modProgress.status !== 'approved') {
            return {
                name: moduleName,
                url: MODULOS_URLS[moduleName],
                displayName: MODULOS_NOMBRES[moduleName],
                status: modProgress?.status || 'not_started'
            };
        }
    }

    return null;
}

/**
 * Verifica si el usuario completó toda la inducción
 */
async function isInductionComplete() {
    const allProgress = await getAllProgressFromSupabase();

    for (const moduleName of MODULOS_ORDEN) {
        const modProgress = allProgress[moduleName];
        if (!modProgress || modProgress.status !== 'approved') {
            return false;
        }
    }

    return true;
}

// ============================================
// FUNCIONES DE ROUTE GUARD
// ============================================

/**
 * Valida el acceso al módulo actual y redirige si es necesario
 */
async function validateModuleAccess(moduleName) {
    const access = await canAccessModule(moduleName);

    if (!access.allowed) {
        console.warn(`⛔ Acceso denegado a ${moduleName}: ${access.message}`);
        // Pequeño delay para asegurar que el usuario vea el bloqueo si es necesario, 
        // pero normalmente redireccionamos inmediato
        alert(access.message);
        window.location.href = access.redirectTo;
        return false;
    }

    console.log(`✅ Acceso permitido a ${moduleName}`);
    return true;
}

// ============================================
// FUNCIONES DE IFRAME/POSTMESSAGE
// ============================================

/**
 * Notifica al padre (dashboard) sobre el progreso
 */
function notifyParent(eventType, data) {
    if (window.parent !== window) {
        window.parent.postMessage({
            type: eventType,
            data: data
        }, '*');
        console.log(`📤 Mensaje enviado al padre: ${eventType}`, data);
    }
}

/**
 * Notifica que el módulo fue completado
 */
function notifyModuleCompleted(moduleName, approved, score, totalQuestions) {
    notifyParent('MODULO_INDUCCION_COMPLETADO', {
        moduleId: moduleName.replace('_', ''),
        moduleName: moduleName,
        aprobado: approved,
        score: score,
        total: totalQuestions,
        percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
        fecha: new Date().toISOString()
    });

    if (approved) {
        const nextModule = getNextModule(moduleName);
        if (nextModule) {
            setTimeout(() => {
                notifyParent('CARGAR_SIGUIENTE_MODULO', {
                    siguienteModulo: nextModule.name,
                    moduloActual: moduleName
                });
            }, 300);
        }
    }
}

// ============================================
// FUNCIÓN DE FINALIZACIÓN UNIVERSAL
// ============================================

/**
 * Finaliza el módulo actual y maneja la navegación
 */
async function finishModuleAndNavigate(moduleName, score, totalQuestions) {
    // Calcular si aprobó
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    const approved = percentage >= PORCENTAJE_APROBACION;

    // Guardar en Supabase
    await approveModule(moduleName, score, totalQuestions);

    // Notificar al padre si está en iframe
    notifyModuleCompleted(moduleName, approved, score, totalQuestions);

    // Obtener siguiente módulo
    const nextModule = getNextModule(moduleName);

    // Resultado
    const result = {
        approved: approved,
        percentage: Math.round(percentage),
        score: score,
        total: totalQuestions,
        nextModule: nextModule,
        isLastModule: nextModule === null,
        message: approved
            ? (nextModule
                ? `¡Felicitaciones! Has aprobado este módulo. Puedes continuar a "${nextModule.displayName}".`
                : '¡Felicitaciones! Has completado toda la inducción.')
            : `No has alcanzado el ${PORCENTAJE_APROBACION}% requerido. Debes reintentar la evaluación.`
    };

    console.log('📊 Resultado del módulo (Cloud):', result);
    return result;
}

/**
 * Navega al siguiente módulo
 */
function navigateToNextModule(currentModule) {
    const nextModule = getNextModule(currentModule);

    if (nextModule) {
        console.log(`➡️ Navegando a ${nextModule.displayName}...`);
        window.location.href = nextModule.url;
    } else {
        console.log('🎉 Inducción completa. Redirigiendo a dashboard...');
        window.location.href = '../funcionario/dashboard.html';
    }
}

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================
if (typeof window !== 'undefined') {
    window.SupabaseProgress = {
        // Constantes
        MODULOS_ORDEN,
        MODULOS_URLS,
        MODULOS_NOMBRES,
        PORCENTAJE_APROBACION,

        // Funciones de usuario
        getUserId,
        getUserRole,
        isUserAuthenticated,
        requireAuth,

        // Funciones de progreso
        getModuleProgress,
        getAllUserProgress,
        getAllProgressFromSupabase,
        saveModuleProgress,
        startModule,
        saveCurrentStep,
        approveModule,
        incrementAttempts,

        // Funciones de validación
        canAccessModule,
        getNextModule,
        getModuleToResume,
        isInductionComplete,
        validateModuleAccess,

        // Funciones de comunicación
        notifyParent,
        notifyModuleCompleted,

        // Funciones de navegación
        finishModuleAndNavigate,
        navigateToNextModule
    };

    console.log('✅ SupabaseProgress cargado (Modo: CLOUD ☁️)');
}
