import { defineConfig } from 'vite'

export default defineConfig({
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                login: 'login.html',
                registro: 'registro.html',
                catalogo: 'catalogo.html',
                'curso-detalle': 'curso-detalle.html',
                'induccion-curso': 'induccion-curso.html',
                'induccion-gestion-humana': 'cursos/induccion-gestion-humana.html',
                // Dashboards
                'funcionario-dashboard': 'funcionario/dashboard.html',
                'funcionario-certificados': 'funcionario/certificados.html',
                'educador-dashboard': 'educador/dashboard.html',
                'educador-crear': 'educador/crear-curso.html',
                'educador-editar': 'educador/editar-curso.html',
                'educador-seguimiento': 'educador/seguimiento.html'
            }
        }
    },
    server: {
        port: 3000,
        open: true
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})
