const fs = require('fs');
fswaph = process.argv[2];
var lines = JSON.parse(fs.readFileSync('scripts/test-lines.json', 'utf8'));
fs.writeFileSync('packages/web/src/__tests__/sidebar-navigation.test.ts', lines.join('\n'), 'utf8');
console.log('successfully written ' + lines.length + ' lines');
