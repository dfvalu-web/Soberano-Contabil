const fs = require('fs');
const path = require('path');

function list(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(e => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) list(full);
    else console.log(full.replace(process.cwd() + path.sep, ''));
  });
}
list('packages/core/src/security');
