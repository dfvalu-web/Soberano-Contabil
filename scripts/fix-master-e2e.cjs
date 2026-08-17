const fs = require('fs');

// 1. Fix Lucro Presumido Calculator default retencoes
let calcCode = fs.readFileSync('packages/core/src/tax/lucro-presumido/calculator.ts', 'utf8');
calcCode = calcCode.replace('const irpjRetidoFonte = retencoesFonteSofridas.irrf || 0;', 'const irpjRetidoFonte = retencoesFonteSofridas?.irrf || 0;');
calcCode = calcCode.replace('const csllRetidaFonte = retencoesFonteSofridas.csll || 0;', 'const csllRetidaFonte = retencoesFonteSofridas?.csll || 0;');
calcCode = calcCode.replace('const csrfRetidaCompensavel = retencoesFonteSofridas.csrf || 0;', 'const csrfRetidaCompensavel = retencoesFonteSofridas?.csrf || 0;');
fs.writeFileSync('packages/core/src/tax/lucro-presumido/calculator.ts', calcCode, 'utf8');

// 2. Fix Master E2E test
let masterCode = fs.readFileSync('packages/core/tests/master-e2e-all-stages.test.ts', 'utf8');
masterCode = masterCode.replace('expect(parsedNfe.valorTotalNota).toBe(30000.00);', 'expect(parsedNfe.totais.valorTotalNota).toBe(30000.00);');
fs.writeFileSync('packages/core/tests/master-e2e-all-stages.test.ts', masterCode, 'utf8');

console.log('Fixed calculator and master test.');
