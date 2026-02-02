// ============================================
// CAMPUS VIRTUAL - Autenticación Directa
// Login por CÉDULA sin Supabase Auth
// ============================================

// ROLES viene de config.js

/**
 * Genera un hash simple de la contraseña
 * Nota: En producción, usar bcrypt del lado del servidor
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'campus_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Registra un nuevo usuario
 * @param {Object} datos - Datos del usuario
 * @returns {Promise<Object>} Resultado del registro
 */
async function registrarUsuario(datos) {
    const supabase = getSupabase();

    try {
        // Verificar si la cédula ya existe
        const { data: existente } = await supabase
            .from('usuarios')
            .select('id')
            .eq('cedula', datos.cedula)
            .single();

        if (existente) {
            return {
                success: false,
                message: 'Esta cédula ya está registrada en el sistema'
            };
        }

        // Hashear la contraseña
        const passwordHash = await hashPassword(datos.password);

        // Insertar usuario
        const { data: nuevoUsuario, error } = await supabase
            .from('usuarios')
            .insert({
                cedula: datos.cedula,
                password_hash: passwordHash,
                nombre_completo: datos.nombre_completo,
                oficina_cargo: datos.oficina_cargo,
                rol: datos.rol
            })
            .select()
            .single();

        if (error) {
            console.error('Error al registrar:', error);
            return {
                success: false,
                message: 'Error al registrar usuario: ' + error.message
            };
        }

        // Guardar en localStorage (sin la contraseña)
        const usuarioData = {
            id: nuevoUsuario.id,
            nombre_completo: nuevoUsuario.nombre_completo,
            cedula: nuevoUsuario.cedula,
            oficina_cargo: nuevoUsuario.oficina_cargo,
            rol: nuevoUsuario.rol
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioData));

        return {
            success: true,
            user: nuevoUsuario,
            message: '¡Registro exitoso!'
        };

    } catch (error) {
        console.error('Error en registro:', error);
        return {
            success: false,
            message: 'Error al registrar usuario'
        };
    }
}

/**
 * Inicia sesión de usuario usando CÉDULA
 * @param {string} cedula - Número de cédula
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Resultado del login
 */
async function iniciarSesion(cedula, password) {
    const supabase = getSupabase();

    try {
        // Buscar usuario por cédula
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('cedula', cedula)
            .single();

        if (error || !usuario) {
            return {
                success: false,
                message: 'Cédula no encontrada en el sistema'
            };
        }

        // Verificar contraseña
        const passwordHash = await hashPassword(password);

        if (usuario.password_hash !== passwordHash) {
            return {
                success: false,
                message: 'Contraseña incorrecta'
            };
        }

        // Guardar en localStorage (sin la contraseña)
        const usuarioData = {
            id: usuario.id,
            nombre_completo: usuario.nombre_completo,
            cedula: usuario.cedula,
            oficina_cargo: usuario.oficina_cargo,
            rol: usuario.rol
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioData));

        return {
            success: true,
            usuario: usuarioData,
            message: '¡Bienvenido!'
        };

    } catch (error) {
        console.error('Error en login:', error);
        return {
            success: false,
            message: 'Error al iniciar sesión'
        };
    }
}

/**
 * Cierra la sesión del usuario actual
 * @returns {Object} Resultado
 */
function cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol_original');

    // Detectar si estamos en una subcarpeta
    const path = window.location.pathname;
    if (path.includes('/educador/') || path.includes('/funcionario/')) {
        window.location.href = '../login.html';
    } else {
        window.location.href = './login.html';
    }
    return { success: true };
}

/**
 * Obtiene el usuario actualmente autenticado desde localStorage
 * @returns {Object|null} Usuario actual o null
 */
function obtenerUsuarioActual() {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return null;

    try {
        return JSON.parse(usuarioStr);
    } catch {
        return null;
    }
}

/**
 * Verifica si hay una sesión activa (sincrónica)
 * @returns {boolean} True si hay sesión
 */
function verificarSesionActiva() {
    const usuario = obtenerUsuarioActual();
    return usuario !== null;
}

/**
 * Verifica la autenticación y redirige si no está logueado
 */
function verificarAutenticacion() {
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        window.location.href = './login.html';
        return false;
    }

    return true;
}

/**
 * Verifica el rol del usuario y redirige si no tiene permisos
 * @param {string} rolRequerido - Rol requerido ('educador' o 'funcionario')
 * @param {string} redireccion - URL a redirigir si no tiene permisos
 */
function verificarRol(rolRequerido, redireccion = './login.html') {
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        window.location.href = './login.html';
        return false;
    }

    if (usuario.rol !== rolRequerido) {
        window.location.href = redireccion;
        return false;
    }

    return true;
}

/**
 * Redirige al dashboard según el rol del usuario
 * @param {string} rol - Rol del usuario
 */
function redirigirSegunRol(rol) {
    if (rol === ROLES.EDUCADOR) {
        window.location.href = './educador/dashboard.html';
    } else {
        window.location.href = './funcionario/dashboard.html';
    }
}

// ============================================
// CAMBIO DE VISTA (Educador <-> Funcionario)
// ============================================

/**
 * Cambia la vista del educador a funcionario temporalmente
 * Guarda el rol original para poder volver
 */
function cambiarVistaAFuncionario() {
    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== ROLES.EDUCADOR) {
        mostrarNotificacion('Solo los educadores pueden cambiar de vista', 'error');
        return;
    }

    // Guardar rol original
    localStorage.setItem('rol_original', usuario.rol);

    // Cambiar rol temporalmente
    usuario.rol = ROLES.FUNCIONARIO;
    localStorage.setItem('usuario', JSON.stringify(usuario));

    mostrarNotificacion('Cambiando a vista de funcionario...', 'info');

    // Redirigir al dashboard del funcionario (ruta desde la carpeta educador)
    setTimeout(() => {
        window.location.href = '../funcionario/dashboard.html';
    }, 500);
}

/**
 * Vuelve a la vista de educador
 */
function volverAVistaEducador() {
    const usuario = obtenerUsuarioActual();
    const rolOriginal = localStorage.getItem('rol_original');

    if (!rolOriginal) {
        mostrarNotificacion('No hay vista previa para restaurar', 'error');
        return;
    }

    // Restaurar rol original
    usuario.rol = rolOriginal;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.removeItem('rol_original');

    mostrarNotificacion('Volviendo a vista de educador...', 'info');

    // Redirigir al dashboard del educador (ruta desde la carpeta funcionario)
    setTimeout(() => {
        window.location.href = '../educador/dashboard.html';
    }, 500);
}

/**
 * Verifica si el usuario está en modo vista de funcionario (siendo educador)
 * @returns {boolean} True si está en modo vista
 */
function estaEnModoVista() {
    return localStorage.getItem('rol_original') !== null;
}
