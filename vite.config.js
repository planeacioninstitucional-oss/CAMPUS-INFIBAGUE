import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                registro: resolve(__dirname, 'registro.html'),
                catalogo: resolve(__dirname, 'catalogo.html'),
                'curso-detalle': resolve(__dirname, 'curso-detalle.html'),
                'induccion-curso': resolve(__dirname, 'induccion-curso.html'),
                'induccion-gestion-humana': resolve(__dirname, 'cursos/induccion-gestion-humana.html'),
                // Dashboards
                'funcionario-dashboard': resolve(__dirname, 'funcionario/dashboard.html'),
                'funcionario-certificados': resolve(__dirname, 'funcionario/certificados.html'),
                'educador-dashboard': resolve(__dirname, 'educador/dashboard.html'),
                'educador-crear': resolve(__dirname, 'educador/crear-curso.html'),
                'educador-editar': resolve(__dirname, 'educador/editar-curso.html'),
                'educador-seguimiento': resolve(__dirname, 'educador/seguimiento.html')
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
