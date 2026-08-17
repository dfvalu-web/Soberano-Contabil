const fs = require('fs');

fs.writeFileSync('packages/core/src/security/index.ts', `export * from './async-job-queue.js';
export * from './audit-trail.js';
export * from './cloud-a3-signer.js';
export * from './crypto.js';
export * from './encrypted-backup-engine.js';
export * from './kms-key-rotation-manager.js';
export * from './lgpd-anonymizer.js';
export * from './open-finance-mtls-client.js';
export * from './sensible-mutation-audit.js';
export * from './telemetry-metrics-exporter.js';
export * from './webhook-dispatcher.js';
`, 'utf8');

console.log('Fixed security index barrel with accurate file exports.');
