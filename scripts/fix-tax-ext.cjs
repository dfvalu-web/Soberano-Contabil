const fs = require('fs');

let taxIndex = fs.readFileSync('packages/core/src/tax/index.ts', 'utf8');
taxIndex = taxIndex.replace("reverse-logistics-tax-esg.ts", "reverse-logistics-tax-esg.js");
fs.writeFileSync('packages/core/src/tax/index.ts', taxIndex, 'utf8');
console.log('Fixed .js extension in tax index.ts.');
