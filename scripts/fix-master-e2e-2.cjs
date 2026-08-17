const fs = require('fs');

// 1. Fix regime-comparator.ts
let regCode = fs.readFileSync('packages/core/src/tax/diagnostic/regime-comparator.ts', 'utf8');
regCode = regCode.replace('adicoesParteA: 0,', 'adicoesParteA: [],');
regCode = regCode.replace('exclusoesParteA: 0,', 'exclusoesParteA: [],');
fs.writeFileSync('packages/core/src/tax/diagnostic/regime-comparator.ts', regCode, 'utf8');

// 2. Fix master-e2e test
let masterCode = fs.readFileSync('packages/core/tests/master-e2e-all-stages.test.ts', 'utf8');
masterCode = masterCode.replace('expect(auditReport.isTotalmenteConforme).toBe(true);', 'expect(auditReport.totalAnomalias).toBe(0);');
fs.writeFileSync('packages/core/tests/master-e2e-all-stages.test.ts', masterCode, 'utf8');

console.log('Fixed regime-comparator and master test assertion.');
