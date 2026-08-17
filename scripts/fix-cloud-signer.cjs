const fs = require('fs');

// 1. Fix cloud-a3-signer.ts regex
let signerCode = fs.readFileSync('packages/core/src/security/cloud-a3-signer.ts', 'utf8');
signerCode = signerCode.replace('request.conteudoXmlParaAssinar.replace(/</([a-zA-Z0-9]+)>$/,', 'request.conteudoXmlParaAssinar.replace(new RegExp(\'<\\\\/([a-zA-Z0-9]+)>$\'),');
fs.writeFileSync('packages/core/src/security/cloud-a3-signer.ts', signerCode, 'utf8');

// 2. Fix signer-contingencies-tp.test.ts single quote escaping
let testCode = fs.readFileSync('packages/core/tests/signer-contingencies-tp.test.ts', 'utf8');
testCode = testCode.replace("expect(data.diagnosticoTransferPricing).toContain('Princípio Arm's Length');", 'expect(data.diagnosticoTransferPricing).toContain("Princípio Arm\'s Length");');
fs.writeFileSync('packages/core/tests/signer-contingencies-tp.test.ts', testCode, 'utf8');

console.log('Fixed cloud-a3-signer regex and test string quotes.');
