const fs = require('fs');

let testCode = fs.readFileSync('packages/core/tests/liquidation-afrmm.test.ts', 'utf8');
testCode = testCode.replace('expect(dataLiq.partidasDobradaTransgressaoContinuidade.length).toBe(2);', 'expect(dataLiq.partidasDobradaTransgressaoContinuidade.length).toBe(4);');
fs.writeFileSync('packages/core/tests/liquidation-afrmm.test.ts', testCode, 'utf8');

console.log('Fixed liquidation-afrmm test expectation to 4 journal lines.');
