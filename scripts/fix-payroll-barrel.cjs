const fs = require('fs');

fs.writeFileSync('packages/core/src/payroll/index.ts', `export * from './calculator/inss-irrf.js';
export * from './calculator/payroll-engine.js';
export * from './benefits/plr-profit-sharing.js';
export * from './benefits/vacation-thirteenth.js';
export * from './esocial/esocial-closing.js';
export * from './esocial/event-generators.js';
export * from './esocial/xml-generator.js';
export * from './terminations/termination-calculator.js';
export * from './special-regimes/port-workers-ogmo-payroll-s1270.js';
export * from './special-regimes/fap-establishment-rat-engine.js';
`, 'utf8');

console.log('Fixed payroll index barrel with accurate exports.');
