const fs = require('fs');

// 1. Create database index.ts
fs.writeFileSync('packages/core/src/database/index.ts', "export * from './postgres-pgvector-s3-worm-adapter.js';\n", 'utf8');

// 2. Create or update telemetry index.ts
if (!fs.existsSync('packages/core/src/telemetry')) {
  fs.mkdirSync('packages/core/src/telemetry', { recursive: true });
}
let tel = '';
if (fs.existsSync('packages/core/src/telemetry/index.ts')) {
  tel = fs.readFileSync('packages/core/src/telemetry/index.ts', 'utf8');
}
if (!tel.includes('opentelemetry-prometheus-apm-engine')) {
  tel += "export * from './opentelemetry-prometheus-apm-engine.js';\n";
  fs.writeFileSync('packages/core/src/telemetry/index.ts', tel, 'utf8');
}

// 3. Update core src/index.ts
let coreIdx = fs.readFileSync('packages/core/src/index.ts', 'utf8');
if (!coreIdx.includes("export * from './database/index.js';")) {
  coreIdx += "export * from './database/index.js';\n";
}
if (!coreIdx.includes("export * from './telemetry/index.js';")) {
  coreIdx += "export * from './telemetry/index.js';\n";
}
fs.writeFileSync('packages/core/src/index.ts', coreIdx, 'utf8');

console.log('Successfully created database and telemetry barrels and updated core index.ts.');
