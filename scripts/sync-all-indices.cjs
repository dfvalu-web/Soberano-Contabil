const fs = require('fs');

// accounting/index.ts
fs.writeFileSync('packages/core/src/accounting/index.ts', `export * from './chart-of-accounts/standard-chart.js';
export * from './ledger/double-entry.js';
export * from './ledger/immutable-ledger-chain.js';
export * from './reconciliation/ofx-parser.js';
export * from './reconciliation/matcher.js';
export * from './statements/financial-statements.js';
export * from './statements/dfc-dmpl.js';
export * from './closing/are-closure.js';
`, 'utf8');

// audit/index.ts
fs.writeFileSync('packages/core/src/audit/index.ts', `export * from './cross-check/cross-auditor.js';
export * from './anomaly-detector.js';
`, 'utf8');

// dfe/index.ts
fs.writeFileSync('packages/core/src/dfe/index.ts', `export * from './nfe/nfe-parser.js';
export * from './auto-entry/dfe-to-accounting.js';
export * from './parsers/cte-nfse-parser.js';
`, 'utf8');

// payroll/index.ts
fs.writeFileSync('packages/core/src/payroll/index.ts', `export * from './calculator/inss-irrf.js';
export * from './calculator/payroll-engine.js';
export * from './terminations/termination-calculator.js';
export * from './benefits/vacation-thirteenth.js';
export * from './esocial/event-generators.js';
export * from './esocial/xml-generator.js';
`, 'utf8');

// sped/index.ts
fs.writeFileSync('packages/core/src/sped/index.ts', `export * from './formatter/sped-writer.js';
export * from './ecd/ecd-generator.js';
export * from './ecf/generator.js';
export * from './efd-icms-ipi/generator.js';
export * from './efd-contribuicoes/generator.js';
export * from './validator/pva-validator.js';
`, 'utf8');

console.log('Synchronized all index.ts barrel files.');
