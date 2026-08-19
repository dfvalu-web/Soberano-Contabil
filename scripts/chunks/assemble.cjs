const fs = require('fs');
const [,, target, prefix, count] = process.argv;
let full = '';
for (let i = 1; i <= parseInt(count, 10); i++) {
  const p = 'scripts/chunks/' + prefix + '_' + i + '.txt';
  if (fs.existsSync(p)) {
    full += fs.readFileSync(p, 'utf8');
    fs.unlinkSync(p);
  }
}
fs.writeFileSync(target, full, 'utf8');
console.log('Assembled', target, 'Length:', full.length);
