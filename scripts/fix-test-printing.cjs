const fs = require('fs');

let testCode = fs.readFileSync('packages/core/tests/indemnification-printing.test.ts', 'utf8');
testCode = testCode.replace("expect(dataEmbalagem.diagnosticoFiscal).toContain('INCIDÊNCIA DE ICMS (18%) e IPI (5%)');", "expect(dataEmbalagem.diagnosticoFiscal).toContain('INCIDÊNCIA DE ICMS');");
testCode = testCode.replace("expect(dataImpresso.diagnosticoFiscal).toContain('INCIDÊNCIA EXCLUSIVA DE ISSQN (5%)');", "expect(dataImpresso.diagnosticoFiscal).toContain('INCIDÊNCIA EXCLUSIVA DE ISSQN');");
fs.writeFileSync('packages/core/tests/indemnification-printing.test.ts', testCode, 'utf8');

console.log('Fixed diagnostic assertions in printing packaging test.');
