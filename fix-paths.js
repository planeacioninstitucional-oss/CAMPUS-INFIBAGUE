#!/usr/bin/env node

/**
 * Script para corregir rutas relativas a absolutas en archivos HTML
 * Necesario para deployment en Vercel
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
    // Funcionario
    'funcionario/dashboard.html',
    'funcionario/certificados.html',

    // Educador
    'educador/dashboard.html',
    'educador/crear-curso.html',
    'educador/editar-curso.html',
    'educador/seguimiento.html',
];

const replacements = [
    { from: 'src="../js/', to: 'src="/js/' },
    { from: 'href="../css/', to: 'href="/css/' },
    { from: 'href="../assets/', to: 'href="/assets/' },
    { from: 'src="../assets/', to: 'src="/assets/' },
];

let totalFixed = 0;

filesToFix.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ from, to }) => {
        if (content.includes(from)) {
            content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Corregido: ${file}`);
        totalFixed++;
    } else {
        console.log(`ℹ️  Sin cambios: ${file}`);
    }
});

console.log(`\n🎉 Total de archivos corregidos: ${totalFixed}`);
