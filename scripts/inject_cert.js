const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, '../assets/plantilla-certificado.jpg');
const jsPath = path.join(__dirname, '../js/certificates.js');

try {
    console.log(`Reading image from ${imagePath}...`);
    if (!fs.existsSync(imagePath)) {
        console.error('Image file not found!');
        process.exit(1);
    }
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
    console.log(`Image read successfully. Size: ${base64Image.length} chars.`);

    console.log(`Reading JS file from ${jsPath}...`);
    let jsContent = fs.readFileSync(jsPath, 'utf8');

    const target = 'const CERTIFICADO_BG = "PLACEHOLDER";';

    if (jsContent.includes(target)) {
        console.log('Target placeholder found. Replacing...');
        // We use split/join or replace. string.replace only replaces first occurrence which is fine here.
        // using template literal for replacement might be risky if image has specific chars, but base64 is safe.
        jsContent = jsContent.replace(target, `const CERTIFICADO_BG = "${base64Image}";`);

        fs.writeFileSync(jsPath, jsContent);
        console.log('Successfully injected base64 image into certificates.js');
    } else {
        console.error('Placeholder not found in certificates.js');
        // Check if it's there but maybe formatting diff?
        console.log('First 200 chars of JS file:');
        console.log(jsContent.substring(0, 200));
        process.exit(1);
    }
} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
