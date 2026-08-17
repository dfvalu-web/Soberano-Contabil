const fs = require('fs');

fs.writeFileSync('packages/core/src/sped/index.ts', `export * from './ecd/ecd-generator.js';
export * from './ecf/generator.js';
export * from './efd-contribuicoes/generator.js';
export * from './efd-icms-ipi/generator.js';
export * from './efd-reinf/generator.js';
export * from './exporters/sped-batch-exporter-engine.js';
export * from './formatter/sped-writer.js';
export * from './validator/pva-validator.js';
`, 'utf8');

console.log('Fixed sped index barrel with accurate file exports.');
