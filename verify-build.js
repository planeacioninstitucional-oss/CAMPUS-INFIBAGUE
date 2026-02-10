#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Post-build: Verificando estructura de dist/...');

const requiredDirs = ['js', 'css', 'assets', 'cursos', 'funcionario', 'educador'];
const distPath = path.join(__dirname, 'dist');

// Verificar que dist existe
if (!fs.existsSync(distPath)) {
    console.error('❌ Error: dist/ no existe');
    process.exit(1);
}

// Verificar cada directorio requerido
let allGood = true;
requiredDirs.forEach(dir => {
    const dirPath = path.join(distPath, dir);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        console.log(`✅ ${dir}/ existe (${files.length} archivos)`);
    } else {
        console.error(`❌ ${dir}/ NO existe`);
        allGood = false;
    }
});

// Verificar archivos JS críticos
const criticalJS = ['config.js', 'auth.js', 'utils.js'];
const jsPath = path.join(distPath, 'js');

if (fs.existsSync(jsPath)) {
    criticalJS.forEach(file => {
        const filePath = path.join(jsPath, file);
        if (fs.existsSync(filePath)) {
            const size = fs.statSync(filePath).size;
            console.log(`✅ js/${file} existe (${size} bytes)`);
        } else {
            console.error(`❌ js/${file} NO existe`);
            allGood = false;
        }
    });
}

if (allGood) {
    console.log('\n🎉 Build verificado correctamente');
    process.exit(0);
} else {
    console.error('\n❌ Build incompleto');
    process.exit(1);
}
