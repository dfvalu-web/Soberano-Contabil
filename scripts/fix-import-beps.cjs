const fs = require('fs');

const p1 = 'packages/core/src/tax/international/beps-globe-qdmtt-double-tax-treaty-engine.ts';
let c1 = fs.readFileSync(p1, 'utf8');
c1 = c1.replace("from '../types/result.js'", "from '../../types/result.js'");
fs.writeFileSync(p1, c1, 'utf8');

const p2 = 'packages/core/src/tax/international/tax-treaty-permanent-establishment-engine.ts';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace("from '../types/result.js'", "from '../../types/result.js'");
fs.writeFileSync(p2, c2, 'utf8');

console.log('Fixed relative imports in international tax modules.');
