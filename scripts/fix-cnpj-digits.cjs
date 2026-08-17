const fs = require('fs');

let code = fs.readFileSync('packages/core/src/tax/recovery/credit-recovery-per-dcomp.ts', 'utf8');
code = code.replace("company.cnpj.substring(0, 8)", "company.cnpj.replace(/\\D/g, '').substring(0, 8)");
fs.writeFileSync('packages/core/src/tax/recovery/credit-recovery-per-dcomp.ts', code, 'utf8');

console.log('Fixed CNPJ digits stripping in credit recovery.');
