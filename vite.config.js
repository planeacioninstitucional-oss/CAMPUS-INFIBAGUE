import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// Plugin para copiar archivos estáticos
function copyStaticFiles() {
    return {
        name: 'copy-static-files',
        closeBundle() {
            const copyDir = (src, dest) => {
                mkdirSync(dest, { recursive: true })
                const entries = readdirSync(src, { withFileTypes: true })

                for (const entry of entries) {
                    const srcPath = join(src, entry.name)
                    const destPath = join(dest, entry.name)

                    if (entry.isDirectory()) {
                        copyDir(srcPath, destPath)
                    } else {
                        copyFileSync(srcPath, destPath)
                    }
                }
            }

            // Copiar carpetas críticas
            copyDir('public/js', 'dist/js')
            copyDir('css', 'dist/css')
            copyDir('assets', 'dist/assets')
            console.log('✅ Archivos estáticos copiados a dist/')
        }
    }
}

export default defineConfig({
    root: '.',
    publicDir: false, // Desactivar publicDir porque lo manejamos manualmente
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
    plugins: [copyStaticFiles()],
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
