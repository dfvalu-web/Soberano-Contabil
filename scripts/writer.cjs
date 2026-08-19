const fs = require('fs');
const [,,dest,mode,b64] = process.argv;
const text = Buffer.from(b64, 'base64').toString('utf8');
if (mode === 'write') {
  fs.writeFileSync(dest, text, 'utf8');
} else if (mode === 'append') {
  fs.appendFileSync(dest, text, 'utf8');
}
console.log('OK ' + dest + ' ' + mode);
