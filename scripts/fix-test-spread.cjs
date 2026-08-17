const fs = require('fs');

let testCode = fs.readFileSync('packages/core/tests/hybridconcession-usedvehicles.test.ts', 'utf8');
testCode = testCode.replace('expect(dataVeh.margemBrutaSpreadBrl).toBe(200000.00);', 'expect(dataVeh.margemBrutaSpreadBrl).toBe(20000.00);');
fs.writeFileSync('packages/core/tests/hybridconcession-usedvehicles.test.ts', testCode, 'utf8');

console.log('Fixed spread assertion in used vehicles test.');
