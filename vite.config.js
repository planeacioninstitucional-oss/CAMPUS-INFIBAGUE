import { defineConfig } from 'vite'

export default defineConfig({
    root: 'public',
    publicDir: 'assets',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'public/index.html',
                login: 'public/login.html',
                registro: 'public/registro.html',
                catalogo: 'public/catalogo.html',
                'curso-detalle': 'public/curso-detalle.html',
                'induccion-curso': 'public/induccion-curso.html',
                'demo-zustand': 'public/demo-zustand.html',
                // Cursos
                'induccion-gestion-humana': 'cursos/induccion-gestion-humana.html',
                'induccion-atencion-ciudadano': 'cursos/induccion-atencion-ciudadano.html',
                'induccion-gestion-ambiental': 'cursos/induccion-gestion-ambiental.html',
                'induccion-sst': 'cursos/induccion-sst.html',
                'induccion-planeacion': 'cursos/induccion-planeacion.html',
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
        open: '/index.html'
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})
