const fs = require('fs');
const filepath = process.argv[2];
const mode = process.argv[3];
const b64 = process.argv[4];

if (!filepath || !mode || !b64) {
  console.error('Usage: node file-writer.cjs <filepath> <write|append> <base64>');
  process.exit(1);
}

if (mode === 'write') {
  fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));
} else if (mode === 'append') {
  fs.appendFileSync(filepath, Buffer.from(b64, 'base64'));
}
console.log('Processed ' + filepath + ' ' + mode);
