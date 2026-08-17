const fs = require('fs');

fs.writeFileSync('packages/core/src/audit/index.ts', `export * from './anomaly-detector.js';
export * from './copilot/tax-accounting-copilot.js';
export * from './cross-audit-efd-dfe-engine.js';
export * from './cross-check/cross-auditor.js';
export * from './forensic/forensic-audit-benford.js';
`, 'utf8');

console.log('Fixed audit index barrel with accurate file exports.');
