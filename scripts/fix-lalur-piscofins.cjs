const fs = require('fs');

let lalurCode = fs.readFileSync('packages/core/src/tax/lucro-real/lalur.ts', 'utf8');
lalurCode = lalurCode.replace('retencoesFonteCompensaveis.pis || 0', 'retencoesFonteCompensaveis?.pis || 0');
lalurCode = lalurCode.replace('retencoesFonteCompensaveis.cofins || 0', 'retencoesFonteCompensaveis?.cofins || 0');
fs.writeFileSync('packages/core/src/tax/lucro-real/lalur.ts', lalurCode, 'utf8');

console.log('Fixed optional PIS and COFINS retencoes in lalur.ts');
