const fs = require('fs');

let code = fs.readFileSync('packages/core/src/security/cloud-a3-signer.ts', 'utf8');
code = code.replace(/sha254/g, 'sha256');
fs.writeFileSync('packages/core/src/security/cloud-a3-signer.ts', code, 'utf8');

console.log('Fixed sha254 typo to sha256.');
