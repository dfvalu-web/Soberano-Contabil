const fs = require('fs');
fs.writeFileSync('packages/web/src/__tests__/sidebar-navigation.test.ts', fs.readFileSync('scripts/source.txt', 'utf8'), 'utf8');
console.log('done');