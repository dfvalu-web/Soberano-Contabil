const fs = require('fs');
fs.writeFileSync('packages/web/src/__tests__/sidebar-navigation.test.ts', \"// test\", 'utf8');
console.log('ok');