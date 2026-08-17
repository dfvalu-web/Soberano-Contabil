const fs = require('fs');

let testCode = fs.readFileSync('packages/core/tests/hyperinflation-iof.test.ts', 'utf8');
testCode = testCode.replace('expect(dataPassiva.partidasDobrada.length).toBe(2);', 'expect(dataPassiva.partidasDobrada.length).toBe(3);');
fs.writeFileSync('packages/core/tests/hyperinflation-iof.test.ts', testCode, 'utf8');

console.log('Updated test assertion for 3 journal lines in hyperinflation.');
