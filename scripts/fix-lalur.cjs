const fs = require('fs');

let lalurCode = fs.readFileSync('packages/core/src/tax/lucro-real/lalur.ts', 'utf8');
lalurCode = lalurCode.replace('const irpjAPagar = Number(Math.max(0, irpjDevido - (retencoesFonteCompensaveis.irrf || 0)).toFixed(2));', 'const irpjAPagar = Number(Math.max(0, irpjDevido - (retencoesFonteCompensaveis?.irrf || 0)).toFixed(2));');
lalurCode = lalurCode.replace('const csllAPagar = Number(Math.max(0, csll9 - (retencoesFonteCompensaveis.csll || 0)).toFixed(2));', 'const csllAPagar = Number(Math.max(0, csll9 - (retencoesFonteCompensaveis?.csll || 0)).toFixed(2));');
fs.writeFileSync('packages/core/src/tax/lucro-real/lalur.ts', lalurCode, 'utf8');

console.log('Fixed optional retencoes in lalur.ts');
