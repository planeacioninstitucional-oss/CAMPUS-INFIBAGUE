// ============================================
// CAMPUS VIRTUAL - Utilidades
// ============================================

/**
 * Formatea una fecha para mostrar en formato legible
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatearFecha(fecha) {
    if (!fecha) return '';

    const date = new Date(fecha);
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString('es-ES', opciones);
}

/**
 * Formatea una fecha con hora
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
function formatearFechaHora(fecha) {
    if (!fecha) return '';

    const date = new Date(fecha);
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return date.toLocaleDateString('es-ES', opciones);
}

/**
 * Valida el formato de una cédula
 * @param {string} cedula - Número de cédula
 * @returns {boolean} True si es válida
 */
function validarCedula(cedula) {
    if (!cedula) return false;

    // Remover espacios y guiones
    const cedulaLimpia = cedula.replace(/[\s-]/g, '');

    // Debe tener entre 6 y 12 dígitos
    const regex = /^\d{6,12}$/;
    return regex.test(cedulaLimpia);
}

/**
 * Valida el formato de un correo electrónico
 * @param {string} correo - Correo a validar
 * @returns {boolean} True si es válido
 */
function validarCorreo(correo) {
    if (!correo) return false;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

/**
 * Valida que un correo sea institucional (.gov.co)
 * @param {string} correo - Correo a validar
 * @returns {boolean} True si es institucional
 */
function validarCorreoInstitucional(correo) {
    if (!validarCorreo(correo)) return false;

    // Aceptar .gov.co o configurar según necesidad
    return correo.toLowerCase().endsWith('.gov.co') ||
        correo.toLowerCase().includes('@entidad.'); // Personalizar según entidad
}

/**
 * Muestra una notificación al usuario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duracion - Duración en ms (default: 3000)
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
    // Remover notificaciones anteriores
    const existentes = document.querySelectorAll('.notificacion-toast');
    existentes.forEach(n => n.remove());

    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion-toast notificacion-${tipo}`;
    notificacion.textContent = mensaje;

    // Estilos inline para el toast
    notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
    border-left: 4px solid;
  `;

    // Colores según tipo
    const colores = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    notificacion.style.borderLeftColor = colores[tipo] || colores.info;

    // Agregar al DOM
    document.body.appendChild(notificacion);

    // Remover después de la duración
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, duracion);
}

/**
 * Muestra un loader/spinner
 * @param {string} contenedorId - ID del contenedor donde mostrar el loader
 */
function mostrarLoader(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; padding: 3rem;">
      <div class="loading" style="width: 40px; height: 40px;"></div>
    </div>
  `;
}

/**
 * Oculta el loader y muestra contenido
 * @param {string} contenedorId - ID del contenedor
 * @param {string} contenido - HTML a mostrar
 */
function mostrarContenido(contenedorId, contenido) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = contenido;
}

/**
 * Sube una imagen a Supabase Storage
 * @param {File} file - Archivo de imagen
 * @param {string} bucket - Nombre del bucket
 * @param {string} carpeta - Carpeta dentro del bucket
 * @returns {Promise<string>} URL pública de la imagen
 */
async function cargarImagen(file, bucket = 'imagenes-cursos', carpeta = 'portadas') {
    if (!file) {
        throw new Error('No se proporcionó un archivo');
    }

    const supabase = getSupabase();
    const timestamp = Date.now();
    const nombreArchivo = `${carpeta}/${timestamp}_${file.name.replace(/\s/g, '_')}`;

    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(nombreArchivo, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Error al subir imagen:', error);
        throw error;
    }
}

/**
 * Sube un PDF a Supabase Storage
 * @param {File} file - Archivo PDF
 * @param {string} bucket - Nombre del bucket
 * @param {string} carpeta - Carpeta dentro del bucket
 * @returns {Promise<string>} URL pública del PDF
 */
async function cargarPDF(file, bucket = 'materiales-curso', carpeta = 'pdfs') {
    if (!file) {
        throw new Error('No se proporcionó un archivo');
    }

    if (file.type !== 'application/pdf') {
        throw new Error('El archivo debe ser un PDF');
    }

    const supabase = getSupabase();
    const timestamp = Date.now();
    const nombreArchivo = `${carpeta}/${timestamp}_${file.name.replace(/\s/g, '_')}`;

    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(nombreArchivo, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Error al subir PDF:', error);
        throw error;
    }
}

/**
 * Valida URL de YouTube o Vimeo
 * @param {string} url - URL a validar
 * @returns {object} { valido: boolean, tipo: 'youtube'|'vimeo'|null, embedUrl: string }
 */
function validarURLVideo(url) {
    if (!url) return { valido: false, tipo: null, embedUrl: '' };

    // YouTube
    // Formatos: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch) {
        return {
            valido: true,
            tipo: 'youtube',
            // rel=0 evita mostrar videos relacionados de otros canales
            // modestbranding=1 reduce el branding de YT
            // youtube-nocookie.com es más compatible con navegadores locales
            // enablejsapi=1 ayuda con errores de configuración del reproductor
            embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1&enablejsapi=1`
        };
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);

    if (vimeoMatch) {
        return {
            valido: true,
            tipo: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
        };
    }

    return { valido: false, tipo: null, embedUrl: '' };
}

/**
 * Trunca un texto a un número máximo de caracteres
 * @param {string} texto - Texto a truncar
 * @param {number} maxCaracteres - Máximo de caracteres
 * @returns {string} Texto truncado
 */
function truncarTexto(texto, maxCaracteres = 100) {
    if (!texto || texto.length <= maxCaracteres) return texto;
    return texto.substring(0, maxCaracteres) + '...';
}

/**
 * Calcula el porcentaje
 * @param {number} completado - Número de items completados
 * @param {number} total - Total de items
 * @returns {number} Porcentaje (0-100)
 */
function calcularPorcentaje(completado, total) {
    if (total === 0) return 0;
    return Math.round((completado / total) * 100);
}

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Obtiene parámetros de la URL
 * @param {string} param - Nombre del parámetro
 * @returns {string|null} Valor del parámetro
 */
function obtenerParametroURL(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Redirige a una página
 * @param {string} url - URL a la que redirigir
 */
function redirigir(url) {
    window.location.href = url;
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} texto - Texto a escapar
 * @returns {string} Texto escapado
 */
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Notifica al dashboard (padre) que un módulo ha sido completado
 * @param {boolean} aprobado - Si el usuario aprobó la evaluación
 * @param {object} metadata - Datos adicionales
 */
async function notificarTerminoModulo(aprobado = true, metadata = {}) {
    // 1. Identificar el módulo actual
    const path = window.location.pathname;
    const moduleFileName = path.split('/').pop().replace('.html', '');

    // Mapeo simple de archivos a IDs lógicos usados en el dashboard
    const moduleMap = {
        'induccion-atencion-ciudadano': 'atencion',
        'induccion-gestion-humana': 'humana',
        'induccion-gestion-ambiental': 'ambiental',
        'induccion-sst': 'sst',
        'induccion-planeacion': 'planeacion'
    };

    const moduleId = moduleMap[moduleFileName] || moduleFileName;

    const message = {
        type: 'MODULO_INDUCCION_COMPLETADO',
        data: {
            moduleId,
            aprobado,
            ...metadata,
            fecha: new Date().toISOString()
        }
    };

    // 2. Notificar al padre (si estamos en iframe)
    if (window.parent !== window) {
        window.parent.postMessage(message, '*');
    } else {
        // 3. Fallback: Intentar guardar directamente si no hay padre (acceso directo)
        console.log('🏁 Módulo completado (Acceso directo):', message);

        try {
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (usuario && aprobado) {
                // Guardar localmente
                const progressKey = `progress_${usuario.id}_induccion_2026`;
                let userProgress = JSON.parse(localStorage.getItem(progressKey) || '[]');
                if (!userProgress.includes(moduleId)) {
                    userProgress.push(moduleId);
                    localStorage.setItem(progressKey, JSON.stringify(userProgress));
                }

                // Si hay Supabase configurado, intentar sincronizar (opcional)
                if (typeof getSupabase === 'function') {
                    // Aquí se podría llamar a una función de sincronización directa
                    console.log('Sincronización directa con Supabase disponible');
                }

                alert('¡Progreso guardado localmente! Puedes volver al dashboard.');
                window.location.href = '../funcionario/dashboard.html';
            }
        } catch (e) {
            console.error('Error al guardar progreso directo:', e);
        }
    }
}

// Agregar estilos para animaciones de notificaciones
const estilosAnimaciones = document.createElement('style');
estilosAnimaciones.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(estilosAnimaciones);
